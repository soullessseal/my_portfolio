type CompanyProps = {
  device?: "mb" | "pc";
  label?: string;
  className?: string;
  dataNodeId?: string;
};

export default function Company({
  device = "mb",
  label = "某某公司，2018/10 - 2023/03",
  className,
  dataNodeId,
}: CompanyProps) {
  const textClass = device === "pc" ? "text-pc-h4" : "text-mb-h4";

  return (
    <div
      className={className}
      data-name={device === "pc" ? "Company_PC" : "Company_MB"}
      data-node-id={dataNodeId}
      data-device={device}
    >
      <p className={[textClass, "text-word1 whitespace-nowrap"].join(" ")}>
        {label}
      </p>
    </div>
  );
}
