"use client";

import { usePathname } from "next/navigation";

import SectionHeader from "./SectionHeader";

export default function AppSharedHeader() {
  const pathname = usePathname();
  const isArtworkRoute = pathname === "/page-artwork" || pathname.startsWith("/page-artwork/");
  const isModalDetailRoute = pathname.startsWith("/page-artwork/projects/");
  const shouldShowHeader =
    pathname === "/" || pathname === "/page-about" || isArtworkRoute;

  if (!shouldShowHeader) {
    return null;
  }

  return (
    <>
      <SectionHeader
        device="mb"
        className={[
          "lg:hidden",
          isModalDetailRoute ? "pointer-events-none" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
      <SectionHeader
        device="pc"
        className={[
          "hidden lg:block",
          isModalDetailRoute ? "pointer-events-none" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </>
  );
}
