// SelectItem.tsx
import Image from "next/image";

type SelectItemProps = {
  active?: boolean;
  iconSrc?: string;
  label?: string;
  className?: string;
};

export default function SelectItem({
  active = false,
  iconSrc = "/figma-assets/icon-a.png",
  label = "Select item",
  className,
}: SelectItemProps) {
  return (
    <div
      className={[
        // 尺寸 + scale 做在容器
        "relative size-[60px] rounded-full overflow-hidden",
        "transition-transform duration-300 ease-out",
        active ? "scale-100" : "scale-[0.583333]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label={label}
    >
      {/* Layer 3: Color — 底色 */}
      <div className="absolute inset-0 rounded-full bg-secondary" />

      {/* Layer 2: Pic — 圖片，只有這層做透明度變化 */}
      <Image
        alt=""
        src={iconSrc}
        fill
        sizes="60px"
        draggable={false}
        className={[
          "absolute inset-0 block size-full object-cover",
          "transition-opacity duration-300 ease-out",
          active ? "opacity-100" : "opacity-50",
        ].join(" ")}
      />

      {/* Layer 1: Stroke — 白色圓框，永遠全不透明 */}
      <div className="absolute inset-0 rounded-full border border-white/90 pointer-events-none" />

      <span className="sr-only">{label}</span>
    </div>
  );
}
