import Image from "next/image";

type Props = {
  className?: string;
  onClick?: () => void;
  ariaLabel?: string;
};

export default function ScrollTopButton({
  className,
  onClick,
  ariaLabel = "Scroll to top",
}: Props) {
  const baseClass = [
    "group inline-flex size-[40px] cursor-pointer items-center justify-center",
    "rounded-[8px]",
    "bg-primary-50",
    "backdrop-blur-[1px]",
    "shadow-[0px_0px_4px_var(--color-word1-50)]",
    "active:bg-word2-50 active:shadow-[0px_0px_4px_var(--color-word1-50),inset_0px_1px_6px_0px_var(--color-word1-50)] lg:transition-[background-color,box-shadow] lg:duration-150 lg:ease-out lg:hover:bg-word2-50 lg:active:bg-word2-50 lg:active:shadow-[0px_0px_4px_var(--color-word1-50),inset_0px_1px_6px_0px_var(--color-word1-50)]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={baseClass}
      onClick={onClick}
      aria-label={ariaLabel}
      data-name="Scroll Top Button"
      data-node-id="397:15"
    >
      <Image
        alt=""
        aria-hidden="true"
        src="/figma-assets/3cc29fd67f78d7af2f1ea44b025d3dfd3f0e3937.svg"
        width={25}
        height={25}
        className="block h-[24.583px] w-[24.252px] group-active:brightness-0 group-active:invert lg:transition-[filter,opacity] lg:duration-150 lg:ease-out lg:group-hover:brightness-0 lg:group-hover:invert lg:group-active:brightness-0 lg:group-active:invert"
      />
    </button>
  );
}
