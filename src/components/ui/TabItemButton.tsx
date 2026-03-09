import React from "react";

type Props = {
  device?: "mb" | "pc";
  state?: "active" | "idle" | "pressed";
  label?: string;
  className?: string;
  onClick?: () => void;

  // 讓 Tabs 可以把互動事件傳進來（按壓狀態要靠這些）
  onPointerDown?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerUp?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerCancel?: React.PointerEventHandler<HTMLButtonElement>;
  onPointerLeave?: React.PointerEventHandler<HTMLButtonElement>;
};

export default function TabItemButton({
  device = "mb",
  state = "idle",
  label = "Tab Item",
  className,
  onClick,
  onPointerDown,
  onPointerUp,
  onPointerCancel,
  onPointerLeave,
}: Props) {
  const isPc = device === "pc";
  const isMb = device === "mb";

  const deviceClass = isPc ? "text-pc-h4 h-[35px]" : "text-mb-h4 h-[26px]";

  // ✅ pressed 只在手機板生效；桌機板 pressed 會被忽略（改用 hover）
  const backgroundClass =
    state === "active"
      ? "bg-word2"
      : isMb && state === "pressed"
      ? "bg-word2-50"
      : "bg-primary";

  const textColorClass =
    state === "idle" ? "text-word1-50" : "text-primary";

  // active 才需要發光字陰影（你 Figma 的 Normal/Active 風格）
  const textShadowClass =
    state === "active" ? "[text-shadow:0px_0px_4px_var(--color-word1)]" : "";

  // ✅ PC：hover = 類 pressed（背景變 word2-50、字色變 primary）
  //    如果你不想 hover 時字也變白，把 hover:text-primary 拿掉即可
  const pcHoverPressedClass =
    isPc && state !== "active"
      ? "hover:bg-word2-50 hover:text-primary"
      : "";

  // ✅ PC：按下去（active）加內陰影（按住滑鼠那瞬間）
  //    內陰影強度你可自行調數值（inset x y blur color）
  const pcActiveInsetClass =
    isPc && state !== "active"
      ? "active:shadow-[inset_0px_2px_6px_var(--color-word1-50)]"
      : "";

  const baseClass = [
  "group",
  "inline-flex items-center justify-center",
  "px-[16px] py-[4px]",
  "rounded-[50px]",
  "select-none",
  "transition-colors duration-150 ease-out",
  state !== "active" ? "cursor-pointer" : "cursor-default",
].join(" ");

  return (
    <button
      type="button"
      role="tab"
      data-device={device}
      data-state={state}
      aria-selected={state === "active"}
      tabIndex={state === "active" ? 0 : -1}
      onClick={onClick}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
      onPointerLeave={onPointerLeave}
      className={[
        baseClass,
        deviceClass,
        backgroundClass,
        pcHoverPressedClass,
        pcActiveInsetClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span
  className={[
    textColorClass,
    textShadowClass,

    // ✅ PC hover 時文字變白
    device === "pc" && state !== "active"
      ? "group-hover:text-primary"
      : "",
  ]
    .filter(Boolean)
    .join(" ")}
>
        {label}
      </span>
    </button>
  );
}
