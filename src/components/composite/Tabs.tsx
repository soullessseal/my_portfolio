"use client";

import { useState } from "react";
import TabItemButton from "../ui/TabItemButton";

type TabsItem = { key: string; label: string };

type Props = {
  device?: "mb" | "pc";
  items: TabsItem[];
  activeKey: string;
  onChange: (key: string) => void;
  className?: string;
};

export default function Tabs({
  device = "mb",
  items,
  activeKey,
  onChange,
  className,
}: Props) {
  const containerClass = device === "pc" ? "gap-[8px] p-[8px]" : "gap-[4px] p-[4px]";

  // ✅ 按住時的暫態 pressed
  const [pressedKey, setPressedKey] = useState<string | null>(null);

  return (
    <div
      className={[
        "inline-flex items-center justify-center",
        "rounded-[50px]",
        "bg-primary",
        "shadow-[0px_1px_5px_0px_var(--color-word1-50)]",
        containerClass,
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      role="tablist"
    >
      {items.map((item) => {
        const isActive = item.key === activeKey;

        // ✅ active 優先，其次 pressed，其次 idle
        const state: "active" | "idle" | "pressed" = isActive
          ? "active"
          : pressedKey === item.key
          ? "pressed"
          : "idle";

        return (
          <TabItemButton
            key={item.key}
            device={device}
            state={state}
            label={item.label}
            className="shrink-0"
            onClick={() => onChange(item.key)}
            onPointerDown={() => {
              // active 不做 pressed（維持 active 視覺）
              if (isActive) return;
              setPressedKey(item.key);
            }}
            onPointerUp={() => setPressedKey(null)}
            onPointerCancel={() => setPressedKey(null)}
            onPointerLeave={() => setPressedKey(null)}
          />
        );
      })}
    </div>
  );
}