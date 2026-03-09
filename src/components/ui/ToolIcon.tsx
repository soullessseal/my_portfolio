import Image from "next/image";

import type { SiteAssets } from "@/sanity/lib/queries";
import { buildSanityImageUrl } from "@/sanity/lib/image";

export type ToolIconName =
  | "Figma"
  | "Canva"
  | "Illustrator"
  | "Photoshop"
  | "Indesign"
  | "Premiere"
  | "Aftereffect"
  | "GitMind"
  | "Capcut";

type ToolIconProps = {
  icon: ToolIconName;
  device?: "mb" | "pc";
  className?: string;
  dataNodeId?: string;
  toolIcons?: SiteAssets["toolIcons"];
};

const PLACEHOLDER_ICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='transparent'/%3E%3C/svg%3E";

function resolveToolIconSrc(icon: ToolIconName, toolIcons?: SiteAssets["toolIcons"]) {
  const cmsItem = toolIcons?.find((item) => item.key === icon);

  return (
    buildSanityImageUrl(cmsItem?.imageItem?.image, {
      width: 144,
      quality: 82,
    }) || PLACEHOLDER_ICON
  );
}

export default function ToolIcon({
  icon,
  device = "mb",
  className,
  dataNodeId,
  toolIcons,
}: ToolIconProps) {
  const sizeClass =
    device === "pc"
      ? "aspect-square w-[72%] max-w-[72px]"
      : "aspect-square w-[70%] min-w-[44px] max-w-[60px]";

  return (
    <div
      className={["relative shrink-0", sizeClass, className].filter(Boolean).join(" ")}
      data-name={`Icon=${icon}`}
      data-node-id={dataNodeId}
    >
      <Image alt="" src={resolveToolIconSrc(icon, toolIcons)} fill sizes="60px" />
    </div>
  );
}
