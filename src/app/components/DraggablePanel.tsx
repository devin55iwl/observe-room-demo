/**
 * DraggablePanel — Floating, resizable panel container.
 *
 * Each right-side panel (Profile, Check List, Insights, Transcript) and
 * the left Analysis panel is wrapped in this component. It provides:
 *  - Drag-to-detach via pointer events on the header
 *  - Double-click to re-dock to the right column
 *  - Vertical resize via bottom handle
 *  - Snap-to-grid alignment with other panels & PiP
 *  - Entry/exit animations (scale + fade)
 *  - Adaptive glass surface styling
 *
 * The panel header shows a 2×3 grip dot grid, panel icon + title,
 * optional minimize button, and close button.
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";
import { motion } from "motion/react";
import { useMotionValue, animate as motionAnimate } from "motion/react";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

import { X, GripVertical, Minus } from "lucide-react";
import { R, C, PANEL_MIN_H, PANEL_MAX_H, spring } from "./constants";
import { useAdaptiveGlass } from "./hooks";
import { PanelContentArea } from "./primitives";
import { computeSnap } from "./SnapEngine";
import type { PRect, SnapLine } from "./SnapEngine";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

export function DraggablePanel({ id, title, icon, onClose, children, meta,
  targetRect, panelRectsRef, onSnapLines,
  onDragStartNotify, onDragEndNotify, onRedock, onMinimize,
}: {
  id: string; title: string; icon: ReactNode; onClose: () => void; children: ReactNode;
  meta?: string; targetRect: PRect;
  panelRectsRef: React.MutableRefObject<Record<string, PRect>>;
  onSnapLines: (lines: SnapLine[]) => void;
  onDragStartNotify: () => void;
  onDragEndNotify: (x: number, y: number, h: number) => void;
  onRedock: () => void;
  onMinimize?: () => void;
}) {
  const { surface: adaptiveSurface } = useAdaptiveGlass();
  let themeTokens: any = null;
  try { themeTokens = useObserveTheme(); } catch {}
  const isLight = themeTokens?.mode === "light";
  const ot = themeTokens?.tokens;
  const posX = useMotionValue(targetRect.x);
  const posY = useMotionValue(targetRect.y);
  const [panelH, setPanelH] = useState(targetRect.h);
  const [panelW, setPanelW] = useState(targetRect.w);
  const [dragging, setDragging] = useState(false);
  const [resizing, setResizing] = useState(false);
  const [zIdx, setZIdx] = useState(50);
  const dragRef = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const resizeRef = useRef<{ y: number; h: number } | null>(null);
  const prevTarget = useRef(targetRect);

  useEffect(() => {
    panelRectsRef.current[id] = { x: posX.get(), y: posY.get(), w: panelW, h: panelH };
    return () => { delete panelRectsRef.current[id]; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (dragging) return;
    const tr = targetRect, pr = prevTarget.current;
    if (tr.x !== pr.x || tr.y !== pr.y) {
      motionAnimate(posX, tr.x, spring);
      motionAnimate(posY, tr.y, spring);
    }
    if (tr.h !== pr.h) setPanelH(tr.h);
    if (tr.w !== pr.w) setPanelW(tr.w);
    prevTarget.current = tr;
    panelRectsRef.current[id] = { x: tr.x, y: tr.y, w: tr.w, h: tr.h };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetRect.x, targetRect.y, targetRect.h, targetRect.w]);

  const onDragDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest("button")) return;
    e.preventDefault();
    dragRef.current = { mx: e.clientX, my: e.clientY, px: posX.get(), py: posY.get() };
    setDragging(true); setZIdx(55);
    onDragStartNotify();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [posX, posY, onDragStartNotify]);

  const onDragMove = useCallback((e: React.PointerEvent) => {
    if (!dragRef.current) return;
    const rawX = dragRef.current.px + (e.clientX - dragRef.current.mx);
    const rawY = dragRef.current.py + (e.clientY - dragRef.current.my);
    const myRect: PRect = { x: rawX, y: rawY, w: panelW, h: panelH };
    const targets = Object.entries(panelRectsRef.current).filter(([k]) => k !== id).map(([, v]) => v);
    const snap = computeSnap(myRect, targets);
    const fx = rawX + snap.dx, fy = rawY + snap.dy;
    posX.set(fx); posY.set(fy);
    panelRectsRef.current[id] = { x: fx, y: fy, w: panelW, h: panelH };
    onSnapLines(snap.lines);
  }, [id, panelW, panelH, panelRectsRef, posX, posY, onSnapLines]);

  const onDragUp = useCallback(() => {
    if (!dragRef.current) return;
    dragRef.current = null;
    setDragging(false); setZIdx(50);
    onSnapLines([]);
    onDragEndNotify(posX.get(), posY.get(), panelH);
  }, [onSnapLines, onDragEndNotify, posX, posY, panelH]);

  const onDblClick = useCallback(() => { onRedock(); }, [onRedock]);

  const onResDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault(); e.stopPropagation();
    resizeRef.current = { y: e.clientY, h: panelH };
    setResizing(true);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, [panelH]);
  const onResMove = useCallback((e: React.PointerEvent) => {
    if (!resizeRef.current) return;
    setPanelH(Math.min(PANEL_MAX_H, Math.max(PANEL_MIN_H, resizeRef.current.h + (e.clientY - resizeRef.current.y))));
  }, []);
  const onResUp = useCallback(() => { resizeRef.current = null; setResizing(false); }, []);

  return (
    <MotionDiv
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: dragging ? 1.012 : 1 }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={spring}
      className="absolute"
      style={{ left: posX, top: posY, width: panelW, height: panelH, zIndex: zIdx }}
    >
      <div className="flex flex-col overflow-hidden w-full h-full transition-shadow duration-200"
        style={{
          ...(isLight && ot ? {
            ...ot.surfaceBlur,
            borderRadius: 24,
            background: ot.surfaceBg,
            borderWidth: 1, borderStyle: "solid", borderColor: ot.surfaceBorder,
            boxShadow: dragging
              ? "0 0 0 1.5px rgba(0,0,0,0.20), 0 24px 64px rgba(0,0,0,0.12), 0 8px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.70)"
              : ot.surfaceShadow,
          } : {
            ...adaptiveSurface,
            ...(dragging ? { boxShadow: "0 0 0 1.5px rgba(97,95,255,0.45), 0 24px 64px rgba(0,0,0,0.55), 0 8px 24px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.14)" } : {}),
          }),
        }}>
        {/* ── Drag header ── */}
        <div className={`flex items-center justify-between px-4 py-3 shrink-0 cursor-grab active:cursor-grabbing group/header transition-colors duration-150 ${isLight ? "hover:bg-black/[0.02]" : "hover:bg-white/[0.02]"}`}
          style={{ borderBottom: `0.5px solid ${dragging ? (isLight ? "rgba(0,0,0,0.12)" : "rgba(97,95,255,0.18)") : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)")}` }}
          onPointerDown={onDragDown} onPointerMove={onDragMove} onPointerUp={onDragUp} onPointerCancel={onDragUp}
          onDoubleClick={onDblClick}>
          <div className="flex items-center gap-2">
            {/* Grip dots — 2×3 grid */}
            <div className={`flex flex-col gap-[3px] shrink-0 transition-opacity duration-150 ${isLight ? "opacity-15 group-hover/header:opacity-35" : "opacity-20 group-hover/header:opacity-50"}`}
              style={dragging ? { opacity: 0.7 } : {}}>
              <div className="flex gap-[3px]">
                <div className="size-[3px] rounded-full" style={{ background: dragging ? (isLight ? "rgba(0,0,0,0.70)" : C.accent) : (isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.8)") }} />
                <div className="size-[3px] rounded-full" style={{ background: dragging ? (isLight ? "rgba(0,0,0,0.70)" : C.accent) : (isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.8)") }} />
              </div>
              <div className="flex gap-[3px]">
                <div className="size-[3px] rounded-full" style={{ background: dragging ? (isLight ? "rgba(0,0,0,0.70)" : C.accent) : (isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.8)") }} />
                <div className="size-[3px] rounded-full" style={{ background: dragging ? (isLight ? "rgba(0,0,0,0.70)" : C.accent) : (isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.8)") }} />
              </div>
              <div className="flex gap-[3px]">
                <div className="size-[3px] rounded-full" style={{ background: dragging ? (isLight ? "rgba(0,0,0,0.70)" : C.accent) : (isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.8)") }} />
                <div className="size-[3px] rounded-full" style={{ background: dragging ? (isLight ? "rgba(0,0,0,0.70)" : C.accent) : (isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.8)") }} />
              </div>
            </div>
            <span className={isLight ? "text-black/28 transition-colors duration-150 group-hover/header:text-black/45" : "text-white/28 transition-colors duration-150 group-hover/header:text-white/45"}
              style={dragging ? { color: isLight ? "rgba(0,0,0,0.70)" : C.accent, opacity: 0.7 } : {}}>{icon}</span>
            <span className={isLight ? "text-black/80" : "text-white/80"} style={{ fontSize: 15 }}>{title}</span>
            {meta && null}
          </div>
          <div className="flex items-center gap-1">
            {!dragging && (
              <span className={isLight ? "text-black/0 group-hover/header:text-black/18 transition-all duration-200 mr-1 select-none pointer-events-none" : "text-white/0 group-hover/header:text-white/18 transition-all duration-200 mr-1 select-none pointer-events-none"}
                style={{ fontSize: 9, letterSpacing: "0.04em" }}>
                drag
              </span>
            )}
            {dragging && (
              <span className="mr-1 select-none pointer-events-none"
                style={{ fontSize: 9, letterSpacing: "0.04em", color: isLight ? "rgba(0,0,0,0.30)" : "rgba(97,95,255,0.50)" }}>
                drop to place
              </span>
            )}
            {onMinimize && (
              <button onClick={onMinimize} className={`p-1.5 rounded-xl transition-colors cursor-pointer ${isLight ? "text-black/14 hover:text-black/50" : "text-white/14 hover:text-white/50"}`}><Minus size={14} /></button>
            )}
            <button onClick={onClose} className={`p-1.5 rounded-xl transition-colors cursor-pointer ${isLight ? "text-black/14 hover:text-black/50" : "text-white/14 hover:text-white/50"}`}><X size={14} /></button>
          </div>
        </div>
        <PanelContentArea>{children}</PanelContentArea>
        {/* ── Resize handle ── */}
        <div className="shrink-0 flex items-center justify-center group/resize relative" style={{ height: 16, cursor: "ns-resize" }}
          onPointerDown={onResDown} onPointerMove={onResMove} onPointerUp={onResUp} onPointerCancel={onResUp}>
          <div className="absolute inset-x-2 inset-y-0 rounded-b-lg opacity-0 group-hover/resize:opacity-100 transition-opacity duration-150"
            style={{ background: resizing ? (isLight ? "rgba(0,0,0,0.03)" : "rgba(97,95,255,0.04)") : (isLight ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.015)") }} />
          <div className={`relative transition-all duration-150 ${isLight ? "group-hover/resize:!bg-black/20" : "group-hover/resize:!bg-white/25"}`}
            style={{
              width: resizing ? 56 : 36,
              height: resizing ? 4 : 3,
              borderRadius: R.pill,
              background: resizing ? (isLight ? "rgba(0,0,0,0.50)" : C.accent) : (isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)"),
              boxShadow: resizing ? (isLight ? "0 0 8px rgba(0,0,0,0.10)" : `0 0 8px rgba(97,95,255,0.30)`) : "none",
            }} />
        </div>
      </div>
    </MotionDiv>
  );
}