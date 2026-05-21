/**
 * tile-utils.ts — Shared helpers for question tile rendering.
 *
 * Consolidates background color, border, signal icon, and quality
 * derivation logic used across all 4 compact states of CheckListContent.
 */
import type { SessionQuestion, QualityLevel } from "../../types";

/* ── Quality derivation ── */
export function deriveQuality(eng: number): QualityLevel {
  if (eng >= 80) return "high";
  if (eng >= 60) return "mid";
  return "low";
}

/* ── Signal icon type ── */
export type SignalIcon = { type: "star" | "warning"; color: string };

export function deriveSignalIcons(q: SessionQuestion): SignalIcon[] {
  const icons: SignalIcon[] = [];
  const sigs = q.signals ?? [];
  if (sigs.find(s => s.icon === "emotion")) icons.push({ type: "star", color: "rgba(109,212,160,0.7)" });
  if (sigs.find(s => s.icon === "hesitation")) icons.push({ type: "warning", color: "rgba(255,209,102,0.65)" });
  if (sigs.find(s => s.icon === "gaze")) icons.push({ type: "warning", color: "rgba(255,128,128,0.6)" });
  return icons;
}

/* ── Tile background color ── */
export function tileBg(q: SessionQuestion, quality: QualityLevel | null): string {
  if (q.status === "active") return "rgba(97,95,255,0.70)";
  if (q.status !== "done" || !quality) return "rgba(255,255,255,0.05)";
  if (quality === "high") return "rgba(109,212,160,0.65)";
  if (quality === "mid") return "rgba(255,209,102,0.55)";
  return "rgba(255,128,128,0.45)";
}

/* ── Engagement color with alpha ── */
export function engColorAlpha(eng: number, a: number): string {
  if (eng >= 80) return `rgba(109,212,160,${a})`;
  if (eng >= 60) return `rgba(255,209,102,${a})`;
  return `rgba(255,128,128,${a})`;
}

/* ── Quality labels ── */
export const QUALITY_LABEL: Record<QualityLevel, string> = { high: "High", mid: "Moderate", low: "Low" };
export const QUALITY_LABEL_COLOR: Record<QualityLevel, string> = {
  high: "rgba(109,212,160,0.85)",
  mid: "rgba(255,209,102,0.75)",
  low: "rgba(255,128,128,0.70)",
};

/* ── Bar fill styling (list view) ── */
export const BAR_FILLED: Record<QualityLevel, string> = {
  high: "rgba(109,212,160,0.85)",
  mid: "rgba(255,209,102,0.50)",
  low: "rgba(255,128,128,0.50)",
};
export const BAR_GLOW: Record<QualityLevel, string> = {
  high: "0px 0px 4px 0px rgba(109,212,160,0.85)",
  mid: "0px 0px 4px 0px rgba(255,209,102,0.50)",
  low: "0px 0px 4px 0px rgba(255,128,128,0.50)",
};
export const BAR_EMPTY = "rgba(255,255,255,0.10)";
export const BAR_COUNT: Record<QualityLevel, number> = { high: 3, mid: 2, low: 1 };

/* ── Signal icon metadata ── */
export const SIGNAL_ICON_MAP: Record<string, { label: string; color: string }> = {
  emotion:    { label: "Strong reaction detected", color: "rgba(109,212,160,0.8)" },
  speed:      { label: "Speech rate change", color: "rgba(109,212,160,0.7)" },
  agreement:  { label: "Agreement pattern", color: "rgba(109,212,160,0.7)" },
  hesitation: { label: "Hesitation detected", color: "rgba(255,209,102,0.75)" },
  pitch:      { label: "Pitch shift detected", color: "rgba(255,209,102,0.7)" },
  filler:     { label: "Filler language", color: "rgba(255,209,102,0.65)" },
  gaze:       { label: "Gaze drift detected", color: "rgba(255,128,128,0.7)" },
};

/* ── Session section definitions ── */
export interface QSession { label: string; range: [number, number] }

export const Q_SESSIONS: QSession[] = [
  { label: "Onboarding", range: [0, 3] },
  { label: "Workflow", range: [4, 9] },
  { label: "Collaboration", range: [10, 15] },
  { label: "Strategy", range: [16, 19] },
];

/* ── Session highlight colors ── */
export const SESSION_HL_COLORS = [
  { border: "rgba(97,95,255,0.40)", label: "S1 · Onboarding" },
  { border: "rgba(109,212,160,0.35)", label: "S2 · Workflow" },
  { border: "rgba(255,209,102,0.35)", label: "S3 · Collaboration" },
  { border: "rgba(255,128,128,0.30)", label: "S4 · Strategy" },
];

/* ── Session index lookup ── */
export function sessionOfIdx(idx: number): number {
  for (let s = 0; s < Q_SESSIONS.length; s++) {
    const [lo, hi] = Q_SESSIONS[s].range;
    if (idx >= lo && idx <= hi) return s;
  }
  return -1;
}
