import ToolBarItem from "../composite/ToolBarItem";
import { ToolIconName } from "../ui/ToolIcon";

type ToolBarDevice = "mb" | "pc";

type ToolBarProps = {
  device?: ToolBarDevice;
  className?: string;
};

type ToolBarEntry = {
  icon: ToolIconName;
  label: string;
  mbNodeId: string;
  mbIconNodeId: string;
  mbLabelNodeId: string;
  pcNodeId: string;
  pcIconNodeId: string;
  pcLabelNodeId: string;
};

const ITEMS: ToolBarEntry[] = [
  {
    icon: "Figma",
    label: "Figma",
    mbNodeId: "799:510",
    mbIconNodeId: "I799:510;798:250",
    mbLabelNodeId: "I799:510;798:294",
    pcNodeId: "801:670",
    pcIconNodeId: "I801:670;800:1804",
    pcLabelNodeId: "I801:670;800:1806",
  },
  {
    icon: "Illustrator",
    label: "Illustrator",
    mbNodeId: "799:508",
    mbIconNodeId: "I799:508;798:357",
    mbLabelNodeId: "I799:508;798:371",
    pcNodeId: "801:677",
    pcIconNodeId: "I801:677;800:1828",
    pcLabelNodeId: "I801:677;800:1830",
  },
  {
    icon: "Photoshop",
    label: "Photoshop",
    mbNodeId: "799:503",
    mbIconNodeId: "I799:503;798:379",
    mbLabelNodeId: "I799:503;798:391",
    pcNodeId: "801:672",
    pcIconNodeId: "I801:672;800:1808",
    pcLabelNodeId: "I801:672;800:1810",
  },
  {
    icon: "Canva",
    label: "Canva",
    mbNodeId: "799:505",
    mbIconNodeId: "I799:505;798:335",
    mbLabelNodeId: "I799:505;798:351",
    pcNodeId: "801:674",
    pcIconNodeId: "I801:674;800:1816",
    pcLabelNodeId: "I801:674;800:1818",
  },
  {
    icon: "Premiere",
    label: "Premiere",
    mbNodeId: "799:509",
    mbIconNodeId: "I799:509;798:423",
    mbLabelNodeId: "I799:509;798:431",
    pcNodeId: "801:678",
    pcIconNodeId: "I801:678;800:1832",
    pcLabelNodeId: "I801:678;800:1834",
  },
  {
    icon: "Indesign",
    label: "Indesign",
    mbNodeId: "799:506",
    mbIconNodeId: "I799:506;798:401",
    mbLabelNodeId: "I799:506;798:411",
    pcNodeId: "801:675",
    pcIconNodeId: "I801:675;800:1820",
    pcLabelNodeId: "I801:675;800:1822",
  },
  {
    icon: "Aftereffect",
    label: "After Effect",
    mbNodeId: "799:504",
    mbIconNodeId: "I799:504;798:445",
    mbLabelNodeId: "I799:504;798:451",
    pcNodeId: "801:673",
    pcIconNodeId: "I801:673;800:1812",
    pcLabelNodeId: "I801:673;800:1814",
  },
  {
    icon: "GitMind",
    label: "GitMind",
    mbNodeId: "799:507",
    mbIconNodeId: "I799:507;798:467",
    mbLabelNodeId: "I799:507;798:471",
    pcNodeId: "801:676",
    pcIconNodeId: "I801:676;800:1824",
    pcLabelNodeId: "I801:676;800:1826",
  },
  {
    icon: "Capcut",
    label: "CapCut",
    mbNodeId: "799:502",
    mbIconNodeId: "I799:502;798:489",
    mbLabelNodeId: "I799:502;798:491",
    pcNodeId: "801:671",
    pcIconNodeId: "I801:671;800:1836",
    pcLabelNodeId: "I801:671;800:1838",
  },
];

const DEVICE_CONFIG: Record<
  ToolBarDevice,
  {
    dataName: string;
    dataNodeId: string;
    wrapperClass: string;
  }
> = {
  mb: {
    dataName: "Tool Bar_MB",
    dataNodeId: "799:539",
    wrapperClass:
      "grid w-full justify-start justify-items-center gap-[16px] [grid-template-columns:repeat(auto-fit,minmax(72px,1fr))]",
  },
  pc: {
    dataName: "Tool Bar_PC",
    dataNodeId: "801:745",
    wrapperClass:
      "grid w-full grid-cols-9 justify-items-center gap-x-[32px] gap-y-[16px] min-[1440px]:gap-x-[48px]",
  },
};

export default function ToolBar({
  device = "mb",
  className,
}: ToolBarProps) {
  const config = DEVICE_CONFIG[device];

  return (
    <div
      className={[config.wrapperClass, className]
        .filter(Boolean)
        .join(" ")}
      data-name={config.dataName}
      data-node-id={config.dataNodeId}
      data-device={device}
    >
      {ITEMS.map((item) => (
        <ToolBarItem
          key={item.icon}
          device={device}
          icon={item.icon}
          label={item.label}
          dataNodeId={device === "pc" ? item.pcNodeId : item.mbNodeId}
          iconNodeId={device === "pc" ? item.pcIconNodeId : item.mbIconNodeId}
          labelNodeId={device === "pc" ? item.pcLabelNodeId : item.mbLabelNodeId}
        />
      ))}
    </div>
  );
}
