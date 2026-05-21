/**
 * Face Analysis — exports composable pieces:
 *   • useEmotionCycle  — data hook
 *   • FaceMeshOverlay  — wireframe SVG overlay
 *   • AnalysisContent  — panel body
 */
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;
const MotionCircle = motion.circle;

import { Brain, Activity, Zap, Radio } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";
import { Tip } from "./Tip";
import imgInterviewee from "figma:asset/fa0d16c39081a2c44765b4fd4bdd1d40747ed8e5.png";
import { T, R, C } from "./constants";

/* ── Local card style aliases (keep border split for Motion compat) ── */
const card: CSSProperties = {
  background: "rgba(255,255,255,0.035)",
  borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)",
  borderRadius: R.md,
  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.10)",
};
const cardGlow: CSSProperties = {
  ...card,
  background: "linear-gradient(180deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)",
  boxShadow:
    "inset 0 0.5px 0 rgba(255,255,255,0.06), 0 2px 8px rgba(0,0,0,0.10), 0 12px 28px -8px rgba(97,95,255,0.06)",
};
const tipBg: CSSProperties = {
  backdropFilter: "blur(40px) saturate(150%)",
  WebkitBackdropFilter: "blur(40px) saturate(150%)",
  borderRadius: R.sm,
  background: "rgba(10,12,18,0.70)",
  border: "1px solid rgba(255,255,255,0.14)",
  boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.30)",
  color: "rgba(255,255,255,0.72)",
};

/* ── Types & Data ── */
export interface EmotionState {
  primary: string;
  emoji: string;
  subtitle: string;
  description: string;
  confidence: number;
  valence: number;
  arousal: number;
  aus: { label: string; name: string; intensity: number }[];
  secondaries: { label: string; value: number }[];
}

const PRESETS: EmotionState[] = [
  {
    primary: "Engaged",
    emoji: "🤔",
    subtitle: "Actively focused",
    description: "Leaning forward with focused eye contact",
    confidence: 87,
    valence: 0.4,
    arousal: 0.55,
    aus: [
      { label: "AU1", name: "Inner Brow Raise", intensity: 42 },
      { label: "AU6", name: "Cheek Raiser", intensity: 68 },
      { label: "AU12", name: "Lip Corner Puller", intensity: 55 },
      { label: "AU25", name: "Lips Part", intensity: 30 },
    ],
    secondaries: [{ label: "Curious", value: 22 }, { label: "Calm", value: 15 }, { label: "Hopeful", value: 8 }],
  },
  {
    primary: "Neutral",
    emoji: "😐",
    subtitle: "Deep in thought",
    description: "Person looking forward with neutral expression",
    confidence: 73,
    valence: 0.1,
    arousal: 0.35,
    aus: [
      { label: "AU1", name: "Inner Brow Raise", intensity: 55 },
      { label: "AU4", name: "Brow Lowerer", intensity: 38 },
      { label: "AU7", name: "Lid Tightener", intensity: 22 },
      { label: "AU24", name: "Lip Presser", intensity: 45 },
    ],
    secondaries: [{ label: "Focused", value: 28 }, { label: "Uncertain", value: 12 }, { label: "Neutral", value: 9 }],
  },
  {
    primary: "Enthusiastic",
    emoji: "😊",
    subtitle: "Highly energized",
    description: "Speaking with visible excitement and wide gestures",
    confidence: 91,
    valence: 0.7,
    arousal: 0.78,
    aus: [
      { label: "AU6", name: "Cheek Raiser", intensity: 82 },
      { label: "AU12", name: "Lip Corner Puller", intensity: 76 },
      { label: "AU25", name: "Lips Part", intensity: 60 },
      { label: "AU26", name: "Jaw Drop", intensity: 35 },
    ],
    secondaries: [{ label: "Joyful", value: 18 }, { label: "Surprised", value: 14 }, { label: "Engaged", value: 11 }],
  },
  {
    primary: "Frustrated",
    emoji: "😤",
    subtitle: "Showing distress",
    description: "Speaking with a slight frown and tense posture",
    confidence: 64,
    valence: -0.45,
    arousal: 0.6,
    aus: [
      { label: "AU4", name: "Brow Lowerer", intensity: 72 },
      { label: "AU9", name: "Nose Wrinkler", intensity: 35 },
      { label: "AU17", name: "Chin Raiser", intensity: 48 },
      { label: "AU24", name: "Lip Presser", intensity: 55 },
    ],
    secondaries: [{ label: "Annoyed", value: 20 }, { label: "Confused", value: 16 }, { label: "Tense", value: 10 }],
  },
];

