"use client";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { urlFor } from "@/sanity/lib/image";

type Props = {
  images: SanityImageSource[];
  videoUrls?: Array<string | null | undefined>;
  title: string;
  showArrows?: boolean;
  arrowPlacement?: "outside" | "inside" | "edge";
};

type IndicatorItem = number | "ellipsis-left" | "ellipsis-right";

type CarouselArrowButtonProps = {
  direction: "left" | "right";
  device: "mb" | "pc";
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
};

const ARROW_CONFIG = {
  mb: {
    left: {
      iconSrc: "/figma-assets/eb79ec2b753853df20063c041d9c3247dec5bb3e.svg",
      iconSize: "13px",
      iconClass: "absolute inset-[22.5%_34.17%]",
      buttonClass: "",
      buttonStyle: { width: 40, height: 40, minWidth: 40, minHeight: 40 },
    },
    right: {
      iconSrc: "/figma-assets/4be1f9eed94356903838c5ac6d2df5050fca6f70.svg",
      iconSize: "13px",
      iconClass: "absolute inset-[22.5%_34.17%]",
      buttonClass: "",
      buttonStyle: { width: 40, height: 40, minWidth: 40, minHeight: 40 },
    },
  },
  pc: {
    left: {
      iconSrc: "/figma-assets/ccc9c28a8773a29e37f27d88ded3ae59ea8e4098.svg",
      iconSize: "19px",
      iconClass:
        "absolute left-1/2 top-1/2 h-[33px] w-[19px] -translate-x-1/2 -translate-y-1/2",
      buttonClass: "",
      buttonStyle: { width: 60, height: 60, minWidth: 60, minHeight: 60 },
    },
    right: {
      iconSrc: "/figma-assets/1bca88747d6583849bea37ddd1be7d320ad00ad1.svg",
      iconSize: "19px",
      iconClass:
        "absolute left-1/2 top-1/2 h-[33px] w-[19px] -translate-x-1/2 -translate-y-1/2",
      buttonClass: "",
      buttonStyle: { width: 60, height: 60, minWidth: 60, minHeight: 60 },
    },
  },
} as const;

function CarouselArrowButton({
  direction,
  device,
  onClick,
  className,
  style,
}: CarouselArrowButtonProps) {
  const config = ARROW_CONFIG[device][direction];
  const isPc = device === "pc";

  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "group absolute rounded-[100px] bg-primary-50 shadow-[0px_0px_4px_0px_var(--color-word1-50)] backdrop-blur-[1px]",
        isPc
          ? "transition-[background-color,box-shadow] duration-150 ease-out hover:bg-word2-50 active:bg-word2-50 active:shadow-[0px_0px_4px_0px_var(--color-word1-50),inset_0px_1px_6px_0px_var(--color-word1-50)]"
          : "active:bg-word2-50 active:shadow-[0px_0px_4px_0px_var(--color-word1-50),inset_0px_1px_6px_0px_var(--color-word1-50)]",
        config.buttonClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ ...config.buttonStyle, ...style, borderRadius: 9999 }}
      aria-label={direction === "left" ? "Previous image" : "Next image"}
    >
      <span className="relative block size-full">
        <span className={config.iconClass}>
          <Image
            alt=""
            src={config.iconSrc}
            fill
            sizes={config.iconSize}
            className={
              isPc
                ? "transition-[filter,opacity] duration-150 ease-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert"
                : "group-active:brightness-0 group-active:invert"
            }
          />
        </span>
      </span>
    </button>
  );
}

function buildIndicators(total: number, currentIndex: number): IndicatorItem[] {
  if (total <= 9) {
    return Array.from({ length: total }, (_, index) => index);
  }

  const start = Math.max(1, Math.min(currentIndex - 2, total - 6));
  const end = Math.min(total - 2, start + 4);
  const indicators: IndicatorItem[] = [0];

  if (start > 1) indicators.push("ellipsis-left");
  for (let i = start; i <= end; i += 1) indicators.push(i);
  if (end < total - 2) indicators.push("ellipsis-right");

  indicators.push(total - 1);
  return indicators;
}

