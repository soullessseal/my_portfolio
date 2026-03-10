// Select.tsx — 真正沿路徑動（rAF + getPointAtLength）
"use client";

import { useCallback, useId, useLayoutEffect, useRef, useState } from "react";
import SelectItem from "@/components/ui/SelectItem";

export type SelectItemData = { iconSrc: string; label: string };
export type SelectProps = {
  items: SelectItemData[];
  activeIndex: number;
  onChange: (nextIndex: number) => void;
  className?: string;
};

// 只取外弧（右→底→左），用來計算沿線座標
const OUTER_D =
  "M312 1.0161C280.605 54.7905 222.496 90.8964 156 90.8964C89.5035 90.8962 31.3948 54.7904 0 1.01608";

const ANIM_MS = 380;

// easing: ease-in-out cubic
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

type Slot = "L" | "C" | "R";
type NodeState = { id: string; idx: number; slot: Slot };

export default function Select({ items, activeIndex, onChange, className }: SelectProps) {
  const n = items.length;
  const gradientId = useId();
  const wi = (i: number) => (n ? ((i % n) + n) % n : 0);
  const prevActiveIndexRef = useRef(activeIndex);
  const pendingActiveIndexRef = useRef<number | null>(null);
  const animateLeftRef = useRef<(currentIndex: number, shouldNotify: boolean) => void>(() => {});
  const animateRightRef = useRef<(currentIndex: number, shouldNotify: boolean) => void>(() => {});

  // 隱藏的 SVG path（只用來量測，不顯示）
  const outerPathRef = useRef<SVGPathElement>(null);

  // 三個槽位的弧長值（R < C < L，因為路徑由右到左）
  const slotL = useRef({ R: 0, C: 0, L: 0 });
  const totalL = useRef(0);

  const busy = useRef(false);
  const touchStartXRef = useRef<number | null>(null);

  const [nodes, setNodes] = useState<NodeState[]>(() => [
    { id: "select-left", idx: wi(activeIndex - 1), slot: "L" },
    { id: "select-center", idx: wi(activeIndex), slot: "C" },
    { id: "select-right", idx: wi(activeIndex + 1), slot: "R" },
  ]);

  // DOM refs（id → element），永遠是同類型元素所以 key 不變時 ref 穩定
  const elsRef = useRef<Map<string, HTMLElement>>(new Map());

  // ── 工具：套用座標 ──
  function applyPos(el: HTMLElement | undefined, x: number, y: number) {
    if (!el) return;
    el.style.left = `${(x / 312) * 100}%`;
    el.style.top = `${y}px`;
  }

  const syncNodesToIndex = useCallback((index: number) => {
    prevActiveIndexRef.current = index;
    setNodes([
      { id: "select-left", idx: ((index - 1) % n + n) % n, slot: "L" },
      { id: "select-center", idx: ((index % n) + n) % n, slot: "C" },
      { id: "select-right", idx: ((index + 1) % n + n) % n, slot: "R" },
    ]);
  }, [n]);

  const processPendingTarget = useCallback(() => {
    const pending = pendingActiveIndexRef.current;

    if (pending === null || busy.current) {
      return;
    }

    if (pending === prevActiveIndexRef.current) {
      pendingActiveIndexRef.current = null;
      return;
    }

    pendingActiveIndexRef.current = null;

    const prevIndex = prevActiveIndexRef.current;
    const delta = pending - prevIndex;

    requestAnimationFrame(() => {
      if (delta === 1 || delta === -(n - 1)) {
        animateRightRef.current(prevIndex, false);
        return;
      }

      if (delta === -1 || delta === n - 1) {
        animateLeftRef.current(prevIndex, false);
        return;
      }

      syncNodesToIndex(pending);
    });
  }, [n, syncNodesToIndex]);

  // ── 量測路徑，初始化三顆位置 ──
  useLayoutEffect(() => {
    if (!n) return;
    const path = outerPathRef.current;
    if (!path) return;

    const len = path.getTotalLength();
    totalL.current = len;

    // 找最低點（弧底 = C 槽）
    let bestL = 0, bestY = -Infinity;
    for (let i = 0; i <= 800; i++) {
      const l = (len * i) / 800;
      const p = path.getPointAtLength(l);
      if (p.y > bestY) { bestY = p.y; bestL = l; }
    }

    const clamp = (v: number) => Math.max(0, Math.min(len, v));
    const OFF = len * 0.26; // L/R 偏移量

    slotL.current = {
      R: clamp(bestL - OFF), // 右槽 = 較小弧長（路徑起點在右）
      C: bestL,
      L: clamp(bestL + OFF), // 左槽 = 較大弧長
    };

    // 初始擺放三顆
    nodes.forEach(node => {
      const el = elsRef.current.get(node.id);
      if (!el) return;
      const sl = slotL.current[node.slot];
      const pt = path.getPointAtLength(sl);
      applyPos(el, pt.x, pt.y);
    });
  }, [n, nodes]);

  // ── 核心：沿弧線 rAF 動畫 ──
  const animAlong = useCallback((
    nodeId: string,
    fromLen: number,
    toLen: number,
    duration: number,
    onDone?: () => void
  ) => {
    const path = outerPathRef.current!;
    const el   = elsRef.current.get(nodeId);
    if (!el) return;
    let startTime: number | null = null;

    function tick(now: number) {
      if (startTime === null) startTime = now;
      const raw      = Math.min((now - startTime) / duration, 1);
      const t        = ease(raw);
      const curLen   = fromLen + (toLen - fromLen) * t;
      const clamped  = Math.max(0, Math.min(totalL.current, curLen));
      const pt       = path.getPointAtLength(clamped);
      applyPos(el, pt.x, pt.y);

      if (raw < 1) {
        requestAnimationFrame(tick);
      } else {
        onDone?.();
      }
    }

    requestAnimationFrame(tick);
  }, []);

  // ── 往左（上一項）──
  // 視覺：L→C、C→R、R 消失右端 → 新節點從左端滑入 L
  const animateLeft = useCallback((currentIndex: number, shouldNotify: boolean) => {
    if (busy.current) return;
    busy.current = true;

    const sl = slotL.current;
    const tl = totalL.current;
    const nextActive = ((currentIndex - 1) % n + n) % n;
    const incoming   = ((currentIndex - 2) % n + n) % n;

    const nL = nodes.find(x => x.slot === "L")!;
    const nC = nodes.find(x => x.slot === "C")!;
    const nR = nodes.find(x => x.slot === "R")!;

    // 立刻更新 slot（觸發 active 大小切換動畫）
    setNodes(prev => prev.map(n =>
      n.id === nL.id ? { ...n, slot: "C" as Slot } :
      n.id === nC.id ? { ...n, slot: "R" as Slot } :
      n
    ));

    // L → C（沿弧線往右，弧長遞減）
    animAlong(nL.id, sl.L, sl.C, ANIM_MS);
    // C → R（沿弧線往右，弧長遞減）
    animAlong(nC.id, sl.C, sl.R, ANIM_MS);

    // R → 滑出右端（弧長 → 0）
    animAlong(nR.id, sl.R, 0, ANIM_MS / 2, () => {
      const elR = elsRef.current.get(nR.id)!;
      // 瞬間跳到左端外側（x≈-60）
      const leftEnd = outerPathRef.current!.getPointAtLength(tl);
      applyPos(elR, leftEnd.x - 60, leftEnd.y);

      // 換成新內容 + 設為 L slot
      setNodes(prev => prev.map(n =>
        n.id === nR.id ? { ...n, idx: incoming, slot: "L" as Slot } : n
      ));

      // 從左端外側滑入 L 槽（弧長由 tl → sl.L）
      animAlong(nR.id, tl, sl.L, ANIM_MS / 2);
    });

    setTimeout(() => {
      prevActiveIndexRef.current = nextActive;
      if (shouldNotify) {
        onChange(nextActive);
      }
      busy.current = false;
      processPendingTarget();
    }, ANIM_MS + 60);
  }, [animAlong, n, onChange, nodes, processPendingTarget]);

  // ── 往右（下一項）──
  // 視覺：R→C、C→L、L 消失左端 → 新節點從右端滑入 R
  const animateRight = useCallback((currentIndex: number, shouldNotify: boolean) => {
    if (busy.current) return;
    busy.current = true;

    const sl = slotL.current;
    const tl = totalL.current;
    const nextActive = ((currentIndex + 1) % n + n) % n;
    const incoming   = ((currentIndex + 2) % n + n) % n;

    const nL = nodes.find(x => x.slot === "L")!;
    const nC = nodes.find(x => x.slot === "C")!;
    const nR = nodes.find(x => x.slot === "R")!;

    // 立刻更新 slot
    setNodes(prev => prev.map(n =>
      n.id === nR.id ? { ...n, slot: "C" as Slot } :
      n.id === nC.id ? { ...n, slot: "L" as Slot } :
      n
    ));

    // R → C（沿弧線往左，弧長遞增）
    animAlong(nR.id, sl.R, sl.C, ANIM_MS);
    // C → L（沿弧線往左，弧長遞增）
    animAlong(nC.id, sl.C, sl.L, ANIM_MS);

    // L → 滑出左端（弧長 → tl）
    animAlong(nL.id, sl.L, tl, ANIM_MS / 2, () => {
      const elL = elsRef.current.get(nL.id)!;
      // 瞬間跳到右端外側（x≈312+60）
      const rightEnd = outerPathRef.current!.getPointAtLength(0);
      applyPos(elL, rightEnd.x + 60, rightEnd.y);

      // 換成新內容 + 設為 R slot
      setNodes(prev => prev.map(n =>
        n.id === nL.id ? { ...n, idx: incoming, slot: "R" as Slot } : n
      ));

      // 從右端外側滑入 R 槽（弧長由 0 → sl.R）
      animAlong(nL.id, 0, sl.R, ANIM_MS / 2);
    });

    setTimeout(() => {
      prevActiveIndexRef.current = nextActive;
      if (shouldNotify) {
        onChange(nextActive);
      }
      busy.current = false;
      processPendingTarget();
    }, ANIM_MS + 60);
  }, [animAlong, n, onChange, nodes, processPendingTarget]);

  useLayoutEffect(() => {
    animateLeftRef.current = animateLeft;
    animateRightRef.current = animateRight;
  }, [animateLeft, animateRight]);

  useLayoutEffect(() => {
    if (!n) return;
    if (prevActiveIndexRef.current === activeIndex) return;

    if (busy.current) {
      pendingActiveIndexRef.current = activeIndex;
      return;
    }

    const prevIndex = prevActiveIndexRef.current;
    const delta = activeIndex - prevIndex;
    const frameId = requestAnimationFrame(() => {
      if (delta === 1 || delta === -(n - 1)) {
        animateRight(prevIndex, false);
        return;
      }

      if (delta === -1 || delta === n - 1) {
        animateLeft(prevIndex, false);
        return;
      }

      syncNodesToIndex(activeIndex);
    });

    return () => cancelAnimationFrame(frameId);
  }, [activeIndex, animateLeft, animateRight, n, syncNodesToIndex]);

  if (!n) return null;

  const handleTouchStart = (event: React.TouchEvent<HTMLDivElement>) => {
    touchStartXRef.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartXRef.current === null) return;

    const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const dx = endX - touchStartXRef.current;
    touchStartXRef.current = null;

    if (Math.abs(dx) < 24 || busy.current) return;

    if (dx > 0) {
      animateLeft(prevActiveIndexRef.current, true);
      return;
    }

    animateRight(prevActiveIndexRef.current, true);
  };

  return (
    <div className={[
      "relative h-[122px] w-[312px] select-none overflow-visible touch-pan-y",
      className,
    ].filter(Boolean).join(" ")}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >

      {/* 顯示用弧線（原始帶漸層的 filled 路徑） */}
      <svg
        className="absolute left-0 top-0 w-full h-[91px] pointer-events-none"
        viewBox="0 0 312 91" fill="none"
        aria-hidden="true"
      >
        <path
          d="M312 1.0161C280.605 54.7905 222.496 90.8964 156 90.8964C89.5035 90.8962 31.3948 54.7904 0 1.01608L1.72242 0C32.7734 53.1851 90.2409 88.8876 156 88.8877C221.758 88.8877 279.227 53.1853 310.278 1.35628e-05L312 1.0161Z"
          fill={`url(#${gradientId})`}
        />
        <defs>
          <linearGradient id={gradientId} x1="156" y1="90.8964" x2="156" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="white" />
            <stop offset="0.9" stopColor="#C9C0BB" />
          </linearGradient>
        </defs>
      </svg>

      {/* 隱藏路徑，只用來 getPointAtLength 量測 */}
      <svg
        aria-hidden="true"
        style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
      >
        <path ref={outerPathRef} d={OUTER_D} />
      </svg>

      {/* 三顆節點（永遠是 div，靠 onClick 條件決定是否可點） */}
      {nodes.map(node => (
        <div
          key={node.id}
          ref={el => {
            if (el) elsRef.current.set(node.id, el);
            else    elsRef.current.delete(node.id);
          }}
          role={node.slot !== "C" ? "button" : undefined}
          tabIndex={node.slot !== "C" ? 0 : undefined}
          aria-label={
            node.slot === "L" ? "Previous" :
            node.slot === "R" ? "Next" : undefined
          }
          onClick={
            node.slot === "L"
              ? () => animateLeft(prevActiveIndexRef.current, true)
              : node.slot === "R"
                ? () => animateRight(prevActiveIndexRef.current, true)
                : undefined
          }
          onKeyDown={e => {
            if (e.key !== "Enter" && e.key !== " ") return;
            if (node.slot === "L") animateLeft(prevActiveIndexRef.current, true);
            if (node.slot === "R") animateRight(prevActiveIndexRef.current, true);
          }}
          style={{
            position: "absolute",
            transform: "translate(-50%, -50%)",
          }}
          className={node.slot !== "C" ? "cursor-pointer" : undefined}
        >
          <SelectItem
            active={node.slot === "C"}
            iconSrc={items[node.idx].iconSrc}
            label={items[node.idx].label}
          />
        </div>
      ))}
    </div>
  );
}
