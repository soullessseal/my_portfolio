import ToolBar from "./ToolBar";

type SectionToolProps = {
  device?: "mb" | "pc";
  title?: string;
  className?: string;
};

export default function SectionTool({
  device = "mb",
  title = "使用工具",
  className,
}: SectionToolProps) {
  const isPc = device === "pc";

  return (
    <section
      className={[
        "flex w-full flex-col items-start",
        isPc ? "gap-[16px] px-[48px]" : "gap-[8px] px-[24px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={isPc ? "Section_Tool_PC" : "Section_Tool_MB"}
      data-node-id={isPc ? "799:860" : "792:327"}
      data-device={device}
    >
      <p
        className={[
          isPc ? "text-pc-h1 text-word1" : "text-mb-h1 text-word2",
          "w-full text-center",
        ].join(" ")}
        data-node-id={isPc ? "799:861" : "792:328"}
      >
        {title}
      </p>

      <ToolBar device={device} className="w-full" />
    </section>
  );
}
