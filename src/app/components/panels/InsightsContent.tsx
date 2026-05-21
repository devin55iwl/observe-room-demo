import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Mic, MessageCircle, Zap, Heart, Eye, TrendingUp, TrendingDown, ChevronDown } from "lucide-react";
import { T, C, R } from "../constants";
import { Card, SectionLabel } from "../primitives";
import { SESSIONS, INSIGHTS } from "../data";
import type { SessionQuestion, QuestionSignal } from "../data";
import { useCompact } from "../primitives";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;
const MotionPath = motion.path;
const MotionSpan = motion.span;

/* ── Signal icon map ── */
const SIG_ICON: Record<QuestionSignal["icon"], (size: number) => React.ReactNode> = {
  hesitation: (s) => <Pause size={s} strokeWidth={2.5} />,
  pitch:      (s) => <Mic size={s} strokeWidth={2} />,
  filler:     (s) => <MessageCircle size={s} strokeWidth={2} />,
  speed:      (s) => <Zap size={s} fill="currentColor" strokeWidth={0} />,
  emotion:    (s) => <Heart size={s} fill="currentColor" strokeWidth={0} />,
  gaze:       (s) => <Eye size={s} strokeWidth={2} />,
  agreement:  (s) => <TrendingUp size={s} strokeWidth={2} />,
};

function sigColor(icon: QuestionSignal["icon"]): string {
  if (icon === "hesitation" || icon === "filler" || icon === "gaze") return C.warning;
  if (icon === "emotion" || icon === "speed") return C.positive;
  return "rgba(255,255,255,0.40)";
}

function engColor(v: number) {
  return v >= 80 ? C.positive : v >= 60 ? C.warning : C.negative;
}
function engColorAlpha(v: number, a: number) {
  if (v >= 80) return `rgba(109,212,160,${a})`;
  if (v >= 60) return `rgba(255,209,102,${a})`;
  return `rgba(255,128,128,${a})`;
}

/* ══════════════════════════════════════════════════
   ── Interview Quality Gauge (Radial Arc) ──
   ══════════════════════════════════════════════════ */

function qualityGrade(score: number): { label: string; color: string; bgGlow: string } {
  if (score >= 80) return { label: "Excellent", color: "rgba(109,212,160,0.9)", bgGlow: "rgba(109,212,160,0.12)" };
  if (score >= 65) return { label: "Good", color: "rgba(109,212,160,0.65)", bgGlow: "rgba(109,212,160,0.08)" };
  if (score >= 50) return { label: "Fair", color: "rgba(255,209,102,0.8)", bgGlow: "rgba(255,209,102,0.10)" };
  return { label: "Needs Work", color: "rgba(255,128,128,0.8)", bgGlow: "rgba(255,128,128,0.10)" };
}

const GAUGE_SIZE = 120;
const GAUGE_CX = GAUGE_SIZE / 2;
const GAUGE_CY = GAUGE_SIZE / 2;
const GAUGE_R_OUTER = 54;
const GAUGE_R_INNER = 33;

const tipBg: React.CSSProperties = {
  backdropFilter: "blur(40px) saturate(150%)",
  WebkitBackdropFilter: "blur(40px) saturate(150%)",
  borderRadius: R.sm,
  background: "rgba(10,12,18,0.70)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.30)",
  color: "rgba(255,255,255,0.72)",
};

/* ── Sections for breakdown ── */
const SECTIONS = [
  { label: "S1", name: "Onboarding", range: [0, 3] as [number, number] },
  { label: "S2", name: "Workflow", range: [4, 9] as [number, number] },
  { label: "S3", name: "Collaboration", range: [10, 15] as [number, number] },
  { label: "S4", name: "Strategy", range: [16, 19] as [number, number] },
];

