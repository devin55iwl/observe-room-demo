/**
 * FunnelShell v5 — Dual-mode design system (Light / Dark)
 *
 * Light: White frosted glass + amber accent + bright background
 * Dark:  Dark cinematic glass + purple accent + night background
 *
 * Components call useParticipantTheme() to get current tokens.
 */
import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { motion } from "motion/react";

const MotionDiv = motion.div;

/* ── Typography ── */
export const SF   = "'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif";
export const MONO = "'SF Mono', 'Menlo', 'Monaco', monospace";

/* ── Mobile detection ── */
export function useIsMobile(breakpoint = 768): boolean {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < breakpoint : false
  );
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const handler = (e: MediaQueryListEvent) => setMobile(e.matches);
    setMobile(mq.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [breakpoint]);
  return mobile;
}

/* ── Theme type ── */
export type ThemeMode = "light" | "dark";

export interface ThemeTokens {
  mode: ThemeMode;
  /* accent */
  ARGB: string;
  AMBER: string;
  AMBER_SOLID: string;
  /* text */
  INK1: string;
  INK2: string;
  INK3: string;
  INK4: string;
  /* surface / stroke */
  SURF1: string;
  SURF2: string;
  STR1: string;
  STR2: string;
  /* status */
  GREEN: string;
  GREEN_BG: string;
  GREEN_STR: string;
  GREEN_TEXT: string;
  /* glass */
  GLASS_BG: string;
  GLASS_BORDER: string;
  GLASS_BLUR: string;
  /* shadows */
  CARD_SHADOW: string;
  /* overlay */
  OVERLAY_BG: string;
  VIGNETTE: string;
  /* scroll fade */
  SCROLL_FADE: string;
  SCROLL_PILL_BG: string;
}

const LIGHT_TOKENS: ThemeTokens = {
  mode: "light",
  /* accent — warm espresso / sienna */
  ARGB: "107, 61, 19",
  AMBER: "rgba(107, 61, 19, 0.72)",
  AMBER_SOLID: "#6B3D13",
  /* text — warm dark-brown ink */
  INK1: "rgba(28, 16, 4, 0.88)",
  INK2: "rgba(28, 16, 4, 0.56)",
  INK3: "rgba(28, 16, 4, 0.38)",
  INK4: "rgba(28, 16, 4, 0.22)",
  /* surface / stroke — warm parchment tones */
  SURF1: "rgba(107, 61, 19, 0.055)",
  SURF2: "rgba(107, 61, 19, 0.028)",
  STR1: "rgba(107, 61, 19, 0.12)",
  STR2: "rgba(107, 61, 19, 0.072)",
  /* status */
  GREEN: "rgba(16, 185, 129, 0.80)",
  GREEN_BG: "rgba(16, 185, 129, 0.06)",
  GREEN_STR: "rgba(16, 185, 129, 0.14)",
  GREEN_TEXT: "rgba(5, 150, 105, 0.72)",
  /* glass — clean white frosted card */
  GLASS_BG: "rgba(255, 255, 255, 0.68)",
  GLASS_BORDER: "rgba(255, 255, 255, 0.90)",
  GLASS_BLUR: "blur(48px) saturate(120%) brightness(1.04)",
  /* shadows */
  CARD_SHADOW: "0 4px 40px rgba(120,70,10,0.12), 0 1px 2px rgba(120,70,10,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
  /* overlay */
  OVERLAY_BG: "rgba(250, 244, 235, 0.92)",
  VIGNETTE: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(200,175,140,0.10) 0%, rgba(200,175,140,0.22) 100%)",
  /* scroll fade */
  SCROLL_FADE: "linear-gradient(to top, rgba(255,255,255,0.97) 10%, rgba(255,255,255,0.70) 40%, rgba(255,255,255,0.28) 70%, transparent 100%)",
  SCROLL_PILL_BG: "rgba(255,255,255,0.88)",
};

const DARK_TOKENS: ThemeTokens = {
  mode: "dark",
  ARGB: "97, 95, 255",
  AMBER: "rgba(97, 95, 255, 0.72)",
  AMBER_SOLID: "#615FFF",
  INK1: "rgba(255, 255, 255, 0.90)",
  INK2: "rgba(255, 255, 255, 0.50)",
  INK3: "rgba(255, 255, 255, 0.40)",
  INK4: "rgba(255, 255, 255, 0.20)",
  SURF1: "rgba(255, 255, 255, 0.055)",
  SURF2: "rgba(255, 255, 255, 0.03)",
  STR1: "rgba(255, 255, 255, 0.11)",
  STR2: "rgba(255, 255, 255, 0.06)",
  GREEN: "rgba(109, 212, 160, 0.90)",
  GREEN_BG: "rgba(109, 212, 160, 0.08)",
  GREEN_STR: "rgba(109, 212, 160, 0.18)",
  GREEN_TEXT: "rgba(109, 212, 160, 0.70)",
  GLASS_BG: "rgba(10, 12, 22, 0.48)",
  GLASS_BORDER: "rgba(255, 255, 255, 0.11)",
  GLASS_BLUR: "blur(64px) saturate(120%) brightness(0.92)",
  CARD_SHADOW: [
    "inset 0  1px  0   rgba(255,255,255,0.16)",
    "inset 1px  1px  2px rgba(255,255,255,0.06)",
    "inset -1px -1px  2px rgba(0,0,0,0.20)",
    "inset 0 0 0 0.5px rgba(255,255,255,0.04)",
    "0  8px 32px rgba(0,0,0,0.45)",
    "0  2px  8px rgba(0,0,0,0.20)",
  ].join(", "),
  OVERLAY_BG: "rgba(0,0,0,0.60)",
  VIGNETTE: "radial-gradient(ellipse 90% 80% at 50% 50%, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.40) 100%)",
  SCROLL_FADE: "linear-gradient(to top, rgba(10,12,22,0.95) 10%, rgba(10,12,22,0.70) 40%, rgba(10,12,22,0.30) 70%, transparent 100%)",
  SCROLL_PILL_BG: "rgba(255,255,255,0.06)",
};

