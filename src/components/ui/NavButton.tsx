import Link from "next/link";
import Image from "next/image";

type Props = {
  device?: "mb" | "pc";
  state?: "normal" | "pressed";
  title?: string;
  imageSrc?: string;
  imageAlt?: string;
  className?: string;
  href?: string;
  onClick?: () => void;
  dataNodeId?: string;
};

const DEFAULT_IMAGE_SRC =
  "/figma-assets/ab2403b5c5181ec4e83670f71174c601fdcc7bf6.png";

export default function NavButton({
  device = "mb",
  state = "normal",
  title = "UI UX 設計",
  imageSrc = DEFAULT_IMAGE_SRC,
  imageAlt = "",
  className,
  href,
  onClick,
  dataNodeId,
}: Props) {
  const isPc = device === "pc";
  const fillClass = [
    "absolute inset-0",
    state === "pressed"
      ? "bg-[var(--color-secondary-50)]"
      : "bg-[var(--color-highlight-50)]",
    state === "normal" && isPc ? "group-hover:bg-secondary-50" : "",
    state === "normal" ? "group-active:bg-secondary-50" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const baseClass = [
    "group relative block w-full cursor-pointer overflow-hidden rounded-[16px] shadow-[0px_0px_3px_var(--color-word1-50)] active:shadow-none",
    isPc ? "h-full min-h-[150px]" : "h-[120px]",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const titleClass = [
    "pointer-events-none absolute inset-0 z-20 flex items-center justify-center",
    "text-center text-primary",
    "text-shadow-[0px_0px_10px_var(--color-word1),0px_0px_5px_var(--color-word1-50)]",
    isPc ? "text-pc-h1" : "text-mb-h1 md:text-pc-h2",
  ].join(" ");

  const content = (
    <>
      <div
        className="absolute inset-0 z-0 overflow-hidden rounded-[16px]"
        data-name="Nav Button Pic"
      >
        <Image
          alt={imageAlt}
          src={imageSrc}
          fill
          sizes={isPc ? "(min-width: 1024px) 33vw, 312px" : "312px"}
          className="object-cover saturate-0"
        />
      </div>

      <div
        className="absolute inset-0 z-10 overflow-hidden rounded-[16px] backdrop-blur-[1px]"
        data-name="Nav Button fill"
      >
        <div className={fillClass} data-name="Nav Button Fill 2" />
        <div
          className="absolute inset-0 opacity-50"
          data-name="Nav Button Fill 1"
          style={{
            backgroundImage:
              "linear-gradient(120deg, var(--color-primary) 20%, transparent 80%)",
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-[16px] group-active:shadow-[inset_0px_0px_6px_var(--color-word1-50)]"
          data-name="Nav Button Stroke"
          style={{
            padding: "3px",
            backgroundImage:
              "conic-gradient(from 62deg, var(--color-primary-0) 0%, var(--color-primary) 7%, var(--color-primary-0) 36%, var(--color-primary) 60%, var(--color-primary-0) 100%)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMaskComposite: "xor",
            maskComposite: "exclude",
          }}
        />
      </div>

      <div className={titleClass} data-name="Nav Title">
        <span>{title}</span>
      </div>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={baseClass}
        data-name="Nav Button"
        data-node-id={dataNodeId}
        data-device={device}
        data-state={state}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={baseClass}
      onClick={onClick}
      data-name="Nav Button"
      data-node-id={dataNodeId}
      data-device={device}
      data-state={state}
    >
      {content}
    </button>
  );
}
