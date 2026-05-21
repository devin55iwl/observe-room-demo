/**
 * CheckListContent — Interview question checklist with 4-state adaptive layout.
 *
 * Adapts its layout based on CompactCtx level:
 *  - Full (0):     Progress bar + list/grid toggle + AI follow-up suggestions + input
 *  - Half (1):     In-progress header + follow-up/viz toggle + input
 *  - Compact (2):  5×4 tile matrix with session hover highlights
 *  - Minimal (3):  10-col mini matrix with click-to-expand session popups
 *
 * Each question tile shows engagement quality (high/mid/low), behavioral signal
 * icons, and reveals a rich tooltip on hover with engagement level, detected
 * signals, and key moments.
 */
import React, { useState, useRef, useLayoutEffect } from "react";
import ReactDOM from "react-dom";
import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, Circle, Send, RefreshCw, Star, AlertTriangle, BarChart3, List, ChevronRight, ChevronDown, Clock, Zap, Grid3X3, MessageSquare, X, SkipForward } from "lucide-react";
import { R, C, T } from "../constants";
import { SESSIONS, AI_FOLLOWUPS } from "../data";
import type { SessionQuestion } from "../data";
import { useCompact } from "../primitives";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

/* ── Shared tile utilities (extracted to reduce duplication) ── */
import {
  deriveQuality, deriveSignalIcons, tileBg as tileBgFn, engColorAlpha,
  QUALITY_LABEL, QUALITY_LABEL_COLOR,
  BAR_FILLED, BAR_GLOW, BAR_EMPTY, BAR_COUNT,
  SIGNAL_ICON_MAP, Q_SESSIONS, SESSION_HL_COLORS,
  sessionOfIdx,
} from "./checklist/tile-utils";
import type { QSession, SignalIcon } from "./checklist/tile-utils";
import type { QualityLevel } from "../types";

/* Tile background colors per quality (chart view — slightly different from grid tiles) */
const TILE_BG: Record<QualityLevel, string> = {
  high: "rgba(109,212,160,0.85)",
  mid:  "#ffd166",
  low:  "rgba(255,128,128,0.5)",
};
const TILE_GLOW: Record<QualityLevel, string> = {
  high: "0px 0px 4px 0px rgba(109,212,160,0.85)",
  mid:  "0px 0px 4px 0px rgba(255,209,102,0.85)",
  low:  "0px 0px 4px 0px rgba(255,128,128,0.5)",
};

/* ══════════════════════════════════════════════
   ── Shared Portal Tooltip ──
   ══════════════════════════════════════════════ */
