"use client";

import type { SiteAssets } from "@/sanity/lib/queries";

import SectionContact from "../sections/SectionContact";
import SectionDesignPhilosophy from "../sections/SectionDesignPhilosophy";
import SectionSkill from "../sections/SectionSkill";
import SectionTool from "../sections/SectionTool";
import SectionWorkExperience from "../sections/SectionWorkExperience";
import ScrollTopButton from "../ui/ScrollTopButton";

type AboutPageProps = {
  siteAssets?: SiteAssets | null;
};

export default function AboutPage({ siteAssets }: AboutPageProps) {
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="relative min-h-screen min-w-[320px] overflow-x-hidden bg-primary text-word1">
      <div className="hidden min-h-screen w-full lg:block">
        <div className="h-[72px]" />
        <SectionContact device="pc" photo={siteAssets?.contact?.photo} />
        <div className="mx-auto w-full max-w-[1440px]">
          <div className="mt-[48px]">
            <SectionDesignPhilosophy device="pc" />
          </div>
          <div className="mt-[48px]">
            <SectionSkill device="pc" />
          </div>
          <div className="mt-[48px]">
            <SectionTool device="pc" toolIcons={siteAssets?.toolIcons} />
          </div>
          <div className="mt-[48px] pb-[24px]">
            <SectionWorkExperience device="pc" />
          </div>
        </div>
      </div>

      <div className="min-h-screen w-full pb-0 lg:hidden">
        <div className="h-[calc(54px_+_env(safe-area-inset-top))]" />
        <SectionContact device="mb" photo={siteAssets?.contact?.photo} />
        <div className="mt-[16px]">
          <SectionDesignPhilosophy device="mb" />
        </div>
        <div className="mt-[16px]">
          <SectionSkill device="mb" />
        </div>
        <div className="mt-[16px]">
          <SectionTool device="mb" toolIcons={siteAssets?.toolIcons} />
        </div>
        <div className="mt-[16px]">
          <SectionWorkExperience device="mb" />
        </div>
      </div>

      <ScrollTopButton
        className="fixed bottom-[80px] right-[12px] z-20 lg:bottom-[24px] lg:right-[24px]"
        onClick={handleScrollTop}
      />
    </main>
  );
}
