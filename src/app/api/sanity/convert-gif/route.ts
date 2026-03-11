import { execFile } from "node:child_process";
import { access } from "node:fs/promises";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { constants as fsConstants } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { promisify } from "node:util";

import type { NextRequest } from "next/server";
import ffmpegStatic from "ffmpeg-static";
import { createClient } from "next-sanity";
import { parseBody } from "next-sanity/webhook";

const execFileAsync = promisify(execFile);

export const runtime = "nodejs";

const WEBHOOK_DEDUPE_TTL_MS = 1000 * 60 * 60; // 1 hour
const WEBHOOK_RATE_WINDOW_MS = Number(process.env.WEBHOOK_RATE_WINDOW_MS ?? 1000 * 60); // 1 minute
const WEBHOOK_RATE_LIMIT = Number(process.env.WEBHOOK_RATE_LIMIT ?? 20);
const UNAUTH_WINDOW_MS = Number(process.env.WEBHOOK_UNAUTH_WINDOW_MS ?? 1000 * 60); // 1 minute
const UNAUTH_MAX_ATTEMPTS = Number(process.env.WEBHOOK_UNAUTH_MAX_ATTEMPTS ?? 8);
const UNAUTH_BLOCK_MS = Number(process.env.WEBHOOK_UNAUTH_BLOCK_MS ?? 1000 * 60 * 10); // 10 minutes
const WEBHOOK_DOC_COOLDOWN_MS = Number(process.env.WEBHOOK_DOC_COOLDOWN_MS ?? 1000 * 15); // 15 seconds
const GIF_MAX_BYTES = Number(process.env.GIF_MAX_BYTES ?? 25 * 1024 * 1024); // 25MB
const GIF_FETCH_TIMEOUT_MS = Number(process.env.GIF_FETCH_TIMEOUT_MS ?? 1000 * 20); // 20 seconds
const FFMPEG_TIMEOUT_MS = Number(process.env.FFMPEG_TIMEOUT_MS ?? 1000 * 30); // 30 seconds
const seenWebhookDeliveries = new Map<string, number>();
const requestRateByIp = new Map<string, { windowStart: number; count: number }>();
const unauthorizedByIp = new Map<string, { windowStart: number; count: number; blockedUntil?: number }>();
const recentDocumentRuns = new Map<string, number>();

