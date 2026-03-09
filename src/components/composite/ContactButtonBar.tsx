import ContactButtonItem from "../ui/ContactButtonItem";

type ContactButtonBarProps = {
  device?: "mb" | "pc";
  className?: string;
};

const ITEMS = [
  {
    label: "電話",
    actionType: "copy" as const,
    actionValue: "0925909881",
    mbNodeId: "1010:595",
    pcNodeId: "1010:594",
  },
  {
    label: "信箱",
    actionType: "copy" as const,
    actionValue: "bankotsuf725@gmail.com",
    mbNodeId: "1010:600",
    pcNodeId: "1010:613",
  },
  {
    label: "簡介網站",
    actionType: "link" as const,
    actionValue: "https://about-me-14a172.webflow.io/",
    mbNodeId: "1010:603",
    pcNodeId: "1010:616",
  },
  {
    label: "履歷表",
    actionType: "link" as const,
    actionValue:
      "https://drive.google.com/drive/folders/1MwCKJ-GLqPUdHXbEWlmOEuc3BAgExhTP?usp=drive_link",
    mbNodeId: "1010:606",
    pcNodeId: "1010:619",
  },
] as const;

const DEVICE_CONFIG = {
  mb: {
    dataName: "Contact Button bar_MB",
    dataNodeId: "1010:622",
    wrapperClass: "w-full max-w-[312px] gap-[8px]",
    dividerClass: "h-[16px]",
    dividerNodeIds: ["1010:520", "1010:526", "1010:532"],
  },
  pc: {
    dataName: "Contact Button bar_PC",
    dataNodeId: "1010:623",
    wrapperClass: "w-full max-w-[312px] gap-[8px]",
    dividerClass: "h-[24px]",
    dividerNodeIds: ["1010:545", "1010:551", "1010:557"],
  },
} as const;

export default function ContactButtonBar({
  device = "mb",
  className,
}: ContactButtonBarProps) {
  const config = DEVICE_CONFIG[device];

  return (
    <div
      className={[
        "flex items-center justify-center",
        config.wrapperClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={config.dataName}
      data-node-id={config.dataNodeId}
      data-device={device}
    >
      {ITEMS.map((item, index) => (
        <div key={item.label} className="flex items-center gap-[8px]">
          <ContactButtonItem
            device={device}
            label={item.label}
            className="shrink-0"
            actionType={item.actionType}
            actionValue={item.actionValue}
            dataNodeId={device === "pc" ? item.pcNodeId : item.mbNodeId}
          />
          {index < ITEMS.length - 1 ? (
            <div
              className={["w-[2px] shrink-0 bg-word1-50", config.dividerClass].join(
                " ",
              )}
              data-name="Line"
              data-node-id={config.dividerNodeIds[index]}
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}
