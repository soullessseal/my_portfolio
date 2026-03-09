"use client";

import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";

import CompositeCard from "../composite/CompositeCard";
import Tabs from "../composite/Tabs";

type Category = "uiux" | "graphic" | "other";

type ArtworkProject = {
  id: string;
  designName: string;
  category: Category;
  customCategoryLabel?: string;
  extraTag?: string;
  cover?: SanityImageSource;
};

type ArtworkGallerySectionProps = {
  device?: "mb" | "pc";
  className?: string;
  projects?: ArtworkProject[];
  basePath?: string;
  initialActiveKey?: "all" | Category;
  sectionId?: string;
};

const TAB_ITEMS = [
  { key: "all", label: "\u5168\u90e8" },
  { key: "uiux", label: "UI/UX" },
  { key: "graphic", label: "\u5e73\u9762\u8a2d\u8a08" },
  { key: "other", label: "\u5176\u4ed6" },
] as const;

const DEVICE_CONFIG = {
  mb: {
    sectionNodeId: "486:433",
    titleNodeId: "473:482",
    tabsNodeId: "486:446",
    cardsNodeId: "972:588",
    wrapperClass: "gap-[8px]",
    titleClass: "text-h1 text-word2",
    tabsClass: "shrink-0",
    cardsClass:
      "grid w-full grid-cols-2 gap-[8px] px-[24px] min-[560px]:grid-cols-3 md:grid-cols-4",
    cardClass: "w-full",
  },
  pc: {
    sectionNodeId: "799:787",
    titleNodeId: "799:788",
    tabsNodeId: "801:527",
    cardsNodeId: "972:614",
    wrapperClass: "gap-[16px]",
    titleClass: "text-pc-h1 text-word1",
    tabsClass: "shrink-0",
    cardsClass: "artwork-gallery-grid-pc",
    cardClass: "w-full",
  },
} as const;

const CATEGORY_LABEL: Record<Category, string> = {
  uiux: "UI/UX",
  graphic: "\u5e73\u9762\u8a2d\u8a08",
  other: "\u5176\u4ed6",
};

function getPrimaryTagLabel(
  project: Pick<ArtworkProject, "category" | "customCategoryLabel">,
) {
  if (project.customCategoryLabel?.trim()) {
    return project.customCategoryLabel.trim();
  }

  return CATEGORY_LABEL[project.category];
}

function getTagLabels(project: ArtworkProject) {
  return [getPrimaryTagLabel(project), project.extraTag?.trim() ?? ""]
    .filter(Boolean)
    .slice(0, 2);
}

export default function ArtworkGallerySection({
  device = "mb",
  className,
  projects = [],
  basePath = "/sanity-test",
  initialActiveKey = "all",
  sectionId,
}: ArtworkGallerySectionProps) {
  const config = DEVICE_CONFIG[device];
  const [activeKey, setActiveKey] = useState<"all" | Category>(initialActiveKey);

  useEffect(() => {
    setActiveKey(initialActiveKey);
  }, [initialActiveKey]);

  const filtered = useMemo(() => {
    if (activeKey === "all") return projects;
    return projects.filter((project) => project.category === activeKey);
  }, [projects, activeKey]);

  return (
    <section
      id={sectionId}
      className={["relative flex flex-col items-center", config.wrapperClass, className]
        .filter(Boolean)
        .join(" ")}
      data-name="Section_Gallery"
      data-node-id={config.sectionNodeId}
      data-device={device}
    >
      <h2 className={config.titleClass} data-node-id={config.titleNodeId}>
        {"\u4f5c\u54c1\u901f\u89bd"}
      </h2>

      <Tabs
        device={device}
        items={[...TAB_ITEMS]}
        activeKey={activeKey}
        onChange={(key) => setActiveKey(key as typeof activeKey)}
        className={config.tabsClass}
      />

      <div
        className={["w-full items-start", config.cardsClass].join(" ")}
        data-name={
          device === "pc" ? "Section_Gallery Box_PC" : "Section_Gallery Box_MB"
        }
        data-node-id={config.cardsNodeId}
      >
        {filtered.map((project) => {
          const coverUrl = project.cover
            ? urlFor(project.cover).width(960).quality(78).url()
            : undefined;

          return (
            <Link
              key={project.id}
              href={`${basePath}/projects/${project.id}`}
              scroll={false}
              className={["group block", config.cardClass].join(" ")}
            >
              <CompositeCard
                device={device}
                imageSrc={coverUrl}
                tagLabels={getTagLabels(project)}
                designName={project.designName}
                className="w-full"
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