type GallerySection = {
  _key?: string;
  processedGifRefs?: string[];
  images?: Array<{
    _key?: string;
    asset?: {
      _ref?: string;
    };
  }>;
  convertedMedia?: Array<{
    _key?: string;
    _type?: "convertedMediaItem";
    sourceImageRef?: string;
    video?: {
      _type?: "file";
      asset?: {
        _type?: "reference";
        _ref?: string;
      };
    };
  }>;
};

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required env: ${name}`);
  }
  return value;
}

function requireAnyEnv(names: string[]): string {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }
  throw new Error(`Missing required env: one of ${names.join(", ")}`);
}

function normalizeDocumentId(id: string): string {
  if (id.startsWith("drafts.")) {
    return id.slice("drafts.".length);
  }
  if (id.startsWith("versions.")) {
    const parts = id.split(".");
    if (parts.length >= 3) {
      return parts.slice(2).join(".");
    }
  }
  return id;
}

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

function randomKey(): string {
  return Math.random().toString(36).slice(2, 14);
}

function rememberDelivery(key: string): boolean {
  const now = Date.now();
  for (const [deliveryKey, timestamp] of seenWebhookDeliveries.entries()) {
    if (now - timestamp > WEBHOOK_DEDUPE_TTL_MS) {
      seenWebhookDeliveries.delete(deliveryKey);
    }
  }

  if (seenWebhookDeliveries.has(key)) {
    return false;
  }
  seenWebhookDeliveries.set(key, now);
  return true;
}

function clientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;
  return "unknown";
}

function allowByRate(ip: string): boolean {
  const now = Date.now();
  const entry = requestRateByIp.get(ip);
  if (!entry || now - entry.windowStart > WEBHOOK_RATE_WINDOW_MS) {
    requestRateByIp.set(ip, { windowStart: now, count: 1 });
    return true;
  }

  if (entry.count >= WEBHOOK_RATE_LIMIT) {
    return false;
  }

  entry.count += 1;
  requestRateByIp.set(ip, entry);
  return true;
}

function isBlockedByUnauthorized(ip: string): boolean {
  const now = Date.now();
  const entry = unauthorizedByIp.get(ip);
  return Boolean(entry?.blockedUntil && now < entry.blockedUntil);
}

function recordUnauthorized(ip: string): void {
  const now = Date.now();
  const entry = unauthorizedByIp.get(ip);
  if (!entry || now - entry.windowStart > UNAUTH_WINDOW_MS) {
    unauthorizedByIp.set(ip, { windowStart: now, count: 1 });
    return;
  }

  const nextCount = entry.count + 1;
  const blockedUntil = nextCount >= UNAUTH_MAX_ATTEMPTS ? now + UNAUTH_BLOCK_MS : entry.blockedUntil;
  unauthorizedByIp.set(ip, { windowStart: entry.windowStart, count: nextCount, blockedUntil });
}

function clearUnauthorized(ip: string): void {
  unauthorizedByIp.delete(ip);
}

function canRunDocument(documentId: string): boolean {
  const now = Date.now();
  const lastRun = recentDocumentRuns.get(documentId);
  if (lastRun && now - lastRun < WEBHOOK_DOC_COOLDOWN_MS) {
    return false;
  }
  recentDocumentRuns.set(documentId, now);
  return true;
}

function parseImageRef(
  imageRef: string,
): { assetId: string; width: number; height: number; extension: string } | null {
  const match = /^image-([a-zA-Z0-9]+)-(\d+)x(\d+)-([a-zA-Z0-9]+)$/.exec(imageRef);
  if (!match) return null;
  return {
    assetId: match[1],
    width: Number(match[2]),
    height: Number(match[3]),
    extension: match[4].toLowerCase(),
  };
}

function imageAssetUrl(projectId: string, dataset: string, imageRef: string): string | null {
  const parsed = parseImageRef(imageRef);
  if (!parsed) return null;
  return `https://cdn.sanity.io/images/${projectId}/${dataset}/${parsed.assetId}-${parsed.width}x${parsed.height}.${parsed.extension}`;
}

async function assertExecutable(pathname: string): Promise<string> {
  await access(pathname, fsConstants.X_OK);
  return pathname;
}