/* ── Helpers ── */
const valColor = (v: number) => v > 0.3 ? C.positive : v < -0.3 ? C.negative : "rgba(255,255,255,0.40)";
const valLabel = (v: number) => v > 0.3 ? "Positive" : v < -0.3 ? "Negative" : "Neutral";

function SectionLabel({ children, tip }: { children: ReactNode; tip?: string }) {
  const label = (
    <div className={`flex items-center gap-3 mb-3 ${tip ? "cursor-help" : ""}`}>
      <span className={`uppercase tracking-[0.14em] text-white/14 ${tip ? "border-b border-dashed border-white/8" : ""}`}
        style={{ fontSize: T.micro }}>{children}</span>
      <div className="flex-1 h-px bg-white/[0.04]" />
    </div>
  );
  return tip ? <Tip text={tip} align="left">{label}</Tip> : label;
}

/* ── Hook: useEmotionCycle ── */
export function useEmotionCycle() {
  const [idx, setIdx] = useState(0);
  const [history, setHistory] = useState<EmotionState[]>([PRESETS[0]]);
  useEffect(() => {
    const id = setInterval(() => {
      setIdx(prev => {
        const next = (prev + 1) % PRESETS.length;
        setHistory(h => [...h.slice(-19), PRESETS[next]]);
        return next;
      });
    }, 4000);
    return () => clearInterval(id);
  }, []);
  return { emotion: PRESETS[idx], history };
}

/* ── Face Mesh Overlay ── */
/* Mesh color — warm amber/gold like professional CV face detection */
const MESH_COLOR = "#D4A76A";
const MESH_COLOR_BRIGHT = "#E8C88A";

const LANDMARKS: [number, number][] = [
  /* 0-12: Jaw contour */
  [22,42],[20,52],[21,62],[24,71],[30,78],[40,83],[50,85],[60,83],[70,78],
  [76,71],[79,62],[80,52],[78,42],
  /* 13-20: Brow line */
  [28,34],[33,30],[39,29],[44,31],[56,31],[61,29],[67,30],[72,34],
  /* 21-24: Nose bridge */
  [50,35],[50,41],[50,47],[50,53],
  /* 25-29: Nose bottom */
  [43,55],[46,57],[50,58],[54,57],[57,55],
  /* 30-35: Left eye */
  [30,38],[34,35],[38,35],[42,38],[38,40],[34,40],
  /* 36-41: Right eye */
  [58,38],[62,35],[66,35],[70,38],[66,40],[62,40],
  /* 42-48: Upper lip */
  [38,66],[42,63],[47,61],[50,62],[53,61],[58,63],[62,66],
  /* 49-53: Lower lip */
  [58,70],[53,72],[50,73],[47,72],[42,70],
  /* 54-61: Inner mouth */
  [41,66],[47,64],[50,65],[53,64],[59,66],[53,68],[50,69],[47,68],
  /* 62-66: Forehead */
  [30,28],[40,24],[50,22],[62,24],[70,28],
  /* 67-72: Extra forehead detail */
  [35,26],[44,23],[50,20],[56,23],[65,26],[50,26],
  /* 73-76: Cheek fill L */
  [28,48],[32,55],[36,60],[34,50],
  /* 77-80: Cheek fill R */
  [72,48],[68,55],[64,60],[66,50],
  /* 81-84: Temple fill */
  [24,36],[76,36],[26,46],[78,46],
  /* 85-88: Mid-face bridge */
  [40,48],[44,50],[56,50],[60,48],
  /* 89-92: Nose sides */
  [44,44],[46,50],[54,50],[56,44],
  /* 93-96: Under-eye */
  [34,42],[40,42],[60,42],[66,42],
];

