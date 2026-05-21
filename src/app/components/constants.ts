import type { CSSProperties } from "react";

/**
 * constants.ts — Shared design tokens, layout constants, and style presets.
 *
 * All visual spacing, typography, color, and glass-morphism styles are
 * centralised here. Panel content components and the App orchestrator
 * both import from this file to maintain consistency.
 *
 * ⚠ IMPORTANT: Tailwind v4 uses oklch internally. When animating
 *   border/background with Motion, always use rgba() values to avoid
 *   oklch ↔ rgba parse conflicts. The style objects below already
 *   follow this rule.
 */
/* ── Typography scale (px) ── */
export const T = { display: 20, title: 15, body: 13, caption: 11, micro: 9 } as const;

/* ── Border-radius presets (px) ── */
export const R = { pill: 9999, lg: 24, md: 16, sm: 10 } as const;

/* ── Layout constants (px) ── */
export const G = 12;            // universal grid gap between all elements
export const NAV_W = 54;        // right nav-bar icon column width
export const LEFT_W = 345;      // left panel (Analysis) & PiP width
export const CTRL_BAR_H = 52;   // bottom control bar height
export const STATUS_H = 61;     // top status bar height
export const STATUS_GAP = 3;    // gap between status bar and content below
export const PANEL_MIN_H = 180; // minimum resize height for right panels
export const PANEL_MAX_H = 800; // maximum resize height for right panels
export const PANEL_DEFAULT_H = 420; // default docked panel height
export const PANEL_W = 356;     // standard right panel width
export const SNAP_DIST = 10;    // snap alignment threshold (px)

/* ── Colour palette ── */
export const C = {
  accent: "#615FFF",
  accentMuted: "rgba(97,95,255,0.10)",
  accentBorder: "rgba(97,95,255,0.18)",
  negative: "#FF8080",
  positive: "#6DD4A0",
  warning: "#FFD166",
};

/* ── Neumorphic Glass Styles ── */
export const glass: CSSProperties = {
  backdropFilter: "blur(64px) saturate(120%) brightness(0.92)",
  WebkitBackdropFilter: "blur(64px) saturate(120%) brightness(0.92)",
};

export const surfaceStyle: CSSProperties = {
  ...glass,
  borderRadius: R.lg,
  background: "rgba(10,12,22,0.48)",
  borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.11)",
  boxShadow: [
    /* ── top highlight edge — primary "glass edge" cue ── */
    "inset 0  1px  0   rgba(255,255,255,0.16)",
    /* ── neumorphic depth ── */
    "inset 1px  1px  2px rgba(255,255,255,0.06)",
    "inset -1px -1px  2px rgba(0,0,0,0.20)",
    /* ── rim glow ── */
    "inset 0 0 0 0.5px rgba(255,255,255,0.04)",
    /* ── depth shadow ── */
    "0  8px 32px rgba(0,0,0,0.45)",
    "0  2px  8px rgba(0,0,0,0.20)",
  ].join(", "),
};

export const cardStyle: CSSProperties = {
  background: "rgba(255,255,255,0.055)",
  borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.09)",
  borderRadius: R.md,
  boxShadow: [
    "inset  0.5px  0.5px 1.5px rgba(255,255,255,0.09)",
    "inset -0.5px -0.5px 1.5px rgba(0,0,0,0.12)",
  ].join(", "),
};

export const cardGlowStyle: CSSProperties = {
  ...cardStyle,
  background: "rgba(255,255,255,0.065)",
  boxShadow: [
    "inset  0.5px  0.5px 1.5px rgba(255,255,255,0.11)",
    "inset -0.5px -0.5px 1.5px rgba(0,0,0,0.12)",
    "0 6px 18px -4px rgba(97,95,255,0.10)",
  ].join(", "),
};

export const tipStyle: CSSProperties = {
  ...glass,
  borderRadius: R.sm,
  background: "rgba(8,10,20,0.78)",
  border: "0.5px solid rgba(255,255,255,0.12)",
  boxShadow: [
    "inset 0  1px  0   rgba(255,255,255,0.10)",
    "inset  0.5px  0.5px 1px rgba(255,255,255,0.06)",
    "inset -0.5px -0.5px 1px rgba(0,0,0,0.20)",
    "0 4px 16px rgba(0,0,0,0.40)",
  ].join(", "),
  color: "rgba(255,255,255,0.72)",
};

export const spring = { type: "spring" as const, damping: 28, stiffness: 200 };

/* ── Adaptive Glass Helpers ── */

/** Canvas-sample an <img> and return average luminance 0-1 */
export function sampleBrightness(img: HTMLImageElement): number {
  const S = 64;
  const cvs = document.createElement("canvas");
  cvs.width = S; cvs.height = S;
  const ctx = cvs.getContext("2d", { willReadFrequently: true });
  if (!ctx) return 0;
  ctx.drawImage(img, 0, 0, S, S);
  const d = ctx.getImageData(0, 0, S, S).data;
  let sum = 0;
  for (let i = 0; i < d.length; i += 4) {
    sum += 0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2];
  }
  return sum / (S * S) / 255;
}

/** Adaptive glass background that scales between glass-dark and glass-darker.
 *  t = 0 → ambient dark scene  → rgba(10,12,22, 0.48) — shows blurred ambiance
 *  t = 1 → very bright content → rgba(6, 8,18,  0.64) — stronger scrim, still transparent
 *
 *  The high blur radius (64px) does the heavy lifting for readability;
 *  this function just adjusts the base tint so panels never feel washed out.
 */
export function tintedBg(t: number, _baseA: number = 0.03): string {
  const base = 0.48;
  const bonus = t > 0.25 ? Math.min(0.18, (t - 0.25) * 0.28) : 0;
  return `rgba(10,12,22,${(base + bonus).toFixed(3)})`;
}