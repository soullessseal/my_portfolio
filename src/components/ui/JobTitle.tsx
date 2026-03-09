type JobTitleProps = {
  device?: "mb" | "pc";
  label?: string;
  className?: string;
  dataNodeId?: string;
};

export default function JobTitle({
  device = "mb",
  label = "視覺設計",
  className,
  dataNodeId,
}: JobTitleProps) {
  const textClass = device === "pc" ? "text-pc-work" : "text-mb-work";

  return (
    <div
      className={className}
      data-name={device === "pc" ? "Job Title_PC" : "Job Title_MB"}
      data-node-id={dataNodeId}
      data-device={device}
    >
      <p className={[textClass, "text-word2 whitespace-nowrap"].join(" ")}>
        {label}
      </p>
    </div>
  );
}
