import Company from "./Company";
import JobTitle from "./JobTitle";

type WorkItemFieldVariant = "workTitle" | "title" | "sort" | "content";

type WorkItemFieldProps = {
  device?: "mb" | "pc";
  variant?: WorkItemFieldVariant;
  title?: string;
  company?: string;
  label?: string;
  items?: string[];
  className?: string;
  dataNodeId?: string;
};

const DEFAULT_CONTENT_ITEMS = [
  "品牌識別與 LOGO 延伸設計",
  "活動與行銷 DM 設計",
  "社群視覺素材設計",
  "包裝與印刷相關設計",
  "OEM 提案與型錄版面設計",
  "跨部門協作與設計執行",
];

export default function WorkItemField({
  device = "mb",
  variant = "title",
  title = "視覺設計",
  company = "某某公司，2018/10 - 2023/03",
  label = variant === "sort" ? "【平面視覺設計】" : "工作內容：",
  items = DEFAULT_CONTENT_ITEMS,
  className,
  dataNodeId,
}: WorkItemFieldProps) {
  const isPc = device === "pc";

  if (variant === "workTitle") {
    return (
      <div
        className={[
          isPc
            ? "flex w-full items-center gap-[8px]"
            : "flex w-full max-w-[312px] items-center gap-[8px]",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-name={isPc ? "Work Item_Work Title_PC" : "Work Item_Work Title_MB"}
        data-node-id={dataNodeId}
        data-device={device}
        data-variant={variant}
      >
        <JobTitle
          device={device}
          label={title}
          dataNodeId={isPc ? "1012:1125" : "1012:1121"}
        />
        <div
          className={[isPc ? "h-[24px]" : "h-[16px]", "w-px shrink-0 bg-word1-50"].join(" ")}
          data-name="Line"
        />
        <Company
          device={device}
          label={company}
          dataNodeId={isPc ? "1012:1124" : "1012:1120"}
        />
      </div>
    );
  }

  if (variant === "content") {
    return (
      <div
        className={[
          "w-full min-w-0 max-w-none",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        data-name={isPc ? "Work Item_Content_PC" : "Work Item_Content_MB"}
        data-node-id={dataNodeId}
        data-device={device}
        data-variant={variant}
      >
        <ul
          className={[
            isPc ? "text-pc-h4 pl-[27px]" : "text-mb-h4 pl-[18px]",
            "list-disc text-word1",
          ].join(" ")}
        >
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>
    );
  }

  const textClass = isPc ? "text-pc-h4" : "text-mb-h4";
  const colorClass = variant === "sort" ? "text-highlight" : "text-word1";

  return (
    <div
      className={className}
      data-name={
        variant === "sort"
          ? isPc
            ? "Work Item_Sort_PC"
            : "Work Item_Sort_MB"
          : isPc
            ? "Work Item_Title_PC"
            : "Work Item_Title_MB"
      }
      data-node-id={dataNodeId}
      data-device={device}
      data-variant={variant}
    >
      <p className={[textClass, colorClass, "whitespace-pre-wrap"].join(" ")}>
        {label}
      </p>
    </div>
  );
}
