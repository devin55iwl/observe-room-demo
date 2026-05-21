/**
 * hooks.ts — Shared React hooks.
 *
 * Exports:
 *  - useClock()        — Elapsed session timer (updates every second)
 *  - GlassTintCtx      — Context providing background luminance (0–1)
 *  - useGlassTint()    — Consumer hook for glass tint context
 *  - useAdaptiveGlass() — Derives surface/card/cardGlow styles from tint
 *  - useSnapDrag()     — Pointer-drag hook with snap-to-grid alignment
 */
import { useState, useEffect, useContext, useMemo, useCallback, useRef, createContext } from "react";
import type { CSSProperties, PointerEvent as RPointerEvent } from "react";
import { useMotionValue, animate as motionAnimate } from "motion/react";
import { surfaceStyle, cardStyle, cardGlowStyle, tintedBg, spring } from "./constants";
import { computeSnap } from "./SnapEngine";
import type { PRect, SnapLine } from "./SnapEngine";

/* ── Clock Hook ── */
export function useClock() {
  const [elapsed, setElapsed] = useState(0);
  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  };
  useEffect(() => {
    const id = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(id);
  }, []);
  return fmt(elapsed);
}

/* ── Glass Tint Context ── */
export const GlassTintCtx = createContext(0); // 0 = dark bg, 1 = very bright bg
export const useGlassTint = () => useContext(GlassTintCtx);

/* ── Adaptive Glass Hook ── */
export function useAdaptiveGlass() {
  const t = useGlassTint();
  return useMemo(() => ({
    surface: { ...surfaceStyle, background: tintedBg(t, 0.03) } as CSSProperties,
    card: { ...cardStyle, background: tintedBg(t, 0.02) } as CSSProperties,
    cardGlow: { ...cardGlowStyle, background: tintedBg(t, 0.025) } as CSSProperties,
  }), [t]);
}

/* ── Snap-Drag Hook ── */
export function useSnapDrag(
  snapId: string,
  panelRectsRef?: React.MutableRefObject<Record<string, PRect>>,
  onSnapLines?: (lines: SnapLine[]) => void,
) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const didDrag = useRef(false);
  const captured = useRef(false);
  const pointerId = useRef<number | null>(null);
  const startPointer = useRef({ x: 0, y: 0 });
  const startOffset = useRef({ x: 0, y: 0 });
  const baseRect = useRef<{ left: number; top: number; width: number; height: number } | null>(null);

  useEffect(() => {
    return () => { if (panelRectsRef) delete panelRectsRef.current[snapId]; };
  }, [panelRectsRef, snapId]);

  const captureBase = useCallback(() => {
    if (!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    baseRect.current = { left: r.left - x.get(), top: r.top - y.get(), width: r.width, height: r.height };
  }, [x, y]);

  const onPointerDown = useCallback((e: RPointerEvent) => {
    dragging.current = true;
    didDrag.current = false;
    captured.current = false;
    pointerId.current = e.pointerId;
    startPointer.current = { x: e.clientX, y: e.clientY };
    startOffset.current = { x: x.get(), y: y.get() };
    captureBase();
  }, [x, y, captureBase]);

  const onPointerMove = useCallback((e: RPointerEvent) => {
    if (!dragging.current) return;
    const dx = e.clientX - startPointer.current.x;
    const dy = e.clientY - startPointer.current.y;
    if (!didDrag.current && Math.abs(dx) < 3 && Math.abs(dy) < 3) return;
    if (!didDrag.current) {
      didDrag.current = true;
      // Capture pointer only once drag threshold is exceeded
      if (pointerId.current !== null) {
        try {
          (e.currentTarget as HTMLElement).setPointerCapture(pointerId.current);
          captured.current = true;
        } catch { /* ignore */ }
      }
    }

    const rawX = startOffset.current.x + dx;
    const rawY = startOffset.current.y + dy;

    if (panelRectsRef && onSnapLines && baseRect.current) {
      const br = baseRect.current;
      const absX = br.left + rawX;
      const absY = br.top + rawY;
      const myRect: PRect = { x: absX, y: absY, w: br.width, h: br.height };
      const targets = Object.entries(panelRectsRef.current)
        .filter(([k]) => k !== snapId)
        .map(([, v]) => v);
      const snap = computeSnap(myRect, targets);
      x.set(rawX + snap.dx);
      y.set(rawY + snap.dy);
      panelRectsRef.current[snapId] = { x: absX + snap.dx, y: absY + snap.dy, w: br.width, h: br.height };
      onSnapLines(snap.lines);
    } else {
      x.set(rawX);
      y.set(rawY);
    }
  }, [panelRectsRef, onSnapLines, snapId, x, y]);

  const onPointerUp = useCallback((e: RPointerEvent) => {
    dragging.current = false;
    if (captured.current) {
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch { /* ignore */ }
      captured.current = false;
    }
    pointerId.current = null;
    if (onSnapLines) onSnapLines([]);
  }, [onSnapLines]);

  /** Animate back to origin (0, 0) — used by resetLayout */
  const reset = useCallback(() => {
    motionAnimate(x, 0, spring);
    motionAnimate(y, 0, spring);
    if (panelRectsRef) delete panelRectsRef.current[snapId];
    baseRect.current = null;
  }, [x, y, panelRectsRef, snapId]);

  return { x, y, containerRef, didDrag, reset, onPointerDown, onPointerMove, onPointerUp };
}