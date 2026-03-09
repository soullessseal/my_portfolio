type Props = {
  label?: string;
  className?: string;
  dataNodeId?: string;
  href?: string;
};

export default function ResumeButton({
  label = "\u4e0b\u8f09\u5c65\u6b77",
  className,
  dataNodeId,
  href = "https://drive.google.com/drive/folders/1MwCKJ-GLqPUdHXbEWlmOEuc3BAgExhTP?usp=drive_link",
}: Props) {
  const baseClass = [
    "inline-flex cursor-pointer items-center justify-center",
    "rounded-[50px]",
    "bg-highlight",
    "px-[8px] py-[8px] lg:px-[16px]",
    "text-primary",
    "text-mb-h2 lg:text-pc-h3",
    "transition-[background-color,box-shadow,transform] duration-150 ease-out",
    "shadow-none",
    "active:bg-[color-mix(in_srgb,var(--color-highlight)_50%,var(--color-black-50))]",
    "active:shadow-[inset_0px_1px_6px_0px_var(--color-word1-50)]",
    "lg:hover:scale-[1.08]",
    "lg:active:scale-[1.08]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={baseClass}
      data-name="Resume Button"
      data-node-id={dataNodeId}
    >
      <span>{label}</span>
    </a>
  );
}