const TRIS: [number, number, number][] = [
  /* Jaw → brow connections */
  [59,60,13],[60,61,14],[61,62,17],[62,63,20],
  [13,14,60],[14,15,61],[17,18,62],[20,19,63],
  /* Nose bridge triangles */
  [13,29,30],[15,16,31],[16,21,31],[17,35,36],[19,20,37],[20,37,12],
  /* Left eye */
  [29,30,34],[30,31,34],[31,32,33],[31,33,34],
  /* Right eye */
  [35,36,40],[36,37,40],[37,38,39],[37,39,40],
  /* Brow-nose bridge */
  [21,22,31],[21,22,36],[22,23,25],[22,23,28],
  [23,24,25],[23,24,28],[24,25,26],[24,27,28],[26,27,24],
  /* Face contour */
  [0,29,13],[0,1,29],[12,37,20],[11,12,37],
  [1,2,34],[2,3,25],[11,10,39],[10,9,28],
  [3,4,41],[4,5,52],[5,6,51],[9,8,47],[8,7,48],[7,6,49],
  /* Mouth-nose connections */
  [25,41,42],[28,47,46],[42,43,44],[44,45,46],
  [41,52,53],[47,48,55],[43,54,56],[45,55,57],
  /* Forehead mesh */
  [62,63,67],[63,64,68],[64,69,72],[64,65,70],[65,66,71],[66,20,71],
  [13,62,81],[20,66,82],[0,81,13],[12,82,20],
  [67,68,14],[68,69,15],[69,72,16],[72,70,17],[70,71,18],[71,19,66],
  [62,67,13],[67,14,13],[66,71,20],[71,19,20],
  [68,72,69],[64,72,68],
  /* Cheek fill L */
  [1,73,83],[73,74,2],[74,75,3],[73,76,1],[76,30,1],
  [83,73,0],[0,73,29],
  /* Cheek fill R */
  [11,77,84],[77,78,10],[78,79,9],[77,80,11],[80,37,11],
  [84,77,12],[12,77,37],
  /* Mid-face */
  [85,86,22],[87,88,22],[85,93,30],[88,96,37],
  [86,89,23],[87,92,23],[89,90,25],[91,92,28],
  [90,91,27],[90,26,91],
  [93,94,31],[94,85,32],[95,88,36],[96,95,39],
  /* Under-eye to cheek */
  [93,76,34],[96,80,40],[93,34,30],[96,40,37],
  [76,85,94],[80,88,95],
];