function InterviewTimeline() {
  const questions = SESSIONS[SESSIONS.length - 1].questions;
  const doneQs = questions.filter(q => q.status === "done");
  const done = doneQs.length;
  const n = questions.length;

  const avgEng = done > 0
    ? Math.round(doneQs.reduce((sum, q) => sum + (q.engagement ?? 0), 0) / done)
    : 0;
  const grade = qualityGrade(avgEng);

  const arcAngle = (Math.PI * 2) / n;
  const gap = 0.025;

  /* Hover state */
  const containerRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<{ q: SessionQuestion; x: number; y: number } | null>(null);
  const enter = useCallback((q: SessionQuestion, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHovered({ q, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);
  const move = useCallback((q: SessionQuestion, e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setHovered({ q, x: e.clientX - rect.left, y: e.clientY - rect.top });
  }, []);
  const leave = useCallback(() => setHovered(null), []);

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-3">
        <SectionLabel>Interview Quality</SectionLabel>
        <span className="font-mono text-white/18" style={{ fontSize: 8 }}>
          {done}/{n} completed
        </span>
      </div>

      <div className="flex items-center gap-4">
        {/* ── Radial arc gauge ─ */}
        <div ref={containerRef} className="relative shrink-0" style={{ width: GAUGE_SIZE, height: GAUGE_SIZE }}>
          {/* Glow */}
          <div className="absolute inset-0 rounded-full" style={{
            background: `radial-gradient(circle, ${grade.bgGlow} 0%, transparent 70%)`,
            filter: "blur(10px)",
          }} />

          <svg width={GAUGE_SIZE} height={GAUGE_SIZE} viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`} className="relative">
            {questions.map((q, i) => {
              const startAngle = -Math.PI / 2 + i * arcAngle + gap;
              const endAngle = startAngle + arcAngle - gap * 2;
              const isDone = q.status === "done";
              const eng = q.engagement ?? 0;
              const isHov = hovered?.q === q;
              const r = isDone ? GAUGE_R_INNER + ((GAUGE_R_OUTER - GAUGE_R_INNER) * (eng / 100)) : GAUGE_R_INNER + 2;

              const x1 = GAUGE_CX + GAUGE_R_INNER * Math.cos(startAngle);
              const y1 = GAUGE_CY + GAUGE_R_INNER * Math.sin(startAngle);
              const x2 = GAUGE_CX + r * Math.cos(startAngle);
              const y2 = GAUGE_CY + r * Math.sin(startAngle);
              const x3 = GAUGE_CX + r * Math.cos(endAngle);
              const y3 = GAUGE_CY + r * Math.sin(endAngle);
              const x4 = GAUGE_CX + GAUGE_R_INNER * Math.cos(endAngle);
              const y4 = GAUGE_CY + GAUGE_R_INNER * Math.sin(endAngle);
              const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

              const pathD = [
                `M${x1},${y1}`, `L${x2},${y2}`,
                `A${r},${r} 0 ${largeArc} 1 ${x3},${y3}`,
                `L${x4},${y4}`,
                `A${GAUGE_R_INNER},${GAUGE_R_INNER} 0 ${largeArc} 0 ${x1},${y1}`,
              ].join(" ");

              return (
                <MotionPath key={q.id} d={pathD}
                  fill={isDone ? engColorAlpha(eng, isHov ? 0.55 : 0.30) : isHov ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.02)"}
                  stroke={isHov ? "rgba(255,255,255,0.25)" : q.status === "active" ? C.accent : isDone ? engColorAlpha(eng, 0.12) : "rgba(255,255,255,0.03)"}
                  strokeWidth={isHov ? 1.2 : q.status === "active" ? 1 : 0.5}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.02 }}
                  onMouseEnter={(e: any) => enter(q, e)}
                  onMouseMove={(e: any) => move(q, e)}
                  onMouseLeave={leave}
                  style={{ cursor: "crosshair", transition: "fill 0.15s, stroke 0.15s" }}
                />
              );
            })}
          </svg>

          {/* Center quality display */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <MotionSpan
              className="font-mono tabular-nums"
              style={{ fontSize: 20, color: grade.color, lineHeight: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {avgEng}
            </MotionSpan>
            <span className="text-white/18 uppercase tracking-[0.08em] mt-0.5" style={{ fontSize: 6 }}>
              quality
            </span>
          </div>

          {/* Hover tooltip */}
          <MotionDiv
            key={hovered?.q.id}
            initial={{ opacity: 0, y: 3 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 3 }}
            transition={{ duration: 0.1 }}
            className="absolute z-50 pointer-events-none"
            style={{
              left: hovered ? hovered.x + 12 : 0, top: hovered ? hovered.y - 8 : 0,
              transform: "translateY(-100%)", maxWidth: 220, minWidth: 160,
            }}>
            {hovered && (() => {
              const q = hovered.q;
              const idx = questions.indexOf(q);
              const eng = q.engagement ?? 0;
              const sigs = (q.signals ?? []).slice(0, 3);
              return (
                <div style={{
                  background: "rgba(10,12,18,0.94)", backdropFilter: "blur(20px)",
                  border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: R.sm,
                  padding: "8px 10px",
                  boxShadow: "0 8px 24px rgba(0,0,0,0.50)",
                }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-white/25" style={{ fontSize: T.micro }}>Q{idx + 1}</span>
                    {q.status === "done" && (
                      <span className="font-mono px-1.5 py-0.5 rounded" style={{
                        fontSize: 7,
                        background: engColorAlpha(eng, 0.12),
                        color: engColor(eng),
                        border: `0.5px solid ${engColorAlpha(eng, 0.15)}`,
                      }}>
                        {eng}%
                      </span>
                    )}
                    {q.status === "active" && (
                      <span className="px-1.5 py-0.5 rounded" style={{ fontSize: 7, color: C.accent, background: "rgba(97,95,255,0.10)", border: "0.5px solid rgba(97,95,255,0.15)" }}>
                        Active
                      </span>
                    )}
                    {q.status === "pending" && (
                      <span className="text-white/15" style={{ fontSize: 7 }}>Pending</span>
                    )}
                  </div>
                  <p className="text-white/55 mb-1" style={{ fontSize: T.caption, lineHeight: 1.4 }}>
                    {q.text}
                  </p>
                  {sigs.length > 0 && (
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 pt-1" style={{ borderTop: "0.5px solid rgba(255,255,255,0.05)" }}>
                      {sigs.map((sig, si) => (
                        <div key={si} className="flex items-center gap-1" style={{ color: sigColor(sig.icon) }}>
                          {SIG_ICON[sig.icon](8)}
                          <span className="text-white/30" style={{ fontSize: 7 }}>{sig.label}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })()}
          </MotionDiv>
        </div>

        {/* ── Right side: grade + section breakdown ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">
          {/* Grade badge */}
          <div className="flex items-center gap-2">
            <div className="size-[7px] rounded-full" style={{ background: grade.color }} />
            <span style={{ fontSize: 11, color: grade.color, fontWeight: 600, letterSpacing: -0.2 }}>
              {grade.label}
            </span>
          </div>

          {/* Section mini bars */}
          <div className="flex flex-col gap-1.5">
            {SECTIONS.map(sec => {
              const secQs = questions.slice(sec.range[0], sec.range[1] + 1);
              const secDone = secQs.filter(q => q.status === "done");
              const secAvg = secDone.length > 0
                ? Math.round(secDone.reduce((s, q) => s + (q.engagement ?? 0), 0) / secDone.length)
                : 0;
              const secGrade = qualityGrade(secAvg);
              const secProgress = secDone.length > 0 ? secAvg : 0;
              return (
                <div key={sec.label} className="flex items-center gap-2">
                  <span className="font-mono text-white/20 shrink-0" style={{ fontSize: 7, width: 16 }}>
                    {sec.label}
                  </span>
                  <div className="flex-1 h-[4px] rounded-full" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <MotionDiv
                      className="h-full rounded-full"
                      style={{ background: secDone.length > 0 ? secGrade.color : "rgba(255,255,255,0.04)" }}
                      initial={{ width: 0 }}
                      animate={{ width: `${secProgress}%` }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
                    />
                  </div>
                  <span className="font-mono tabular-nums text-white/18 shrink-0" style={{ fontSize: 7, minWidth: 18, textAlign: "right" }}>
                    {secDone.length > 0 ? `${secAvg}%` : "—"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
   ── Sentiment Breakdown ──
   ══════════════════════════════════════════════════ */
function SentimentBreakdown() {
  const { positive, neutral, negative } = INSIGHTS.sentiment;
  const segments = [
    { label: "Positive", value: positive, color: C.positive, alpha: "rgba(109,212,160,0.20)" },
    { label: "Neutral", value: neutral, color: "rgba(255,255,255,0.35)", alpha: "rgba(255,255,255,0.06)" },
    { label: "Negative", value: negative, color: C.negative, alpha: "rgba(255,128,128,0.15)" },
  ];

  return (
    <Card className="p-3.5">
      <SectionLabel>Sentiment</SectionLabel>
      {/* Stacked horizontal bar */}
      <div className="flex items-center gap-[2px] h-[6px] rounded-full overflow-hidden mb-3">
        {segments.map(seg => (
          <MotionDiv
            key={seg.label}
            className="h-full"
            style={{ background: seg.color, opacity: 0.6, borderRadius: 2 }}
            initial={{ width: 0 }}
            animate={{ width: `${seg.value}%` }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
          />
        ))}
      </div>
      {/* Legend */}
      <div className="flex items-center gap-4">
        {segments.map(seg => (
          <div key={seg.label} className="flex items-center gap-1.5">
            <div className="size-[5px] rounded-full" style={{ background: seg.color, opacity: 0.8 }} />
            <span className="text-white/30" style={{ fontSize: T.micro }}>{seg.label}</span>
            <span className="font-mono text-white/45" style={{ fontSize: T.micro }}>{seg.value}%</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
   ── Key Highlights ──
   ════════════��═════════════════════════════════════ */
function KeyHighlights() {
  return (
    <Card className="p-3.5">
      <SectionLabel>Highlights</SectionLabel>
      <div className="flex flex-col gap-2">
        {INSIGHTS.highlights.map((hl, i) => (
          <MotionDiv
            key={i}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i, type: "spring", damping: 24, stiffness: 260 }}
            className="flex items-start gap-2.5"
          >
            {/* Intensity indicator */}
            <div className="shrink-0 mt-[3px] flex items-center gap-[2px]">
              {[0, 1, 2].map(bi => (
                <div key={bi} style={{
                  width: 8, height: 5, borderRadius: 1.5,
                  background: bi < Math.round(hl.intensity * 3)
                    ? hl.intensity >= 0.8 ? "rgba(109,212,160,0.65)" : hl.intensity >= 0.6 ? "rgba(255,209,102,0.55)" : "rgba(255,128,128,0.45)"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: bi < Math.round(hl.intensity * 3)
                    ? hl.intensity >= 0.8 ? "0 0 3px rgba(109,212,160,0.3)" : hl.intensity >= 0.6 ? "0 0 3px rgba(255,209,102,0.25)" : "none"
                    : "none",
                }} />
              ))}
            </div>
            <span className="text-white/50" style={{ fontSize: T.caption, lineHeight: 1.45, letterSpacing: -0.05 }}>
              {hl.text}
            </span>
          </MotionDiv>
        ))}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
   ── Keyword Cloud ──
   ══════════════════════════════════════════════════ */
function KeywordCloud() {
  return (
    <Card className="p-3.5">
      <SectionLabel>Keywords</SectionLabel>
      <div className="flex flex-wrap gap-1.5">
        {INSIGHTS.keywords.map((kw, i) => {
          const maxCount = Math.max(...INSIGHTS.keywords.map(k => k.count));
          const intensity = kw.count / maxCount;
          return (
            <MotionDiv
              key={kw.tag}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.04 * i, type: "spring", damping: 22, stiffness: 300 }}
              className="flex items-center gap-1.5 px-2.5 py-1.5"
              style={{
                borderRadius: 8,
                background: `rgba(97,95,255,${0.03 + intensity * 0.08})`,
                borderWidth: 0.5, borderStyle: "solid",
                borderColor: `rgba(97,95,255,${0.08 + intensity * 0.14})`,
              }}
            >
              <span className="text-white/55" style={{ fontSize: T.caption, letterSpacing: -0.05 }}>
                {kw.tag}
              </span>
              <span className="font-mono" style={{
                fontSize: 8,
                color: `rgba(97,95,255,${0.35 + intensity * 0.45})`,
              }}>
                {kw.count}
              </span>
            </MotionDiv>
          );
        })}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
   ── Section Quality Breakdown (compact view) ──
   ══════════════════════════════════════════════════ */
function SectionBreakdown() {
  const questions = SESSIONS[SESSIONS.length - 1].questions;

  return (
    <Card className="p-3.5">
      <SectionLabel>Section Breakdown</SectionLabel>
      <div className="flex flex-col gap-2.5">
        {SECTIONS.map((sec, si) => {
          const secQs = questions.slice(sec.range[0], sec.range[1] + 1);
          const secDone = secQs.filter(q => q.status === "done");
          const secAvg = secDone.length > 0
            ? Math.round(secDone.reduce((s, q) => s + (q.engagement ?? 0), 0) / secDone.length)
            : 0;
          const grade = qualityGrade(secAvg);
          const topSignals = secDone
            .flatMap(q => q.signals ?? [])
            .slice(0, 2);

          return (
            <MotionDiv
              key={sec.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: si * 0.06, duration: 0.3 }}
              className="flex items-center gap-3"
            >
              {/* Section label */}
              <div className="shrink-0 flex flex-col items-center" style={{ width: 28 }}>
                <span className="font-mono text-white/35" style={{ fontSize: 10, letterSpacing: -0.2 }}>{sec.label}</span>
                <span className="text-white/15" style={{ fontSize: 7 }}>{sec.name}</span>
              </div>
              {/* Progress bar */}
              <div className="flex-1 min-w-0">
                <div className="h-[5px] rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.04)" }}>
                  <MotionDiv
                    className="h-full rounded-full"
                    style={{ background: secDone.length > 0 ? grade.color : "rgba(255,255,255,0.04)" }}
                    initial={{ width: 0 }}
                    animate={{ width: `${secAvg}%` }}
                    transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 + si * 0.08 }}
                  />
                </div>
              </div>
              {/* Score + signals */}
              <div className="shrink-0 flex items-center gap-1.5">
                {topSignals.length > 0 && (
                  <div className="flex items-center gap-[2px]">
                    {topSignals.map((sig, i) => (
                      <span key={i} style={{ color: sigColor(sig.icon), opacity: 0.5 }}>
                        {SIG_ICON[sig.icon](7)}
                      </span>
                    ))}
                  </div>
                )}
                <span className="font-mono tabular-nums" style={{
                  fontSize: 9,
                  color: secDone.length > 0 ? grade.color : "rgba(255,255,255,0.15)",
                  minWidth: 22,
                  textAlign: "right",
                }}>
                  {secDone.length > 0 ? `${secAvg}` : "—"}
                </span>
              </div>
            </MotionDiv>
          );
        })}
      </div>
    </Card>
  );
}

/* ══════════════════════════════════════════════════
   ── InsightsContent — Adaptive Layout ──
   compact: 0 = full, 1 = half, 2 = compact, 3 = minimal
   ══════════════════════════════════════════════════ */
export function InsightsContent() {
  const compact = useCompact();

  /* ── State 3/4: Minimal — just sentiment bar + score ── */
  if (compact >= 2) {
    const questions = SESSIONS[SESSIONS.length - 1].questions;
    const doneQs = questions.filter(q => q.status === "done");
    const avgEng = doneQs.length > 0
      ? Math.round(doneQs.reduce((sum, q) => sum + (q.engagement ?? 0), 0) / doneQs.length)
      : 0;
    const grade = qualityGrade(avgEng);
    const { positive, neutral, negative } = INSIGHTS.sentiment;

    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 px-3 py-2">
        {/* Quality score */}
        <div className="flex items-center gap-2">
          <div className="size-[6px] rounded-full" style={{ background: grade.color }} />
          <MotionSpan
            className="font-mono tabular-nums"
            style={{ fontSize: 22, color: grade.color, lineHeight: 1 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            {avgEng}
          </MotionSpan>
          <span className="text-white/15 uppercase tracking-[0.1em]" style={{ fontSize: 7 }}>quality</span>
        </div>

        {/* Mini sentiment bar */}
        <div className="w-full max-w-[200px]">
          <div className="flex items-center gap-[2px] h-[4px] rounded-full overflow-hidden">
            <div className="h-full rounded-sm" style={{ width: `${positive}%`, background: C.positive, opacity: 0.5 }} />
            <div className="h-full rounded-sm" style={{ width: `${neutral}%`, background: "rgba(255,255,255,0.25)", opacity: 0.5 }} />
            <div className="h-full rounded-sm" style={{ width: `${negative}%`, background: C.negative, opacity: 0.5 }} />
          </div>
          <div className="flex items-center justify-between mt-1.5">
            {[
              { label: "+", value: positive, color: C.positive },
              { label: "○", value: neutral, color: "rgba(255,255,255,0.25)" },
              { label: "−", value: negative, color: C.negative },
            ].map(s => (
              <span key={s.label} className="font-mono" style={{ fontSize: 7, color: s.color, opacity: 0.6 }}>
                {s.value}%
              </span>
            ))}
          </div>
        </div>

        {/* Grade label */}
        <span style={{ fontSize: 9, color: grade.color, opacity: 0.6, letterSpacing: -0.1 }}>
          {grade.label}
        </span>
      </div>
    );
  }

  /* ── State 2: Half height — sentiment + keywords (no summary) ── */
  if (compact >= 1) {
    const questions = SESSIONS[SESSIONS.length - 1].questions;
    const doneQs = questions.filter(q => q.status === "done");
    const avgEng = doneQs.length > 0
      ? Math.round(doneQs.reduce((sum, q) => sum + (q.engagement ?? 0), 0) / doneQs.length)
      : 0;
    const grade = qualityGrade(avgEng);
    return (
      <div className="flex flex-col gap-2.5 flex-1 overflow-y-auto scroll-area">
        {/* Quality score strip */}
        <Card className="p-3">
          <div className="flex items-center gap-3">
            <div className="size-[6px] rounded-full shrink-0" style={{ background: grade.color }} />
            <MotionSpan
              className="font-mono tabular-nums"
              style={{ fontSize: 20, color: grade.color, lineHeight: 1 }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              {avgEng}
            </MotionSpan>
            <span className="text-white/15 uppercase tracking-[0.1em]" style={{ fontSize: 7 }}>quality</span>
            <div className="flex-1" />
            <span style={{ fontSize: 9, color: grade.color, opacity: 0.6, letterSpacing: -0.1 }}>
              {grade.label}
            </span>
          </div>
        </Card>
        <SentimentBreakdown />
        <KeywordCloud />
      </div>
    );
  }

  /* ── State 1: Full height — complete insights dashboard ── */
  return (
    <div className="flex flex-col gap-3 flex-1 overflow-y-auto scroll-area">
      <InterviewTimeline />

      <Card className="p-3.5">
        <SectionLabel>Summary</SectionLabel>
        <p className="text-white/45" style={{ fontSize: T.caption, lineHeight: 1.55 }}>
          Participant highlighted frustrations with manual handoff processes and expressed strong
          interest in AI-powered automation. Key pain points: version control and cross-team gaps.
        </p>
      </Card>

      <SentimentBreakdown />
      <KeyHighlights />
      <SectionBreakdown />
      <KeywordCloud />
    </div>
  );
}