/* ── Context ── */
interface ThemeCtxValue {
  tokens: ThemeTokens;
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeCtx = createContext<ThemeCtxValue>({
  tokens: DARK_TOKENS,
  mode: "dark",
  toggle: () => {},
});

export function ParticipantThemeProvider({ children, defaultMode = "dark" }: { children: React.ReactNode; defaultMode?: ThemeMode }) {
  const [mode, setMode] = useState<ThemeMode>(defaultMode);
  const toggle = useCallback(() => setMode((m) => (m === "light" ? "dark" : "light")), []);
  const tokens = mode === "light" ? LIGHT_TOKENS : DARK_TOKENS;
  return <ThemeCtx.Provider value={{ tokens, mode, toggle }}>{children}</ThemeCtx.Provider>;
}

export function useParticipantTheme() {
  return useContext(ThemeCtx);
}

/* ── Backward-compat direct exports (dark defaults) ── */
export const ARGB        = DARK_TOKENS.ARGB;
export const AMBER       = DARK_TOKENS.AMBER;
export const AMBER_SOLID = DARK_TOKENS.AMBER_SOLID;
export const INK1 = DARK_TOKENS.INK1;
export const INK2 = DARK_TOKENS.INK2;
export const INK3 = DARK_TOKENS.INK3;
export const INK4 = DARK_TOKENS.INK4;
export const SURF1 = DARK_TOKENS.SURF1;
export const SURF2 = DARK_TOKENS.SURF2;
export const STR1  = DARK_TOKENS.STR1;
export const STR2  = DARK_TOKENS.STR2;
export const GREEN      = DARK_TOKENS.GREEN;
export const GREEN_BG   = DARK_TOKENS.GREEN_BG;
export const GREEN_STR  = DARK_TOKENS.GREEN_STR;
export const GREEN_TEXT = DARK_TOKENS.GREEN_TEXT;
export const GLASS_BG     = DARK_TOKENS.GLASS_BG;
export const GLASS_BORDER = DARK_TOKENS.GLASS_BORDER;
export const GLASS_BLUR   = DARK_TOKENS.GLASS_BLUR;

/* ────────────────────────────────────────────────────── */

/** Theme-aware primary CTA */
export function PrimaryBtn({
  label,
  disabled = false,
  onClick,
  icon,
}: {
  label: string;
  disabled?: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
}) {
  const { tokens: t } = useParticipantTheme();
  const [hov, setHov] = React.useState(false);
  return (
    <div
      onClick={() => !disabled && onClick()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        width: "100%",
        padding: "13px 0",
        borderRadius: 12,
        cursor: disabled ? "default" : "pointer",
        opacity: disabled ? 0.34 : 1,
        background: disabled
          ? (t.mode === "light" ? "rgba(28, 25, 23, 0.03)" : "rgba(255, 255, 255, 0.02)")
          : hov
            ? `rgba(${t.ARGB}, 0.16)`
            : `rgba(${t.ARGB}, 0.065)`,
        boxShadow: disabled
          ? `inset 0 0 0 1px ${t.STR2}`
          : hov
            ? `inset 0 0 0 1px rgba(${t.ARGB}, 0.36)`
            : `inset 0 0 0 1px rgba(${t.ARGB}, 0.18)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        transition: "background 0.16s ease, box-shadow 0.16s ease",
        userSelect: "none" as const,
      }}
    >
      <span
        style={{
          fontSize: 13.5,
          fontFamily: SF,
          fontWeight: 600,
          color: disabled ? t.INK3 : t.AMBER_SOLID,
          letterSpacing: "-0.01em",
        }}
      >
        {label}
      </span>
      {icon}
    </div>
  );
}

/** Separator */
export function Divider() {
  const { tokens: t } = useParticipantTheme();
  return <div style={{ height: 1, background: t.STR2, flexShrink: 0 }} />;
}

/** Section heading capsule */
export function SectionLabel({ label }: { label: string }) {
  const { tokens: t } = useParticipantTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
      <div style={{ width: 2.5, height: 12, borderRadius: 9999, background: `rgba(${t.ARGB}, 0.48)` }} />
      <span style={{
        fontSize: 10, fontFamily: SF, fontWeight: 600,
        color: t.INK3, letterSpacing: "0.14em", textTransform: "uppercase" as const,
      }}>
        {label}
      </span>
    </div>
  );
}

/** Unused shell kept for backward compat */
export function FunnelShell({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}