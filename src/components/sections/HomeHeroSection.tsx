import Image from "next/image";
import type { CSSProperties } from "react";

import type { SiteAssets } from "@/sanity/lib/queries";

import CmsImage from "../ui/CmsImage";
import TagButton from "../ui/TagButton";

type HomeHeroSectionProps = {
  device?: "mb" | "pc";
  hero?: SiteAssets["hero"];
  className?: string;
};

const DESIGNER_LOCKUP_SRC = {
  mb: "/figma-assets/9614435c0823117f7af970609a08bc8955c816f2.svg",
  pc: "/figma-assets/79a1e8896d9d708b008360c67a9406a8b625ada1.svg",
} as const;

const FALLBACK_HERO_ALT = "Betty portfolio hero image";
const DEVICE_CONFIG = {
  mb: {
    sectionNodeId: "360:273",
    imageNodeId: "799:1058",
    tagsNodeId: "354:87",
    firstTagNodeId: "360:264",
    secondTagNodeId: "360:267",
    introNodeId: "377:251",
    introTextNodeId: "361:315",
    designerNodeId: "978:523",
    outerClass:
      "h-[212px] w-full min-[360px]:h-[clamp(212px,calc(212px_+_(100vw_-_360px)_/_4),372px)]",
    innerClass:
      "relative mx-auto flex h-full w-full flex-col items-start justify-between px-[24px] pt-[8px] md:px-[48px]",
    tagsGapClassName:
      "gap-[4px] min-[360px]:gap-[clamp(4px,calc(4px_+_(100vw_-_360px)_/_40),10px)]",
    introGapClassName:
      "gap-[8px] min-[360px]:gap-[clamp(8px,calc(8px_+_(100vw_-_360px)_/_28),20px)]",
    imageWrapperClassName:
      "absolute right-0 top-0 h-[180px] w-[360px] min-[360px]:h-[clamp(180px,calc(180px_+_(100vw_-_360px)_/_4),340px)] min-[360px]:w-[clamp(360px,calc(360px_+_(100vw_-_360px)_/_2),680px)]",
    imageWrapperStyle: {
      right: "max(0px, calc((100vw - 560px) / 2))",
    },
    imageClassName:
      "absolute left-[-2.3%] top-[-108%] h-[226.63%] w-[169.89%] max-w-none min-[480px]:top-[-84%] min-[480px]:h-[210%] min-[768px]:left-[6%]",
    introTextClassName:
      "w-full text-mb-h5 text-word2-50 md:!font-bold md:![font-size:16px] md:![font-family:var(--font-pc-h5-family)]",
    introTextStyle: {
      letterSpacing: "0.08em",
      lineHeight: 1.45,
    } satisfies CSSProperties,
    designerClassName:
      "h-[29.44px] w-[204.83px] min-[360px]:h-[clamp(29.44px,calc(29.44px_+_(100vw_-_360px)_/_12),47.1px)] min-[360px]:w-[clamp(204.83px,calc(204.83px_+_(100vw_-_360px)_/_4.3),327.73px)]",
    tagVariant: "mb" as const,
  },
  pc: {
    sectionNodeId: "799:1308",
    imageNodeId: "801:449",
    tagsNodeId: "799:1310",
    firstTagNodeId: "799:1311",
    secondTagNodeId: "799:1312",
    introNodeId: "799:1313",
    introTextNodeId: "799:1314",
    designerNodeId: "978:522",
    outerClass: "h-[360px] w-full",
    innerClass:
      "relative mx-auto flex h-full w-full max-w-[1440px] flex-col items-start justify-between px-[48px] pt-[24px] pb-[24px]",
    tagsGapClassName: "gap-[8px]",
    introGapClassName: "gap-[16px]",
    imageWrapperClassName: "absolute right-0 top-0 h-[360px] w-[719px]",
    imageWrapperStyle: {
      right: "max(0px, calc((100vw - 1440px) / 2))",
    },
    imageClassName:
      "absolute left-[-48.07%] top-[-140.83%] h-[302.59%] w-[226.83%] max-w-none",
    introTextClassName: "w-full max-w-[928px] text-pc-h5 text-word2-50",
    introTextStyle: {
      letterSpacing: "0.1em",
      lineHeight: 1.5,
    } satisfies CSSProperties,
    designerClassName: "h-[47.104px] w-[327.729px]",
    tagVariant: "pc" as const,
  },
} as const;

export default function HomeHeroSection({
  device = "mb",
  hero,
  className,
}: HomeHeroSectionProps) {
  const config = DEVICE_CONFIG[device];
  const heroImage = device === "pc" ? hero?.desktopImage : hero?.mobileImage ?? hero?.desktopImage;

  return (
    <section
      className={[
        "relative overflow-hidden bg-linear-to-b from-secondary from-[20%] to-primary to-[60%]",
        config.outerClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name="Section_Hero"
      data-node-id={config.sectionNodeId}
      data-device={device}
    >
      <div
        className={config.imageWrapperClassName}
        style={config.imageWrapperStyle}
        data-name="Section_Hero Pic"
        data-node-id={config.imageNodeId}
      >
        {heroImage?.image ? (
          <CmsImage
            image={heroImage.image}
            alt={heroImage.alt || FALLBACK_HERO_ALT}
            width={1871}
            height={1206}
            sizes="100vw"
            maxWidth={2000}
            quality={84}
            className={config.imageClassName}
            priority
          />
        ) : null}
      </div>

      <div className={config.innerClass}>
        <div
          className={["relative z-10 flex items-center", config.tagsGapClassName].join(" ")}
          data-name="Tag"
          data-node-id={config.tagsNodeId}
        >
          <TagButton
            variant={config.tagVariant}
            label="UI/UX 設計"
            className="md:min-h-[28px] md:[&>span]:!font-normal md:[&>span]:![font-size:16px] md:[&>span]:![line-height:1.25] md:[&>span]:![font-family:var(--font-pc-tag-family)]"
            dataNodeId={config.firstTagNodeId}
          />
          <TagButton
            variant={config.tagVariant}
            label="平面設計"
            className="md:min-h-[28px] md:[&>span]:!font-normal md:[&>span]:![font-size:16px] md:[&>span]:![line-height:1.25] md:[&>span]:![font-family:var(--font-pc-tag-family)]"
            dataNodeId={config.secondTagNodeId}
          />
        </div>

        <div
          className={["relative z-10 flex flex-col items-start", config.introGapClassName].join(" ")}
          data-name="Intro"
          data-node-id={config.introNodeId}
        >
          <p className={config.introTextClassName} style={config.introTextStyle} data-node-id={config.introTextNodeId}>
            <span>我是</span>
            <span className="text-highlight">
              設計師 Betty
              <br />
              專注於 UI/UX、網站視覺與品牌表現
            </span>
            <br />
            <span>透過清楚的資訊結構與細緻視覺，打造兼具體驗與辨識度的作品。</span>
          </p>
          <Image
            alt="DESIGNER"
            src={DESIGNER_LOCKUP_SRC[device]}
            width={device === "mb" ? 205 : 328}
            height={device === "mb" ? 30 : 47}
            className={config.designerClassName}
            data-name="Union"
            data-node-id={config.designerNodeId}
          />
        </div>
      </div>
    </section>
  );
}