function PortalTooltip({
  anchorRef, visible, flipDown, width, children, placement = "vertical",
}: {
  anchorRef: React.RefObject<HTMLElement | null>;
  visible: boolean; flipDown: boolean; width?: number;
  children: React.ReactNode;
  placement?: "vertical" | "right";
}) {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [actualPlacement, setActualPlacement] = useState<"above" | "below" | "right">("above");
  useLayoutEffect(() => {
    if (!visible || !anchorRef.current) return;
    const rect = anchorRef.current.getBoundingClientRect();
    const w = width ?? 240;
    if (placement === "right") {
      const rightFits = rect.right + 10 + w < window.innerWidth;
      const leftPos = rightFits ? rect.right + 10 : rect.left - w - 10;
      setPos({ top: rect.top + rect.height / 2, left: leftPos });
      setActualPlacement("right");
    } else {
      if (flipDown) { setPos({ top: rect.bottom + 6, left: rect.left }); setActualPlacement("below"); }
      else { setPos({ top: rect.top - 6, left: rect.left }); setActualPlacement("above"); }
    }
  }, [visible, flipDown, anchorRef, placement, width]);

  const animDir = actualPlacement === "right" ? { x: -6 } : actualPlacement === "below" ? { y: -4 } : { y: 4 };
  const animDirZero = actualPlacement === "right" ? { x: 0 } : { y: 0 };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {visible && (
        <MotionDiv
          initial={{ opacity: 0, ...animDir }}
          animate={{ opacity: 1, ...animDirZero }}
          exit={{ opacity: 0, ...animDir }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          className="fixed z-[9999] pointer-events-none"
          style={{
            left: pos.left,
            ...(actualPlacement === "above"
              ? { top: pos.top, transform: "translateY(-100%)" }
              : actualPlacement === "right"
                ? { top: pos.top, transform: "translateY(-50%)" }
                : { top: pos.top }),
            width: width ?? anchorRef.current?.getBoundingClientRect().width ?? 280,
          }}
        >
          <div style={{
            background: "rgba(14,14,20,0.96)",
            borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.10)",
            borderRadius: R.lg,
            padding: "10px 12px",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 0 0.5px rgba(255,255,255,0.04) inset",
            minWidth: 200,
          }}>
            {children}
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>,
    document.body
  );
}

/* ═════════════════════════════════════════════
   ── Tooltip Content ──
   ══════════════════════════════════════════════ */
function TooltipContent({ q, label, quality, keyMomentSignal }: {
  q: SessionQuestion; label: string; quality: QualityLevel;
  keyMomentSignal: any;
}) {
  return (
    <div>
      <div className="text-white/70 mb-2" style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
      <div className="mb-2">
        <span className="text-white/25 uppercase tracking-[0.08em]" style={{ fontSize: 7 }}>Engagement</span>
        <div className="mt-0.5">
          <span style={{ fontSize: 10, fontWeight: 600, color: QUALITY_LABEL_COLOR[quality] }}>{QUALITY_LABEL[quality]}</span>
        </div>
      </div>
      {q.signals && q.signals.length > 0 && (
        <div className="mb-2">
          <span className="text-white/25 uppercase tracking-[0.08em]" style={{ fontSize: 7 }}>Signals (cues)</span>
          <div className="flex flex-col gap-0.5 mt-1">
            {q.signals.map((sig: any, si: number) => {
              const mapped = SIGNAL_ICON_MAP[sig.icon] ?? { label: sig.label, color: "rgba(255,255,255,0.5)" };
              const isEmotion = sig.icon === "emotion" || sig.icon === "agreement";
              return (
                <div key={si} className="flex items-center gap-1.5">
                  {isEmotion ? <Star size={7} style={{ color: mapped.color, fill: mapped.color }} /> : <AlertTriangle size={7} style={{ color: mapped.color }} />}
                  <span className="text-white/40" style={{ fontSize: 9 }}>{mapped.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {keyMomentSignal && (
        <div>
          <span className="text-white/25 uppercase tracking-[0.08em]" style={{ fontSize: 7 }}>Key moments</span>
          <p className="text-white/35 mt-0.5" style={{ fontSize: 9, lineHeight: 1.5 }}>{keyMomentSignal.detail}</p>
        </div>
      )}
      {(!q.signals || q.signals.length === 0) && q.summary && (
        <div>
          <span className="text-white/25 uppercase tracking-[0.08em]" style={{ fontSize: 7 }}>Summary</span>
          <p className="text-white/35 mt-0.5" style={{ fontSize: 9, lineHeight: 1.5 }}>{q.summary}</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════���══════
   ── Pending / Active Tooltip Content ──
   ═══════���══════════════════════════════════════ */
function PendingTooltipContent({ q, label, isActive }: {
  q: SessionQuestion; label: string; isActive: boolean;
}) {
  const statusLabel = isActive ? "In progress" : "Not started";
  const statusColor = isActive ? C.accent : "rgba(255,255,255,0.25)";
  return (
    <div>
      <div className="text-white/70 mb-2" style={{ fontSize: 10.5, fontWeight: 600, lineHeight: 1.3 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: q.summary ? 8 : 0 }}>
        <div style={{
          width: 6, height: 6, borderRadius: 3,
          background: isActive ? C.accent : "transparent",
          borderWidth: isActive ? 0 : 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.15)",
          boxShadow: isActive ? `0 0 6px ${C.accent}` : "none",
        }} />
        <span style={{ fontSize: 9, color: statusColor, fontWeight: 500, letterSpacing: 0.1 }}>{statusLabel}</span>
      </div>
      {q.summary && (
        <div>
          <span className="text-white/25 uppercase tracking-[0.08em]" style={{ fontSize: 7 }}>Preview</span>
          <p className="text-white/30 mt-0.5" style={{ fontSize: 9, lineHeight: 1.5 }}>{q.summary}</p>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ── Question Row ──
   ══════════════════════════════════════════════ */
function QuestionRow({ q, index, scrollTo }: { q: SessionQuestion; index: number; scrollTo: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const [rowHovered, setRowHovered] = useState(false);
  const [flipDown, setFlipDown] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const done = q.status === "done";
  const active = q.status === "active";
  const eng = q.engagement ?? 0;
  const quality = done ? deriveQuality(eng) : null;
  const signalIcons = done ? deriveSignalIcons(q) : [];

  useLayoutEffect(() => {
    if (scrollTo && ref.current) ref.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [scrollTo]);

  const showTooltip = () => {
    hoverTimer.current = setTimeout(() => {
      if (ref.current) { const rect = ref.current.getBoundingClientRect(); setFlipDown(rect.top < 260); }
      setHovered(true);
    }, 320);
  };
  const hideTooltip = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setHovered(false); };

  const keyMomentSignal = done && q.signals?.length ? q.signals.find(s => s.icon === "emotion") ?? q.signals[0] : null;

  /* Tile colors — matching State 2 style */
  const tBg = tileBgFn(q, quality);
  const hlBorder = done && quality === "high" ? "rgba(109,212,160,0.35)"
    : done && quality === "mid" ? "rgba(255,209,102,0.30)"
    : done && quality === "low" ? "rgba(255,128,128,0.25)"
    : "rgba(255,255,255,0.06)";

  return (
    <div ref={ref} className="relative"
      onMouseEnter={() => { setRowHovered(true); showTooltip(); }}
      onMouseLeave={() => { setRowHovered(false); hideTooltip(); }}
    >
      <MotionDiv
        initial={{ scale: 0, opacity: 0 }}
        animate={{
          scale: rowHovered ? 1.12 : 1,
          opacity: active ? [0.5, 1, 0.5] : 1,
        }}
        transition={{
          scale: { type: "spring", damping: 22, stiffness: 280 },
          opacity: active ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 },
        }}
        className="relative flex items-center justify-center"
        style={{
          width: "100%",
          aspectRatio: "1 / 1",
          borderRadius: 5,
          background: tBg,
          borderWidth: rowHovered ? 1.5 : 0.5,
          borderStyle: "solid",
          borderColor: rowHovered ? "rgba(255,255,255,0.40)" : hlBorder,
          boxShadow: rowHovered
            ? `0 0 12px ${hlBorder}, 0 0 4px rgba(255,255,255,0.08)`
            : "none",
          cursor: "pointer",
          overflow: "hidden",
          zIndex: rowHovered ? 10 : "auto",
          transition: "border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.2s ease",
        }}
      >
        {/* Glass highlight */}
        <div className="absolute inset-0 pointer-events-none" style={{
          borderRadius: "inherit",
          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 35%)",
        }} />
        {/* Q number */}
        <span className="font-mono absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{
          fontSize: 11,
          fontWeight: 600,
          color: rowHovered ? "rgba(255,255,255,0.85)"
            : active ? "rgba(255,255,255,0.75)"
            : done ? "rgba(255,255,255,0.22)"
            : "rgba(255,255,255,0.10)",
          transition: "color 0.15s ease",
        }}>
          {index + 1}
        </span>
        {/* Signal cue icons */}
        {signalIcons.length > 0 && (
          <div className="absolute bottom-[2px] right-[2px] flex items-center gap-[1px] pointer-events-none">
            {signalIcons.slice(0, 2).map((icon, i) => (
              icon.type === "warning"
                ? <AlertTriangle key={i} size={7} style={{ color: icon.color, opacity: rowHovered ? 0.95 : 0.55 }} />
                : <Star key={i} size={7} style={{ color: icon.color, fill: icon.color, opacity: rowHovered ? 0.95 : 0.55 }} />
            ))}
          </div>
        )}
        {/* Active pulse dot */}
        {active && (
          <div className="absolute top-[2px] left-[2px] size-[3px] rounded-full animate-pulse" style={{ background: "rgba(255,255,255,0.8)" }} />
        )}
      </MotionDiv>
      {hovered && (
        <PortalTooltip anchorRef={ref} visible={hovered} flipDown={flipDown} placement="right" width={230}>
          {done && quality ? (
            <TooltipContent q={q} label={`Q${index + 1}: ${q.text}`} quality={quality} keyMomentSignal={keyMomentSignal} />
          ) : (
            <PendingTooltipContent q={q} label={`Q${index + 1}: ${q.text}`} isActive={active} />
          )}
        </PortalTooltip>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ── Chart Column (chart view tile) ──
   ══════════════════════════════════════════════ */
function ChartColumn({ q, globalIdx }: { q: SessionQuestion; globalIdx: number }) {
  const [hovered, setHovered] = useState(false);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const colRef = useRef<HTMLDivElement>(null);
  const isDone = q.status === "done";
  const isActive = q.status === "active";
  const isPending = q.status === "pending";
  const eng = q.engagement ?? 0;
  const quality = isDone ? deriveQuality(eng) : null;
  const signalIcons = isDone ? deriveSignalIcons(q) : [];
  const keyMomentSignal = isDone && q.signals?.length ? q.signals.find(s => s.icon === "emotion") ?? q.signals[0] : null;
  const [flipDown, setFlipDown] = useState(false);

  const showTooltip = () => {
    hoverTimer.current = setTimeout(() => {
      if (colRef.current) { const rect = colRef.current.getBoundingClientRect(); setFlipDown(rect.top < 240); }
      setHovered(true);
    }, 320);
  };
  const hideTooltip = () => { if (hoverTimer.current) clearTimeout(hoverTimer.current); setHovered(false); };

  const tileBg = isActive ? "#615fff" : isDone && quality ? TILE_BG[quality] : "rgba(255,255,255,0.12)";
  const tileGlow = isActive ? "0px 0px 4px 0px rgba(97,95,255,0.85)" : isDone && quality ? TILE_GLOW[quality] : "none";
  const numColor = isActive ? "rgba(255,255,255,1)" : isDone ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.15)";

  return (
    <div ref={colRef} className="flex flex-col items-center cursor-default relative shrink-0" style={{ gap: 4 }}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}>
      {signalIcons.length > 0 ? (
        <div className="flex items-center gap-0.5" style={{ height: 7 }}>
          {signalIcons.map((icon, i) => (
            icon.type === "warning"
              ? <AlertTriangle key={i} size={7} style={{ color: icon.color, opacity: 0.5 }} />
              : <Star key={i} size={7} style={{ color: icon.color, fill: icon.color, opacity: 0.5 }} />
          ))}
        </div>
      ) : null}
      <MotionDiv
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: isActive ? [0.7, 1, 0.7] : 1 }}
        transition={{
          scale: { duration: 0.3, delay: globalIdx * 0.02 },
          opacity: isActive ? { duration: 2.4, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2, delay: globalIdx * 0.02 },
        }}
        className="relative"
        style={{
          width: 32, height: 32, borderRadius: 1.5,
          background: tileBg, boxShadow: tileGlow,
          borderWidth: isPending ? 0.5 : 0, borderStyle: "solid" as const, borderColor: isPending ? "rgba(255,255,255,0.04)" : "transparent",
        }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: "inherit", boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.12)" }} />
        <span className="absolute inset-0 flex items-center justify-center font-mono select-none"
          style={{ fontSize: 20, fontWeight: 700, color: numColor, lineHeight: 1 }}>
          {globalIdx + 1}
        </span>
      </MotionDiv>
      {hovered && (
        <PortalTooltip anchorRef={colRef} visible={hovered} flipDown={flipDown} width={220}>
          {isDone && quality ? (
            <TooltipContent q={q} label={`Q${globalIdx + 1}: ${q.text}`} quality={quality} keyMomentSignal={keyMomentSignal} />
          ) : (
            <PendingTooltipContent q={q} label={`Q${globalIdx + 1}: ${q.text}`} isActive={isActive} />
          )}
        </PortalTooltip>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════
   ── Follow-up Card ──
   ══════════════════════════════════════════════ */
function FollowUpCard({ text, onClick }: { text: string; onClick: () => void }) {
  return (
    <button onClick={onClick}
      className="w-full text-left cursor-pointer group/card transition-all active:scale-[0.99]"
      style={{
        background: "rgba(97,95,255,0.06)",
        borderRadius: 14,
        borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(97,95,255,0.18)",
        padding: "12px 16px",
      }}>
      <span className="text-white/40 transition-colors group-hover/card:text-white/55" style={{ fontSize: T.body, lineHeight: 1.6, letterSpacing: -0.08 }}>{text}</span>
    </button>
  );
}

/* ══════════════════════════════════════════════
   ── Mini Session Popup — State 4 click-to-expand ──
   ══════════════════════════════════════════════ */
function MiniSessionPopup({ sIdx, questions, onClose }: {
  sIdx: number;
  questions: SessionQuestion[];
  onClose: () => void;
}) {
  const sess = Q_SESSIONS[sIdx];
  const hl = SESSION_HL_COLORS[sIdx];
  const qs = questions.slice(sess.range[0], sess.range[1] + 1);
  const doneCount = qs.filter(q => q.status === "done").length;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center"
      onClick={onClose}
      style={{ background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)" }}>
      <MotionDiv
        initial={{ opacity: 0, scale: 0.92, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 4 }}
        transition={{ type: "spring", damping: 28, stiffness: 340 }}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{
          width: 280,
          maxHeight: 340,
          background: "rgba(18,20,28,0.92)",
          borderWidth: 0.5, borderStyle: "solid", borderColor: hl.border,
          borderRadius: 16,
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 1px rgba(255,255,255,0.06)",
          backdropFilter: "blur(40px)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 pt-3.5 pb-2.5"
          style={{ borderBottomWidth: 0.5, borderBottomStyle: "solid", borderBottomColor: "rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-2">
            <div className="size-2 rounded-full" style={{ background: hl.border }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", letterSpacing: 0.1 }}>
              {sess.label}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono" style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>
              {doneCount}/{qs.length}
            </span>
            <button onClick={onClose} className="flex items-center justify-center rounded-full transition-colors hover:bg-white/[0.06]"
              style={{ width: 20, height: 20, cursor: "pointer" }}>
              <X size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
            </button>
          </div>
        </div>

        {/* Question list */}
        <div className="overflow-y-auto px-3 py-2.5" style={{ maxHeight: 280 }}>
          <div className="flex flex-col gap-1">
            {qs.map((q, i) => {
              const globalIdx = sess.range[0] + i;
              const isDone = q.status === "done";
              const isActive = q.status === "active";
              const eng = q.engagement ?? 0;
              const quality = isDone ? deriveQuality(eng) : null;

              const dotColor = isActive
                ? "rgba(97,95,255,0.75)"
                : quality === "high" ? "rgba(109,212,160,0.6)"
                : quality === "mid" ? "rgba(255,209,102,0.5)"
                : quality === "low" ? "rgba(255,128,128,0.45)"
                : "rgba(255,255,255,0.08)";

              return (
                <div key={q.id} className="flex items-start gap-2.5 py-1.5 px-1.5 rounded-lg"
                  style={{
                    background: isActive ? "rgba(97,95,255,0.06)" : "transparent",
                  }}>
                  {/* Number + dot */}
                  <div className="flex items-center gap-1.5 shrink-0 mt-[1px]">
                    <span className="font-mono" style={{
                      fontSize: 8,
                      color: isActive ? "rgba(97,95,255,0.7)" : "rgba(255,255,255,0.2)",
                      width: 14,
                      textAlign: "right",
                    }}>
                      {globalIdx + 1}
                    </span>
                    <div className="rounded-full" style={{
                      width: 5,
                      height: 5,
                      background: dotColor,
                    }} />
                  </div>
                  {/* Question text */}
                  <span style={{
                    fontSize: 10,
                    color: isActive ? "rgba(255,255,255,0.6)" : isDone ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.18)",
                    lineHeight: 1.5,
                    letterSpacing: -0.05,
                  }}>
                    {q.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </MotionDiv>
    </div>
  );
}

/* ═════════════════════════════════════════════
   ── CheckListContent — 4-state adaptive system ──
   compact: 0 = full (>500px), 1 = half (180-500px), 2 = compact (120-180px), 3 = minimal (<120px)
   ═════════════════════════════════════════════ */
export function CheckListContent({ onSendFollowUp, onSkip }: {
  onSendFollowUp: (text: string, urgent: boolean) => void;
  onSkip?: (qText: string, qIdx: number) => void;
}) {
  const session = SESSIONS[SESSIONS.length - 1];
  const done = session.questions.filter(q => q.completed).length;
  const total = session.questions.length;
  const activeIdx = session.questions.findIndex(q => q.status === "active");
  const compact = useCompact();

  const [inputText, setInputText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [urgent, setUrgent] = useState(false);
  const [followUpExpanded, setFollowUpExpanded] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "chart">("list");
  const [expandedSession, setExpandedSession] = useState<number | null>(null);
  const [hoveredSession, setHoveredSession] = useState<number | null>(null);
  const [halfShowViz, setHalfShowViz] = useState(false);
  const compactGridRef = useRef<HTMLDivElement>(null);
  const [compactGridSize, setCompactGridSize] = useState({ w: 200, h: 300 });
  const [miniPopup, setMiniPopup] = useState<number | null>(null);
  const [hoveredQIdx, setHoveredQIdx] = useState<number | null>(null);
  const hoveredTileRef = useRef<HTMLDivElement | null>(null);
  const hoverQTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [tileFlipDown, setTileFlipDown] = useState(false);

  /* ── Skip state ── */
  const [skippedIds, setSkippedIds] = useState<Set<number>>(new Set());
  const [hoveredRowIdx, setHoveredRowIdx] = useState<number | null>(null);

  const handleSkip = (qId: number, gIdx: number, qText: string) => {
    setSkippedIds(prev => new Set([...prev, qId]));
    onSkip?.(qText, gIdx);
  };

  const handleRestore = (qId: number) => {
    setSkippedIds(prev => { const next = new Set(prev); next.delete(qId); return next; });
  };

  /* Reset popup when leaving State 4 */
  useLayoutEffect(() => {
    if (compact < 3) { setMiniPopup(null); setHoveredQIdx(null); }
  }, [compact]);

  /* Reset to follow-up view whenever entering State 2 */
  useLayoutEffect(() => {
    if (compact === 1) setHalfShowViz(false);
  }, [compact]);

  useLayoutEffect(() => {
    if (!compactGridRef.current) return;
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 0 && height > 0) setCompactGridSize({ w: width, h: height });
      }
    });
    ro.observe(compactGridRef.current);
    return () => ro.disconnect();
  }, []);

  const handleSend = () => {
    if (!inputText.trim()) return;
    onSendFollowUp(inputText.trim(), urgent);
    setInputText("");
  };

  /* sessionOfIdx imported from tile-utils */



  /* Shared: hover helpers for question tooltip (State 2/3/4) */
  const showQTooltip = (idx: number, el: HTMLElement) => {
    if (hoverQTimer.current) clearTimeout(hoverQTimer.current);
    hoveredTileRef.current = el as HTMLDivElement;
    hoverQTimer.current = setTimeout(() => {
      const rect = el.getBoundingClientRect();
      setTileFlipDown(rect.top < 200);
      setHoveredQIdx(idx);
    }, 280);
  };
  const hideQTooltip = () => {
    if (hoverQTimer.current) clearTimeout(hoverQTimer.current);
    setHoveredQIdx(null);
  };

  /* Shared: currently hovered question data */
  const hQ = hoveredQIdx !== null ? session.questions[hoveredQIdx] : null;
  const hQDone = hQ?.status === "done";
  const hQActive = hQ?.status === "active";
  const hQuality = hQDone ? deriveQuality(hQ.engagement ?? 0) : null;
  const hKeySignal = hQDone && hQ.signals?.length ? hQ.signals.find((s: any) => s.icon === "emotion") ?? hQ.signals[0] : null;

  /* ══════════════════════════════════════════
     STATE 4 — Mini Matrix (h < 120px)
     Grid tiles with question numbers. Click tile → session popup.
     ══════════════════════════════════════════ */
  if (compact >= 3) {
    const COLS = 10;
    const isHovering4 = hoveredSession !== null;

    return (
      <div className="flex flex-col items-center justify-center h-full select-none px-3 py-2 relative">
        {/* Session label + pass rate on hover */}
        <div style={{ height: 16, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, flexShrink: 0 }}>
          <AnimatePresence mode="wait">
            {hoveredSession !== null && (
              <MotionDiv key={hoveredSession}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-1.5 px-2 py-0.5"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderWidth: 0.5, borderStyle: "solid", borderColor: SESSION_HL_COLORS[hoveredSession].border,
                  borderRadius: 6,
                }}>
                <span style={{ fontSize: 8, color: SESSION_HL_COLORS[hoveredSession].border, fontWeight: 600, letterSpacing: 0.2 }}>
                  {SESSION_HL_COLORS[hoveredSession].label}
                </span>
                <span className="font-mono" style={{ fontSize: 7, color: "rgba(255,255,255,0.18)" }}>
                  Q{Q_SESSIONS[hoveredSession].range[0] + 1}–{Q_SESSIONS[hoveredSession].range[1] + 1}
                </span>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* Matrix grid with Q numbers */}
        <div className="w-full flex items-center justify-center flex-1">
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gap: 3,
            width: "100%",
            maxWidth: 280,
          }}>
            {session.questions.map((q, idx) => {
              const isDone = q.status === "done";
              const isActive = q.status === "active";
              const eng = q.engagement ?? 0;
              const quality = isDone ? deriveQuality(eng) : null;
              const sIdx = sessionOfIdx(idx);
              const isHighlighted = hoveredSession === sIdx;
              const isDimmed = isHovering4 && !isHighlighted;
              const isQHovered = hoveredQIdx === idx;

              const bg = tileBgFn(q, quality);

              const numColor = isActive
                ? "rgba(255,255,255,0.9)"
                : isDimmed ? "rgba(255,255,255,0.08)"
                : isDone ? "rgba(255,255,255,0.55)"
                : "rgba(255,255,255,0.16)";

              const hlBorder = SESSION_HL_COLORS[sIdx]?.border ?? "rgba(255,255,255,0.15)";
              const hlGlow = hlBorder.replace(/[\d.]+\)$/, "0.35)");

              return (
                <MotionDiv key={q.id}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: isQHovered ? 1.25 : isHighlighted ? 1.08 : isDimmed ? 0.92 : 1,
                    opacity: isActive ? [0.5, 1, 0.5] : isDimmed ? 0.2 : 1,
                  }}
                  transition={{
                    scale: { type: "spring", damping: 20, stiffness: 300, delay: idx * 0.01 },
                    opacity: isActive ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.15 },
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                    setHoveredSession(sIdx);
                    showQTooltip(idx, e.currentTarget);
                  }}
                  onMouseLeave={() => {
                    setHoveredSession(null);
                    hideQTooltip();
                  }}
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation();
                    setMiniPopup(prev => prev === sIdx ? null : sIdx);
                  }}
                  className="flex items-center justify-center relative"
                  style={{
                    aspectRatio: "1",
                    borderRadius: 4,
                    background: bg,
                    borderWidth: isQHovered ? 1.5 : isHighlighted ? 1.5 : miniPopup === sIdx ? 1 : 0.5,
                    borderStyle: "solid",
                    borderColor: isQHovered
                      ? "rgba(255,255,255,0.35)"
                      : isHighlighted
                        ? hlBorder
                        : miniPopup === sIdx
                          ? hlBorder
                          : `rgba(255,255,255,${isDone ? "0.05" : "0.03"})`,
                    boxShadow: isQHovered
                      ? `0 0 12px rgba(255,255,255,0.15), 0 0 6px ${hlGlow}`
                      : isHighlighted
                        ? `0 0 8px ${hlGlow}, inset 0 0 4px ${hlBorder.replace(/[\d.]+\)$/, "0.1)")}`
                        : "none",
                    cursor: "pointer",
                    overflow: "hidden",
                    zIndex: isQHovered ? 10 : "auto",
                    transition: "border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.2s ease",
                  }}
                >
                  <span className="font-mono relative" style={{
                    fontSize: 7,
                    color: isQHovered ? "rgba(255,255,255,0.95)" : numColor,
                    lineHeight: 1,
                    letterSpacing: -0.2,
                    transition: "color 0.15s ease",
                  }}>
                    {idx + 1}
                  </span>
                </MotionDiv>
              );
            })}
          </div>
        </div>

        {/* Progress counter */}
        <div className="mt-1.5 shrink-0">
          <span className="font-mono" style={{
            fontSize: 9,
            color: done === total ? "rgba(109,212,160,0.45)" : "rgba(255,255,255,0.18)",
            letterSpacing: 0.3,
          }}>
            {done}<span style={{ color: "rgba(255,255,255,0.07)" }}>/{total}</span>
          </span>
        </div>

        {/* Question detail tooltip on hover (State 1 style) */}
        {hQ && hoveredQIdx !== null && (
          <PortalTooltip anchorRef={hoveredTileRef as React.RefObject<HTMLElement>} visible={hoveredQIdx !== null} flipDown={tileFlipDown} width={220}>
            {hQDone && hQuality ? (
              <TooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} quality={hQuality} keyMomentSignal={hKeySignal} />
            ) : (
              <PendingTooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} isActive={!!hQActive} />
            )}
          </PortalTooltip>
        )}

        {/* Session popup overlay via portal */}
        {miniPopup !== null && ReactDOM.createPortal(
          <MiniSessionPopup
            sIdx={miniPopup}
            questions={session.questions}
            onClose={() => setMiniPopup(null)}
          />,
          document.body,
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     STATE 3 — Tile Matrix (h 120–180px)
     Reuses State 2's 5×4 visualization grid.
     ══════════════════════════════════════════ */
  if (compact >= 2) {
    return (
      <div ref={compactGridRef} className="flex flex-col items-center justify-center h-full select-none px-2 py-1 relative">
        {/* Session label + pass rate on hover */}
        <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, flexShrink: 0 }}>
          <AnimatePresence mode="wait">
            {hoveredSession !== null && (
              <MotionDiv key={hoveredSession}
                initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.12 }}
                className="flex items-center gap-1.5 px-2.5 py-0.5"
                style={{ background: "rgba(255,255,255,0.03)", borderWidth: 0.5, borderStyle: "solid" as const, borderColor: SESSION_HL_COLORS[hoveredSession].border, borderRadius: 7 }}>
                <span style={{ fontSize: 9, color: SESSION_HL_COLORS[hoveredSession].border, fontWeight: 600, letterSpacing: 0.2 }}>
                  {SESSION_HL_COLORS[hoveredSession].label}
                </span>
                <span className="font-mono" style={{ fontSize: 8, color: "rgba(255,255,255,0.15)" }}>
                  Q{Q_SESSIONS[hoveredSession].range[0] + 1}–{Q_SESSIONS[hoveredSession].range[1] + 1}
                </span>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
        {/* 5×4 Grid — same as State 2 viz */}
        <div className="flex-1 w-full" style={{
          display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: 5,
        }}>
          {session.questions.map((q, idx) => {
            const isDone = q.status === "done";
            const isActive = q.status === "active";
            const eng = q.engagement ?? 0;
            const quality = isDone ? deriveQuality(eng) : null;
            const sIdx = sessionOfIdx(idx);
            const isHighlighted = hoveredSession === sIdx;
            const isDimmed = hoveredSession !== null && !isHighlighted;
            const isQHovered = hoveredQIdx === idx;
            const signalIcons = isDone ? deriveSignalIcons(q) : [];
            const hlBorder = SESSION_HL_COLORS[sIdx]?.border ?? "rgba(255,255,255,0.15)";

            const bg = tileBgFn(q, quality);
            return (
              <MotionDiv key={q.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{
                  scale: isQHovered ? 1.12 : isHighlighted ? 1.05 : isDimmed ? 0.95 : 1,
                  opacity: isActive ? [0.5, 1, 0.5] : isDimmed ? 0.25 : 1,
                }}
                transition={{
                  scale: { type: "spring", damping: 22, stiffness: 280 },
                  opacity: isActive ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 },
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                  setHoveredSession(sIdx);
                  showQTooltip(idx, e.currentTarget);
                }}
                onMouseLeave={() => {
                  setHoveredSession(null);
                  hideQTooltip();
                }}
                className="relative flex items-end justify-center"
                style={{
                  width: "100%", height: "100%", borderRadius: 5,
                  background: bg,
                  borderWidth: isQHovered ? 1.5 : isHighlighted && sIdx >= 0 ? 1 : 0.5,
                  borderStyle: "solid",
                  borderColor: isQHovered
                    ? "rgba(255,255,255,0.40)"
                    : isHighlighted && sIdx >= 0
                      ? hlBorder
                      : "rgba(255,255,255,0.04)",
                  boxShadow: isQHovered
                    ? `0 0 12px ${hlBorder.replace(/[\d.]+\)$/, "0.30)")}, 0 0 4px rgba(255,255,255,0.08)`
                    : "none",
                  cursor: isDone || isActive ? "pointer" : "default",
                  overflow: "hidden",
                  zIndex: isQHovered ? 10 : "auto",
                  transition: "border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.2s ease",
                }}>
                {/* Glass highlight */}
                <div className="absolute inset-0 pointer-events-none" style={{
                  borderRadius: "inherit",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 35%)",
                }} />
                {/* Q number */}
                <span className="font-mono absolute inset-0 flex items-center justify-center pointer-events-none" style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: isQHovered ? "rgba(255,255,255,0.85)"
                    : isActive ? "rgba(255,255,255,0.75)"
                    : isDone ? "rgba(255,255,255,0.22)"
                    : "rgba(255,255,255,0.10)",
                  transition: "color 0.15s ease",
                }}>
                  {idx + 1}
                </span>
                {/* Signal cue icons in bottom-right */}
                {signalIcons.length > 0 && (
                  <div className="absolute bottom-[3px] right-[3px] flex items-center gap-[2px] pointer-events-none">
                    {signalIcons.slice(0, 2).map((icon, i) => (
                      icon.type === "warning"
                        ? <AlertTriangle key={i} size={9} style={{ color: icon.color, opacity: isQHovered ? 0.95 : 0.55 }} />
                        : <Star key={i} size={9} style={{ color: icon.color, fill: icon.color, opacity: isQHovered ? 0.95 : 0.55 }} />
                    ))}
                  </div>
                )}
              </MotionDiv>
            );
          })}
        </div>

        {/* Progress counter */}
        <div className="mt-1 shrink-0">
          <span className="font-mono" style={{
            fontSize: 10,
            color: done === total ? "rgba(109,212,160,0.45)" : "rgba(255,255,255,0.18)",
            letterSpacing: 0.4,
          }}>
            {done}<span style={{ color: "rgba(255,255,255,0.07)" }}>/{total}</span>
          </span>
        </div>

        {/* Question detail tooltip on hover */}
        {hQ && hoveredQIdx !== null && (
          <PortalTooltip anchorRef={hoveredTileRef as React.RefObject<HTMLElement>} visible={hoveredQIdx !== null} flipDown={tileFlipDown} width={220} placement="right">
            {hQDone && hQuality ? (
              <TooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} quality={hQuality} keyMomentSignal={hKeySignal} />
            ) : (
              <PendingTooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} isActive={!!hQActive} />
            )}
          </PortalTooltip>
        )}
      </div>
    );
  }

  /* ══════════════════════════════════════════
     STATE 2 — Half Height / Focused Card (h 180–500px)
     Follow-ups + input primary. Viz toggle in header.
     ══════════════════════════════════════════ */
  if (compact >= 1) {
    return (
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-0.5 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="size-[5px] rounded-full animate-pulse" style={{ background: C.negative }} />
            <span className="text-white/22 uppercase tracking-[0.12em]" style={{ fontSize: 7 }}>In Progress</span>
            <span className="font-mono text-white/25 ml-1" style={{ fontSize: 9 }}>
              {done}<span style={{ color: "rgba(255,255,255,0.08)" }}>/{total}</span>
            </span>
          </div>
          <button
            onClick={() => setHalfShowViz(v => !v)}
            className="p-1.5 rounded-lg transition-all cursor-pointer hover:bg-white/[0.04]"
            style={{
              background: halfShowViz ? "rgba(97,95,255,0.10)" : "transparent",
              borderWidth: 0.5, borderStyle: "solid",
              borderColor: halfShowViz ? "rgba(97,95,255,0.20)" : "transparent",
            }}
            title={halfShowViz ? "Show follow-ups" : "Show visualization"}>
            {halfShowViz
              ? <MessageSquare size={11} style={{ color: "rgba(255,255,255,0.30)" }} />
              : <Grid3X3 size={11} style={{ color: "rgba(255,255,255,0.25)" }} />
            }
          </button>
        </div>

        {/* Main content: follow-ups OR viz */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {halfShowViz ? (
              <MotionDiv key="half-viz"
                initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                ref={compactGridRef}
                className="h-full flex flex-col items-center justify-center px-2 py-1 relative">
                {/* Session label + pass rate */}
                <div style={{ height: 20, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 4, flexShrink: 0 }}>
                  <AnimatePresence mode="wait">
                    {hoveredSession !== null && (
                      <MotionDiv key={hoveredSession}
                        initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -3 }}
                        transition={{ duration: 0.12 }}
                        className="flex items-center gap-1.5 px-2.5 py-0.5"
                        style={{ background: "rgba(255,255,255,0.03)", borderWidth: 0.5, borderStyle: "solid" as const, borderColor: SESSION_HL_COLORS[hoveredSession].border, borderRadius: 7 }}>
                        <span style={{ fontSize: 9, color: SESSION_HL_COLORS[hoveredSession].border, fontWeight: 600, letterSpacing: 0.2 }}>
                          {SESSION_HL_COLORS[hoveredSession].label}
                        </span>
                        <span className="font-mono" style={{ fontSize: 8, color: "rgba(255,255,255,0.15)" }}>
                          Q{Q_SESSIONS[hoveredSession].range[0] + 1}–{Q_SESSIONS[hoveredSession].range[1] + 1}
                        </span>
                      </MotionDiv>
                    )}
                  </AnimatePresence>
                </div>
                {/* Grid */}
                <div className="flex-1 w-full" style={{
                  display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gridTemplateRows: "repeat(4, 1fr)", gap: 5,
                }}>
                  {session.questions.map((q, idx) => {
                    const isDone = q.status === "done";
                    const isActive = q.status === "active";
                    const eng = q.engagement ?? 0;
                    const quality = isDone ? deriveQuality(eng) : null;
                    const sIdx = sessionOfIdx(idx);
                    const isHighlighted = hoveredSession === sIdx;
                    const isDimmed = hoveredSession !== null && !isHighlighted;
                    const isQHovered = hoveredQIdx === idx;
                    const signalIcons = isDone ? deriveSignalIcons(q) : [];
                    const hlBorder = SESSION_HL_COLORS[sIdx]?.border ?? "rgba(255,255,255,0.15)";

                    const bg = tileBgFn(q, quality);
                    return (
                      <MotionDiv key={q.id}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{
                          scale: isQHovered ? 1.12 : isHighlighted ? 1.05 : isDimmed ? 0.95 : 1,
                          opacity: isActive ? [0.5, 1, 0.5] : isDimmed ? 0.25 : 1,
                        }}
                        transition={{
                          scale: { type: "spring", damping: 22, stiffness: 280 },
                          opacity: isActive ? { duration: 2.8, repeat: Infinity, ease: "easeInOut" } : { duration: 0.2 },
                        }}
                        onMouseEnter={(e: React.MouseEvent<HTMLDivElement>) => {
                          setHoveredSession(sIdx);
                          showQTooltip(idx, e.currentTarget);
                        }}
                        onMouseLeave={() => {
                          setHoveredSession(null);
                          hideQTooltip();
                        }}
                        className="relative flex items-end justify-center"
                        style={{
                          width: "100%", height: "100%", borderRadius: 5,
                          background: bg,
                          borderWidth: isQHovered ? 1.5 : isHighlighted && sIdx >= 0 ? 1 : 0.5,
                          borderStyle: "solid",
                          borderColor: isQHovered
                            ? "rgba(255,255,255,0.40)"
                            : isHighlighted && sIdx >= 0
                              ? hlBorder
                              : "rgba(255,255,255,0.04)",
                          boxShadow: isQHovered
                            ? `0 0 12px ${hlBorder.replace(/[\d.]+\)$/, "0.30)")}, 0 0 4px rgba(255,255,255,0.08)`
                            : "none",
                          cursor: isDone || isActive ? "pointer" : "default",
                          overflow: "hidden",
                          zIndex: isQHovered ? 10 : "auto",
                          transition: "border-color 0.15s ease, border-width 0.15s ease, box-shadow 0.2s ease",
                        }}>
                        {/* Glass highlight */}
                        <div className="absolute inset-0 pointer-events-none" style={{
                          borderRadius: "inherit",
                          background: "linear-gradient(180deg, rgba(255,255,255,0.08) 0%, transparent 35%)",
                        }} />
                        {/* Q number */}
                        <span className="font-mono absolute inset-0 flex items-center justify-center pointer-events-none" style={{
                          fontSize: 14,
                          fontWeight: 600,
                          color: isQHovered ? "rgba(255,255,255,0.85)"
                            : isActive ? "rgba(255,255,255,0.75)"
                            : isDone ? "rgba(255,255,255,0.22)"
                            : "rgba(255,255,255,0.10)",
                          transition: "color 0.15s ease",
                        }}>
                          {idx + 1}
                        </span>
                        {/* Signal cue icons in bottom-right */}
                        {signalIcons.length > 0 && (
                          <div className="absolute bottom-[3px] right-[3px] flex items-center gap-[2px] pointer-events-none">
                            {signalIcons.slice(0, 2).map((icon, i) => (
                              icon.type === "warning"
                                ? <AlertTriangle key={i} size={9} style={{ color: icon.color, opacity: isQHovered ? 0.95 : 0.55 }} />
                                : <Star key={i} size={9} style={{ color: icon.color, fill: icon.color, opacity: isQHovered ? 0.95 : 0.55 }} />
                            ))}
                          </div>
                        )}
                      </MotionDiv>
                    );
                  })}
                </div>

                {/* Question detail tooltip on hover — positioned to the side so it doesn't cover the tile */}
                {hQ && hoveredQIdx !== null && (
                  <PortalTooltip anchorRef={hoveredTileRef as React.RefObject<HTMLElement>} visible={hoveredQIdx !== null} flipDown={tileFlipDown} width={220} placement="right">
                    {hQDone && hQuality ? (
                      <TooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} quality={hQuality} keyMomentSignal={hKeySignal} />
                    ) : (
                      <PendingTooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} isActive={!!hQActive} />
                    )}
                  </PortalTooltip>
                )}
              </MotionDiv>
            ) : (
              <MotionDiv key="half-followups"
                initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 6 }}
                transition={{ duration: 0.22, ease: [0.25, 0.1, 0.25, 1] }}
                className="h-full flex flex-col">
                <div className="flex items-center gap-2 mb-2.5 shrink-0">
                  <span className="text-white/25 uppercase tracking-[0.8px]" style={{ fontSize: 8 }}>AI follow-ups</span>
                  <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.03)" }} />
                  <button className="p-0.5 rounded transition-colors hover:bg-white/[0.03] cursor-pointer" style={{ opacity: 0.25 }}>
                    <RefreshCw size={10} className="text-white" />
                  </button>
                </div>
                <div className="flex flex-col gap-1.5 flex-1 min-h-0 overflow-y-auto scroll-area pr-0.5">
                  {AI_FOLLOWUPS.slice(0, 3).map(s => (
                    <FollowUpCard key={s.id} text={s.text}
                      onClick={() => { setInputText(s.text); setTimeout(() => inputRef.current?.focus(), 30); }}
                    />
                  ))}
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* Input — always anchored */}
        <div className="shrink-0 pt-2.5 mt-1" style={{ borderTopWidth: 0.5, borderTopStyle: "solid", borderTopColor: "rgba(255,255,255,0.04)" }}>
          <div className="relative">
            <textarea ref={inputRef} value={inputText}
              onChange={e => setInputText(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
              placeholder="Ask at next natural pause..."
              rows={1}
              className="w-full resize-none bg-white/[0.025] text-white/60 placeholder:text-white/15 px-3 py-2.5 pr-10 outline-none transition-colors focus:bg-white/[0.04] scroll-area"
              style={{ fontSize: T.body, borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.06)", borderRadius: 12, lineHeight: 1.5 }}
            />
            <button onClick={handleSend} disabled={!inputText.trim()}
              className="absolute right-2 bottom-2 p-1.5 rounded-full transition-all cursor-pointer disabled:cursor-default"
              style={{ background: inputText.trim() ? C.accent : "rgba(255,255,255,0.04)", opacity: inputText.trim() ? 1 : 0.2 }}>
              <Send size={11} className="text-white/80" style={{ opacity: inputText.trim() ? 1 : 0.2 }} />
            </button>
          </div>
          <div className="flex items-center justify-end pr-0.5 pt-1.5 pb-0.5">
            <button onClick={() => setUrgent(prev => !prev)} className="flex items-center gap-1.5 cursor-pointer">
              <div className="relative shrink-0" style={{ width: 28, height: 16, borderRadius: 9999 }}>
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 9999,
                  background: urgent ? "rgba(97,95,255,0.25)" : "rgba(255,255,255,0.05)",
                  borderWidth: 0.5, borderStyle: "solid",
                  borderColor: urgent ? "rgba(97,95,255,0.35)" : "rgba(255,255,255,0.04)",
                  transition: "background 0.2s, border-color 0.2s",
                }} />
                <div style={{
                  position: "absolute", top: 2.5, left: urgent ? 15 : 3,
                  width: 11, height: 11, borderRadius: 9999,
                  background: urgent ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.20)",
                  transition: "background 0.2s, left 0.2s",
                }} />
              </div>
              <span className="text-white/25" style={{ fontSize: 9, fontWeight: 500 }}>Urgent</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ══════════════════════════════════════════
     STATE 1 — Full Height / Expanded (h >= 500px)
     Complete working state: viz + follow-ups + input
     ══════════════════════════════════════════ */
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  const activeQ = session.questions[activeIdx];

  return (
    <div className="flex flex-col h-full gap-0">
      {/* ── Progress summary strip ── */}
      <div className="shrink-0 mb-4 px-1">
        <div className="flex items-center gap-3 mb-2.5">
          <div className="flex-1 h-[3px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
            <MotionDiv
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                height: "100%", borderRadius: 999,
                background: pct === 100
                  ? "linear-gradient(90deg, rgba(109,212,160,0.6), rgba(109,212,160,0.4))"
                  : "linear-gradient(90deg, rgba(97,95,255,0.5), rgba(97,95,255,0.3))",
              }}
            />
          </div>
          <span className="font-mono shrink-0" style={{
            fontSize: 10, fontWeight: 600,
            color: pct === 100 ? "rgba(109,212,160,0.55)" : "rgba(255,255,255,0.30)",
            letterSpacing: -0.3,
          }}>
            {done}<span style={{ color: "rgba(255,255,255,0.10)" }}>/{total}</span>
          </span>
        </div>
        {activeQ && (
          <div className="flex items-center gap-2 px-0.5">
            <div className="size-[5px] rounded-full animate-pulse" style={{ background: C.accent }} />
            <span className="text-white/30 truncate" style={{ fontSize: 9, letterSpacing: -0.05 }}>
              Q{activeIdx + 1}: {activeQ.text}
            </span>
          </div>
        )}
      </div>

      {/* ── Checklist overview — glass card ── */}
      <div className="mb-3 min-h-0" style={{
        background: "rgba(255,255,255,0.015)",
        borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.05)",
        borderRadius: 14, overflow: "hidden",
        display: "flex", flexDirection: "column",
        flex: "1 1 0",
      }}>
        <div className="flex items-center justify-between px-3.5 py-2.5 shrink-0" style={{ borderBottomWidth: 0.5, borderBottomStyle: "solid", borderBottomColor: "rgba(255,255,255,0.04)" }}>
          <div className="flex items-center gap-1.5">
            <div className="size-[5px] rounded-full animate-pulse" style={{ background: C.negative }} />
            <span className="text-white/25 uppercase tracking-[0.1em]" style={{ fontSize: 7.5 }}>Questions</span>
          </div>
          <button onClick={() => setViewMode(v => v === "list" ? "chart" : "list")}
            className="p-1 rounded-md transition-all cursor-pointer hover:bg-white/[0.04]"
            style={{
              background: viewMode === "chart" ? "rgba(97,95,255,0.10)" : "transparent",
              borderWidth: 0.5, borderStyle: "solid",
              borderColor: viewMode === "chart" ? "rgba(97,95,255,0.20)" : "transparent",
            }}
            title={viewMode === "list" ? "Switch to grid" : "Switch to list"}>
            {viewMode === "list"
              ? <Grid3X3 size={11} style={{ color: "rgba(255,255,255,0.22)" }} />
              : <List size={11} style={{ color: C.accent }} />}
          </button>
        </div>
        <div className="overflow-y-auto scroll-area px-2.5 py-2 flex-1 min-h-0">
          {viewMode === "list" ? (
            <MotionDiv key="list" initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
              {Q_SESSIONS.map((sec, secIdx) => {
                const secQuestions = session.questions.slice(sec.range[0], sec.range[1] + 1);
                const secDone = secQuestions.filter(sq => sq.status === "done").length;
                const secTotal = secQuestions.length;
                return (
                  <div key={sec.label} className="relative">
                    {secIdx > 0 && <div style={{ height: 1, marginBottom: 6, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.04) 80%, transparent)" }} />}
                    <div className="flex items-center gap-1.5 px-0.5" style={{ marginTop: secIdx > 0 ? 4 : 1, marginBottom: 5 }}>
                      <span className="text-white/30 shrink-0" style={{ fontSize: 11, fontWeight: 600, letterSpacing: -0.14 }}>S{secIdx + 1}</span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.12)", letterSpacing: 0.17 }}>–</span>
                      <span className="text-white/40 shrink-0" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.22 }}>{sec.label}</span>
                      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.04), transparent)" }} />
                      <span className="font-mono" style={{ fontSize: 9, color: secDone === secTotal ? "rgba(109,212,160,0.50)" : "rgba(255,255,255,0.12)" }}>{secDone}/{secTotal}</span>
                    </div>
                    <div className="flex flex-col">
                      {secQuestions.map((q, i) => {
                        const gIdx = sec.range[0] + i;
                        const iD = q.status === "done";
                        const iA = q.status === "active";
                        const iP = q.status === "pending";
                        const iS = skippedIds.has(q.id);
                        const isMissed = iS && activeIdx > gIdx;
                        const isRowHovered = hoveredRowIdx === gIdx;
                        const eng = q.engagement ?? 0;
                        const ql = iD ? deriveQuality(eng) : null;
                        const barCount = ql ? BAR_COUNT[ql] : 0;
                        const signalIcons = iD ? deriveSignalIcons(q) : [];
                        return (
                          <div key={q.id}
                            className="flex items-center gap-2.5 rounded-[10px]"
                            style={{
                              height: 30.5, paddingLeft: 6, paddingRight: 6,
                              cursor: "pointer",
                              background: isRowHovered
                                ? (iS ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.02)")
                                : (iA && !iS ? "rgba(97,95,255,0.06)" : "transparent"),
                              opacity: iS ? 0.5 : 1,
                              transitionProperty: "background-color, opacity",
                              transitionDuration: "0.15s",
                              transitionTimingFunction: "ease",
                              ...(iA && !iS ? { borderLeftWidth: 2, borderLeftStyle: "solid" as const, borderLeftColor: C.accent, paddingLeft: 8 } : {}),
                            }}
                            onMouseEnter={(e) => {
                              setHoveredRowIdx(gIdx);
                              if (!iS) showQTooltip(gIdx, e.currentTarget);
                            }}
                            onMouseLeave={() => {
                              setHoveredRowIdx(null);
                              hideQTooltip();
                            }}
                          >
                            {/* Status icon */}
                            <div className="shrink-0 relative" style={{ width: 11, height: 11 }}>
                              {iS ? (
                                <div style={{ position: "relative", width: 11, height: 11, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                  <Circle size={11} style={{ color: "rgba(255,255,255,0.08)" }} />
                                  <div style={{ position: "absolute", width: 1, height: 14, background: "rgba(255,255,255,0.22)", transform: "rotate(45deg)" }} />
                                </div>
                              ) : iD ? (
                                <CheckCircle2 size={11} style={{ color: engColorAlpha(eng, 0.85), filter: `drop-shadow(0 0 3px ${engColorAlpha(eng, 0.3)})` }} />
                              ) : iA ? (
                                <div className="size-[11px] rounded-full flex items-center justify-center" style={{ borderWidth: 1, borderStyle: "solid", borderColor: C.accent }}>
                                  <div className="size-[3px] rounded-full animate-pulse" style={{ background: C.accent }} />
                                </div>
                              ) : (
                                <Circle size={11} style={{ color: "rgba(255,255,255,0.10)" }} />
                              )}
                            </div>

                            {/* Question text */}
                            <span
                              className={`flex-1 min-w-0 truncate ${iS ? "text-white/[0.18]" : iD ? "text-white/80" : iA ? "text-white/50" : "text-white/20"}`}
                              style={{
                                fontSize: 11, lineHeight: 1.5, letterSpacing: 0.06,
                                textDecorationLine: iS ? "line-through" : "none",
                                textDecorationColor: iS ? "rgba(255,255,255,0.12)" : "transparent",
                              }}
                            >
                              {q.text}
                            </span>

                            {/* Right action area */}
                            {iS ? (
                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* Status badge */}
                                <span style={{
                                  fontSize: 7.5, letterSpacing: "0.06em", textTransform: "uppercase" as const,
                                  color: isMissed ? "rgba(255,255,255,0.18)" : "rgba(255,209,102,0.60)",
                                  background: isMissed ? "rgba(255,255,255,0.03)" : "rgba(255,209,102,0.06)",
                                  borderWidth: 0.5, borderStyle: "solid",
                                  borderColor: isMissed ? "rgba(255,255,255,0.07)" : "rgba(255,209,102,0.16)",
                                  borderRadius: 4, padding: "1px 5px", whiteSpace: "nowrap" as const,
                                }}>
                                  {isMissed ? "Missed" : "Skipped"}
                                </span>
                                {/* Restore button — only when timing still allows */}
                                {!isMissed && isRowHovered && (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); handleRestore(q.id); }}
                                    style={{
                                      display: "flex", alignItems: "center", gap: 3,
                                      fontSize: 8, color: "rgba(255,255,255,0.38)",
                                      background: "rgba(255,255,255,0.04)",
                                      borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.09)",
                                      borderRadius: 4, padding: "1px 6px", cursor: "pointer",
                                      whiteSpace: "nowrap" as const,
                                    }}
                                    onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.65)"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                                    onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.38)"; e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                                  >
                                    <RefreshCw size={7} />
                                    Restore
                                  </button>
                                )}
                              </div>
                            ) : iD && ql ? (
                              /* Done: quality bars + signal icons */
                              <div className="flex items-center gap-2 shrink-0">
                                {signalIcons.length > 0 && (
                                  <div className="flex items-center gap-[2px]">
                                    {signalIcons.slice(0, 2).map((ic, idx2) =>
                                      ic.type === "warning"
                                        ? <AlertTriangle key={idx2} size={7} style={{ color: ic.color, opacity: 0.65 }} />
                                        : <Star key={idx2} size={7} style={{ color: ic.color, fill: ic.color, opacity: 0.7 }} />
                                    )}
                                  </div>
                                )}
                                <div className="flex items-center gap-[2.5px]" style={{ opacity: ql === "high" ? 0.55 : 1 }}>
                                  {[0, 1, 2].map(bi => (
                                    <div key={bi} style={{
                                      width: 11, height: 7, borderRadius: 1.5,
                                      background: bi < barCount ? BAR_FILLED[ql] : BAR_EMPTY,
                                      boxShadow: bi < barCount ? BAR_GLOW[ql] : "none",
                                    }} />
                                  ))}
                                </div>
                              </div>
                            ) : (iP || iA) && isRowHovered ? (
                              /* Pending/active + hovered: Skip button */
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSkip(q.id, gIdx, q.text); }}
                                style={{
                                  display: "flex", alignItems: "center", gap: 3,
                                  fontSize: 8, color: "rgba(255,255,255,0.28)",
                                  background: "rgba(255,255,255,0.03)",
                                  borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.07)",
                                  borderRadius: 4, padding: "1px 7px", cursor: "pointer",
                                  whiteSpace: "nowrap" as const,
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.55)"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                                onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.28)"; e.currentTarget.style.background = "rgba(255,255,255,0.03)"; }}
                              >
                                <SkipForward size={7} />
                                Skip
                              </button>
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </MotionDiv>
          ) : (
            <MotionDiv key="chart" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }}>
              {Q_SESSIONS.map((sec, secIdx) => {
                const secQuestions = session.questions.slice(sec.range[0], sec.range[1] + 1);
                const secDone = secQuestions.filter(sq => sq.status === "done").length;
                const secTotal = secQuestions.length;
                return (
                  <div key={sec.label} className="relative">
                    {secIdx > 0 && <div style={{ height: 1, marginBottom: 4, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.04) 20%, rgba(255,255,255,0.04) 80%, transparent)" }} />}
                    <div className="flex items-center gap-2 px-0.5" style={{ marginTop: secIdx > 0 ? 2 : 1, marginBottom: 4 }}>
                      <span className="text-white/30 shrink-0" style={{ fontSize: 10, fontWeight: 600, letterSpacing: -0.2 }}>S{secIdx + 1}</span>
                      <span style={{ fontSize: 9, color: "rgba(255,255,255,0.12)" }}>·</span>
                      <span className="text-white/30 shrink-0" style={{ fontSize: 10, fontWeight: 500, letterSpacing: 0.05 }}>{sec.label}</span>
                      <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.04), transparent)" }} />
                      <span className="font-mono" style={{ fontSize: 9, color: secDone === secTotal ? "rgba(109,212,160,0.50)" : "rgba(255,255,255,0.12)" }}>{secDone}/{secTotal}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(28px, 1fr))", gap: 4 }}>
                      {secQuestions.map((q, i) => {
                        const globalIdx = sec.range[0] + i;
                        const iS = skippedIds.has(q.id);
                        return (
                          <div key={q.id} style={{ position: "relative" }}>
                            <div style={{ opacity: iS ? 0.28 : 1, transitionProperty: "opacity", transitionDuration: "0.2s", transitionTimingFunction: "ease" }}>
                              <QuestionRow q={q} index={globalIdx} scrollTo={globalIdx === activeIdx} />
                            </div>
                            {iS && (
                              <div style={{
                                position: "absolute", inset: 0, borderRadius: 5,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                pointerEvents: "none",
                              }}>
                                <div style={{ width: 1, height: "135%", background: "rgba(255,255,255,0.28)", transform: "rotate(45deg)" }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </MotionDiv>
          )}
        </div>
        {/* Question detail tooltip on hover — shared with State 2/3 */}
        {hQ && hoveredQIdx !== null && (
          <PortalTooltip anchorRef={hoveredTileRef as React.RefObject<HTMLElement>} visible={hoveredQIdx !== null} flipDown={tileFlipDown} width={230} placement="right">
            {hQDone && hQuality ? (
              <TooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} quality={hQuality} keyMomentSignal={hKeySignal} />
            ) : (
              <PendingTooltipContent q={hQ} label={`Q${hoveredQIdx + 1}: ${hQ.text}`} isActive={!!hQActive} />
            )}
          </PortalTooltip>
        )}
      </div>

      {/* ── Follow-up area — glass card ── */}
      <div className="min-h-0 flex flex-col" style={{
        background: "rgba(255,255,255,0.015)",
        borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.05)",
        borderRadius: 14, overflow: "hidden",
        flex: followUpExpanded ? "1 1 0" : "0 0 auto",
        transition: "flex 0.3s ease",
      }}>
        {/* Header — pill style matching Figma */}
        <button
          onClick={() => setFollowUpExpanded(v => !v)}
          className="flex items-center gap-0 px-1.5 py-1.5 shrink-0 cursor-pointer w-full hover:bg-white/[0.015]"
          style={{
            borderWidth: 0, borderBottomWidth: followUpExpanded ? 0.5 : 0,
            borderStyle: "solid",
            borderColor: "transparent", borderBottomColor: "rgba(255,255,255,0.04)",
            transition: "background-color 0.15s ease",
          }}
        >
          {/* Left pill: icon + label */}
          <div className="flex items-center gap-2 shrink-0" style={{
            background: "rgba(255,255,255,0.04)",
            borderRadius: 20, padding: "5px 12px 5px 10px",
          }}>
            <MessageSquare size={12} style={{ color: "rgba(255,255,255,0.35)" }} />
            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", letterSpacing: -0.1 }}>AI suggestion</span>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: chevron dropdown */}
          <div className="flex items-center shrink-0 pr-1">
            <ChevronDown size={12} style={{
              color: "rgba(255,255,255,0.25)",
              transform: followUpExpanded ? "rotate(0deg)" : "rotate(-90deg)",
              transition: "transform 0.25s ease",
            }} />
          </div>
        </button>

        {/* Expandable content */}
        {followUpExpanded && (
          <div className="flex flex-col gap-2 px-3 py-2.5 flex-1 min-h-0 overflow-y-auto scroll-area">
            {AI_FOLLOWUPS.slice(0, 3).map(s => (
              <FollowUpCard key={s.id} text={s.text}
                onClick={() => { setInputText(s.text); setTimeout(() => inputRef.current?.focus(), 30); }} />
            ))}
          </div>
        )}
      </div>

      {/* ── Input area — anchored bottom ── */}
      <div className="shrink-0 mt-3">
        <div className="relative mb-1.5">
          <textarea ref={inputRef} value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
            placeholder="AI-enhanced, ask at next natural pause"
            rows={2}
            className="w-full resize-none bg-white/[0.02] text-white/60 placeholder:text-white/15 px-3.5 py-3 pr-12 outline-none transition-colors focus:bg-white/[0.04] scroll-area"
            style={{ fontSize: T.body, borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.05)", borderRadius: 14, lineHeight: 1.6, letterSpacing: -0.08 }}
          />
          <button onClick={handleSend} disabled={!inputText.trim()}
            className="absolute right-2.5 bottom-3 p-2 rounded-full transition-all cursor-pointer disabled:cursor-default"
            style={{ background: inputText.trim() ? C.accent : "rgba(255,255,255,0.04)", opacity: inputText.trim() ? 1 : 0.2 }}>
            <Send size={13} className="text-white/80" style={{ opacity: inputText.trim() ? 1 : 0.2 }} />
          </button>
        </div>
        <div className="flex items-center justify-end pr-1 pb-1">
          <button onClick={() => setUrgent(prev => !prev)} className="flex items-center gap-2 cursor-pointer">
            <div className="relative shrink-0" style={{ width: 32, height: 18, borderRadius: 9999 }}>
              <div style={{
                position: "absolute", inset: 0, borderRadius: 9999,
                background: urgent ? "rgba(97,95,255,0.25)" : "rgba(255,255,255,0.05)",
                borderWidth: 0.5, borderStyle: "solid",
                borderColor: urgent ? "rgba(97,95,255,0.35)" : "rgba(255,255,255,0.04)",
                transition: "background 0.2s, border-color 0.2s",
              }} />
              <div style={{
                position: "absolute", top: 3, left: urgent ? 17 : 3.5,
                width: 12, height: 12, borderRadius: 9999,
                background: urgent ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.22)",
                transition: "background 0.2s, left 0.2s",
              }} />
            </div>
            <span className="text-white/25" style={{ fontSize: T.body, fontWeight: 500, letterSpacing: 0.06 }}>Urgent</span>
          </button>
        </div>
      </div>
    </div>
  );
}