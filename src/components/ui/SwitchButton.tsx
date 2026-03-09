import Image from "next/image";

type SwitchButtonDevice = "mb" | "pc";
type SwitchButtonDirection = "left" | "right";

type SwitchButtonProps = {
  device?: SwitchButtonDevice;
  direction?: SwitchButtonDirection;
  className?: string;
  onClick?: () => void;
};

const CONFIG: Record<
  SwitchButtonDevice,
  Record<
    SwitchButtonDirection,
    {
      buttonNodeId: string;
      iconNodeId: string;
      dataName: string;
      sizeClass: string;
      iconClass: string;
      iconSrc: string;
    }
  >
> = {
  mb: {
    left: {
      buttonNodeId: "849:489",
      iconNodeId: "849:487",
      dataName: "Switch Button_Left_MB",
      sizeClass: "size-[40px]",
      iconClass: "absolute inset-[22.5%_34.17%]",
      iconSrc: "/figma-assets/eb79ec2b753853df20063c041d9c3247dec5bb3e.svg",
    },
    right: {
      buttonNodeId: "849:488",
      iconNodeId: "849:483",
      dataName: "Switch Button_Right_MB",
      sizeClass: "size-[40px]",
      iconClass: "absolute inset-[22.5%_34.17%]",
      iconSrc: "/figma-assets/4be1f9eed94356903838c5ac6d2df5050fca6f70.svg",
    },
  },
  pc: {
    left: {
      buttonNodeId: "849:515",
      iconNodeId: "849:513",
      dataName: "Switch Button_Left_PC",
      sizeClass: "size-[60px]",
      iconClass: "absolute left-1/2 top-1/2 h-[33px] w-[19px] -translate-x-1/2 -translate-y-1/2",
      iconSrc: "/figma-assets/ccc9c28a8773a29e37f27d88ded3ae59ea8e4098.svg",
    },
    right: {
      buttonNodeId: "849:514",
      iconNodeId: "849:509",
      dataName: "Switch Button_Right_PC",
      sizeClass: "size-[60px]",
      iconClass: "absolute left-1/2 top-1/2 h-[33px] w-[19px] -translate-x-1/2 -translate-y-1/2",
      iconSrc: "/figma-assets/1bca88747d6583849bea37ddd1be7d320ad00ad1.svg",
    },
  },
};

export default function SwitchButton({
  device = "mb",
  direction = "left",
  className,
  onClick,
}: SwitchButtonProps) {
  const config = CONFIG[device][direction];
  const isPc = device === "pc";

  return (
    <button
      type="button"
      className={[
        "group relative cursor-pointer rounded-[100px] bg-primary-50 shadow-[0px_0px_4px_0px_var(--color-word1-50)] backdrop-blur-[1px]",
        isPc
          ? "transition-[background-color,box-shadow] duration-150 ease-out hover:bg-word2-50 active:bg-word2-50 active:shadow-[0px_0px_4px_0px_var(--color-word1-50),inset_0px_1px_6px_0px_var(--color-word1-50)]"
          : "active:bg-word2-50 active:shadow-[0px_0px_4px_0px_var(--color-word1-50),inset_0px_1px_6px_0px_var(--color-word1-50)]",
        config.sizeClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      onClick={onClick}
      data-name={config.dataName}
      data-node-id={config.buttonNodeId}
      data-device={device}
      data-direction={direction}
    >
      <span className={config.iconClass} data-name="Union" data-node-id={config.iconNodeId}>
        <Image
          alt=""
          src={config.iconSrc}
          fill
          sizes={device === "pc" ? "19px" : "13px"}
          className={
            isPc
              ? "transition-[filter,opacity] duration-150 ease-out group-hover:brightness-0 group-hover:invert group-active:brightness-0 group-active:invert"
              : "group-active:brightness-0 group-active:invert"
          }
        />
      </span>
    </button>
  );
}
