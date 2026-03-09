import ToolIcon, { ToolIconName } from "../ui/ToolIcon";

type ToolBarItemDevice = "mb" | "pc";

type ToolBarItemProps = {
  device?: ToolBarItemDevice;
  icon: ToolIconName;
  label: string;
  className?: string;
  dataNodeId?: string;
  iconNodeId?: string;
  labelNodeId?: string;
};

export default function ToolBarItem({
  device = "mb",
  icon,
  label,
  className,
  dataNodeId,
  iconNodeId,
  labelNodeId,
}: ToolBarItemProps) {
  const wrapperClass =
    device === "pc"
      ? "flex w-full min-w-0 flex-col items-center gap-[10px]"
      : "flex w-full min-w-0 flex-col items-center gap-[8px]";
  const labelClass =
    device === "pc"
      ? "text-pc-h4"
      : "text-mb-h4 [font-size:clamp(var(--font-mb-nav-size),3.2vw,var(--font-mb-h4-size))]";

  return (
    <div
      className={[wrapperClass, className]
        .filter(Boolean)
        .join(" ")}
      data-name={`Tool Item_${device.toUpperCase()}`}
      data-node-id={dataNodeId}
      data-device={device}
    >
      <ToolIcon icon={icon} device={device} dataNodeId={iconNodeId} />
      <span
        className={["min-w-0 text-center text-word1 whitespace-nowrap", labelClass].join(" ")}
        data-node-id={labelNodeId}
      >
        {label}
      </span>
    </div>
  );
}
