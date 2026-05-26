/**
 * primitives.tsx — Reusable low-level UI building blocks.
 *
 * Exports:
 *  - Surface          — Glass-morphism container (adaptive to background)
 *  - Card             — Inner card with optional active/glow state
 *  - SectionLabel     — Uppercase section divider with optional tooltip
 *  - CompactCtx       — Context for panel compact-level (0 full → 3 minimal)
 *  - useCompact()     — Consumer hook for compact context
 *  - PanelContentArea — Scroll-aware content wrapper with fade + compact detection
 */
import React, { useRef, useState, useEffect, useCallback, createContext, useContext } from "react";
import type { ReactNode, CSSProperties } from "react";
import { C, T } from "./constants";
import { useAdaptiveGlass } from "./hooks";
import { Tip } from "./Tip";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

/* ── Surface ── */
export function Surface({ children, className = "", style }: { children: ReactNode; className?: string; style?: CSSProperties }) {
  const { surface } = useAdaptiveGlass();
  let themeTokens: any = null;
  try { themeTokens = useObserveTheme(); } catch {}
  const isLight = themeTokens?.mode === "light";
  const ot = themeTokens?.tokens;

  const lightSurface: CSSProperties = ot ? {
    ...ot.surfaceBlur,
    borderRadius: 24,
    background: ot.surfaceBg,
    borderWidth: 1, borderStyle: "solid", borderColor: ot.surfaceBorder,
    boxShadow: ot.surfaceShadow,
  } : {};

  return <div className={className} style={{ ...(isLight ? lightSurface : surface), ...style }}>{children}</div>;
}

/* ── Card ── */
export function Card({ children, className = "", active, glow, style }: {
  children: ReactNode; className?: string; active?: boolean; glow?: boolean; style?: CSSProperties;
}) {
  const ag = useAdaptiveGlass();
  return (
    <div className={className} style={{
      ...(glow ? ag.cardGlow : ag.card),
      ...(active ? { borderColor: C.accentBorder, background: C.accentMuted } : {}),
      ...style,
    }}>
      {children}
    </div>
  );
}

/* ── Section Label ── */
export function SectionLabel({ children, tip }: { children: ReactNode; tip?: string }) {
  let themeTokens: any = null;
  try { themeTokens = useObserveTheme(); } catch {}
  const isLight = themeTokens?.mode === "light";

  const label = (
    <div className={`flex items-center gap-3 mb-3 ${tip ? "cursor-help" : ""}`}>
      <span className={`uppercase tracking-[0.14em] ${isLight ? "text-black/25" : "text-white/14"} ${tip ? `border-b border-dashed ${isLight ? "border-black/8" : "border-white/8"}` : ""}`}
        style={{ fontSize: T.micro }}>{children}</span>
      <div className={`flex-1 h-px ${isLight ? "bg-black/[0.06]" : "bg-white/[0.04]"}`} />
    </div>
  );
  return tip ? <Tip text={tip} align="left">{label}</Tip> : label;
}

/* ── Compact level context ── */
// 0 = full (>500px), 1 = half (180-500px), 2 = compact (120-180px), 3 = minimal (<120px)
export const CompactCtx = createContext(0);
export function useCompact() { return useContext(CompactCtx); }

/* ── Panel Content Area (scroll-aware fade) ── */
export function PanelContentArea({ children, className = "" }: { children: ReactNode; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showFade, setShowFade] = useState(false);
  const [compactLevel, setCompactLevel] = useState(0);
  let themeTokens: any = null;
  try { themeTokens = useObserveTheme(); } catch {}
  const isLight = themeTokens?.mode === "light";

  const checkOverflow = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const hasOverflow = el.scrollHeight > el.clientHeight + 4;
    const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 8;
    setShowFade(hasOverflow && !atBottom);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkOverflow();
    const ro = new ResizeObserver((entries) => {
      checkOverflow();
      for (const entry of entries) {
        const h = entry.contentRect.height;
        setCompactLevel(h < 120 ? 3 : h < 180 ? 2 : h < 500 ? 1 : 0);
      }
    });
    ro.observe(el);
    const mo = new MutationObserver(checkOverflow);
    mo.observe(el, { childList: true, subtree: true });
    return () => { ro.disconnect(); mo.disconnect(); };
  }, [checkOverflow]);

  return (
    <CompactCtx.Provider value={compactLevel}>
      <div className={`flex-1 overflow-hidden relative flex flex-col ${className}`}>
        <div ref={scrollRef} className="overflow-y-auto scroll-area px-4 py-4 flex flex-col flex-1 min-h-0"
          onScroll={checkOverflow}>
          {children}
        </div>
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none transition-opacity duration-200"
          style={{
            height: 36,
            opacity: showFade ? 1 : 0,
            background: isLight
              ? "linear-gradient(to top, rgba(240,241,243,0.70) 0%, rgba(240,241,243,0.30) 40%, transparent 100%)"
              : "linear-gradient(to top, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.30) 40%, transparent 100%)",
          }} />
      </div>
    </CompactCtx.Provider>
  );
}
