/**
 * PiPView — Picture-in-Picture floating video window.
 *
 * Displays the AI moderator / participant camera feed in a draggable
 * thumbnail. Click to swap the main background feed; drag near the
 * right edge to dock it into the right-panel stack.
 *
 * Key behaviours:
 *  - Pointer-drag with snap-to-grid alignment (via SnapEngine).
 *  - Click (without drag) toggles `pipSwapped` (main ↔ PiP feed swap).
 *  - Releasing near the right panel column auto-docks the PiP.
 *  - Audio waveform bars animate continuously to indicate live audio.
 */
import React, { useRef, useCallback } from "react";
import { motion, AnimatePresence, animate as motionAnimate } from "motion/react";
import type { MotionValue } from "motion/react";
import { ArrowUpDown } from "lucide-react";
import { R, C, T, spring } from "./constants";
import { computeSnap } from "./SnapEngine";
import type { PRect, SnapLine } from "./SnapEngine";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;
const MotionImg = motion.img;

/* ── Props ── */
export interface PiPViewProps {
  /** Motion values controlling position & size (shared with App orchestrator) */
  pipX: MotionValue<number>;
  pipY: MotionValue<number>;
  pipW: MotionValue<number>;
  pipH: MotionValue<number>;

  /** Natural (un-docked) dimensions */
  PIP_W: number;
  PIP_H: number;

  /** Snap system ID used in panelRectsRef */
  PIP_ID: string;

  /** Images */
  imgInterviewee: string;
  imgCookiyAI: string;

  /** Swap state — which feed is shown in PiP vs main background */
  pipSwapped: boolean;
  setPipSwapped: React.Dispatch<React.SetStateAction<boolean>>;

  /** Docked-to-right state */
  pipDockedRight: boolean;
  setPipDockedRight: React.Dispatch<React.SetStateAction<boolean>>;

  /** Drag state — true while pointer is held on PiP */
  aiModDragging: boolean;
  setAiModDragging: React.Dispatch<React.SetStateAction<boolean>>;

  /** Shared panel rects used for snap alignment */
  panelRectsRef: React.MutableRefObject<Record<string, PRect>>;
  setSnapLines: (lines: SnapLine[]) => void;
  setPanelsMoved: React.Dispatch<React.SetStateAction<boolean>>;

  /** Right-panel dock threshold offset (G + NAV_W + G) */
  rightOffset: number;
  PANEL_W: number;

  /** Adaptive glass surface style for the container */
  surfaceStyle: React.CSSProperties;
}

