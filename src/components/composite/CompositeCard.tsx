"use client";

import Image from "next/image";
import { useRef, useState } from "react";

import TagButton from "../ui/TagButton";

type CompositeCardDevice = "mb" | "pc";

type CompositeCardProps = {
  device?: CompositeCardDevice;
  imageSrc?: string;
  imageAlt?: string;
  tagLabels?: string[];
  designName?: string;
  className?: string;
};

const DEFAULT_IMAGE_SRC =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23c9c0bb'/%3E%3C/svg%3E";

const DEVICE_CONFIG: Record<
  CompositeCardDevice,
  {
    cardNodeId: string;
    dataName: string;
    sizeClass: string;
    paddingClass: string;
    tagNodeId: string;
    titleNodeId: string;
    titleClass: string;
  }
> = {
  mb: {
    cardNodeId: "489:470",
    dataName: "Composite_Card_MB",
    sizeClass: "h-[118px] w-full",
    paddingClass: "p-[8px]",
    tagNodeId: "360:263",
    titleNodeId: "489:460",
    titleClass: "text-mb-h5",
  },
  pc: {
    cardNodeId: "801:501",
    dataName: "Composite_Card_PC",
    sizeClass: "h-[200px] w-full",
    paddingClass: "p-[16px]",
    tagNodeId: "801:498",
    titleNodeId: "801:499",
    titleClass: "text-pc-h5",
  },
};

export default function CompositeCard({
  device = "mb",
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = "",
  tagLabels = ["TAG"],
  designName = "DESIGN NAME",
  className,
}: CompositeCardProps) {
  const config = DEVICE_CONFIG[device];
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const releaseTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const isInteractive = !isPressed && isHovered;
  const hideContent = isHovered || isPressed;
  const clearReleaseTimeout = () => {
    if (releaseTimeoutRef.current) {
      clearTimeout(releaseTimeoutRef.current);
      releaseTimeoutRef.current = null;
    }
  };

  const handlePressStart = (event: React.PointerEvent<HTMLElement>) => {
    clearReleaseTimeout();
    pointerStartRef.current = { x: event.clientX, y: event.clientY };
    setIsPressed(true);
  };

  const handlePressEnd = () => {
    clearReleaseTimeout();
    releaseTimeoutRef.current = setTimeout(() => {
      setIsPressed(false);
      releaseTimeoutRef.current = null;
    }, 180);
    pointerStartRef.current = null;
  };

  const handlePointerMove = (event: React.PointerEvent<HTMLElement>) => {
    if (!pointerStartRef.current) return;

    const dx = Math.abs(event.clientX - pointerStartRef.current.x);
    const dy = Math.abs(event.clientY - pointerStartRef.current.y);

    if (dx > 8 || dy > 8) {
      clearReleaseTimeout();
      pointerStartRef.current = null;
      setIsPressed(false);
    }
  };

  return (
    <article
      className={[
        "relative flex flex-col items-start justify-between overflow-hidden rounded-[16px] shadow-[0px_0px_3px_var(--color-word1-50)] transition-[transform,box-shadow] duration-200 ease-out",
        config.sizeClass,
        config.paddingClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        transform: isInteractive ? "translateY(-2px) scale(1.03)" : "translateY(0) scale(1)",
        boxShadow: isInteractive
            ? "0px 8px 18px var(--color-word1-50)"
            : "0px 0px 3px var(--color-word1-50)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onPointerDown={handlePressStart}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePressEnd}
      onPointerCancel={handlePressEnd}
      onPointerLeave={handlePressEnd}
      data-name={config.dataName}
      data-node-id={config.cardNodeId}
      data-device={device}
    >
      <div className="pointer-events-none absolute inset-0">
        <Image
          alt={imageAlt}
          src={imageSrc}
          fill
          sizes={device === "pc" ? "280px" : "152px"}
          className="object-cover transition-transform duration-200 ease-out"
          style={{
            transform: isInteractive ? "scale(1.08)" : "scale(1)",
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-200 ease-out"
          style={{
            opacity: hideContent ? 0 : 1,
            background: "var(--color-secondary-50)",
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-200 ease-out"
          style={{
            opacity: hideContent ? 0 : 1,
            background:
              "linear-gradient(to top, var(--color-word2-50) 10%, color-mix(in srgb, var(--color-word2) 0%, transparent) 30%)",
          }}
        />
        <div
          className="absolute inset-0 transition-opacity duration-200 ease-out"
          style={{
            opacity: hideContent ? 0 : 1,
            background:
              "linear-gradient(to top, var(--color-word1-50) 0%, color-mix(in srgb, var(--color-word1) 0%, transparent) 50%)",
          }}
        />
        {isPressed ? (
          <div
            className="absolute inset-0 transition-opacity duration-150 ease-out"
            style={{
              opacity: 1,
              boxShadow: "inset 0px 2px 12px var(--color-word1-50)",
            }}
          />
        ) : null}
      </div>

      <div
        className="relative z-10 flex max-w-full flex-wrap items-start gap-[4px] transition-opacity duration-200 ease-out lg:gap-[8px]"
        style={{
          opacity: hideContent ? 0 : 1,
        }}
      >
        {tagLabels.slice(0, 2).map((tagLabel, index) => (
          <TagButton
            key={`${config.tagNodeId}-${index}-${tagLabel}`}
            variant={device}
            label={tagLabel}
            dataNodeId={config.tagNodeId}
            className="shrink-0"
          />
        ))}
      </div>

      <p
        className={[
          "relative z-10 min-w-full whitespace-pre-wrap text-primary transition-opacity duration-200 ease-out",
          config.titleClass,
        ].join(" ")}
        style={{
          opacity: hideContent ? 0 : 1,
          textShadow: hideContent
            ? "none"
            : "0px 0px 12px var(--color-black-50), 0px 0px 8px var(--color-word1), 0px 0px 4px var(--color-word1-50)",
        }}
        data-node-id={config.titleNodeId}
      >
        {designName}
      </p>
    </article>
  );
}
