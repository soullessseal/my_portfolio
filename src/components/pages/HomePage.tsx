"use client";

import type { SiteAssets } from "@/sanity/lib/queries";

import HomeHeroSection from "../sections/HomeHeroSection";
import HomeNavSection from "../sections/HomeNavSection";
import ScrollTopButton from "../ui/ScrollTopButton";

type HomePageProps = {
  siteAssets?: SiteAssets | null;
};

export default function HomePage({ siteAssets }: HomePageProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main
      className="relative min-h-0 min-w-[320px] overflow-x-hidden bg-primary text-word1"
      id="top"
    >
      <div className="hidden min-h-[calc(100dvh-40px)] w-full lg:block">
        <div className="h-[72px]" />
        <HomeHeroSection device="pc" hero={siteAssets?.hero} />
        <div className="mx-auto mt-[32px] w-full max-w-[1440px]">
          <HomeNavSection
            device="pc"
            navigationButtons={siteAssets?.navigationButtons}
            className="h-[max(150px,calc(100vh_-_536px))]"
          />
        </div>
      </div>

      <div className="min-h-[calc(100dvh-82px)] w-full pb-0 lg:hidden">
        <div className="h-[calc(54px_+_env(safe-area-inset-top))]" />
        <HomeHeroSection device="mb" hero={siteAssets?.hero} />
        <div className="mx-auto mt-[16px] w-full">
          <HomeNavSection device="mb" navigationButtons={siteAssets?.navigationButtons} />
        </div>
      </div>

      <ScrollTopButton
        className="fixed bottom-[calc(88px_+_env(safe-area-inset-bottom))] right-[12px] z-20 lg:bottom-[24px] lg:right-[24px]"
        onClick={handleScrollTop}
      />
    </main>
  );
}
