"use client";

import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { Category, ProjectListItem, SiteAssets } from "@/sanity/lib/queries";

import type { FeaturedProjectItem } from "../sections/ArtworkFeaturedSection";
import ArtworkFeaturedSection from "../sections/ArtworkFeaturedSection";
import ArtworkGallerySection from "../sections/ArtworkGallerySection";
import FeaturedDetailModal from "../sections/FeaturedDetailModal";
import ScrollTopButton from "../ui/ScrollTopButton";

type Props = {
  projects: ProjectListItem[];
  siteAssets?: SiteAssets | null;
};

function toCategoryTab(value: string | null): Category | undefined {
  if (value === "uiux" || value === "graphic" || value === "other") return value;
  return undefined;
}

export default function ArtworkPage({ projects, siteAssets }: Props) {
  const searchParams = useSearchParams();
  const initialGalleryTab = toCategoryTab(searchParams.get("tab"));
  const [activeFeaturedIndex, setActiveFeaturedIndex] = useState(1);
  const [featuredDetailProject, setFeaturedDetailProject] = useState<FeaturedProjectItem | null>(null);
  const [lockedScrollY, setLockedScrollY] = useState(0);
  const scrollYRef = useRef(0);
  const galleryPcRef = useRef<HTMLDivElement | null>(null);
  const galleryMbRef = useRef<HTMLDivElement | null>(null);
  const isModalOpen = featuredDetailProject !== null;

  const handleOpenDetail = (project: FeaturedProjectItem) => {
    scrollYRef.current = window.scrollY;
    setLockedScrollY(window.scrollY);
    setFeaturedDetailProject(project);
  };

  const handleCloseDetail = () => {
    setFeaturedDetailProject(null);
    requestAnimationFrame(() => {
      window.scrollTo({ top: scrollYRef.current, behavior: "instant" as ScrollBehavior });
    });
  };

  useEffect(() => {
    if (!initialGalleryTab) return;

    const target =
      window.innerWidth >= 1024
        ? galleryPcRef.current ?? galleryMbRef.current
        : galleryMbRef.current ?? galleryPcRef.current;

    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [initialGalleryTab]);

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <main
        className="relative min-h-screen min-w-[320px] overflow-x-hidden bg-primary text-word1"
        style={
          isModalOpen
            ? {
                position: "fixed",
                top: `-${lockedScrollY}px`,
                left: 0,
                right: 0,
                overflow: "hidden",
              }
            : undefined
        }
      >
        <div className="hidden min-h-screen w-full lg:block">
          <div className="h-[72px]" />
          <ArtworkFeaturedSection
            device="pc"
            activeIndex={activeFeaturedIndex}
            siteAssets={siteAssets}
            onChange={setActiveFeaturedIndex}
            onOpenDetail={handleOpenDetail}
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
            siteAssets={siteAssets}
            onChange={setActiveFeaturedIndex}
            onOpenDetail={handleOpenDetail}
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

      <FeaturedDetailModal
        project={featuredDetailProject}
        siteAssets={siteAssets}
        onClose={handleCloseDetail}
      />
    </>
  );
}
