"use client";

import { useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent, TouchEvent as ReactTouchEvent } from "react";
import Image from "next/image";

import type { SiteAssets } from "@/sanity/lib/queries";
import { buildSanityImageUrl } from "@/sanity/lib/image";

import Select from "../ui/Select";
import SwitchButton from "../ui/SwitchButton";
import TagButton from "../ui/TagButton";

type ArtworkFeaturedSectionProps = {
  device?: "mb" | "pc";
  className?: string;
  activeIndex?: number;
  siteAssets?: SiteAssets | null;
  onChange?: (nextIndex: number) => void;
  onOpenDetail?: (project: FeaturedProjectItem) => void;
};

export type FeaturedProjectItem = {
  key: string;
  selectIconSrc: string;
  selectLabel: string;
  title: string;
  imageSrc: string;
  tagLabels: string[];
};

const PLACEHOLDER_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23c9c0bb'/%3E%3C/svg%3E";

const PROJECT_ITEMS: FeaturedProjectItem[] = [
  {
    key: "project-1",
    selectIconSrc: PLACEHOLDER_IMAGE,
    selectLabel: "1",
    title: "瑞士旅遊專案",
    imageSrc: PLACEHOLDER_IMAGE,
    tagLabels: ["平面設計專案", "旅遊主題"],
  },
  {
    key: "project-2",
    selectIconSrc: PLACEHOLDER_IMAGE,
    selectLabel: "2",
    title: "個人作品集網站",
    imageSrc: PLACEHOLDER_IMAGE,
    tagLabels: ["UI/UX設計", "個人品牌"],
  },
  {
    key: "project-3",
    selectIconSrc: PLACEHOLDER_IMAGE,
    selectLabel: "3",
    title: "印度朝聖海外網專案",
    imageSrc: PLACEHOLDER_IMAGE,
    tagLabels: ["UI設計專案", "海外主題"],
  },
] as const;

const DEVICE_CONFIG = {
  mb: {
    sectionNodeId: "473:411",
    titleNodeId: "473:441",
    contentNodeId: "473:417",
    contentTitleNodeId: "473:418",
    showcaseNodeId: "807:656",
    showcaseImageNodeId: "475:602",
    wrapperClass: "gap-[8px] px-[24px] pt-[8px] pb-0",
    carouselClass: "pb-[20px]",
    carouselTitleClass: "mb-[-20px] text-h1 text-word2",
    contentClass: "gap-[8px]",
    contentTitleClass: "text-work text-word1",
    showcaseShellClass: "w-full justify-center gap-[4px]",
    showcaseFrameClass:
      "h-[180px] w-[216px] shrink-0 overflow-hidden rounded-[16px] px-0 py-[8px] md:h-[280px] md:w-[336px]",
    showcaseImageClass:
      "h-[180px] w-[216px] max-w-none object-cover md:h-[280px] md:w-[336px]",
    showcaseImageWrapperClass: "absolute inset-0 flex justify-center overflow-hidden rounded-[16px]",
    tagVariant: "mb" as const,
  },
  pc: {
    sectionNodeId: "799:797",
    titleNodeId: "799:799",
    contentNodeId: "799:805",
    contentTitleNodeId: "799:806",
    showcaseNodeId: "807:646",
    showcaseImageNodeId: "799:807",
    wrapperClass: "gap-[16px] px-0 pt-[24px] pb-0",
    carouselClass: "pb-[22px]",
    carouselTitleClass: "mb-[-22px] text-pc-h1 text-word2",
    contentClass: "mx-auto w-full max-w-[1440px] gap-[16px] px-[48px]",
    contentTitleClass: "text-pc-work text-word1",
    showcaseShellClass: "w-full justify-center gap-[32px] xl:gap-[48px]",
    showcaseFrameClass: "h-[456px] w-[576px] shrink-0 overflow-hidden rounded-[16px] px-0 py-[8px]",
    showcaseImageClass: "h-full w-full object-cover",
    showcaseImageWrapperClass: "absolute inset-0 overflow-hidden rounded-[16px]",
    tagVariant: "pc" as const,
  },
} as const;

function resolveProjects(siteAssets?: SiteAssets | null) {
  return PROJECT_ITEMS.map((item) => {
    const heroImage = siteAssets?.featuredDetails
      ?.find((detail) => detail.projectKey === item.key)
      ?.images?.find((image) => image.caption === "hero");
    const selectIcon = siteAssets?.selectIcons?.find((icon) => icon.key === item.key);

    const imageSrc =
      buildSanityImageUrl(heroImage?.image, { width: 1200, quality: 78 }) ||
      (heroImage?._type === "featuredImageAsset" && heroImage.asset?.url) ||
      item.imageSrc;
    const selectIconSrc =
      buildSanityImageUrl(selectIcon?.imageItem?.image, { width: 120, quality: 82 }) ||
      item.selectIconSrc;

    return {
      ...item,
      imageSrc,
      selectIconSrc,
      selectLabel: selectIcon?.label || item.selectLabel,
    };
  });
}

