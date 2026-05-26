import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;
const MotionSpan = motion.span;

import { MessageSquareText, ChevronUp, X, Sparkles } from "lucide-react";
import { T, R, C } from "./constants";
import { useAdaptiveGlass } from "./hooks";
import type { FollowUpQuestion } from "./data";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

/* ── Status dot colors ── */
const STATUS_COLOR: Record<string, string> = {
  pending: C.warning,
  asked: C.positive,
  failed: C.negative,
};
const STATUS_GLOW: Record<string, string> = {
  pending: "rgba(255,209,102,0.25)",
  asked: "rgba(109,212,160,0.20)",
  failed: "rgba(255,128,128,0.20)",
};

/* S1-2: Human-readable status descriptions for Research Ops role */
const STATUS_LABEL: Record<string, string> = {
  pending: "Queued — waiting for AI moderator to find a natural moment",
  asked:   "AI moderator asked this question",
  failed:  "Could not be delivered — conversation moved past the context",
};

/* ── Tiny note-slip for each follow-up ── */
function NoteSlip({ fq, index, onDismiss }: { fq: FollowUpQuestion; index: number; onDismiss?: (id: number) => void }) {
  const isDone = fq.status === "asked";
  const isFailed = fq.status === "failed";
  const [added, setAdded] = useState(false);
  const [dotHovered, setDotHovered] = useState(false);
  const isAIGenerated = fq.observer === "AI";
  let themeData: any = null;
  try { themeData = useObserveTheme(); } catch {}
  const isLight = themeData?.mode === "light";
  const ot = themeData?.tokens;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: 6, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -4, scale: 0.97 }}
      transition={{
        type: "spring", damping: 26, stiffness: 300,
        delay: index * 0.04,
      }}
      className="group/slip"
    >
      <div
        className="flex items-center gap-2.5 px-3 py-[7px] transition-all duration-200"
        style={{
          borderRadius: R.sm,
          background: isDone
            ? (isLight ? "rgba(0,0,0,0.01)" : "rgba(255,255,255,0.015)")
            : isFailed
              ? "rgba(255,128,128,0.04)"
              : (isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.03)"),
          border: `0.5px solid ${
            isDone
              ? (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)")
              : isFailed
                ? "rgba(255,128,128,0.08)"
                : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)")
          }`,
          boxShadow: isDone
            ? "none"
            : `inset 0 0.5px 0 ${isLight ? "rgba(255,255,255,0.40)" : "rgba(255,255,255,0.05)"}`,
        }}
      >
        {/* Status dot with glow + tooltip */}
        <div
          className="relative shrink-0"
          onMouseEnter={() => setDotHovered(true)}
          onMouseLeave={() => setDotHovered(false)}
        >
          <div
            className={`size-[5px] rounded-full ${fq.status === "pending" ? "animate-pulse" : ""}`}
            style={{ background: STATUS_COLOR[fq.status] }}
          />
          {fq.status === "pending" && (
            <div
              className="absolute rounded-full animate-pulse"
              style={{
                inset: -4,
                background: STATUS_GLOW[fq.status],
                filter: "blur(3px)",
                zIndex: 0,
                pointerEvents: "none",
              }}
            />
          )}
          {/* S1-2: Status tooltip */}
          {dotHovered && (
            <div style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              width: 200,
              zIndex: 80,
              background: isLight ? "rgba(255,255,255,0.92)" : "rgba(10,12,18,0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              borderRadius: R.sm,
              borderWidth: 0.5,
              borderStyle: "solid",
              borderColor: `${STATUS_COLOR[fq.status]}30`,
              padding: "6px 9px",
              boxShadow: isLight ? "0 6px 20px rgba(0,0,0,0.08)" : "0 6px 20px rgba(0,0,0,0.45)",
              pointerEvents: "none",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                <div style={{ width: 5, height: 5, borderRadius: "50%", background: STATUS_COLOR[fq.status], flexShrink: 0 }} />
                <span style={{
                  fontSize: T.micro,
                  color: STATUS_COLOR[fq.status],
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                }}>
                  {fq.status}
                </span>
              </div>
              <p style={{ fontSize: T.micro, color: isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)", lineHeight: 1.45, margin: 0 }}>
                {STATUS_LABEL[fq.status]}
              </p>
            </div>
          )}
        </div>

        {/* Text */}
        <span
          className={`flex-1 min-w-0 truncate transition-colors ${
            isDone
              ? (isLight ? "text-black/18 line-through decoration-black/8" : "text-white/18 line-through decoration-white/8")
              : isFailed
                ? (isLight ? "text-black/30" : "text-white/30")
                : (isLight ? "text-black/55" : "text-white/55")
          }`}
          style={{ fontSize: T.caption, lineHeight: 1.35 }}
        >
          {fq.text}
        </span>

        {/* Observer source tag */}
        <span
          style={{
            flexShrink: 0,
            fontSize: 8,
            letterSpacing: "0.03em",
            color: isAIGenerated
              ? (isLight ? "rgba(0,0,0,0.50)" : "rgba(97,95,255,0.55)")
              : (isLight ? "rgba(0,0,0,0.28)" : "rgba(255,255,255,0.28)"),
            background: isAIGenerated
              ? (isLight ? "rgba(0,0,0,0.05)" : "rgba(97,95,255,0.08)")
              : (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"),
            borderWidth: 0.5,
            borderStyle: "solid",
            borderColor: isAIGenerated
              ? (isLight ? "rgba(0,0,0,0.10)" : "rgba(97,95,255,0.16)")
              : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.07)"),
            borderRadius: 4,
            padding: "1px 5px",
            whiteSpace: "nowrap",
          }}
        >
          {isAIGenerated ? "AI" : "You"}
        </span>

        {/* Urgent indicator */}
        {fq.urgent && (
          <span
            className="shrink-0 uppercase tracking-[0.08em] px-1 py-px"
            style={{
              fontSize: 7,
              color: C.negative,
              background: "rgba(255,128,128,0.06)",
              borderRadius: 3,
              border: "0.5px solid rgba(255,128,128,0.10)",
            }}
          >
            urgent
          </span>
        )}

        {/* Time tag (only for asked items) */}
        {isDone && (
          <span
            className={`shrink-0 font-mono opacity-0 group-hover/slip:opacity-100 transition-opacity ${isLight ? "text-black/12" : "text-white/12"}`}
            style={{ fontSize: 8 }}
          >
            {fq.time}
          </span>
        )}

        {/* Add to guide */}
        <button
            onClick={() => setAdded(true)}
            className={`shrink-0 transition-all duration-200 cursor-pointer whitespace-nowrap ${
              added
                ? "opacity-100"
                : "opacity-0 group-hover/slip:opacity-100"
            }`}
            style={{
              fontSize: 9,
              letterSpacing: 0.02,
              color: added ? C.positive : (isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)"),
              background: added ? "rgba(109,212,160,0.08)" : (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"),
              border: `0.5px solid ${added ? "rgba(109,212,160,0.15)" : (isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)")}`,
              borderRadius: 4,
              padding: "2px 6px",
            }}
            onMouseEnter={e => { if (!added) { e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.08)"; e.currentTarget.style.color = isLight ? "rgba(0,0,0,0.60)" : "rgba(255,255,255,0.60)"; } }}
            onMouseLeave={e => { if (!added) { e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"; e.currentTarget.style.color = isLight ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.40)"; } }}
          >
            {added ? "✓ Added" : "+ Guide"}
          </button>

        {/* Dismiss button */}
        <button
          onClick={() => onDismiss?.(fq.id)}
          className="shrink-0 opacity-0 group-hover/slip:opacity-100 transition-all duration-200 cursor-pointer flex items-center justify-center"
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            background: "rgba(255,255,255,0.00)",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,128,128,0.12)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.00)"; }}
        >
          <X size={10} className={isLight ? "text-black/25 hover:text-red-400/70 transition-colors" : "text-white/25 hover:text-red-400/70 transition-colors"} />
        </button>
      </div>
    </MotionDiv>
  );
}

