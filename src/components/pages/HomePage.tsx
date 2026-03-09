"use client";

import HomeHeroSection from "../sections/HomeHeroSection";
import HomeNavSection from "../sections/HomeNavSection";
import ScrollTopButton from "../ui/ScrollTopButton";

export default function HomePage() {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main
      className="relative min-h-screen min-w-[320px] overflow-x-hidden bg-primary text-word1"
      id="top"
    >
      <div className="hidden min-h-screen w-full lg:block">
        <div className="h-[72px]" />
        <HomeHeroSection device="pc" />
        <div className="mx-auto mt-[32px] w-full max-w-[1440px]">
          <HomeNavSection
            device="pc"
            className="h-[max(150px,calc(100vh_-_536px))]"
          />
        </div>
      </div>

      <div className="min-h-screen w-full pb-[72px] lg:hidden">
        <div className="h-[calc(54px_+_env(safe-area-inset-top))]" />
        <HomeHeroSection device="mb" />
        <div className="mx-auto mt-[16px] w-full">
          <HomeNavSection device="mb" />
        </div>
      </div>

      <ScrollTopButton
        className="fixed bottom-[80px] right-[12px] z-20 lg:bottom-[24px] lg:right-[24px]"
        onClick={handleScrollTop}
      />
    </main>
  );
}
