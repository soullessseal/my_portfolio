import Image from "next/image";

type BottomNavButtonProps = {
  label: string;
  iconSrc: string;
  iconAlt?: string;
  iconWidth: number;
  iconHeight: number;
  iconClassName?: string;
  iconStyle?: React.CSSProperties;
  className?: string;
  contentClassName?: string;
  labelClassName?: string;
  dataNodeId?: string;
  onClick?: () => void;
  onPointerDown?: () => void;
  onPointerUp?: () => void;
  onPointerLeave?: () => void;
  onPointerCancel?: () => void;
};

export default function BottomNavButton({
  label,
  iconSrc,
  iconAlt = "",
  iconWidth,
  iconHeight,
  iconClassName,
  iconStyle,
  className,
  contentClassName,
  labelClassName,
  dataNodeId,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerLeave,
  onPointerCancel,
}: BottomNavButtonProps) {
  return (
    <button
      type="button"
      className={[
        "relative flex h-[56px] w-[96px] shrink-0 select-none items-start justify-center rounded-[8px] touch-manipulation",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
      onPointerCancel={onPointerCancel}
      data-name="Bottom Button"
      data-node-id={dataNodeId}
      aria-label={label}
      style={{
        WebkitTapHighlightColor: "transparent",
        WebkitTouchCallout: "none",
        userSelect: "none",
      }}
    >
      <span
        className={[
          "pointer-events-none flex w-full select-none flex-col items-center gap-[6px]",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span
          className={["shrink-0", iconClassName].filter(Boolean).join(" ")}
          style={iconStyle}
        >
          <Image
            src={iconSrc}
            alt={iconAlt}
            width={iconWidth}
            height={iconHeight}
            className="pointer-events-none shrink-0 select-none"
            draggable={false}
          />
        </span>
        <span
          className={[
            "select-none text-mb-nav text-center",
            labelClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {label}
        </span>
      </span>
    </button>
  );
}
