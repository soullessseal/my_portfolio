import WorkItemField from "../ui/WorkItemField";
import WorkSectionGroup from "./WorkSectionGroup";

type WorkSection = {
  sort: string;
  items: string[];
};

type WorkContentProps = {
  device?: "mb" | "pc";
  title?: string;
  company?: string;
  sections?: WorkSection[];
  className?: string;
  dataNodeId?: string;
};

const DEFAULT_SECTIONS: WorkSection[] = [
  {
    sort: "【平面視覺設計】",
    items: [
      "品牌識別與 LOGO 延伸設計",
      "活動與行銷 DM 設計",
      "社群視覺素材設計",
      "包裝與印刷相關設計",
      "OEM 提案與型錄版面設計",
      "跨部門協作與設計執行",
    ],
  },
  {
    sort: "【影片剪輯】",
    items: ["品牌短影音剪輯與基礎後製"],
  },
  {
    sort: "【其他】",
    items: ["B2B 提案簡報製作", "與業務及行銷團隊協作"],
  },
] as const;

export default function WorkContent({
  device = "mb",
  title = "視覺設計",
  company = "某某公司，2018/10 - 2023/03",
  sections = DEFAULT_SECTIONS.map((section) => ({ ...section, items: [...section.items] })),
  className,
  dataNodeId,
}: WorkContentProps) {
  const isPc = device === "pc";

  return (
    <div
      className={[
        "flex h-full flex-col items-start gap-[8px]",
        "w-full max-w-none",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={isPc ? "Work Content_PC" : "Work Content_MB"}
      data-node-id={dataNodeId ?? (isPc ? "1011:816" : "1011:836")}
      data-device={device}
    >
      <WorkItemField
        device={device}
        variant="workTitle"
        title={title}
        company={company}
        className={
          isPc
            ? "w-full max-w-none"
            : "w-full max-w-none"
        }
        dataNodeId={isPc ? "1011:785" : "1011:774"}
      />

      <div
        className="flex w-full flex-1 flex-col items-start"
        data-name={isPc ? "Work box_PC" : "Work box_MB"}
        data-node-id={isPc ? "1011:1016" : "1011:1047"}
      >
        <WorkItemField
          device={device}
          variant="title"
          label="工作內容："
          dataNodeId={isPc ? "1011:784" : "1011:773"}
        />

        <div
          className={[
            "flex w-full flex-1 items-stretch",
            isPc
              ? "flex-col gap-[8px] min-[1440px]:flex-row min-[1440px]:gap-[16px]"
              : "flex-col gap-[8px] min-[720px]:flex-row min-[720px]:gap-[12px]",
          ].join(" ")}
        >
          {sections.map((section, index) => (
            <WorkSectionGroup
              key={section.sort}
              device={device}
              groupIndex={index}
              className={
                isPc
                  ? "min-[1440px]:min-w-0 min-[1440px]:flex-1 min-[1440px]:basis-0"
                  : "min-[720px]:min-w-0 min-[720px]:flex-1 min-[720px]:basis-0"
              }
              sort={section.sort}
              items={section.items}
              sortNodeId={
                isPc
                  ? index === 0
                    ? "1011:783"
                    : index === 1
                      ? "1011:801"
                      : "1011:812"
                  : index === 0
                    ? "1011:772"
                    : index === 1
                      ? "1011:828"
                      : "1011:832"
              }
              contentNodeId={
                isPc
                  ? index === 0
                    ? "1011:782"
                    : index === 1
                      ? "1011:802"
                      : "1011:813"
                  : index === 0
                    ? "1011:771"
                    : index === 1
                      ? "1011:829"
                      : "1011:833"
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
