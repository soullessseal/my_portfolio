import WorkItemField from "../ui/WorkItemField";

type WorkSectionGroupProps = {
  device?: "mb" | "pc";
  sort: string;
  items: string[];
  sortNodeId?: string;
  contentNodeId?: string;
  className?: string;
  groupIndex?: number;
};

export default function WorkSectionGroup({
  device = "mb",
  sort,
  items,
  sortNodeId,
  contentNodeId,
  className,
  groupIndex,
}: WorkSectionGroupProps) {
  return (
    <div
      className={[
        "flex w-full min-w-0 flex-col items-start gap-[8px] rounded-[16px] bg-primary shadow-[0_0_8px_var(--color-secondary-50)] px-[12px] py-[12px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name="Work Section Group"
      data-device={device}
      data-group-index={groupIndex}
    >
      <WorkItemField
        device={device}
        variant="sort"
        label={sort}
        className="w-full"
        dataNodeId={sortNodeId}
      />
      <WorkItemField
        device={device}
        variant="content"
        items={items}
        className="w-full min-w-0 max-w-none"
        dataNodeId={contentNodeId}
      />
    </div>
  );
}
