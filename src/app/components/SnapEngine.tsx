/**
 * SnapEngine — Snap-to-grid alignment system.
 *
 * Provides edge snapping between draggable panels. When a panel moves
 * within SNAP_DIST of another panel's edge, it snaps to align.
 *
 * Exports:
 *  - PRect       — Rectangle type {x, y, w, h}
 *  - SnapLine    — Visual guide line for rendering
 *  - computeSnap — Calculate snap offset + guide lines
 *  - SnapGuides  — Renders visual alignment guides
 */
import React from "react";
import { G, SNAP_DIST, C } from "./constants";

/* ── Types ── */
export interface PRect { x: number; y: number; w: number; h: number }
export interface SnapLine { axis: "h" | "v"; pos: number; from: number; to: number }

/* ── Snap Computation ── */
export function computeSnap(dragged: PRect, targets: PRect[]): { dx: number; dy: number; lines: SnapLine[] } {
  let bestDx = Infinity, bestDy = Infinity;
  const xHits: { delta: number; lineX: number; t: PRect }[] = [];
  const yHits: { delta: number; lineY: number; t: PRect }[] = [];
  const dL = dragged.x, dR = dragged.x + dragged.w, dCx = dragged.x + dragged.w / 2;
  const dT = dragged.y, dB = dragged.y + dragged.h, dCy = dragged.y + dragged.h / 2;

  for (const t of targets) {
    const tL = t.x, tR = t.x + t.w, tCx = t.x + t.w / 2;
    const tT = t.y, tB = t.y + t.h, tCy = t.y + t.h / 2;
    const xs = [
      { delta: tL - dL, lineX: tL }, { delta: tR - dR, lineX: tR },
      { delta: tR + G - dL, lineX: tR }, { delta: tL - G - dR, lineX: tL },
      { delta: tCx - dCx, lineX: tCx },
    ];
    const ys = [
      { delta: tT - dT, lineY: tT }, { delta: tB - dB, lineY: tB },
      { delta: tB + G - dT, lineY: tB }, { delta: tT - G - dB, lineY: tT },
      { delta: tCy - dCy, lineY: tCy },
    ];
    for (const s of xs) {
      if (Math.abs(s.delta) < SNAP_DIST) { xHits.push({ ...s, t }); if (Math.abs(s.delta) < Math.abs(bestDx)) bestDx = s.delta; }
    }
    for (const s of ys) {
      if (Math.abs(s.delta) < SNAP_DIST) { yHits.push({ ...s, t }); if (Math.abs(s.delta) < Math.abs(bestDy)) bestDy = s.delta; }
    }
  }

  const dx = Math.abs(bestDx) < SNAP_DIST ? bestDx : 0;
  const dy = Math.abs(bestDy) < SNAP_DIST ? bestDy : 0;
  const lines: SnapLine[] = [];
  if (dx !== 0) for (const h of xHits) { if (Math.abs(h.delta - dx) < 0.5) { const ay = [dragged.y + dy, dragged.y + dy + dragged.h, h.t.y, h.t.y + h.t.h]; lines.push({ axis: "v", pos: h.lineX, from: Math.min(...ay) - 14, to: Math.max(...ay) + 14 }); } }
  if (dy !== 0) for (const h of yHits) { if (Math.abs(h.delta - dy) < 0.5) { const ax = [dragged.x + dx, dragged.x + dx + dragged.w, h.t.x, h.t.x + h.t.w]; lines.push({ axis: "h", pos: h.lineY, from: Math.min(...ax) - 14, to: Math.max(...ax) + 14 }); } }
  return { dx, dy, lines };
}

/* ── Snap Guide Overlay ── */
export function SnapGuides({ lines }: { lines: SnapLine[] }) {
  if (!lines.length) return null;
  return (
    <div className="absolute inset-0 z-[52] pointer-events-none">
      {lines.map((l, i) => l.axis === "v" ? (
        <div key={i} className="absolute" style={{ left: l.pos - 0.5, top: l.from, width: 1, height: l.to - l.from, background: `linear-gradient(180deg, transparent, ${C.accent}90, transparent)` }}>
          <div className="absolute -top-1 -left-[2.5px] size-[6px] rounded-full" style={{ background: C.accent, opacity: 0.7 }} />
          <div className="absolute -bottom-1 -left-[2.5px] size-[6px] rounded-full" style={{ background: C.accent, opacity: 0.7 }} />
        </div>
      ) : (
        <div key={i} className="absolute" style={{ left: l.from, top: l.pos - 0.5, width: l.to - l.from, height: 1, background: `linear-gradient(90deg, transparent, ${C.accent}90, transparent)` }}>
          <div className="absolute -left-1 -top-[2.5px] size-[6px] rounded-full" style={{ background: C.accent, opacity: 0.7 }} />
          <div className="absolute -right-1 -top-[2.5px] size-[6px] rounded-full" style={{ background: C.accent, opacity: 0.7 }} />
        </div>
      ))}
    </div>
  );
}