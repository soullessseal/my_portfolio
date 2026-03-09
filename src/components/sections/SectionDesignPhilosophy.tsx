type SectionDesignPhilosophyProps = {
  device?: "mb" | "pc";
  title?: string;
  paragraphs?: string[];
  className?: string;
};

const DEFAULT_PARAGRAPHS = [
  "以理解為起點，解決問題為核心。設計就是要讓使用者更好地完成任務、看懂資訊、降低操作負擔。",
  "我習慣深入理解產品脈絡，整理複雜規則、拆解需求，以流程與資訊構築出介面。我重視細節，因為細節塑造體驗；我也重視溝通，在專業與彈性之間找到平衡。",
  "設計不會一次就到位，它來自反覆測試與調整。",
];

export default function SectionDesignPhilosophy({
  device = "mb",
  title = "設計理念",
  paragraphs = DEFAULT_PARAGRAPHS,
  className,
}: SectionDesignPhilosophyProps) {
  const isPc = device === "pc";

  return (
    <section
      className={[
        "flex w-full flex-col items-center",
        isPc ? "gap-[16px] px-[48px]" : "gap-[8px] px-[24px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={isPc ? "Section_Design Philosophy_PC" : "Section_Design Philosophy_MB"}
      data-node-id={isPc ? "799:815" : "792:280"}
      data-device={device}
    >
      <p
        className={[
          isPc ? "text-pc-h1 text-word1" : "text-mb-h1 text-word2",
          "w-full text-center",
        ].join(" ")}
        data-node-id={isPc ? "799:816" : "792:281"}
      >
        {title}
      </p>

      <div
        className={[
          isPc ? "text-pc-h4" : "text-mb-h4",
          "flex w-full flex-col items-start gap-[8px] text-word2-50",
        ].join(" ")}
        data-name="Content"
        data-node-id={isPc ? "799:817" : "792:282"}
      >
        {paragraphs.map((paragraph, index) => (
          <p
            key={`${index}-${paragraph}`}
            className="w-full whitespace-pre-wrap"
            data-node-id={
              isPc
                ? index === 0
                  ? "799:818"
                  : index === 1
                    ? "799:819"
                    : "799:820"
                : index === 0
                  ? "792:283"
                  : index === 1
                    ? "792:284"
                    : "792:285"
            }
          >
            {paragraph}
          </p>
        ))}
      </div>
    </section>
  );
}