export default function ArtworkFeaturedSection({
  device = "mb",
  className,
  activeIndex = 1,
  siteAssets,
  onChange,
  onOpenDetail,
}: ArtworkFeaturedSectionProps) {
  const config = DEVICE_CONFIG[device];
  const projects = resolveProjects(siteAssets);
  const activeProject = projects[activeIndex];
  const dragStartXRef = useRef<number | null>(null);
  const dragTriggeredRef = useRef(false);
  const draggedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);

  const handlePrev = () => {
    onChange?.((activeIndex - 1 + projects.length) % projects.length);
  };

  const handleNext = () => {
    onChange?.((activeIndex + 1) % projects.length);
  };

  const handlePointerDown = (clientX: number) => {
    dragStartXRef.current = clientX;
    dragTriggeredRef.current = false;
    draggedRef.current = false;
    setIsDragging(true);
  };

  const handlePointerMove = (clientX: number) => {
    if (dragStartXRef.current === null || dragTriggeredRef.current) return;

    const deltaX = clientX - dragStartXRef.current;
    const threshold = 40;

    if (deltaX >= threshold) {
      dragTriggeredRef.current = true;
      draggedRef.current = true;
      handlePrev();
      return;
    }

    if (deltaX <= -threshold) {
      dragTriggeredRef.current = true;
      draggedRef.current = true;
      handleNext();
    }
  };

  const handlePointerEnd = () => {
    dragStartXRef.current = null;
    dragTriggeredRef.current = false;
    setIsDragging(false);
  };

  const handleTouchStart = (event: ReactTouchEvent<HTMLDivElement>) => {
    handlePointerDown(event.touches[0]?.clientX ?? 0);
  };

  const handleTouchMove = (event: ReactTouchEvent<HTMLDivElement>) => {
    handlePointerMove(event.touches[0]?.clientX ?? 0);
  };

  return (
    <section
      className={[
        "relative flex flex-col items-center bg-linear-to-b from-secondary from-[20%] to-primary to-[60%]",
        config.wrapperClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name="Section_Featured"
      data-node-id={config.sectionNodeId}
      data-device={device}
    >
      <div
        className={["flex flex-col items-center", config.carouselClass].join(" ")}
        data-name="Circular Carousel"
        data-node-id={device === "pc" ? "799:798" : "489:558"}
      >
        <h2 className={config.carouselTitleClass} data-node-id={config.titleNodeId}>
          精選作品
        </h2>
        <Select
          items={projects.map((item) => ({
            iconSrc: item.selectIconSrc,
            label: item.selectLabel,
          }))}
          activeIndex={activeIndex}
          onChange={(nextIndex) => onChange?.(nextIndex)}
          className="mb-[-20px] md:mb-[-22px]"
        />
      </div>

      <div
        className={["relative flex w-full flex-col items-center", config.contentClass].join(" ")}
        data-name="Content"
        data-node-id={config.contentNodeId}
      >
        <p className={config.contentTitleClass} data-node-id={config.contentTitleNodeId}>
          {activeProject.title}
        </p>

        <div
          className={["relative flex items-center justify-center", config.showcaseShellClass].join(" ")}
          data-name="Section_Showcase"
          data-node-id={config.showcaseNodeId}
        >
          <SwitchButton device={device} direction="left" className="shrink-0" onClick={handlePrev} />

          <div
            className={[
              "relative flex touch-pan-y select-none items-start justify-center gap-[4px]",
              device === "pc" ? (isDragging ? "cursor-grabbing" : "cursor-grab") : "",
              config.showcaseFrameClass,
            ].join(" ")}
            onDragStart={(event) => event.preventDefault()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handlePointerEnd}
            onTouchCancel={handlePointerEnd}
            onPointerDown={(event: ReactPointerEvent<HTMLDivElement>) => {
              event.currentTarget.setPointerCapture(event.pointerId);
              handlePointerDown(event.clientX);
            }}
            onPointerMove={(event) => handlePointerMove(event.clientX)}
            onPointerUp={(event: ReactPointerEvent<HTMLDivElement>) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              handlePointerEnd();
            }}
            onPointerLeave={handlePointerEnd}
            onPointerCancel={(event: ReactPointerEvent<HTMLDivElement>) => {
              if (event.currentTarget.hasPointerCapture(event.pointerId)) {
                event.currentTarget.releasePointerCapture(event.pointerId);
              }
              handlePointerEnd();
            }}
            onClick={() => {
              if (draggedRef.current) {
                draggedRef.current = false;
                return;
              }

              onOpenDetail?.(activeProject);
            }}
            data-name="Showcase"
            data-node-id={config.showcaseImageNodeId}
          >
            <div className={config.showcaseImageWrapperClass}>
              <Image
                alt={activeProject.title}
                src={activeProject.imageSrc}
                width={device === "pc" ? 928 : 216}
                height={device === "pc" ? 496 : 180}
                className={[config.showcaseImageClass, "pointer-events-none select-none"].join(" ")}
                draggable={false}
              />
            </div>

            <TagButton
              variant={config.tagVariant}
              label={activeProject.tagLabels[0]}
              className="relative z-10 shrink-0 select-none"
              dataNodeId={device === "pc" ? "799:808" : "475:603"}
            />
            <TagButton
              variant={config.tagVariant}
              label={activeProject.tagLabels[1]}
              className="relative z-10 shrink-0 select-none"
              dataNodeId={device === "pc" ? "799:809" : "475:604"}
            />
          </div>

          <SwitchButton device={device} direction="right" className="shrink-0" onClick={handleNext} />
        </div>
      </div>
    </section>
  );
}
