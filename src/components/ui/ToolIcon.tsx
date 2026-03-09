import Image from "next/image";

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
};

const ICON_SRC_MAP: Record<ToolIconName, string> = {
  Figma: "/figma-assets/1f2f99faf45b17a2667c5b455c7fc274e0daaff0.svg",
  Canva: "/figma-assets/e5c31988fd25a46fd8fd77646f484737403c80d7.svg",
  Illustrator: "/figma-assets/e20ea82504d748e37576deb8ea830d7f75b7668d.svg",
  Photoshop: "/figma-assets/5b974b68cc704dfba74b06718aac38caa74ba83d.svg",
  Indesign: "/figma-assets/cc4413231710ad43c544ed87a21e2089bb2a1e02.svg",
  Premiere: "/figma-assets/172982d09b6fcfbd61ee1f5e51b71ee6e3163156.svg",
  Aftereffect: "/figma-assets/64ec0787df3ce3f8f2f8a88661cdc8880f25a5b2.svg",
  GitMind: "/figma-assets/a8528991c34f50419aea26a402cff8224530addd.svg",
  Capcut: "/figma-assets/c87bb68e89527bf4bffbfefc07fe5a74d78140d3.svg",
};

export default function ToolIcon({
  icon,
  device = "mb",
  className,
  dataNodeId,
}: ToolIconProps) {
  const sizeClass =
    device === "pc"
      ? "aspect-square w-[72%] max-w-[72px]"
      : "aspect-square w-[70%] min-w-[44px] max-w-[60px]";

  return (
    <div
      className={["relative shrink-0", sizeClass, className]
        .filter(Boolean)
        .join(" ")}
      data-name={`Icon=${icon}`}
      data-node-id={dataNodeId}
    >
      <Image alt="" src={ICON_SRC_MAP[icon]} fill sizes="60px" />
    </div>
  );
}