export function FaceMeshOverlay() {
  const [scanY, setScanY] = useState(20);
  useEffect(() => {
    let dir = 1, y = 20;
    const id = setInterval(() => {
      y += dir * 0.25;
      if (y > 85) dir = -1;
      if (y < 20) dir = 1;
      setScanY(y);
    }, 30);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
      <div style={{ width: "42%", height: "65%", position: "relative" }}>
        <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
          <defs>
            <radialGradient id="fmGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={MESH_COLOR} stopOpacity="0.06" />
              <stop offset="100%" stopColor={MESH_COLOR} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="fmScan" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={MESH_COLOR_BRIGHT} stopOpacity="0" />
              <stop offset="50%" stopColor={MESH_COLOR_BRIGHT} stopOpacity="0.50" />
              <stop offset="100%" stopColor={MESH_COLOR_BRIGHT} stopOpacity="0" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#fmGlow)" />
          {/* Triangle mesh */}
          <g>
            {TRIS.map(([a, b, c], i) => {
              const pa = LANDMARKS[a], pb = LANDMARKS[b], pc = LANDMARKS[c];
              if (!pa || !pb || !pc) return null;
              return <polygon key={i} points={`${pa[0]},${pa[1]} ${pb[0]},${pb[1]} ${pc[0]},${pc[1]}`}
                fill="none" stroke={MESH_COLOR} strokeWidth="0.22" opacity={0.40} />;
            })}
          </g>
          {/* Vertex dots */}
          <g>
            {LANDMARKS.map(([x, y], i) => (
              <g key={i}>
                <circle cx={x} cy={y} r="0.7" fill={MESH_COLOR_BRIGHT} opacity={0.12} />
                <circle cx={x} cy={y} r="0.35" fill={MESH_COLOR_BRIGHT} opacity={0.65} />
              </g>
            ))}
          </g>
          {/* Scan line */}
          <line x1="15" y1={scanY} x2="85" y2={scanY} stroke="url(#fmScan)" strokeWidth="0.12" opacity={0.6} />
        </svg>
      </div>
    </div>
  );
}

/* ── Mini Gauge ── */
function MiniGauge({ value, max = 100, label, color, tip }: {
  value: number; max?: number; label: string; color: string; tip?: string;
}) {
  const size = 48, r = (size - 6) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - (value / max) * 0.75);

  const inner = (
    <div className={`flex flex-col items-center ${tip ? "cursor-help" : ""}`}>
      <svg width={size} height={size} className="-rotate-[135deg]">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth={2}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeLinecap="round" />
        <MotionCircle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={2}
          strokeDasharray={`${circ * 0.75} ${circ * 0.25}`} strokeLinecap="round"
          initial={{ strokeDashoffset: circ * 0.75 }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", damping: 22, stiffness: 100 }} />
      </svg>
      <div className="-mt-8 text-center">
        <div className="font-mono text-white/80" style={{ fontSize: T.body, color }}>{value}</div>
      </div>
      <div className="text-white/14 uppercase tracking-[0.12em] mt-1.5" style={{ fontSize: 7 }}>{label}</div>
    </div>
  );
  return tip ? <Tip text={tip}>{inner}</Tip> : inner;
}

/* ── Analysis Content ── */
export function AnalysisContent({ emotion: em, history }: {
  emotion: EmotionState; history: EmotionState[];
}) {
  return (
    <div className="flex flex-col gap-3 flex-1 min-h-0">
      {/* ── Live Video Feed + Primary Emotion (fixed, never compressed) ── */}
      <div style={cardGlow} className="overflow-hidden shrink-0">
        {/* Video preview with mesh overlay */}
        <div className="relative" style={{ height: 140 }}>
          <img src={imgInterviewee} alt="Live feed"
            className="w-full h-full object-cover object-top" />
          {/* Vignette */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.10) 0%, transparent 30%, transparent 50%, rgba(0,0,0,0.55) 100%)",
          }} />
          {/* Face mesh overlay inline (compact) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ width: "55%", height: "80%", position: "relative" }}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 w-full h-full">
                <defs>
                  <radialGradient id="fmGlowInline" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor={MESH_COLOR} stopOpacity="0.08" />
                    <stop offset="100%" stopColor={MESH_COLOR} stopOpacity="0" />
                  </radialGradient>
                </defs>
                <circle cx="50" cy="50" r="48" fill="url(#fmGlowInline)" />
                {TRIS.map(([a, b, c], i) => {
                  const pa = LANDMARKS[a], pb = LANDMARKS[b], pc = LANDMARKS[c];
                  if (!pa || !pb || !pc) return null;
                  return <polygon key={i} points={`${pa[0]},${pa[1]} ${pb[0]},${pb[1]} ${pc[0]},${pc[1]}`}
                    fill="none" stroke={MESH_COLOR} strokeWidth="0.28" opacity={0.50} />;
                })}
                {LANDMARKS.map(([x, y], i) => (
                  <circle key={i} cx={x} cy={y} r="0.4" fill={MESH_COLOR_BRIGHT} opacity={0.70} />
                ))}
              </svg>
            </div>
          </div>
          {/* Live badge — top-left */}
          <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1"
            style={{
              borderRadius: 6,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
              border: "0.5px solid rgba(255,255,255,0.08)",
            }}>
            <Radio size={8} style={{ color: C.negative }} className="animate-pulse" />
            <span className="text-white/60 uppercase tracking-[0.12em]" style={{ fontSize: 7 }}>Live</span>
          </div>
          {/* Confidence ring — top-right */}
          <div className="absolute top-2 right-2.5 flex items-center gap-1.5 px-2 py-1"
            style={{
              borderRadius: 6,
              background: "rgba(0,0,0,0.45)",
              backdropFilter: "blur(12px)",
              border: "0.5px solid rgba(255,255,255,0.08)",
            }}>
            <span className="font-mono" style={{ fontSize: T.caption, color: C.accent }}>{em.confidence}%</span>
          </div>
          {/* Bottom overlay: emotion + subtitle */}
          <div className="absolute bottom-0 left-0 right-0 px-3.5 pb-3 pt-6"
            style={{ background: "linear-gradient(0deg, rgba(0,0,0,0.60) 0%, transparent 100%)" }}>
            <div className="flex items-end justify-between">
              <div>
                <AnimatePresence mode="wait">
                  <MotionDiv key={em.primary}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-2">
                    <span style={{ fontSize: 18 }}>{em.emoji}</span>
                    <span className="text-white/90" style={{ fontSize: T.title }}>{em.primary}</span>
                  </MotionDiv>
                </AnimatePresence>
                <div className="text-white/35 mt-0.5" style={{ fontSize: T.micro }}>{em.subtitle}</div>
              </div>
              {/* Mini valence/arousal pills */}
              <div className="flex items-center gap-1.5">
                <div className="px-1.5 py-0.5 flex items-center gap-1" style={{
                  borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.06)",
                }}>
                  <div className="size-1 rounded-full" style={{ background: valColor(em.valence) }} />
                  <span className="font-mono text-white/35" style={{ fontSize: 7 }}>{em.valence > 0 ? "+" : ""}{em.valence.toFixed(1)}</span>
                </div>
                <div className="px-1.5 py-0.5 flex items-center gap-1" style={{
                  borderRadius: 4, background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.06)",
                }}>
                  <Zap size={6} style={{ color: em.arousal > 0.6 ? C.warning : "rgba(255,255,255,0.35)" }} />
                  <span className="font-mono text-white/35" style={{ fontSize: 7 }}>{(em.arousal * 100).toFixed(0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Active AU indicators strip */}
        <div className="flex items-center gap-1 px-3.5 py-2" style={{ borderTop: "0.5px solid rgba(255,255,255,0.04)" }}>
          <Brain size={9} style={{ color: C.accent, opacity: 0.5 }} />
          <div className="flex items-center gap-1 flex-1 overflow-hidden">
            {em.aus.slice(0, 4).map(au => (
              <div key={au.label} className="flex items-center gap-1 px-1.5 py-0.5 shrink-0"
                style={{ borderRadius: 4, background: "rgba(97,95,255,0.06)", border: "0.5px solid rgba(97,95,255,0.10)" }}>
                <span className="font-mono text-white/28" style={{ fontSize: 7 }}>{au.label}</span>
                <div className="w-4 h-[2px] rounded-full bg-white/[0.04]">
                  <MotionDiv className="h-full rounded-full" style={{ background: C.accent, opacity: 0.50 }}
                    animate={{ width: `${au.intensity}%` }} transition={{ type: "spring", damping: 22, stiffness: 100 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Emotion Analysis — 2-column snapshot grid (scrollable) ── */}
      <div className="flex flex-col min-h-0 flex-1 overflow-hidden" style={card}>
        <div className="p-3.5 pb-0 shrink-0">
          <SectionLabel tip="Detected emotions over the session timeline">Emotion Analysis</SectionLabel>
          {/* Bar chart */}
          <div className="flex items-end gap-[2px] h-7 mb-3">
            {history.map((h, i) => (
              <MotionDiv key={`tl-${i}`} className="flex-1 rounded-sm relative group/bar cursor-default"
                style={{ background: h.valence > 0.3 ? C.positive : h.valence < -0.3 ? C.negative : C.accent, opacity: 0.35 }}
                initial={{ height: 0 }} animate={{ height: `${h.confidence}%` }}
                transition={{ delay: i * 0.04, duration: 0.35 }}>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2 py-1 whitespace-nowrap
                  opacity-0 group-hover/bar:opacity-100 transition-all pointer-events-none z-10"
                  style={{ ...tipBg, fontSize: 8 }}>{h.primary} {h.confidence}%</div>
              </MotionDiv>
            ))}
          </div>
        </div>
        {/* Snapshot cards — 2-column grid, scrollable */}
        <div className="overflow-y-auto scroll-area flex-1 min-h-0 px-3.5 pb-3.5">
          <div className="grid grid-cols-2 gap-2.5">
            {history.slice(-4).map((h, i) => {
              const elapsed = Math.max(0, history.length - 4 + i) * 4;
              const mm = String(Math.floor(elapsed / 60)).padStart(2, "0");
              const ss = String(elapsed % 60).padStart(2, "0");
              const confPct = h.confidence;
              return (
                <MotionDiv key={`grid-${i}-${h.primary}`}
                  className="flex flex-col"
                  initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05, duration: 0.3 }}>
                  {/* Thumbnail with timestamp */}
                  <div className="relative overflow-hidden" style={{
                    borderRadius: 10,
                    aspectRatio: "4/3",
                    border: "0.5px solid rgba(255,255,255,0.08)",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.12)",
                  }}>
                    <img src={imgInterviewee} alt={h.primary}
                      className="w-full h-full object-cover"
                      style={{ filter: `brightness(${0.7 + confPct * 0.003}) saturate(${0.8 + confPct * 0.004})` }} />
                    <div className="absolute inset-0" style={{
                      background: "linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.40) 100%)",
                    }} />
                    {/* Timestamp badge */}
                    <div className="absolute bottom-1.5 right-1.5 px-2 py-0.5 font-mono"
                      style={{
                        fontSize: T.micro,
                        borderRadius: 6,
                        background: "rgba(0,0,0,0.55)",
                        backdropFilter: "blur(8px)",
                        color: "rgba(255,255,255,0.80)",
                      }}>
                      {mm}:{ss}
                    </div>
                  </div>
                  {/* Emoji + Label + Description */}
                  <div className="pt-2 pb-1 px-0.5">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span style={{ fontSize: 14 }}>{h.emoji}</span>
                      <span className="text-white/70" style={{ fontSize: T.caption }}>{h.primary}</span>
                    </div>
                    <p className="text-white/30" style={{ fontSize: T.micro, lineHeight: 1.4 }}>{h.description}</p>
                  </div>
                </MotionDiv>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FaceAnalysisView() { return null; }