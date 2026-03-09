import SkillContent from "../composite/SkillContent";

type SectionSkillProps = {
  device?: "mb" | "pc";
  title?: string;
  className?: string;
};

export default function SectionSkill({
  device = "mb",
  title = "專業技能",
  className,
}: SectionSkillProps) {
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
      data-name={isPc ? "Section_Skill_PC" : "Section_Skill_MB"}
      data-node-id={isPc ? "799:821" : "792:287"}
      data-device={device}
    >
      <p
        className={[
          isPc ? "text-pc-h1 text-word1" : "text-mb-h1 text-word2",
          "w-full text-center",
        ].join(" ")}
        data-node-id={isPc ? "799:822" : "792:288"}
      >
        {title}
      </p>

      <SkillContent
        device={device}
        className="max-w-none"
        dataNodeId={isPc ? "1016:1475" : "1016:1449"}
      />
    </section>
  );
}