/* =============================================
   FollowUpBar — top-center glass bar
   ============================================= */
interface FollowUpBarProps {
  followUps: FollowUpQuestion[];
  onDismiss?: (id: number) => void;
}

export function FollowUpBar({ followUps, onDismiss }: FollowUpBarProps) {
  const total = followUps.length;
  const asked = followUps.filter(q => q.status === "asked").length;
  const pending = followUps.filter(q => q.status === "pending");
  const sortedPending = [...pending.filter(q => q.urgent), ...pending.filter(q => !q.urgent)];
  const nextPending = sortedPending[0] ?? null;
  const current = nextPending ?? followUps.find(q => q.status === "asked");

  if (total === 0) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.98 }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      className="relative"
      style={{
        width: 430,
        maxWidth: "42vw",
        borderRadius: 18,
        background: "rgba(7,12,22,0.58)",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 14px 42px rgba(0,0,0,0.26)",
        backdropFilter: "blur(30px) saturate(116%)",
        WebkitBackdropFilter: "blur(30px) saturate(116%)",
      }}
    >
      <div className="flex items-center gap-3 px-3.5 py-3 min-w-0">
        <div style={{ width: 7, height: 7, borderRadius: 99, background: current?.urgent ? C.negative : C.warning, boxShadow: `0 0 10px ${current?.urgent ? "rgba(255,128,128,0.35)" : "rgba(255,209,102,0.28)"}` }} />
        <div className="min-w-0 flex-1">
          <div style={{ fontSize: 9, letterSpacing: "0.13em", textTransform: "uppercase", color: "rgba(255,255,255,0.30)" }}>
            Current follow-up
          </div>
          <div className="truncate" style={{ marginTop: 2, fontSize: 12, color: "rgba(255,255,255,0.70)", lineHeight: 1.35 }}>
            {current?.text ?? "All follow-ups asked"}
          </div>
        </div>
        {current?.urgent && (
          <span style={{ fontSize: 8, letterSpacing: "0.08em", textTransform: "uppercase", color: C.negative, background: "rgba(255,128,128,0.08)", border: "1px solid rgba(255,128,128,0.16)", borderRadius: 5, padding: "2px 6px" }}>
            urgent
          </span>
        )}
        <span className="font-mono tabular-nums" style={{ fontSize: 11, color: "rgba(255,255,255,0.36)" }}>
          {asked}/{total}
        </span>
      </div>
    </MotionDiv>
  );
}
