import BottomNavButton from "../ui/BottomNavButton";

const PLACEHOLDER_ICON = (width: number, height: number) =>
  `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='transparent'/%3E%3C/svg%3E`;

const items = [
  {
    key: "home",
    label: "首頁",
    iconSrc: PLACEHOLDER_ICON(30, 25),
    iconWidth: 30.083,
    iconHeight: 24.517,
    contentClassName: "pt-[7.32px]",
    dataNodeId: "416:307",
  },
  {
    key: "gallery",
    label: "設計作品",
    iconSrc: PLACEHOLDER_ICON(26, 23),
    iconWidth: 26.133,
    iconHeight: 23,
    contentClassName: "pt-[9px]",
    dataNodeId: "410:125",
  },
  {
    key: "about",
    label: "關於我",
    iconSrc: PLACEHOLDER_ICON(18, 24),
    iconWidth: 18.402,
    iconHeight: 23.834,
    contentClassName: "pt-[8px]",
    dataNodeId: "410:126",
  },
] as const;

export default function CompositeBottomButton({
  className,
}: {
  className?: string;
}) {
  return (
    <nav
      className={["flex h-[72px] w-fit items-center gap-[12px] px-[24px] py-[8px]", className]
        .filter(Boolean)
        .join(" ")}
      aria-label="Bottom navigation"
      data-name="Composite_Bottom Button"
      data-node-id="410:139"
    >
      {items.map((item) => (
        <BottomNavButton
          key={item.key}
          label={item.label}
          iconSrc={item.iconSrc}
          iconWidth={item.iconWidth}
          iconHeight={item.iconHeight}
          contentClassName={item.contentClassName}
          className="flex-1 basis-0"
          dataNodeId={item.dataNodeId}
        />
      ))}
    </nav>
  );
}
