"use client";

import { usePathname } from "next/navigation";

import type { SiteAssets } from "@/sanity/lib/queries";

import SectionBottomBar from "./SectionBottomBar";

const PAGE_MAP = {
  "/": "Home",
  "/page-artwork": "Gallery",
  "/page-about": "About",
} as const;

type AppMobileBottomBarProps = {
  bottomButtons?: SiteAssets["bottomButtons"];
};

export default function AppMobileBottomBar({ bottomButtons }: AppMobileBottomBarProps) {
  const pathname = usePathname();
  const isArtworkRoute = pathname === "/page-artwork" || pathname.startsWith("/page-artwork/");
  const isModalDetailRoute = pathname.startsWith("/page-artwork/projects/");
  const page = isArtworkRoute ? "Gallery" : PAGE_MAP[pathname as keyof typeof PAGE_MAP];

  if (!page) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-30 flex justify-center bg-[var(--color-primary-85)] pb-[env(safe-area-inset-bottom)] shadow-[0px_1px_5px_0px_var(--color-word1-50)] backdrop-blur-[2px] lg:hidden",
        isModalDetailRoute ? "pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SectionBottomBar className="w-full" page={page} bottomButtons={bottomButtons} />
    </div>
  );
}
