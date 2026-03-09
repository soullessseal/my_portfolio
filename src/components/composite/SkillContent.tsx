import SkillPill from "../ui/SkillPill";

type SkillGroup = {
  title: string;
  items: string[];
  dataNodeId?: string;
  titleNodeId?: string;
  itemNodeIds?: string[];
};

type SkillContentProps = {
  device?: "mb" | "pc";
  groups?: SkillGroup[];
  className?: string;
  dataNodeId?: string;
};

const DEFAULT_GROUPS: Record<"mb" | "pc", SkillGroup[]> = {
  mb: [
    {
      title: "視覺與平面設計",
      items: ["品牌VI視覺設計", "行銷與活動視覺設計", "印刷物設計與輸出"],
      dataNodeId: "1016:1362",
      titleNodeId: "1016:1363",
      itemNodeIds: ["1016:1365", "1016:1370", "1016:1375"],
    },
    {
      title: "UI/UX設計",
      items: ["網頁視覺設計", "UI元件與變體設計", "Prototype原型設計"],
      dataNodeId: "1016:1380",
      titleNodeId: "1016:1381",
      itemNodeIds: ["1016:1383", "1016:1388", "1016:1393"],
    },
  ],
  pc: [
    {
      title: "視覺與平面設計",
      items: ["品牌VI視覺設計", "行銷與活動視覺設計", "印刷物設計與輸出"],
      dataNodeId: "1016:1411",
      titleNodeId: "1016:1412",
      itemNodeIds: ["1016:1414", "1016:1419", "1016:1424"],
    },
    {
      title: "UI/UX設計",
      items: ["網頁視覺設計", "UI元件與變體設計", "Prototype原型設計"],
      dataNodeId: "1016:1429",
      titleNodeId: "1016:1430",
      itemNodeIds: ["1016:1432", "1016:1437", "1016:1442"],
    },
  ],
};

export default function SkillContent({
  device = "mb",
  groups,
  className,
  dataNodeId,
}: SkillContentProps) {
  const isPc = device === "pc";
  const resolvedGroups = groups ?? DEFAULT_GROUPS[device];
  const titleClass = isPc ? "text-pc-h3" : "text-mb-h3";

  return (
    <div
      className={[
        "flex items-start",
        isPc ? "w-full max-w-[928px] gap-[16px]" : "w-full max-w-[312px] gap-[8px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={isPc ? "Skill Content_PC" : "Skill Content_MB"}
      data-node-id={dataNodeId ?? (isPc ? "1016:1447" : "1016:1448")}
      data-device={device}
    >
      {resolvedGroups.map((group) => (
        <div
          key={group.title}
          className="flex min-h-px min-w-px flex-1 flex-col items-center justify-center gap-[8px] rounded-[16px] bg-word2-50 px-[8px] py-[16px]"
          data-name={group.title}
          data-node-id={group.dataNodeId}
        >
          <p
            className={[titleClass, "w-full text-center text-primary whitespace-pre-wrap"].join(
              " ",
            )}
            data-node-id={group.titleNodeId}
          >
            {group.title}
          </p>
          <div className="flex w-full flex-col items-center justify-center gap-[8px]">
            {group.items.map((item, index) => (
              <SkillPill
                key={item}
                device={device}
                label={item}
                dataNodeId={group.itemNodeIds?.[index]}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