export default function ProjectCarousel({
  images,
  videoUrls,
  title,
  showArrows = true,
  arrowPlacement = "outside",
}: Props) {
  const items = useMemo(() => images ?? [], [images]);
  const [index, setIndex] = useState(0);
  const [isTabletUp, setIsTabletUp] = useState(false);
  const [isDesktopUp, setIsDesktopUp] = useState(false);
  const startXRef = useRef(0);

  const total = items.length;
  const canNav = total > 1;
  const indicators = useMemo(() => buildIndicators(total, index), [total, index]);
  const current = items[index];
  const currentVideoUrl = videoUrls?.[index] ?? null;
  const currentAssetRef =
    (current as { asset?: { _ref?: string }; _ref?: string } | undefined)?.asset?._ref ??
    (current as { _ref?: string } | undefined)?._ref ??
    "";
  const isAnimatedImage = /-(gif|webp)$/i.test(currentAssetRef);
  const currentImageUrl = current
    ? urlFor(current).width(912).fit("max").quality(90).url()
    : null;

  const goPrev = () => setIndex((i) => (i - 1 + total) % total);
  const goNext = () => setIndex((i) => (i + 1) % total);

  const onTouchStart = (e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startXRef.current;
    if (Math.abs(dx) < 40 || !canNav) return;
    if (dx > 0) goPrev();
    else goNext();
  };

  useEffect(() => {
    const tabletQuery = window.matchMedia("(min-width: 768px)");
    const desktopQuery = window.matchMedia("(min-width: 1024px)");

    const apply = () => {
      setIsTabletUp(tabletQuery.matches);
      setIsDesktopUp(desktopQuery.matches);
    };

    apply();
    tabletQuery.addEventListener("change", apply);
    desktopQuery.addEventListener("change", apply);

    return () => {
      tabletQuery.removeEventListener("change", apply);
      desktopQuery.removeEventListener("change", apply);
    };
  }, []);

  const arrowDevice = isTabletUp ? "pc" : "mb";
  const arrowOffset = (() => {
    if (arrowPlacement === "inside") {
      if (!isTabletUp) return 8;
      return isDesktopUp ? 12 : 10;
    }
    if (arrowPlacement === "edge") {
      if (!isTabletUp) return -27;
      if (isDesktopUp) return -40;
      return -24;
    }

    if (!isTabletUp) return -20;
    if (isDesktopUp) return -45;
    return -24;
  })();

  return (
    <div className="w-full">
      <div
        className="relative rounded-[18px]"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="relative overflow-hidden rounded-[18px] bg-black/5" style={{ aspectRatio: "19 / 12" }}>
          {current ? (
            currentVideoUrl ? (
              <video
                src={currentVideoUrl}
                className="absolute inset-0 h-full w-full object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={`${title} - ${index + 1}`}
              />
            ) : (
              <Image
                src={currentImageUrl ?? ""}
                alt={`${title} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 760px, (min-width: 768px) 90vw, 86vw"
                priority={index === 0}
                unoptimized={isAnimatedImage}
              />
            )
          ) : (
            <div className="absolute inset-0 bg-black/10" />
          )}

        </div>

        {canNav && showArrows && (
          <>
            <CarouselArrowButton
              device={arrowDevice}
              direction="left"
              onClick={goPrev}
              className="z-10 -translate-y-1/2"
              style={{ left: arrowOffset, top: "50%" }}
            />
            <CarouselArrowButton
              device={arrowDevice}
              direction="right"
              onClick={goNext}
              className="z-10 -translate-y-1/2"
              style={{ right: arrowOffset, top: "50%" }}
            />
          </>
        )}
      </div>

      {total > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2 px-2">
            {indicators.map((item, indicatorIndex) => {
              if (typeof item !== "number") {
                return (
                  <span
                    key={`${item}-${indicatorIndex}`}
                    className="select-none text-[10px] leading-none text-word1-50"
                    aria-hidden="true"
                  >
                    ...
                  </span>
                );
              }

              const i = item;
              const active = i === index;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={[
                    "h-2 w-2 shrink-0 rounded-full transition",
                    active ? "bg-word2" : "bg-word1-50 hover:bg-word1",
                  ].join(" ")}
                  aria-label={`Go to image ${i + 1}`}
                />
              );
            })}
        </div>
      )}
    </div>
  );
}
