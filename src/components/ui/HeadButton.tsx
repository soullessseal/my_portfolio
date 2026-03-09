import Link from "next/link";

type HeadButtonVariant = "home" | "gallery" | "about";

type HeadButtonProps = {
  variant?: HeadButtonVariant;
  label?: string;
  className?: string;
  onClick?: () => void;
  href?: string;
};

const VARIANT_CONFIG: Record<
  HeadButtonVariant,
  {
    label: string;
    heightClass: string;
    nodeId: string;
    dataName: string;
  }
> = {
  home: {
    label: "\u9996\u9801",
    heightClass: "h-[48px]",
    nodeId: "801:388",
    dataName: "Head Button_Home",
  },
  gallery: {
    label: "\u8a2d\u8a08\u4f5c\u54c1",
    heightClass: "h-[48px]",
    nodeId: "801:387",
    dataName: "Head Button_Gallery",
  },
  about: {
    label: "\u95dc\u65bc\u6211",
    heightClass: "h-[48px]",
    nodeId: "801:386",
    dataName: "Head Button_About",
  },
};

export default function HeadButton({
  variant = "home",
  label,
  className,
  onClick,
  href,
}: HeadButtonProps) {
  const config = VARIANT_CONFIG[variant];

  const baseClass = [
    "inline-flex w-[96px] cursor-pointer items-center justify-center rounded-[8px]",
    "text-pc-nav text-center text-word1-50 transition-colors duration-150 ease-out",
    "[text-shadow:0_0_18px_var(--color-primary-85),0_0_14px_var(--color-primary-85),0_0_10px_var(--color-primary-85),0_0_6px_var(--color-primary),0_0_4px_var(--color-primary),0_0_2px_var(--color-primary),0_0_1px_var(--color-primary)]",
    "hover:bg-word2-50 hover:text-primary hover:[text-shadow:none]",
    "active:shadow-[inset_0px_2px_6px_var(--color-word1-50)]",
    config.heightClass,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (href) {
    return (
      <Link
        href={href}
        className={baseClass}
        data-name={config.dataName}
        data-node-id={config.nodeId}
      >
        <span>{label ?? config.label}</span>
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClass}
      onClick={onClick}
      data-name={config.dataName}
      data-node-id={config.nodeId}
    >
      <span>{label ?? config.label}</span>
    </button>
  );
}
