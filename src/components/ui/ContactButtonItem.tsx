"use client";

import { useEffect, useRef, useState } from "react";

type ContactButtonItemProps = {
  device?: "mb" | "pc";
  label?: string;
  className?: string;
  dataNodeId?: string;
  actionType?: "copy" | "link";
  actionValue?: string;
};

export default function ContactButtonItem({
  device = "mb",
  label = "電話",
  className,
  dataNodeId,
  actionType = "copy",
  actionValue = "",
}: ContactButtonItemProps) {
  const textClass = device === "pc" ? "text-pc-h3" : "text-mb-h3";
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = async () => {
    if (!actionValue) return;

    if (actionType === "link") {
      window.open(actionValue, "_blank", "noopener,noreferrer");
      return;
    }

    try {
      await navigator.clipboard.writeText(actionValue);
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 1200);
    } catch {
      // no-op when clipboard is blocked by browser policy
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        "group relative inline-flex cursor-pointer select-none items-center justify-center gap-[4px] rounded-[50px] px-[8px] py-[4px] transition-colors duration-150 ease-out",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-name={device === "pc" ? "Contact Button Item_PC" : "Contact Button Item_MB"}
      data-node-id={dataNodeId}
      data-device={device}
    >
      {copied ? (
        <span className="absolute -top-[18px] left-1/2 -translate-x-1/2 whitespace-nowrap rounded-[8px] bg-word2 px-[6px] py-[2px] text-[10px] leading-none text-primary shadow-[0px_0px_4px_var(--color-word1-50)]">
          已複製
        </span>
      ) : null}
      <span
        className={[
          textClass,
          "text-center text-highlight transition-colors duration-150 ease-out",
          "group-active:text-word2 lg:group-hover:text-word2 lg:group-active:text-word2",
        ].join(" ")}
      >
        {label}
      </span>
    </button>
  );
}
