"use client";

import { usePathname } from "next/navigation";

import SectionBottomBar from "./SectionBottomBar";

const PAGE_MAP = {
  "/": "Home",
  "/page-artwork": "Gallery",
  "/page-about": "About",
} as const;

export default function AppMobileBottomBar() {
  const pathname = usePathname();
  const isArtworkRoute = pathname === "/page-artwork" || pathname.startsWith("/page-artwork/");
  const isModalDetailRoute = pathname.startsWith("/page-artwork/projects/");
  const page = isArtworkRoute
    ? "Gallery"
    : PAGE_MAP[pathname as keyof typeof PAGE_MAP];

  if (!page) {
    return null;
  }

  return (
    <div
      className={[
        "fixed inset-x-0 bottom-0 z-30 flex justify-center lg:hidden",
        isModalDetailRoute ? "pointer-events-none" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <SectionBottomBar className="w-full" page={page} />
    </div>
  );
}
