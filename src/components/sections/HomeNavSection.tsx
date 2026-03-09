import NavButton from "../ui/NavButton";

type HomeNavSectionProps = {
  device?: "mb" | "pc";
  className?: string;
};

const ITEMS = [
  {
    title: "UI UX 作品",
    imageSrc: "/figma-assets/ab2403b5c5181ec4e83670f71174c601fdcc7bf6.png",
    href: "/page-artwork?tab=uiux",
    mbNodeId: "387:266",
    pcNodeId: "801:433",
  },
  {
    title: "平面設計作品",
    imageSrc: "/figma-assets/dfba8b127039f0914c3a97b2fb80d291f46caa20.png",
    href: "/page-artwork?tab=graphic",
    mbNodeId: "387:269",
    pcNodeId: "801:441",
  },
  {
    title: "其他作品",
    imageSrc: "/figma-assets/e572cd936c93effa21afdc25bbc3b5dcbefd7b8d.png",
    href: "/page-artwork?tab=other",
    mbNodeId: "387:275",
    pcNodeId: "801:445",
  },
] as const;

export default function HomeNavSection({
  device = "mb",
  className,
}: HomeNavSectionProps) {
  const isPc = device === "pc";

  return (
    <section
      className={[
        "flex w-full",
        isPc
          ? "w-full items-stretch gap-[16px] px-[48px]"
          : "flex-col items-start gap-[8px] px-[24px] md:px-[48px]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name="Section_Nav"
      data-node-id={isPc ? "799:1304" : "354:69"}
      data-device={device}
    >
      {ITEMS.map((item) => (
        <NavButton
          key={item.title}
          device={device}
          state="normal"
          title={item.title}
          imageSrc={item.imageSrc}
          href={item.href}
          className={isPc ? "min-w-0 flex-1 basis-0 h-full" : "w-full md:h-[160px]"}
          dataNodeId={isPc ? item.pcNodeId : item.mbNodeId}
        />
      ))}
    </section>
  );
}