export function PiPView({
  pipX, pipY, pipW, pipH,
  PIP_W, PIP_H, PIP_ID,
  imgInterviewee, imgCookiyAI,
  pipSwapped, setPipSwapped,
  pipDockedRight, setPipDockedRight,
  aiModDragging, setAiModDragging,
  panelRectsRef, setSnapLines, setPanelsMoved,
  rightOffset, PANEL_W,
  surfaceStyle,
}: PiPViewProps) {
  const pipDragRef = useRef<{ mx: number; my: number; px: number; py: number } | null>(null);
  const pipWasDrag = useRef(false);

  /* ── Pointer handlers ── */
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    pipDragRef.current = { mx: e.clientX, my: e.clientY, px: pipX.get(), py: pipY.get() };
    pipWasDrag.current = false;
    setAiModDragging(true);
    if (pipDockedRight) {
      setPipDockedRight(false);
      motionAnimate(pipW, PIP_W, spring);
      motionAnimate(pipH, PIP_H, spring);
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, [pipX, pipY, pipW, pipH, PIP_W, PIP_H, pipDockedRight, setAiModDragging, setPipDockedRight]);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!pipDragRef.current) return;
    const dx = e.clientX - pipDragRef.current.mx;
    const dy = e.clientY - pipDragRef.current.my;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) pipWasDrag.current = true;
    const rawX = pipDragRef.current.px + dx;
    const rawY = pipDragRef.current.py + dy;
    const curW = pipW.get(), curH = pipH.get();
    const myRect: PRect = { x: rawX, y: rawY, w: curW, h: curH };
    const targets = Object.entries(panelRectsRef.current)
      .filter(([k]) => k !== PIP_ID)
      .map(([, v]) => v);
    const snap = computeSnap(myRect, targets);
    const fx = rawX + snap.dx, fy = rawY + snap.dy;
    pipX.set(fx);
    pipY.set(fy);
    panelRectsRef.current[PIP_ID] = { x: fx, y: fy, w: curW, h: curH };
    setSnapLines(snap.lines);
  }, [pipX, pipY, pipW, pipH, PIP_ID, panelRectsRef, setSnapLines]);

  const onPointerUp = useCallback(() => {
    if (!pipDragRef.current) return;
    const wasDrag = pipWasDrag.current;
    pipDragRef.current = null;
    setAiModDragging(false);
    setSnapLines([]);
    if (!wasDrag) {
      setPipSwapped(s => !s);
    } else {
      const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
      const dockThreshold = vw - rightOffset - PANEL_W - 80;
      if (pipX.get() > dockThreshold) {
        setPipDockedRight(true);
      }
      setPanelsMoved(true);
    }
  }, [pipX, setAiModDragging, setSnapLines, setPipSwapped, setPipDockedRight, setPanelsMoved, rightOffset, PANEL_W]);

  const onPointerCancel = useCallback(() => {
    pipDragRef.current = null;
    setAiModDragging(false);
    setSnapLines([]);
  }, [setAiModDragging, setSnapLines]);

  return (
    <MotionDiv
      className="absolute z-10"
      style={{
        left: pipX, top: pipY, width: pipW, height: pipH,
        zIndex: aiModDragging ? 55 : 10,
      }}
      animate={{ scale: aiModDragging ? 1.02 : 1 }}
      transition={spring}
    >
      <div
        className="overflow-hidden relative group/pip w-full h-full transition-shadow duration-200"
        style={{
          ...surfaceStyle, padding: 0,
          cursor: aiModDragging ? "grabbing" : "pointer",
          boxShadow: aiModDragging
            ? "0 0 0 1.5px rgba(97,95,255,0.35), 0 24px 64px rgba(0,0,0,0.50), 0 8px 24px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.12)"
            : (surfaceStyle.boxShadow as string),
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerCancel}
      >
        {/* Both feeds stacked — crossfade */}
        <MotionImg src={imgCookiyAI} alt="" className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: pipSwapped ? 0 : 1 }} transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} />
        <MotionImg src={imgInterviewee} alt="" className="absolute inset-0 w-full h-full object-cover"
          animate={{ opacity: pipSwapped ? 1 : 0 }} transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }} />

        {/* Bottom gradient scrim */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
          style={{ height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)" }} />

        {/* Top edge inner shine */}
        <div className="absolute inset-x-0 top-0 pointer-events-none z-[1]"
          style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent)" }} />

        {/* LIVE indicator — top-left */}
        <div className="absolute top-3 left-3 z-20 flex items-center gap-1.5 px-2 py-[3px]"
          style={{ borderRadius: R.pill, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="relative">
            <div className="size-[5px] rounded-full bg-red-500" />
            <div className="absolute inset-0 size-[5px] rounded-full bg-red-500 animate-ping" style={{ animationDuration: "1.8s" }} />
          </div>
          <span className="uppercase tracking-[0.1em] text-white/60" style={{ fontSize: 7 }}>Live</span>
        </div>

        {/* Connection quality — top-right */}
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 px-2 py-[3px]"
          style={{ borderRadius: R.pill, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "0.5px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-end gap-[2px]" style={{ height: 8 }}>
            {[3, 5, 7, 8].map((h, i) => (
              <div key={i} className="rounded-[0.5px]" style={{ width: 2, height: h, background: i < 3 ? C.positive : "rgba(109,212,160,0.35)" }} />
            ))}
          </div>
          <span className="text-white/35 font-mono" style={{ fontSize: 7 }}>HD</span>
        </div>

        {/* Audio waveform bars */}
        <div className="absolute bottom-[18px] z-20 flex items-end gap-[2px]" style={{ right: 56, height: 10 }}>
          {[0, 0.12, 0.24, 0.36, 0.48].map((delay, i) => (
            <MotionDiv key={i} className="rounded-full"
              style={{ width: 2, background: pipSwapped ? C.positive : C.accent, opacity: 0.55 }}
              animate={{ height: [3, 8, 4, 10, 3] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }} />
          ))}
        </div>

        {/* Hover overlay — swap hint */}
        <div className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/pip:opacity-100 transition-opacity duration-200"
          style={{ background: "rgba(0,0,0,0.25)", backdropFilter: "blur(2px)" }}>
          <MotionDiv className="flex items-center gap-2 px-3 py-1.5"
            style={{ borderRadius: R.pill, background: "rgba(255,255,255,0.10)", borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.15)" }}
            initial={false} whileHover={{ background: "rgba(255,255,255,0.16)" }}>
            <ArrowUpDown size={11} className="text-white/70" />
            <span className="text-white/70" style={{ fontSize: T.micro }}>Switch</span>
          </MotionDiv>
        </div>

        {/* Name badge */}
        <AnimatePresence mode="wait">
          <MotionDiv
            key={pipSwapped ? "pip-interviewee" : "pip-ai"}
            initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.25, delay: 0.1 }}
            className="absolute bottom-3.5 left-3.5 z-20 px-2.5 py-1 flex items-center gap-2"
            style={{ borderRadius: R.sm, background: "rgba(0,0,0,0.50)", backdropFilter: "blur(12px)", borderWidth: 0.5, borderStyle: "solid", borderColor: pipSwapped ? "rgba(255,255,255,0.08)" : "rgba(97,95,255,0.15)" }}
          >
            {pipSwapped ? (
              <span className="flex items-center gap-2">
                <div className="size-[6px] rounded-full" style={{ background: C.positive }} />
                <span className="text-white/70" style={{ fontSize: T.micro }}>Participant</span>
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <div className="size-[6px] rounded-full animate-pulse" style={{ background: C.accent }} />
                <span className="text-white/70" style={{ fontSize: T.micro }}>Cookiy AI</span>
                <span style={{ fontSize: T.micro, color: "rgba(255,255,255,0.28)" }}>&#183; AI Moderator</span>
              </span>
            )}
          </MotionDiv>
        </AnimatePresence>

        {/* Engine version tag */}
        <MotionDiv
          className="absolute bottom-3.5 right-3.5 px-2 py-0.5 font-mono z-20"
          style={{ fontSize: 7, borderRadius: R.sm, background: "rgba(0,0,0,0.35)", backdropFilter: "blur(8px)", border: "0.5px solid rgba(255,255,255,0.04)", color: "rgba(255,255,255,0.18)" }}
          animate={{ opacity: pipSwapped ? 0 : 0.6 }}
          transition={{ duration: 0.3 }}
        >
          Engine v2.5.1
        </MotionDiv>
      </div>
    </MotionDiv>
  );
}
