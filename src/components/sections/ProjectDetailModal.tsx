"use client";

import type { CSSProperties } from "react";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import lottie from "lottie-web";
import type { AnimationItem } from "lottie-web";

import ModalShell from "@/components/ui/ModalShell";
import ProjectCarousel from "@/components/ui/ProjectCarousel";
import TagButton from "@/components/ui/TagButton";

type Category = "uiux" | "graphic" | "other";

const CATEGORY_LABEL: Record<Category, string> = {
  uiux: "UI/UX",
  graphic: "\u5e73\u9762\u8a2d\u8a08",
  other: "\u5176\u4ed6",
};

type Props = {
  project: {
    _id: string;
    designName: string;
    category: Category;
    customCategoryLabel?: string;
    extraTag?: string;
    gallerySections?: {
      _key?: string;
      subtitle?: string;
      images?: SanityImageSource[];
      convertedMedia?: {
        sourceImageRef?: string;
        video?: {
          asset?: {
            _ref?: string;
          };
        };
      }[];
    }[];
  } | null;
  closeHref: string;
};

function getSanityFileUrl(fileRef: string | undefined): string | null {
  if (!fileRef) return null;
  const match = /^file-([a-zA-Z0-9]+)-([a-zA-Z0-9]+)$/.exec(fileRef);
  if (!match) return null;

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  if (!projectId || !dataset) return null;

  const [, assetId, extension] = match;
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${assetId}.${extension}`;
}

function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Close modal"
      className="group relative inline-flex shrink-0 items-center justify-center overflow-hidden border border-word1-50 bg-primary-50 shadow-[0px_0px_4px_0px_var(--color-word1-50)] backdrop-blur-[1px] transition-[background-color,box-shadow] duration-150 ease-out hover:bg-word2-50 active:bg-word2-50 active:shadow-[0px_0px_4px_0px_var(--color-word1-50),inset_0px_1px_6px_0px_var(--color-word1-50)]"
      style={{ width: 28, height: 28, borderRadius: 9999, minWidth: 28, minHeight: 28 }}
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-[10px] w-[10px] text-word2 transition-colors duration-150 ease-out group-hover:text-primary group-active:text-primary"
        fill="none"
      >
        <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  );
}

function getFontStyle(prefix: "mb" | "pc", name: "h5" | "work"): CSSProperties {
  return {
    fontFamily: `var(--font-${prefix}-${name}-family)`,
    fontWeight: `var(--font-${prefix}-${name}-weight)`,
    fontSize: `var(--font-${prefix}-${name}-size)`,
    lineHeight: `var(--font-${prefix}-${name}-line-height)`,
    letterSpacing: `var(--font-${prefix}-${name}-letter-spacing)`,
  };
}

const PROJECT_MODAL_SCROLL_HINT_ASSET =
  "/figma-assets/699044657eec75e76de56108_9a9d9cb55e14430ca8893be47c5c845a.json";

export default function ProjectDetailModal({ project, closeHref }: Props) {
  const router = useRouter();
  const [isTabletUp, setIsTabletUp] = useState(false);
  const scrollHintRef = useRef<HTMLDivElement | null>(null);
  const scrollHintTimeoutRef = useRef<number | null>(null);
  const scrollHintAnimationRef = useRef<AnimationItem | null>(null);

  const closeModal = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(closeHref, { scroll: false });
  };

  useEffect(() => {
    const tabletQuery = window.matchMedia("(min-width: 768px)");
    const apply = () => setIsTabletUp(tabletQuery.matches);

    apply();
    tabletQuery.addEventListener("change", apply);

    return () => tabletQuery.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!project || !isTabletUp || !scrollHintRef.current) return;

    const container = scrollHintRef.current;
    container.style.opacity = "0";

    const animation = lottie.loadAnimation({
      container,
      renderer: "svg",
      loop: true,
      autoplay: false,
      path: PROJECT_MODAL_SCROLL_HINT_ASSET,
      rendererSettings: {
        preserveAspectRatio: "xMidYMid meet",
        progressiveLoad: true,
      },
    });
    scrollHintAnimationRef.current = animation;

    const showTimeoutId = window.setTimeout(() => {
      container.style.opacity = "0.5";
      animation.goToAndPlay(0, true);

      scrollHintTimeoutRef.current = window.setTimeout(() => {
        container.style.opacity = "0";
        animation.stop();
      }, 3000);
    }, 120);

    return () => {
      window.clearTimeout(showTimeoutId);
      if (scrollHintTimeoutRef.current !== null) {
        window.clearTimeout(scrollHintTimeoutRef.current);
        scrollHintTimeoutRef.current = null;
      }
      scrollHintAnimationRef.current = null;
      animation.destroy();
    };
  }, [project, isTabletUp]);

  const scrollBottomGapPx = isTabletUp ? 24 : -12;
  const tagVariant = isTabletUp ? "pc" : "mb";
  const titleStyle = getFontStyle(isTabletUp ? "pc" : "mb", "work");
  const subtitleStyle = getFontStyle(isTabletUp ? "pc" : "mb", "h5");
  const viewportPaddingClass = isTabletUp ? "p-6" : "p-2";
  const headerPadding = isTabletUp ? "22px 24px 20px" : "16px 16px 14px";
  const bodyPaddingClass = isTabletUp ? "min-h-0 px-4 py-8" : "min-h-0 px-3 pt-3 pb-0";
  const scrollContentStyle: CSSProperties = {
    height: `calc(82dvh - 140px - ${scrollBottomGapPx}px)`,
    maxHeight: `calc(82dvh - 140px - ${scrollBottomGapPx}px)`,
    overflowY: "auto",
    paddingTop: 0,
    paddingBottom: isTabletUp ? "0.75rem" : "0rem",
    paddingLeft: isTabletUp ? "0rem" : "0.75rem",
    paddingRight: isTabletUp ? "0rem" : "0.75rem",
  };
  const primaryTagLabel = project?.category
    ? project.customCategoryLabel?.trim() || CATEGORY_LABEL[project.category]
    : "Project";
  const tagLabels = [primaryTagLabel, project?.extraTag?.trim() ?? ""].filter(Boolean).slice(0, 2);
  const gallerySections =
    project?.gallerySections?.filter(
      (section) => (section.images?.length ?? 0) > 0 || (section.convertedMedia?.length ?? 0) > 0,
    ) ?? [];

  return (
    <ModalShell closeHref={closeHref}>
      <div className="fixed inset-0 z-50">
        <button
          type="button"
          onClick={closeModal}
          className="absolute inset-0 bg-black/50"
          aria-label="Close modal"
        />

        <div
          className={`absolute inset-0 flex items-center justify-center ${viewportPaddingClass}`}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div
            className="w-full max-w-[900px] overflow-hidden p-[4px]"
            style={{ borderRadius: 18, boxShadow: "0 0 6px var(--color-word1-50)" }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="grid h-[82dvh] w-full grid-rows-[auto_minmax(0,1fr)] overflow-hidden bg-primary"
              style={{ borderRadius: 14 }}
            >
              <div
                className="flex items-start justify-between gap-6 border-b border-secondary-50"
                style={{ padding: headerPadding }}
              >
                <div className="flex min-w-0 flex-1 flex-col items-start gap-[10px]">
                  <div className="flex max-w-full flex-wrap items-start gap-[8px]">
                    {tagLabels.map((tagLabel, index) => (
                      <TagButton key={`${index}-${tagLabel}`} variant={tagVariant} label={tagLabel} />
                    ))}
                  </div>
                  <div className="text-word2" style={titleStyle}>
                    {project?.designName ?? "Project Showcase"}
                  </div>
                </div>

                <div className="shrink-0">
                  <CloseButton onClick={closeModal} />
                </div>
              </div>

              <div className={`relative ${bodyPaddingClass}`}>
                <div style={{ background: "rgba(255, 255, 255, 0.4)" }}>
                  <div className="hide-scrollbar-desktop pb-0 md:pb-6" style={scrollContentStyle}>
                    {gallerySections.length > 0 ? (
                      <div>
                        {gallerySections.map((section, index) => (
                          <div
                            key={section._key ?? `${section.subtitle ?? "section"}-${index}`}
                            className={index === 0 ? "relative" : undefined}
                            style={{ paddingTop: index === 0 ? 0 : 40 }}
                          >
                            <section className="flex flex-col gap-4">
                              <div className="mx-auto w-[86%] max-w-[760px] md:w-[90%] lg:w-full">
                                {section.subtitle?.trim() ? (
                                  <div className="mb-4">
                                    <h2 className="text-word2" style={subtitleStyle}>
                                      {section.subtitle.trim()}
                                    </h2>
                                  </div>
                                ) : index === 0 ? (
                                  <div className="mb-4 h-[1px]" />
                                ) : null}

                                <ProjectCarousel
                                  images={section.images ?? []}
                                  videoUrls={(section.images ?? []).map((image) => {
                                    const imageRef =
                                      (image as { asset?: { _ref?: string } } | undefined)?.asset?._ref;
                                    if (!imageRef) return null;
                                    const converted = section.convertedMedia?.find(
                                      (item) => item.sourceImageRef === imageRef,
                                    );
                                    return getSanityFileUrl(converted?.video?.asset?._ref);
                                  })}
                                  title={
                                    section.subtitle?.trim()
                                      ? `${project?.designName ?? "Project"} - ${section.subtitle.trim()}`
                                      : project?.designName ?? "Project"
                                  }
                                  showArrows
                                  arrowPlacement="edge"
                                />
                              </div>
                            </section>
                            {index === 0 ? (
                              <div
                                ref={scrollHintRef}
                                className="pointer-events-none absolute left-1/2 top-[0px] hidden h-[48px] w-[48px] -translate-x-1/2 opacity-0 transition-opacity duration-200 md:block"
                              />
                            ) : null}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="px-1 py-2 text-word1">
                        This project does not have any gallery sections yet.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}


