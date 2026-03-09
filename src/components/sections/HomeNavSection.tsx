import type { Category, SiteAssets } from "@/sanity/lib/queries";

import { buildSanityImageUrl } from "@/sanity/lib/image";

import NavButton from "../ui/NavButton";

type HomeNavSectionProps = {
  device?: "mb" | "pc";
  navigationButtons?: SiteAssets["navigationButtons"];
  className?: string;
};

const PLACEHOLDER_CARD =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23c9c0bb'/%3E%3C/svg%3E";

const FALLBACK_ITEMS = [
  {
    key: "uiux" as const,
    title: "UI UX 作品",
    imageSrc: PLACEHOLDER_CARD,
    href: "/page-artwork?tab=uiux",
    mbNodeId: "387:266",
    pcNodeId: "801:433",
  },
  {
    key: "graphic" as const,
    title: "平面設計作品",
    imageSrc: PLACEHOLDER_CARD,
    href: "/page-artwork?tab=graphic",
    mbNodeId: "387:269",
    pcNodeId: "801:441",
  },
  {
    key: "other" as const,
    title: "其他作品",
    imageSrc: PLACEHOLDER_CARD,
    href: "/page-artwork?tab=other",
    mbNodeId: "387:275",
    pcNodeId: "801:445",
  },
] as const;

const itemsByKey = new Map(FALLBACK_ITEMS.map((item) => [item.key, item]));

function resolveNavigationButton(
  key: Category,
  navigationButtons?: SiteAssets["navigationButtons"],
) {
  const fallback = itemsByKey.get(key)!;
  const cmsItem = navigationButtons?.find((item) => item.key === key);

  return {
    ...fallback,
    title: cmsItem?.title || fallback.title,
    href: cmsItem?.href || fallback.href,
    imageAlt: cmsItem?.imageItem?.alt || cmsItem?.title || fallback.title,
    imageSrc:
      buildSanityImageUrl(cmsItem?.imageItem?.image, {
        width: 960,
        quality: 78,
      }) || fallback.imageSrc,
  };
}

export default function HomeNavSection({
  device = "mb",
  navigationButtons,
  className,
}: HomeNavSectionProps) {
  const isPc = device === "pc";

  return (
    <section
      className={[
        "flex w-full",
        isPc
          ? "w-full items-stretch gap-[16px] px-[48px]"
          : "flex-col items-start gap-[8px] px-[24px] md:px-[48px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name="Section_Nav"
      data-node-id={isPc ? "799:1304" : "354:69"}
      data-device={device}
    >
      {(["uiux", "graphic", "other"] as const).map((key) => {
        const item = resolveNavigationButton(key, navigationButtons);

        return (
          <NavButton
            key={item.key}
            device={device}
            state="normal"
            title={item.title}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
            href={item.href}
            className={isPc ? "h-full min-w-0 flex-1 basis-0" : "w-full md:h-[160px]"}
            dataNodeId={isPc ? item.pcNodeId : item.mbNodeId}
          />
        );
      })}
    </section>
  );
}
