"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import ArtworkFeaturedSection from "../sections/ArtworkFeaturedSection";
import ArtworkGallerySection from "../sections/ArtworkGallerySection";
import FeaturedDetailModal from "../sections/FeaturedDetailModal";
import ScrollTopButton from "../ui/ScrollTopButton";
import type { Category, ProjectListItem } from "@/sanity/lib/queries";
import type { FeaturedProjectItem } from "../sections/ArtworkFeaturedSection";

type Props = {
  projects: ProjectListItem[];
};

function toCategoryTab(value: string | null): Category | undefined {
  if (value === "uiux" || value === "graphic" || value === "other") return value;
  return undefined;
}

export default function ArtworkPage({ projects }: Props) {
  const searchParams = useSearchParams();
  const initialGalleryTab = toCategoryTab(searchParams.get("tab"));
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(1);
  const [featuredDetailProject, setFeaturedDetailProject] = useState<FeaturedProjectItem | null>(null);
  const [lockedScrollY, setLockedScrollY] = useState(0);
  const scrollYRef = useRef(0); // ← 加在 galleryPcRef 旁邊
  const galleryPcRef = useRef<HTMLDivElement | null>(null);
  const galleryMbRef = useRef<HTMLDivElement | null>(null);
  const isModalOpen = featuredDetailProject !== null; // ← 新增

  // ← 新增：開啟 modal 前記住目前捲動位置
  const handleOpenDetail = (project: FeaturedProjectItem) => {
    scrollYRef.current = window.scrollY;
    setLockedScrollY(window.scrollY);
    setFeaturedDetailProject(project);
  };

  // ← 新增：關閉 modal 後還原捲動位置
  const handleCloseDetail = () => {
    setFeaturedDetailProject(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollYRef.current, behavior: "instant" as ScrollBehavior });
    });
  };

  useEffect(() => {
    if (!initialGalleryTab) return;

    const target =
      window.innerWidth >= 1024 ? galleryPcRef.current ?? galleryMbRef.current : galleryMbRef.current ?? galleryPcRef.current;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialGalleryTab]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
     <>  {/* ← main 外面包 Fragment */}
    <main
        className="relative min-h-screen min-w-[320px] overflow-x-hidden bg-primary text-word1"
        style={isModalOpen ? { // ← modal 開啟時凍結背景
          position: "fixed",
          top: `-${lockedScrollY}px`,
          left: 0,
          right: 0,
          overflow: "hidden",
        } : {}}
      >
      <div className="hidden min-h-screen w-full lg:block">
        <div className="h-[72px]" />
        <ArtworkFeaturedSection
          device="pc"
          activeIndex={activeFeaturedIndex}
          onChange={setActiveFeaturedIndex}
          onOpenDetail={handleOpenDetail} // ← 改這裡
        />
        <div ref={galleryPcRef} className="mx-auto mt-[58px] w-full max-w-[1440px] pb-[24px]">
          <ArtworkGallerySection
            device="pc"
            projects={projects}
            basePath="/page-artwork"
            initialActiveKey={initialGalleryTab ?? "all"}
          />
        </div>
      </div>

      <div className="min-h-screen w-full pb-[72px] lg:hidden">
        <div className="h-[calc(54px_+_env(safe-area-inset-top))]" />
        <ArtworkFeaturedSection
          device="mb"
          className="mt-[1px]"
          activeIndex={activeFeaturedIndex}
          onChange={setActiveFeaturedIndex}
          onOpenDetail={handleOpenDetail} // ← 改這裡
        />
        <div ref={galleryMbRef} className="mx-auto mt-[15px] w-full">
          <ArtworkGallerySection
            device="mb"
            projects={projects}
            basePath="/page-artwork"
            initialActiveKey={initialGalleryTab ?? "all"}
          />
        </div>
      </div>

      <ScrollTopButton
        className="fixed bottom-[80px] right-[12px] z-20 lg:bottom-[24px] lg:right-[24px]"
        onClick={handleScrollTop}
      />
      
    </main>
    {/* ← Modal 移到 main 外面，改用 handleCloseDetail */}
      <FeaturedDetailModal
        project={featuredDetailProject}
        onClose={handleCloseDetail} // ← 改這裡
      />
      </>
  );
}
