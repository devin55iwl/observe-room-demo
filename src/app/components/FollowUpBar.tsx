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
  const [expanded, setExpanded] = useState(false);
  const { surface } = useAdaptiveGlass();
  let themeData: any = null;
  try { themeData = useObserveTheme(); } catch {}
  const isLight = themeData?.mode === "light";
  const ot = themeData?.tokens;

  /* Light mode surface override */
  const surfaceOverride = isLight && ot ? {
    ...ot.surfaceBlur,
    borderRadius: 24,
    background: ot.surfaceBg,
    borderWidth: 1, borderStyle: "solid" as const, borderColor: ot.surfaceBorder,
    boxShadow: ot.surfaceShadow,
  } : surface;

  /* ── Container-width breakpoint tracking ── */
  const headerRef = useRef<HTMLDivElement>(null);
  const [headerW, setHeaderW] = useState(9999);
  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => setHeaderW(entry.contentRect.width));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /*
   * Breakpoints (measured on the header row itself):
   *   compact  < 480px : hide progress track + "asked" label
   *   narrow   < 360px : hide divider + preview area + progress entirely
   *   mini     < 260px : hide "Follow-ups" text, keep icon + badge + chevron
   */
  const compact = headerW < 480;
  const narrow  = headerW < 360;
  const mini    = headerW < 260;

  const total = followUps.length;
  const asked = followUps.filter(q => q.status === "asked").length;
  const pending = followUps.filter(q => q.status === "pending");
  const progress = total > 0 ? (asked / total) * 100 : 0;
  /* nextPending: urgent first */
  const sortedPending = [...pending.filter(q => q.urgent), ...pending.filter(q => !q.urgent)];
  const nextPending = sortedPending[0] ?? null;

  if (total === 0) return null;

  return (
    <MotionDiv
      initial={{ opacity: 0, y: -16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -16, scale: 0.97 }}
      transition={{ type: "spring", damping: 26, stiffness: 220 }}
      className="relative flex flex-col"
      style={surfaceOverride}
    >
      {/* ── Header row ── */}
      <div
        ref={headerRef}
        className="relative flex items-center px-4 shrink-0 w-full min-w-0"
        style={{ height: 51 }}
      >
        {/* Left cluster: icon + title + S1-2 AI queue badge */}
        <div className="flex items-center gap-2 shrink-0">
          <MessageSquareText size={14} strokeWidth={1.4} className={isLight ? "text-black/28 shrink-0" : "text-white/28 shrink-0"} />

          {/* "Follow-ups" label — hidden at mini */}
          {!mini && (
            <span
              className={isLight ? "text-black/80 whitespace-nowrap" : "text-white/80 whitespace-nowrap"}
              style={{ fontSize: T.title, letterSpacing: -0.46 }}
            >
              Follow-ups
            </span>
          )}

          {/* S1-2: AI queue badge */}
          {!mini && (
            <div style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "2px 7px",
              borderRadius: 10,
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(97,95,255,0.08)",
              borderWidth: 0.5, borderStyle: "solid",
              borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(97,95,255,0.18)",
              flexShrink: 0,
            }}>
              <Sparkles size={8} style={{ color: isLight ? "rgba(0,0,0,0.45)" : "rgba(97,95,255,0.70)" }} />
              <span style={{
                fontSize: 8,
                color: isLight ? "rgba(0,0,0,0.40)" : "rgba(97,95,255,0.60)",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}>
                → AI Moderator
              </span>
            </div>
          )}

          {/* Pending count badge — visible when collapsed & there are pending items */}
          <AnimatePresence>
            {!expanded && pending.length > 0 && (
              <MotionDiv
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: "spring", damping: 22, stiffness: 340 }}
                className="flex items-center justify-center shrink-0"
                style={{
                  minWidth: 18,
                  height: 18,
                  borderRadius: 9999,
                  background: C.warning,
                  boxShadow: `0 0 8px rgba(255,209,102,0.35), 0 1px 3px rgba(0,0,0,0.30)`,
                  fontSize: 10,
                  color: "rgba(0,0,0,0.75)",
                  padding: "0 5px",
                  lineHeight: 1,
                }}
              >
                {pending.length}
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* Divider — hidden at narrow */}
        {!narrow && (
          <div
            className="shrink-0 mx-3.5"
            style={{ width: 0.5, height: 18, background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)", borderRadius: 1 }}
          />
        )}

        {/* ── Inline next-pending preview — hidden at narrow ── */}
        {!narrow && (
          <div className="flex-1 min-w-0 overflow-hidden">
            <AnimatePresence mode="wait">
              {nextPending ? (
                <MotionDiv
                  key={nextPending.id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ type: "spring", damping: 24, stiffness: 300 }}
                  className="flex items-center gap-2.5"
                >
                  {/* Pulsing dot */}
                  <div className="relative shrink-0">
                    <div
                      className="size-[5px] rounded-full animate-pulse"
                      style={{ background: STATUS_COLOR.pending, boxShadow: `0 0 6px 2px ${STATUS_GLOW.pending}` }}
                    />
                  </div>

                  {/* Question text */}
                  <span
                    className={`truncate min-w-0 ${isLight ? "text-black/55" : "text-white/55"}`}
                    style={{ fontSize: 11, lineHeight: 1.35, letterSpacing: 0.06 }}
                  >
                    {nextPending.text}
                  </span>

                  {/* Urgent badge */}
                  {nextPending.urgent && (
                    <span
                      className="shrink-0 uppercase px-1 py-px"
                      style={{
                        fontSize: 7,
                        letterSpacing: 0.79,
                        color: C.negative,
                        background: "rgba(255,128,128,0.06)",
                        borderRadius: 3,
                        border: "0.5px solid rgba(255,128,128,0.10)",
                      }}
                    >
                      urgent
                    </span>
                  )}
                </MotionDiv>
              ) : (
                <MotionSpan
                  key="__empty__"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="text-white/16 italic"
                  style={{ fontSize: T.caption }}
                >
                  All questions asked
                </MotionSpan>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Flex spacer when preview is hidden so right cluster stays right */}
        {narrow && <div style={{ flex: 1 }} />}

        {/* Right cluster: progress + counter + chevron */}
        <div className="flex items-center gap-3.5 shrink-0 ml-2">
          {/* Progress track — hidden at compact */}
          {!compact && (
            <div className="flex items-center gap-4">
              <div
                className="relative overflow-hidden"
                style={{
                  width: 81, height: 4,
                  borderRadius: 9999,
                  background: "rgba(255,255,255,0.06)",
                  boxShadow: "inset 0 0.5px 1px rgba(0,0,0,0.15)",
                }}
              >
                <MotionDiv
                  animate={{ width: `${progress}%` }}
                  transition={{ type: "spring", damping: 20, stiffness: 180 }}
                  className="absolute inset-y-0 left-0"
                  style={{
                    borderRadius: 9999,
                    background: `linear-gradient(90deg, ${C.positive}, rgba(109,212,160,0.7))`,
                    boxShadow: `0 0 8px ${STATUS_GLOW.asked}`,
                  }}
                />
              </div>

              {/* Counter — highlight asked count */}
              <span
                className="font-mono tabular-nums whitespace-nowrap"
                style={{ fontSize: T.caption }}
              >
                <span style={{ color: "rgba(255,255,255,0.65)" }}>{asked}</span>
                <span style={{ color: "rgba(255,255,255,0.20)" }}>/{total}</span>
                <span style={{ color: "rgba(255,255,255,0.30)", marginLeft: 3 }}>asked</span>
              </span>
            </div>
          )}

          {/* Compact counter — numbers only, no progress bar, no "asked" label */}
          {compact && !mini && (
            <span className="font-mono tabular-nums whitespace-nowrap" style={{ fontSize: T.caption }}>
              <span style={{ color: "rgba(255,255,255,0.65)" }}>{asked}</span>
              <span style={{ color: "rgba(255,255,255,0.20)" }}>/{total}</span>
            </span>
          )}

          {/* Collapse / expand chevron — always visible */}
          <button
            onClick={() => setExpanded(v => !v)}
            className="group/chev flex items-center justify-center cursor-pointer transition-colors shrink-0"
            style={{ borderRadius: 8, width: 24, height: 24, background: "rgba(255,255,255,0.00)" }}
            onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.00)"; }}
          >
            <MotionDiv
              animate={{ rotate: expanded ? 0 : 180 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
            >
              <ChevronUp size={13} className="text-white/25 group-hover/chev:text-white/50 transition-colors" />
            </MotionDiv>
          </button>
        </div>
      </div>

      {/* ── Expandable content area ── */}
      <AnimatePresence initial={false}>
        {expanded && (
          <MotionDiv
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="overflow-hidden"
          >
            {/* Separator line */}
            <div
              className="mx-0"
              style={{ height: 0.5, background: "rgba(255,255,255,0.06)" }}
            />
            <div className="px-4 pt-3 pb-3">
              <div className="flex flex-col gap-1.5">
                <AnimatePresence>
                  {/* Sorted: urgent pending → normal pending → asked/failed */}
                  {[
                    ...pending.filter(q => q.urgent),
                    ...pending.filter(q => !q.urgent),
                    ...followUps.filter(q => q.status !== "pending"),
                  ].map((fq, i) => (
                    <NoteSlip key={fq.id} fq={fq} index={i} onDismiss={onDismiss} />
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </MotionDiv>
  );
}