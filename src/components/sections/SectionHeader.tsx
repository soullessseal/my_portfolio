import HeadButton from "../ui/HeadButton";
import ResumeButton from "../ui/ResumeButton";

type SectionHeaderDevice = "mb" | "pc";

type SectionHeaderProps = {
  device?: SectionHeaderDevice;
  brandLabel?: string;
  className?: string;
};

const NAV_ITEMS = [
  { variant: "home" as const, key: "home", href: "/" },
  { variant: "gallery" as const, key: "gallery", href: "/page-artwork" },
  { variant: "about" as const, key: "about", href: "/page-about" },
];

const DEVICE_CONFIG: Record<
  SectionHeaderDevice,
  {
    outerClass: string;
    innerClass: string;
    brandSlotClass: string;
    brandTextClass: string;
    dataName: string;
    dataNodeId: string;
    resumeNodeId: string;
    resumeSlotClass: string;
    navWrapperClass?: string;
  }
> = {
  mb: {
    outerClass:
      "h-[calc(54px_+_env(safe-area-inset-top))] w-full border border-primary bg-[var(--color-primary-85)] px-0 pt-[env(safe-area-inset-top)] shadow-[0px_1px_5px_0px_var(--color-word1-50)] backdrop-blur-[2px]",
    innerClass:
      "mx-auto flex h-[54px] w-full items-center justify-between px-[24px] py-[8px] md:px-[48px]",
    brandSlotClass: "flex w-[72px] shrink-0 items-center",
    brandTextClass: "text-mb-h2",
    dataName: "Section_Header_MB",
    dataNodeId: "408:60",
    resumeNodeId: "368:243",
    resumeSlotClass: "flex w-[72px] shrink-0 justify-end",
  },
  pc: {
    outerClass:
      "h-[72px] w-full border border-primary bg-[var(--color-primary-85)] px-0 shadow-[0px_1px_5px_0px_var(--color-word1-50)] backdrop-blur-[2px]",
    innerClass:
      "mx-auto flex h-full w-full max-w-[1440px] items-center justify-between px-[48px] py-[8px]",
    brandSlotClass: "flex w-[104px] shrink-0 items-center",
    brandTextClass: "text-pc-h2",
    dataName: "Section_Header_PC",
    dataNodeId: "800:1843",
    resumeNodeId: "800:1753",
    resumeSlotClass: "flex w-[104px] shrink-0 justify-end",
    navWrapperClass: "flex items-center gap-[24px]",
  },
};

export default function SectionHeader({
  device = "mb",
  brandLabel = "Betty",
  className,
}: SectionHeaderProps) {
  const config = DEVICE_CONFIG[device];

  return (
    <header
      className={["fixed inset-x-0 top-0 z-40", config.outerClass, className]
        .filter(Boolean)
        .join(" ")}
      data-name={config.dataName}
      data-node-id={config.dataNodeId}
      data-device={device}
    >
      <div className={config.innerClass}>
        <div className={config.brandSlotClass}>
          <span className={["text-word1", config.brandTextClass].join(" ")}>
            {brandLabel}
          </span>
        </div>

        {device === "pc" ? (
          <nav
            className={config.navWrapperClass}
            aria-label="Primary navigation"
            data-name="Nav Button"
            data-node-id="801:411"
          >
            {NAV_ITEMS.map((item) => (
              <HeadButton
                key={item.key}
                variant={item.variant}
                className="shrink-0"
                href={item.href}
              />
            ))}
          </nav>
        ) : null}

        <div className={config.resumeSlotClass}>
          <ResumeButton dataNodeId={config.resumeNodeId} className="shrink-0" />
        </div>
      </div>
    </header>
  );
}