async function ffmpegPath(): Promise<string> {
  const envPath = process.env.FFMPEG_BIN;
  if (envPath) {
    return assertExecutable(envPath);
  }

  if (ffmpegStatic) {
    const candidates = [
      ffmpegStatic,
      resolve(process.cwd(), ffmpegStatic),
      resolve(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg"),
      resolve(dirname(process.cwd()), "node_modules", "ffmpeg-static", "ffmpeg"),
    ];

    for (const candidate of candidates) {
      try {
        return await assertExecutable(candidate);
      } catch {
        // Try the next likely deploy path.
      }
    }

    throw new Error(
      `ffmpeg binary not found. ffmpeg-static resolved to "${ffmpegStatic}", but no executable was present in the deployment bundle.`
    );
  }

  return "ffmpeg";
}

async function convertGifToMp4(gifBytes: Uint8Array, sourceRef: string): Promise<{ path: string; cleanupDir: string }> {
  const workDir = join(tmpdir(), `gif2mp4-${Date.now()}-${randomKey()}`);
  await mkdir(workDir, { recursive: true });

  const parsed = parseImageRef(sourceRef);
  const baseName = parsed?.assetId ?? randomKey();
  const gifPath = join(workDir, `${baseName}.gif`);
  const mp4Path = join(workDir, `${baseName}.mp4`);
  await writeFile(gifPath, gifBytes);

  await execFileAsync(
    await ffmpegPath(),
    [
      "-y",
      "-i",
      gifPath,
      "-movflags",
      "+faststart",
      "-pix_fmt",
      "yuv420p",
      "-vf",
      "fps=20,scale=trunc(iw/2)*2:trunc(ih/2)*2",
      "-an",
      mp4Path,
    ],
    { timeout: FFMPEG_TIMEOUT_MS },
  );

  return { path: mp4Path, cleanupDir: workDir };
}

export async function POST(request: NextRequest) {
  try {
    const ip = clientIp(request);
    if (isBlockedByUnauthorized(ip)) {
      return new Response("Too Many Unauthorized Requests", { status: 429 });
    }
    if (!allowByRate(ip)) {
      return new Response("Too Many Requests", { status: 429 });
    }

    const projectId = requireEnv("NEXT_PUBLIC_SANITY_PROJECT_ID");
    const dataset = requireEnv("NEXT_PUBLIC_SANITY_DATASET");
    const token = requireAnyEnv(["SANITY_API_WRITE_TOKEN", "SANITY_API_TOKEN"]);
    const webhookSecret = requireEnv("SANITY_WEBHOOK_SECRET");

    const url = new URL(request.url);
    const force = url.searchParams.get("force") === "1";

    const { body: payload, isValidSignature } = await parseBody(
      request,
      webhookSecret,
      false,
    );
    if (isValidSignature !== true || !payload) {
      recordUnauthorized(ip);
      return new Response("Unauthorized", { status: 401 });
    }
    clearUnauthorized(ip);
    const payloadAny = payload as {
      _id?: string;
      documentId?: string;
      ids?: { created?: string[]; updated?: string[] };
    };

    const headerProjectId = request.headers.get("sanity-project-id");
    if (headerProjectId && headerProjectId !== projectId) {
      recordUnauthorized(ip);
      return new Response("Unauthorized", { status: 401 });
    }
    const headerDataset = request.headers.get("sanity-dataset");
    if (headerDataset && headerDataset !== dataset) {
      recordUnauthorized(ip);
      return new Response("Unauthorized", { status: 401 });
    }

    const deliveryKey = request.headers.get("idempotency-key");
    if (deliveryKey && !rememberDelivery(deliveryKey)) {
      return Response.json({ ok: true, duplicate: true, reason: "Duplicate webhook delivery" });
    }

    const documentId =
      payloadAny._id ||
      payloadAny.documentId ||
      payloadAny.ids?.created?.[0] ||
      payloadAny.ids?.updated?.[0];
    if (!documentId || typeof documentId !== "string") {
      return Response.json({ ok: false, reason: "Missing document id in webhook payload" }, { status: 400 });
    }
    const normalizedId = normalizeDocumentId(documentId);
    if (!canRunDocument(normalizedId)) {
      return Response.json({ ok: true, skipped: true, reason: "Document cooldown active" });
    }
    const candidateIds = uniqueIds([documentId, normalizedId, `drafts.${normalizedId}`]);

    const writeClient = createClient({
      projectId,
      dataset,
      apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2026-03-02",
      useCdn: false,
      token,
      perspective: "raw",
    });

    const doc = await writeClient.fetch<{
      _id: string;
      gallerySections?: GallerySection[];
    }>(
      `*[_type=="project" && _id in $ids][0]{
        _id,
        gallerySections[]{
          ...,
          images[]{_key, asset},
          convertedMedia[]{
            _key,
            _type,
            sourceImageRef,
            video{asset}
          }
        }
      }`,
      { ids: candidateIds },
    );

    if (!doc?._id) {
      console.log("[convert-gif] project not found", { documentId });
      return Response.json({ ok: true, converted: 0, reason: "Project not found for webhook id" });
    }

    const sections = doc?.gallerySections ?? [];
    if (!sections.length) {
      console.log("[convert-gif] no gallery sections", { projectId: doc._id });
      return Response.json({ ok: true, converted: 0, reason: "No gallery sections" });
    }

    let convertedCount = 0;
    let fixedImageKeyCount = 0;
    let updatedProcessedRefsCount = 0;
    const updatedSections: GallerySection[] = [];

    for (const section of sections) {
      const normalizedImages = (section.images ?? []).map((image) => {
        if (image._key) return image;
        fixedImageKeyCount += 1;
        return {
          ...image,
          _key: randomKey(),
        };
      });

      const gifImageRefs = new Set(
        normalizedImages
          .map((image) => image.asset?._ref)
          .filter((imageRef): imageRef is string => {
            if (!imageRef) return false;
            const parsed = parseImageRef(imageRef);
            return Boolean(parsed && parsed.extension === "gif");
          }),
      );

      const nextConverted = [...(section.convertedMedia ?? [])];

      const existingMap = new Map(
        nextConverted.filter((item) => item.sourceImageRef && item.video?.asset?._ref).map((item) => [item.sourceImageRef as string, item]),
      );
      const previousProcessedSet = new Set(section.processedGifRefs ?? []);
      for (const sourceRef of existingMap.keys()) {
        previousProcessedSet.add(sourceRef);
      }
      const nextProcessedSet = new Set(
        [...previousProcessedSet].filter((sourceRef) => gifImageRefs.has(sourceRef)),
      );

      for (const image of normalizedImages) {
        const imageRef = image.asset?._ref;
        if (!imageRef) continue;
        const parsed = parseImageRef(imageRef);
        if (!parsed || parsed.extension !== "gif") continue;
        if (existingMap.has(imageRef)) continue;
        // Respect manual deletions: if this GIF has been processed before, do not auto-regenerate MP4.
        if (!force && nextProcessedSet.has(imageRef)) continue;

        const gifUrl = imageAssetUrl(projectId, dataset, imageRef);
        if (!gifUrl) continue;
        const abortController = new AbortController();
        const timer = setTimeout(() => abortController.abort(), GIF_FETCH_TIMEOUT_MS);
        const gifResp = await fetch(gifUrl, { signal: abortController.signal }).finally(() =>
          clearTimeout(timer),
        );
        if (!gifResp.ok) continue;
        const contentLength = Number(gifResp.headers.get("content-length") ?? 0);
        if (contentLength > GIF_MAX_BYTES) continue;
        const gifBytes = new Uint8Array(await gifResp.arrayBuffer());
        if (gifBytes.byteLength > GIF_MAX_BYTES) continue;

        const { path: mp4Path, cleanupDir } = await convertGifToMp4(gifBytes, imageRef);
        try {
          const mp4Bytes = await readFile(mp4Path);
          const uploaded = await writeClient.assets.upload(
            "file",
            mp4Bytes,
            {
              filename: `${parsed.assetId}.mp4`,
              contentType: "video/mp4",
            },
          );

          nextConverted.push({
            _key: randomKey(),
            _type: "convertedMediaItem",
            sourceImageRef: imageRef,
            video: {
              _type: "file",
              asset: {
                _type: "reference",
                _ref: uploaded._id,
              },
            },
          });
          convertedCount += 1;
          nextProcessedSet.add(imageRef);
        } finally {
          await rm(cleanupDir, { recursive: true, force: true });
        }
      }

      const previousProcessedSorted = [...previousProcessedSet].sort();
      const nextProcessedSorted = [...nextProcessedSet].sort();
      const processedChanged =
        previousProcessedSorted.length !== nextProcessedSorted.length ||
        previousProcessedSorted.some((value, index) => value !== nextProcessedSorted[index]);
      if (processedChanged) {
        updatedProcessedRefsCount += 1;
      }

      updatedSections.push({
        ...section,
        processedGifRefs: nextProcessedSorted,
        images: normalizedImages,
        convertedMedia: nextConverted,
      });
    }

    if (convertedCount > 0 || fixedImageKeyCount > 0 || updatedProcessedRefsCount > 0) {
      await writeClient.patch(doc._id).set({ gallerySections: updatedSections }).commit();
    }

    console.log("[convert-gif] completed", {
      projectId: doc._id,
      force,
      converted: convertedCount,
      fixedImageKeys: fixedImageKeyCount,
      updatedProcessedRefs: updatedProcessedRefsCount,
    });
    return Response.json({
      ok: true,
      force,
      converted: convertedCount,
      fixedImageKeys: fixedImageKeyCount,
      updatedProcessedRefs: updatedProcessedRefsCount,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[convert-gif] failed:", message);
    return Response.json({ ok: false, error: message }, { status: 500 });
  }
}

export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
} //故意打這樣避免被看到GET接口，因為這個接口是給Sanity Webhook用的，不應該被外部訪問。
