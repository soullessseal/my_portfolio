"use client";

import { useEffect, useRef } from "react";

import WorkContent from "../composite/WorkContent";

type WorkSection = {
  sort: string;
  items: string[];
};

type WorkEntry = {
  title: string;
  company: string;
  sections: WorkSection[];
  dataNodeId: string;
};

type SectionWorkExperienceProps = {
  device?: "mb" | "pc";
  title?: string;
  entries?: WorkEntry[];
  className?: string;
};

const DEFAULT_ENTRIES: Record<"mb" | "pc", WorkEntry[]> = {
  mb: [
    {
      title: "行政美工",
      company: "冠佑聯合有限公司（2018/10 - 2023/03）",
      dataNodeId: "1011:837",
      sections: [
        {
          sort: "【平面視覺設計】",
          items: [
            "公司 VI 及延伸應用設計（LOGO、網站橫幅）",
            "各式文宣、EDM",
            "展覽視覺設計",
            "產品包裝設計(紙盒、吊卡、貼紙等)",
            "協助客戶OEM｜ODM稿件設計",
            "產品目錄製作、修編",
          ],
        },
        {
          sort: "【影片剪輯】",
          items: ["產品影片錄製、剪接"],
        },
        {
          sort: "【其他】",
          items: ["官網及B2B後台維護及管理", "新品編碼、CRM上架"],
        },
      ],
    },
    {
      title: "美術設計師",
      company: "千陽號旅遊有限公司（2024/07 - 2025/06）",
      dataNodeId: "1011:895",
      sections: [
        {
          sort: "【平面視覺設計】",
          items: [
            "各旅遊線路｜朝聖線路｜簽證｜行銷｜同業用素材（LOGO、行程手冊、簡報、線路地圖、社群廣告圖、商品圖、部落格文章圖、Banner、CTA、海報、文宣、其他印刷品）",
          ],
        },
        {
          sort: "【專案-斯里蘭卡旅遊網站】",
          items: ["網站視覺風格設計", "版型配置與一致性調整"],
        },
        {
          sort: "【專案-印度朝聖海外網站】",
          items: [
            "UI System",
            "UI Component與Variant",
            "RWD規劃（Desktop / Mobile）",
            "Wireframe線框稿製作",
            "Prototype互動原型設計",
          ],
        },
      ],
    },
  ],
  pc: [
    {
      title: "行政美工",
      company: "冠佑聯合有限公司（2018/10 - 2023/03）",
      dataNodeId: "1011:957",
      sections: [
        {
          sort: "【平面視覺設計】",
          items: [
            "公司 VI 及延伸應用設計（LOGO、網站橫幅）",
            "各式文宣、EDM",
            "展覽視覺設計",
            "產品包裝設計(紙盒、吊卡、貼紙等)",
            "協助客戶OEM｜ODM稿件設計",
            "產品目錄製作、修編",
          ],
        },
        {
          sort: "【影片剪輯】",
          items: ["產品影片錄製、剪接"],
        },
        {
          sort: "【其他】",
          items: ["官網及B2B後台維護及管理", "新品編碼、CRM上架"],
        },
      ],
    },
    {
      title: "美術設計師",
      company: "千陽號旅遊有限公司（2024/07 - 2025/06）",
      dataNodeId: "1011:996",
      sections: [
        {
          sort: "【平面視覺設計】",
          items: [
            "各旅遊線路｜朝聖線路｜簽證｜行銷｜同業用素材（LOGO、行程手冊、簡報、線路地圖、社群廣告圖、商品圖、部落格文章圖、Banner、CTA、海報、文宣、其他印刷品）",
          ],
        },
        {
          sort: "【專案-斯里蘭卡旅遊網站】",
          items: ["網站視覺風格設計", "版型配置與一致性調整"],
        },
        {
          sort: "【專案-印度朝聖海外網站】",
          items: [
            "UI System",
            "UI Component與Variant",
            "RWD規劃（Desktop / Mobile）",
            "Wireframe線框稿製作",
            "Prototype互動原型設計",
          ],
        },
      ],
    },
  ],
};

export default function SectionWorkExperience({
  device = "mb",
  title = "工作經歷",
  entries,
  className,
}: SectionWorkExperienceProps) {
  const isPc = device === "pc";
  const resolvedEntries = entries ?? DEFAULT_ENTRIES[device];
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!isPc || !sectionRef.current) {
      return;
    }

    const section = sectionRef.current;

    const syncGroupHeights = () => {
      const isHorizontal = window.innerWidth < 1440;
      const groups = Array.from(
        section.querySelectorAll<HTMLElement>("[data-group-index]"),
      );

      groups.forEach((group) => {
        group.style.minHeight = "";
      });

      if (!isHorizontal) {
        return;
      }

      const groupsByIndex = new Map<number, HTMLElement[]>();
      groups.forEach((group) => {
        const index = Number(group.dataset.groupIndex);
        const list = groupsByIndex.get(index) ?? [];
        list.push(group);
        groupsByIndex.set(index, list);
      });

      groupsByIndex.forEach((items) => {
        const maxHeight = Math.max(...items.map((item) => item.offsetHeight));
        items.forEach((item) => {
          item.style.minHeight = `${maxHeight}px`;
        });
      });
    };

    syncGroupHeights();
    window.addEventListener("resize", syncGroupHeights);

    return () => {
      window.removeEventListener("resize", syncGroupHeights);
    };
  }, [isPc, resolvedEntries]);

  return (
    <section
      ref={sectionRef}
      className={[
        "flex w-full flex-col items-start",
        isPc ? "gap-[16px] px-[48px]" : "gap-[8px] px-[24px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={isPc ? "Section_Work Experience_PC" : "Section_Work Experience_MB"}
      data-node-id={isPc ? "799:863" : "792:356"}
      data-device={device}
    >
      <p
        className={[
          isPc ? "text-pc-h1 text-word1" : "text-mb-h1 text-word2",
          "w-full text-center",
        ].join(" ")}
        data-node-id={isPc ? "799:864" : "792:357"}
      >
        {title}
      </p>

      <div
        className={[
          "flex w-full items-stretch",
          isPc
            ? "flex-row gap-[24px] min-[1440px]:flex-col min-[1440px]:gap-[32px]"
            : "flex-col gap-[16px]",
        ].join(" ")}
        data-name="Work Container"
        data-node-id={isPc ? "799:865" : "799:602"}
      >
        {resolvedEntries.map((entry) => (
          <WorkContent
            key={entry.dataNodeId}
            device={device}
            title={entry.title}
            company={entry.company}
            sections={entry.sections}
            className={
              isPc
                ? "min-w-0 flex-1 self-stretch min-[1440px]:flex-none min-[1440px]:self-auto"
                : "min-[720px]:max-w-none"
            }
            dataNodeId={entry.dataNodeId}
          />
        ))}
      </div>
    </section>
  );
}
