/**
 * ObserveThemeContext — Light/Dark mode for the Researcher Observe Room.
 *
 * Light mode follows the Cookiy Design Guidelines:
 *   - Pure black/grey/white palette (no purple/blue accents)
 *   - Frosted glass system with white-based translucency
 *   - GradientBackground with neutral gray ambient blobs
 *
 * Dark mode preserves the original cinematic glass design.
 */
import React, { createContext, useContext, useState, useCallback } from "react";
import type { CSSProperties } from "react";

export type ObserveMode = "light" | "dark";

export interface ObserveTokens {
  mode: ObserveMode;
  /* background */
  pageBg: string;
  /* text */
  ink1: string;  // primary
  ink2: string;  // secondary
  ink3: string;  // tertiary / captions
  ink4: string;  // disabled / placeholder
  /* accent */
  accent: string;
  accentMuted: string;
  accentBorder: string;
  /* status */
  negative: string;
  positive: string;
  warning: string;
  /* glass surface */
  surfaceBg: string;
  surfaceBorder: string;
  surfaceShadow: string;
  surfaceBlur: CSSProperties;
  /* card */
  cardBg: string;
  cardBorder: string;
  cardShadow: string;
  /* tip */
  tipBg: string;
  tipBorder: string;
  tipColor: string;
  /* misc */
  divider: string;
  scrollFade: string;
  overlayBg: string;
}

const DARK_TOKENS: ObserveTokens = {
  mode: "dark",
  pageBg: "#0a0b0f",
  ink1: "rgba(255,255,255,0.90)",
  ink2: "rgba(255,255,255,0.50)",
  ink3: "rgba(255,255,255,0.30)",
  ink4: "rgba(255,255,255,0.14)",
  accent: "#615FFF",
  accentMuted: "rgba(97,95,255,0.10)",
  accentBorder: "rgba(97,95,255,0.18)",
  negative: "#FF8080",
  positive: "#6DD4A0",
  warning: "#FFD166",
  surfaceBg: "rgba(10,12,22,0.48)",
  surfaceBorder: "rgba(255,255,255,0.11)",
  surfaceShadow: [
    "inset 0  1px  0   rgba(255,255,255,0.16)",
    "inset 1px  1px  2px rgba(255,255,255,0.06)",
    "inset -1px -1px  2px rgba(0,0,0,0.20)",
    "inset 0 0 0 0.5px rgba(255,255,255,0.04)",
    "0  8px 32px rgba(0,0,0,0.45)",
    "0  2px  8px rgba(0,0,0,0.20)",
  ].join(", "),
  surfaceBlur: {
    backdropFilter: "blur(64px) saturate(120%) brightness(0.92)",
    WebkitBackdropFilter: "blur(64px) saturate(120%) brightness(0.92)",
  },
  cardBg: "rgba(255,255,255,0.055)",
  cardBorder: "rgba(255,255,255,0.09)",
  cardShadow: [
    "inset  0.5px  0.5px 1.5px rgba(255,255,255,0.09)",
    "inset -0.5px -0.5px 1.5px rgba(0,0,0,0.12)",
  ].join(", "),
  tipBg: "rgba(8,10,20,0.78)",
  tipBorder: "rgba(255,255,255,0.12)",
  tipColor: "rgba(255,255,255,0.72)",
  divider: "rgba(255,255,255,0.06)",
  scrollFade: "linear-gradient(to top, rgba(10,12,18,0.65) 0%, rgba(10,12,18,0.30) 40%, transparent 100%)",
  overlayBg: "rgba(0,0,0,0.20)",
};

const LIGHT_TOKENS: ObserveTokens = {
  mode: "light",
  pageBg: "#f0f1f3",
  ink1: "rgba(0,0,0,0.80)",
  ink2: "rgba(0,0,0,0.50)",
  ink3: "rgba(0,0,0,0.30)",
  ink4: "rgba(0,0,0,0.15)",
  accent: "rgba(0,0,0,0.80)",
  accentMuted: "rgba(0,0,0,0.04)",
  accentBorder: "rgba(0,0,0,0.12)",
  negative: "#ef4444",
  positive: "#10b981",
  warning: "#f59e0b",
  surfaceBg: "rgba(255,255,255,0.50)",
  surfaceBorder: "rgba(255,255,255,0.70)",
  surfaceShadow: [
    "0 2px 16px rgba(0,0,0,0.04)",
    "inset 0 1px 0 rgba(255,255,255,0.70)",
  ].join(", "),
  surfaceBlur: {
    backdropFilter: "blur(40px) saturate(130%)",
    WebkitBackdropFilter: "blur(40px) saturate(130%)",
  },
  cardBg: "rgba(255,255,255,0.40)",
  cardBorder: "rgba(255,255,255,0.60)",
  cardShadow: "inset 0 1px 0 rgba(255,255,255,0.50)",
  tipBg: "rgba(255,255,255,0.80)",
  tipBorder: "rgba(0,0,0,0.08)",
  tipColor: "rgba(0,0,0,0.60)",
  divider: "rgba(0,0,0,0.06)",
  scrollFade: "linear-gradient(to top, rgba(240,241,243,0.70) 0%, rgba(240,241,243,0.30) 40%, transparent 100%)",
  overlayBg: "rgba(0,0,0,0.08)",
};

interface ObserveThemeCtxValue {
  mode: ObserveMode;
  tokens: ObserveTokens;
  toggle: () => void;
}

const ObserveThemeCtx = createContext<ObserveThemeCtxValue>({
  mode: "dark",
  tokens: DARK_TOKENS,
  toggle: () => {},
});

export function ObserveThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<ObserveMode>("dark");
  const toggle = useCallback(() => setMode(m => m === "dark" ? "light" : "dark"), []);
  const tokens = mode === "dark" ? DARK_TOKENS : LIGHT_TOKENS;
  return (
    <ObserveThemeCtx.Provider value={{ mode, tokens, toggle }}>
      {children}
    </ObserveThemeCtx.Provider>
  );
}

export function useObserveTheme() {
  return useContext(ObserveThemeCtx);
}
