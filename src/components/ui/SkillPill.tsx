type SkillPillProps = {
  device?: "mb" | "pc";
  label?: string;
  className?: string;
  dataNodeId?: string;
};

export default function SkillPill({
  device = "mb",
  label = "技能項目",
  className,
  dataNodeId,
}: SkillPillProps) {
  const textClass = device === "pc" ? "text-pc-h4" : "text-mb-h4";
  const fluidTextClass =
    device === "pc"
      ? "[font-size:clamp(var(--font-pc-h5-size),1.5vw,var(--font-pc-h4-size))]"
      : "[font-size:clamp(var(--font-mb-h5-size),2.8vw,var(--font-mb-h4-size))]";

  return (
    <div
      className={[
        "flex w-full min-w-0 items-center justify-center rounded-[50px] border-2 border-primary px-[16px] py-[8px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name="Button"
      data-node-id={dataNodeId}
      data-device={device}
    >
      <p
        className={[
          textClass,
          fluidTextClass,
          "min-w-0 text-center text-primary whitespace-nowrap",
        ].join(" ")}
      >
        {label}
      </p>
    </div>
  );
}
