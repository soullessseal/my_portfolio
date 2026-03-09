type Props = {
  variant?: "mb" | "pc";
  label?: string;
  className?: string;
  dataNodeId?: string;
};

export default function TagButton({
  variant = "mb",
  label = "TAG",
  className,
  dataNodeId,
}: Props) {
  const variantText = variant === "pc" ? "text-pc-tag" : "text-mb-tag";

  const baseClass =
    "backdrop-blur-[0.75px] bg-black-50 inline-flex items-center justify-center px-[16px] py-[4px] rounded-[50px] shadow-[0px_0px_4px_var(--color-secondary-50)]";

  return (
    <div
      className={[baseClass, className].filter(Boolean).join(" ")}
      data-node-id={dataNodeId}
    >
      <span
        className={[
          variantText,
          "text-primary [text-shadow:0px_0px_4px_var(--color-word1)]",
        ].join(" ")}
      >
        {label}
      </span>
    </div>
  );
}
