"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import BottomNavButton from "../ui/BottomNavButton";

type PageVariant = "Home" | "Gallery" | "About";
type ActiveKey = "home" | "gallery" | "about";

type SectionBottomBarProps = {
  className?: string;
  page?: PageVariant;
};

const baseItems = [
  {
    key: "home",
    label: "首頁",
    href: "/",
    inactiveIconSrc: "/figma-assets/bottom-nav-home.svg",
    activeIconSrc: "/figma-assets/bottom-nav-home-active.svg",
    iconWidth: 30.083,
    iconHeight: 24.517,
    contentClassName: "pt-[7.32px]",
    dataNodeId: "I416:466;416:307",
  },
  {
    key: "gallery",
    label: "作品集",
    href: "/page-artwork",
    inactiveIconSrc: "/figma-assets/bottom-nav-gallery.svg",
    activeIconSrc: "/figma-assets/bottom-nav-gallery-active.svg",
    iconWidth: 26.133,
    iconHeight: 23,
    contentClassName: "pt-[9px]",
    dataNodeId: "I416:466;416:308",
  },
  {
    key: "about",
    label: "關於我",
    href: "/page-about",
    inactiveIconSrc: "/figma-assets/bottom-nav-about.svg",
    activeIconSrc: "/figma-assets/bottom-nav-about-active.svg",
    iconWidth: 18.402,
    iconHeight: 23.834,
    contentClassName: "pt-[8px]",
    dataNodeId: "I416:466;416:309",
  },
] as const;

export default function SectionBottomBar({
  className,
  page = "Home",
}: SectionBottomBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const pageToKey = (value: PageVariant): ActiveKey =>
    value.toLowerCase() as ActiveKey;
  const routeActiveKey =
    pathname === "/"
      ? "home"
      : pathname === "/page-artwork"
        ? "gallery"
        : pathname === "/page-about"
          ? "about"
          : pageToKey(page);
  const previousActiveKeyRef = useRef<ActiveKey>(routeActiveKey);
  const [activeKey, setActiveKey] = useState<ActiveKey>(routeActiveKey);
  const [activeBackgroundDurationClass, setActiveBackgroundDurationClass] =
    useState("duration-180");
  const [pressedKey, setPressedKey] = useState<ActiveKey | null>(null);

  useEffect(() => {
    baseItems.forEach((item) => {
      router.prefetch(item.href);
    });
  }, [router]);

  useEffect(() => {
    const currentIndex = baseItems.findIndex(
      (item) => item.key === previousActiveKeyRef.current,
    );
    const nextIndex = baseItems.findIndex((item) => item.key === routeActiveKey);
    const travelSteps = Math.abs(currentIndex - nextIndex);
    const frameId = window.requestAnimationFrame(() => {
      setActiveBackgroundDurationClass(travelSteps >= 2 ? "duration-280" : "duration-180");
      setActiveKey(routeActiveKey);
      previousActiveKeyRef.current = routeActiveKey;
      setPressedKey(null);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [routeActiveKey]);

  const activeIndex = baseItems.findIndex((item) => item.key === activeKey);
  const activeBackgroundWidth = "calc((100% - 72px) / 3)";
  const activeBackgroundOffset = `calc(24px + ${activeIndex} * (${activeBackgroundWidth} + 12px))`;

  return (
    <div
      className={["relative h-[72px] w-full", className].filter(Boolean).join(" ")}
      data-name="Section Bottom Bar"
      data-node-id="431:202"
      data-page={activeKey}
    >
      <div
        className={[
          "absolute inset-0 flex items-center gap-[12px] px-[24px] py-[8px]",
          "shadow-[0px_1px_5px_0px_var(--color-word1-50)]",
          "backdrop-blur-[2px]",
          "transition-colors duration-300 ease-out",
          "bg-[var(--color-primary-85)]",
        ]
          .filter(Boolean)
          .join(" ")}
        data-name="Background Bar"
        data-node-id="416:507"
      />
      <div
        className={[
          "pointer-events-none absolute top-[8px] h-[56px] rounded-[8px] bg-word2-50 transition-[left] ease-out",
          activeBackgroundDurationClass,
        ].join(" ")}
        style={{
          left: activeBackgroundOffset,
          width: activeBackgroundWidth,
        }}
        data-name="Active Background"
        data-node-id="416:461"
      />
      <nav
        className="absolute inset-0 flex items-center gap-[12px] px-[24px] py-[8px]"
        aria-label={`${activeKey} bottom navigation`}
        data-name="Composite_Bottom Button"
        data-node-id="416:466"
      >
        {baseItems.map((item) => {
          const isActive = item.key === activeKey;
          const isPressed = !isActive && item.key === pressedKey;
          const labelClassName = isActive
            ? "text-primary"
            : "text-word1-50 [text-shadow:0_0_8px_var(--color-primary-85),0_0_4px_var(--color-primary),0_0_1px_var(--color-primary)]";
          const iconStyle = isActive
            ? undefined
            : {
                filter:
                  "drop-shadow(0 0 8px var(--color-primary-85)) drop-shadow(0 0 4px var(--color-primary)) drop-shadow(0 0 1px var(--color-primary))",
              };

          return (
            <BottomNavButton
              key={item.key}
              label={item.label}
              iconSrc={isActive ? item.activeIconSrc : item.inactiveIconSrc}
              iconWidth={item.iconWidth}
              iconHeight={item.iconHeight}
              iconStyle={iconStyle}
              contentClassName={item.contentClassName}
              className={[
                "z-10 flex-1 basis-0 transition-[background-color,box-shadow] duration-150 ease-out",
                isPressed
                  ? "shadow-[inset_0_1px_6px_var(--color-word1-50)]"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              labelClassName={labelClassName}
              dataNodeId={item.dataNodeId}
              onPointerDown={() => {
                if (!isActive) {
                  setPressedKey(item.key);
                }
              }}
              onPointerUp={() => {
                setPressedKey((current) => (current === item.key ? null : current));
              }}
              onPointerLeave={() => {
                setPressedKey((current) => (current === item.key ? null : current));
              }}
              onPointerCancel={() => {
                setPressedKey((current) => (current === item.key ? null : current));
              }}
              onClick={() => {
                if (pathname === item.href) {
                  return;
                }
                setPressedKey(null);
                router.push(item.href);
              }}
            />
          );
        })}
      </nav>
    </div>
  );
}
