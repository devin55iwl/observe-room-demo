/**
 * ParticipantPage v17 — Dual-mode (Light / Dark)
 *
 * Light: White frosted glass + amber accent + bright living room
 * Dark:  Cinematic dark glass + purple accent + Matterhorn night
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Mic, MicOff, Camera, CameraOff,
  Pause, Play, CheckCircle,
  Keyboard, ChevronRight, ChevronLeft,
  Send, LogOut, Sun, Moon,
  MonitorUp, Scan, Volume2, ChevronUp, BookOpen,
  ArrowRight,
} from "lucide-react";
import imgFace from "figma:asset/fa0d16c39081a2c44765b4fd4bdd1d40747ed8e5.png";
import imgDarkBg from "figma:asset/c6fe44898bbfde63751a3f1f6653e91005096cb4.png";
import svgIconPaths from "../../imports/svg-sm4p1qlmaq";
import svgOrbPaths from "../../imports/svg-cshb1u9rpu";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { LanguageStep }    from "../components/participant/LanguageStep";
import { TermsStep }       from "../components/participant/TermsStep";
import { SetupStep }       from "../components/participant/SetupStep";
import { ScreenerStep }    from "../components/participant/ScreenerStep";
import {
  SF, MONO,
  ParticipantThemeProvider, useParticipantTheme,
  useIsMobile,
} from "../components/participant/FunnelShell";

/* ── Motion pre-destructure ── */
const MotionDiv  = motion.div;
const MotionSpan = motion.span;

const BG_LIGHT = "https://images.unsplash.com/photo-1760067538241-33a8694d9e23?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlnaHQlMjBtb2Rlcm4lMjBsaXZpbmclMjByb29tJTIwbmF0dXJhbCUyMGxpZ2h0JTIwd2FybSUyMGludGVyaW9yfGVufDF8fHx8MTc3MzgxNzE3NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

const SCREEN_SHARE_IMG = "https://images.unsplash.com/photo-1697894812544-db326714ce22?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYWNPUyUyMGRlc2t0b3AlMjB3YWxscGFwZXIlMjBtb3VudGFpbnN8ZW58MXx8fHwxNzczODk5NjY3fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral";

/* ─────────── Types ─────────── */
type Stage =
  | "language" | "terms" | "setup" | "screener"
  | "disqualified" | "ready" | "interview" | "paused" | "complete";

type Speech = "speaking" | "listening" | "thinking";

type ComparisonOption = {
  id: string;
  img: string;
  label: string;
  subtitle?: string;
};

type Question = {
  id: number; num: string; topic: string; text: string;
  type?: "text" | "comparison";
  options?: ComparisonOption[];
  multiSelect?: boolean;
};

const COMP_IMGS = [
  "https://images.unsplash.com/photo-1687125114692-54f19a0fd438?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmQlMjBkYXJrJTIwaW50ZXJmYWNlfGVufDF8fHx8MTc3Mzg3MjMxNXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1717994818193-266ff93e3396?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3aGl0ZSUyMG1pbmltYWwlMjBkYXNoYm9hcmQlMjBVSSUyMGRlc2lnbnxlbnwxfHx8fDE3NzM5MDk5MTN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1626234736261-f50c9ff94bef?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkYXRhJTIwdmlzdWFsaXphdGlvbiUyMGNvbG9yZnVsJTIwY2hhcnR8ZW58MXx8fHwxNzczOTA5OTA5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1641862039942-5815d8f74938?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2JpbGUlMjBhcHAlMjBpbnRlcmZhY2UlMjBkZXNpZ24lMjBjbGVhbnxlbnwxfHx8fDE3NzM5MDk5MDl8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1591783097758-85335ca9635d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwZGVzaWduJTIwcHJvdG90eXBlJTIwd2lyZWZyYW1lfGVufDF8fHx8MTc3MzkwOTkxMHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
  "https://images.unsplash.com/photo-1726137065519-c9a1b9eca951?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmaW50ZWNoJTIwYmFua2luZyUyMGFwcCUyMGludGVyZmFjZXxlbnwxfHx8fDE3NzM5MDk5MTF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
];

const QS: Question[] = [
  { id: 17, num: "Q17", topic: "Future Workflow",     text: "Looking ahead, what would your ideal design workflow look like in the next couple of years?" },
  { id: 18, num: "Q18", topic: "Design Preference",   text: "Which dashboard layout do you find more intuitive for daily use?", type: "comparison",
    options: [
      { id: "a", img: COMP_IMGS[0], label: "Session one", subtitle: "Dark Analytics" },
      { id: "b", img: COMP_IMGS[1], label: "Session two", subtitle: "Minimal White" },
      { id: "c", img: COMP_IMGS[2], label: "Session three", subtitle: "Data Viz" },
      { id: "d", img: COMP_IMGS[3], label: "Session four", subtitle: "Mobile App" },
    ] },
  { id: 19, num: "Q19", topic: "Tool Comparison",   text: "Which of these prototyping tools would best fit your team's needs?", type: "comparison", multiSelect: true,
    options: [
      { id: "a", img: COMP_IMGS[0], label: "Tool Alpha", subtitle: "Enterprise" },
      { id: "b", img: COMP_IMGS[1], label: "Tool Beta", subtitle: "Lightweight" },
      { id: "c", img: COMP_IMGS[2], label: "Tool Gamma", subtitle: "Data-first" },
      { id: "d", img: COMP_IMGS[3], label: "Tool Delta", subtitle: "Mobile" },
      { id: "e", img: COMP_IMGS[4], label: "Tool Epsilon", subtitle: "Prototype" },
      { id: "f", img: COMP_IMGS[5], label: "Tool Zeta", subtitle: "Fintech" },
    ] },
  { id: 20, num: "Q20", topic: "Closing Reflections",  text: "As we wrap up — is there anything else you'd like to share, or any final thoughts?" },
];
const TOTAL = 20;
const BEFORE = 16;

const FUNNEL_STAGES: readonly string[] = ["language", "terms", "setup", "screener"];

const HEADERS: Record<string, { title: string; subtitle: string; step: number }> = {
  language:    { title: "Choose your language",    subtitle: "Select to continue in your preferred language", step: 1 },
  terms:       { title: "Terms & Privacy",         subtitle: "Please read carefully before continuing",      step: 2 },
  setup:       { title: "Study & Device Setup",    subtitle: "Review the study and connect your devices",    step: 3 },
  screener:    { title: "Screener",                subtitle: "Quick questions to personalise your session",  step: 4 },
};

const USER_TRANSCRIPTS = [
  "I think ideally I'd want a workflow where the AI handles the repetitive layout tasks automatically, so I can focus more on creative exploration and user research...",
  "I'd go with the dark one — it feels more focused and professional. The light layout is clean but the dark variant reduces eye strain during long sessions...",
  "I'm really excited about learning more about generative design tools and how they can augment our creative process rather than replace it...",
  "I think the most important thing is that we keep the human element in our research. Technology should serve the conversation, not replace it...",
];

/* ─────────── Hooks ─────────── */
function useTypewriter(text: string, active: boolean, speed = 22): string {
  const [out, setOut] = useState("");
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const idx   = useRef(0);
  useEffect(() => {
    if (!active) { setOut(""); idx.current = 0; return; }
    idx.current = 0; setOut("");
    timer.current = setInterval(() => {
      idx.current++;
      setOut(text.slice(0, idx.current));
      if (idx.current >= text.length && timer.current) clearInterval(timer.current);
    }, speed);
    return () => { if (timer.current) clearInterval(timer.current); };
  }, [text, active, speed]);
  return out;
}

/* ─────────── Waveform ─────────── */
const WAVE_BARS = [0.14, 0.22, 0.34, 0.50, 0.76, 0.56, 1.0, 0.90, 0.96, 0.60];

function Waveform({ active, listening, barColor, glowColor, typing }: {
  active: boolean; listening?: boolean;
  barColor?: string; glowColor?: string;
  typing?: boolean;
}) {
  const { tokens: t } = useParticipantTheme();
  const bc = barColor || t.AMBER_SOLID;
  const gc = glowColor || `rgba(${t.ARGB}, 0.24)`;

  const getAnimate = (v: number, i: number) => {
    if (!active) return { scaleY: 0.04, opacity: 0.12 };
    if (typing) {
      // typing mode: punchy staccato bursts
      return {
        scaleY: [v * 0.03, v * 0.72, v * 0.08, v * 0.52, v * 0.04],
        opacity: [0.15, 0.88, 0.22, 0.72, 0.15],
      };
    }
    if (listening) {
      return {
        scaleY: [v * 0.08, v * 0.38, v * 0.06, v * 0.32, v * 0.10],
        opacity: [0.30, 0.60, 0.30],
      };
    }
    return {
      scaleY: [v * 0.05, v, v * 0.15, v * 0.68, v * 0.10, v * 0.82, v],
      opacity: [0.44 + v * 0.50, 0.44 + v * 0.56],
    };
  };

  const getTransition = (v: number, i: number) => {
    if (!active) return { duration: 0.30 };
    if (typing) {
      return { duration: 0.12 + i * 0.015, repeat: Infinity, ease: "easeOut" as const, delay: i * 0.02 };
    }
    if (listening) {
      return { duration: 1.2 + i * 0.08, repeat: Infinity, ease: "easeInOut" as const, delay: i * 0.04 };
    }
    return { duration: 0.78 + i * 0.06, repeat: Infinity, ease: "easeInOut" as const, delay: i * 0.04 };
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, height: "100%", width: "100%" }}>
      {WAVE_BARS.map((v, i) => (
        <MotionDiv key={i}
          animate={getAnimate(v, i)}
          transition={getTransition(v, i)}
          style={{
            width: 4.5, height: "100%", borderRadius: 9999, transformOrigin: "center",
            background: bc,
            boxShadow: active ? `0 0 10px 0 ${gc}` : "none",
          }}
        />
      ))}
    </div>
  );
}

/* ─────────── Amplitude Dots (light-mode interview visualiser) ─────────── */
const DOT_AMP_FULL    = [0.20, 0.46, 0.74, 0.94, 1.0, 0.92, 0.70, 0.44, 0.20];
const DOT_AMP_COMPACT = [0.48, 0.84, 1.0, 0.80, 0.46];

function AmplitudeDots({ active, listening, dotColor, glowColor, compact }: {
  active: boolean; listening?: boolean; dotColor?: string; glowColor?: string; compact?: boolean;
}) {
  const { tokens: t } = useParticipantTheme();
  const dc  = dotColor  || t.AMBER_SOLID;
  const gc  = glowColor || `rgba(${t.ARGB}, 0.30)`;
  const amps    = compact ? DOT_AMP_COMPACT : DOT_AMP_FULL;
  const W       = compact ? 6 : 7;          // dot width (px)
  const BASE_H  = compact ? 6 : 7;          // resting dot height
  const MAX_H   = compact ? 22 : 48;        // peak height
  const gap     = compact ? 4 : 7;

  // height at each amplitude level
  const toH = (v: number, peak: number) => Math.max(BASE_H, v * peak);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap, height: "100%", width: "100%" }}>
      {amps.map((v, i) => {
        const speakH  = toH(v, MAX_H);
        const listenH = toH(v, MAX_H * 0.6);
        return (
          <MotionDiv key={i}
            animate={!active
              ? { height: BASE_H, opacity: 0.22 }
              : listening
                ? { height: [listenH * 0.7, listenH, listenH * 0.55, listenH * 0.88, listenH * 0.7], opacity: [0.55, 0.85, 0.42, 0.78, 0.55] }
                : { height: [speakH * 0.4, speakH, speakH * 0.25, speakH * 0.85, speakH * 0.4], opacity: [0.65, 0.96, 0.50, 0.88, 0.65] }
            }
            transition={active
              ? { duration: listening ? 1.40 + i * 0.09 : 0.78 + i * 0.06, repeat: Infinity, ease: "easeInOut" as const, delay: i * 0.05 }
              : { duration: 0.28, ease: "easeOut" as const }
            }
            style={{
              width: W, height: BASE_H, borderRadius: W / 2, flexShrink: 0,
              background: dc,
              boxShadow: active ? `0 0 10px 1px ${gc}` : "none",
            }}
          />
        );
      })}
    </div>
  );
}

/* ─────────── Desktop Progress + REC badge ─────────── */
function DesktopProgressREC({ progress, qIdx }: { progress: number; qIdx: number }) {
  const { tokens: t, mode } = useParticipantTheme();
  const isDarkMode = mode === "dark";
  const recDot  = isDarkMode ? t.AMBER_SOLID : "rgba(0,0,0,0.98)";
  const recText = isDarkMode ? t.AMBER_SOLID : "rgba(0,0,0,0.88)";
  const recBg   = isDarkMode ? `rgba(${t.ARGB}, 0.05)` : "rgba(0,0,0,0.05)";
  const barFg   = isDarkMode
    ? `linear-gradient(90deg, rgba(${t.ARGB}, 0.62), rgba(${t.ARGB}, 0.30))`
    : "linear-gradient(90deg, rgba(0,0,0,0.62), rgba(0,0,0,0.30))";
  return (
    <>
      <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6, width: 200 }}>
        <span style={{ fontSize: 11.5, fontFamily: SF, color: t.INK3 }}>
          Question {BEFORE + qIdx + 1} of {TOTAL}
        </span>
        <div style={{ width: "100%", height: 3, borderRadius: 9999, background: t.STR2, overflow: "hidden" }}>
          <MotionDiv
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.50, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ height: "100%", borderRadius: 9999, background: barFg }}
          />
        </div>
      </div>
      <div style={{
        flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
        padding: "4px 12px", borderRadius: 9999,
        background: recBg,
      }}>
        <MotionDiv animate={{ opacity: [1, 0.18, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
          style={{ width: 5, height: 5, borderRadius: "50%", background: recDot }} />
        <span style={{ fontSize: 9.5, color: recText, fontFamily: SF, letterSpacing: "0.10em", textTransform: "uppercase" as const, fontWeight: 600 }}>REC</span>
      </div>
    </>
  );
}

/* ─────────── AI Orb SVG ─────────── */
// Module-level counter to ensure unique SVG gradient/filter IDs
let _orbN = 0;
function AIOrbSVG({ size = 137, orbOpacity = 1, isSpeaking = false, isListening = false }: {
  size?: number; orbOpacity?: number; isSpeaking?: boolean; isListening?: boolean;
}) {
  const n = useRef(++_orbN).current;
  const f0 = `of0n${n}`, f1 = `of1n${n}`, f2 = `of2n${n}`, f3 = `of3n${n}`;
  const p0 = `op0n${n}`, p1 = `op1n${n}`, p2 = `op2n${n}`, p3 = `op3n${n}`;
  return (
    <MotionDiv
      animate={isSpeaking ? { scale: [1, 1.08, 1] } : isListening ? { scale: [1, 1.04, 1] } : { scale: 1 as number }}
      transition={isSpeaking
        ? { duration: 1.4, repeat: Infinity, ease: "easeInOut" }
        : isListening ? { duration: 2.0, repeat: Infinity, ease: "easeInOut" }
        : { duration: 0.3 }}
      style={{ width: size, height: size, flexShrink: 0, position: "relative", borderRadius: "50%", overflow: "hidden" }}
    >
      {/* child div is oversized so blurred gradients fill the circle */}
      <div style={{ position: "absolute", top: "-46%", right: "-38%", bottom: "-38%", left: "-48%", opacity: orbOpacity }}>
        <svg width="100%" height="100%" viewBox="0 0 254.933 252.117" fill="none">
          <ellipse cx="127.102" cy="124.558" fill="#F9E6C5" rx="61.498" ry="61.4977" />
          <g filter={`url(#${f0})`}>
            <ellipse cx="124.217" cy="124.217" fill={`url(#${p0})`} rx="54.217" ry="54.2168" />
          </g>
          <g filter={`url(#${f1})`}>
            <ellipse cx="45.1808" cy="45.1807" fill={`url(#${p1})`} rx="45.1808" ry="45.1807"
              transform="matrix(-0.795358 0.606139 -0.606143 -0.795356 202.663 145.483)" />
          </g>
          <g opacity="0.46">
            <g filter={`url(#${f2})`}>
              <path d={svgOrbPaths.pb919980} fill={`url(#${p2})`} />
            </g>
            <g filter={`url(#${f3})`}>
              <path d={svgOrbPaths.p2c010300} fill={`url(#${p3})`} />
            </g>
          </g>
          <defs>
            <filter id={f0} x="0" y="0" width="248.434" height="248.434" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="35" />
            </filter>
            <filter id={f1} x="24.1594" y="21.751" width="230.366" height="230.366" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="35" />
            </filter>
            <filter id={f2} x="40.6637" y="7.53168" width="214.269" height="233.466" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="35" />
            </filter>
            <filter id={f3} x="1.62441" y="13.8337" width="218.898" height="230.703" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
              <feGaussianBlur stdDeviation="35" />
            </filter>
            <linearGradient id={p0} x1="124.217" y1="70" x2="124.217" y2="178.434" gradientUnits="userSpaceOnUse">
              <stop stopColor="#F9EAD0" /><stop offset="1" stopColor="#FF5200" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={p1} x1="45.1808" y1="0" x2="45.1808" y2="90.3614" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF5200" /><stop offset="1" stopColor="white" stopOpacity="0.2" />
            </linearGradient>
            <linearGradient id={p2} x1="174.218" y1="124.151" x2="143.495" y2="136.048" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFEA00" /><stop offset="1" stopColor="#D7F9D0" stopOpacity="0" />
            </linearGradient>
            <linearGradient id={p3} x1="80.2397" y1="139.427" x2="109.155" y2="121.656" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FFD500" /><stop offset="1" stopColor="#FF7070" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </MotionDiv>
  );
}

/* ─────────── Card Header ─────────── */
function CardHeader({ stage, progress, qIdx }: { stage: Stage; progress: number; qIdx: number }) {
  const { tokens: t } = useParticipantTheme();
  const isMob = useIsMobile();
  const isFunnel = FUNNEL_STAGES.includes(stage);
  const header = HEADERS[stage];
  const isInterviewLike = stage === "interview" || stage === "paused";

  return (
    <>
      {/* Accent line at top */}
      <div style={{
        position: "absolute", top: 0, left: "20%", right: "20%", height: 1.5, zIndex: 10,
        borderRadius: "0 0 9999px 9999px",
        background: `linear-gradient(90deg, transparent, rgba(${t.ARGB}, 0.22), transparent)`,
      }} />

      <div style={{
        flexShrink: 0,
        ...(isMob ? {
          paddingTop: SA_TOP,
          background: t.mode === "light"
            ? "rgba(250,244,235,0.82)"
            : "rgba(10,12,22,0.72)",
          backdropFilter: "blur(24px) saturate(120%)",
          WebkitBackdropFilter: "blur(24px) saturate(120%)",
        } : {}),
      }}>
        {/* Mobile mini status row below Dynamic Island / notch */}
        {isMob && (
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "8px 20px 0",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {isInterviewLike && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <MotionDiv animate={{ opacity: [1, 0.18, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                      style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF3B30" }} />
                    <span style={{ fontSize: 10, fontFamily: SF, fontWeight: 700, color: "#FF3B30", letterSpacing: "0.10em", textTransform: "uppercase" as const }}>REC</span>
                  </div>
                  <span style={{ fontSize: 10, fontFamily: SF, color: t.INK4 }}>·</span>
                </>
              )}
              <span style={{ fontSize: 10.5, fontFamily: SF, fontWeight: 500, color: t.INK3, letterSpacing: "0.04em" }}>
                {isFunnel && header ? `Step ${header.step} of 4`
                  : isInterviewLike ? `Q${BEFORE + qIdx + 1} / ${TOTAL}`
                  : ""}
              </span>
            </div>
          </div>
        )}

        {/* Main header row */}
        <div style={{
          display: "flex", alignItems: "center", gap: isMob ? 12 : 14,
          padding: isMob ? "10px 20px 12px" : "16px 24px 12px",
        }}>
          <div style={{ flex: 1, minWidth: 0, paddingTop: isMob ? 0 : 4 }}>
            <div style={{ fontSize: isMob ? 16 : 14, fontFamily: SF, fontWeight: 600, color: t.INK1, letterSpacing: "-0.016em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {isFunnel && header ? header.title
                : isInterviewLike ? "AI Tools Research"
                : stage === "ready" ? "Ready to begin"
                : stage === "complete" ? "Session complete"
                : "AI Tools Research"}
            </div>
            {!isMob && (
              <div style={{ fontSize: 11.5, fontFamily: SF, color: t.INK3, marginTop: 3 }}>
                {isFunnel && header ? header.subtitle
                  : isInterviewLike ? "Conducted by Cookiy Research Lab"
                  : stage === "ready" ? "You're all set"
                  : stage === "complete" ? "Thank you for participating"
                  : ""}
              </div>
            )}
          </div>

          {isFunnel && header && !isMob && (
            <div style={{
              flexShrink: 0, padding: "4px 12px", borderRadius: 9999,
              background: `rgba(${t.ARGB}, 0.05)`,
              boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.14)`,
            }}>
              <span style={{ fontSize: 11.5, fontFamily: MONO, color: t.AMBER_SOLID }}>{header.step} / 4</span>
            </div>
          )}

          {isInterviewLike && !isMob && (
            <DesktopProgressREC progress={progress} qIdx={qIdx} />
          )}

          {/* Mobile: compact progress bar */}
          {isInterviewLike && isMob && (
            <div style={{ flexShrink: 0, width: 56, height: 3.5, borderRadius: 9999, background: t.STR2, overflow: "hidden" }}>
              <MotionDiv
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.50, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  height: "100%", borderRadius: 9999,
                  background: `linear-gradient(90deg, rgba(${t.ARGB}, 0.62), rgba(${t.ARGB}, 0.30))`,
                }}
              />
            </div>
          )}

          {(stage === "ready" || stage === "complete") && (
            <div style={{
              flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 12px", borderRadius: 9999,
              background: t.GREEN_BG, boxShadow: `inset 0 0 0 1px ${t.GREEN_STR}`,
            }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.GREEN }} />
              <span style={{ fontSize: 10, fontFamily: MONO, color: t.GREEN_TEXT }}>IRB-2024-0419</span>
            </div>
          )}
        </div>
      </div>

      <div style={{ height: 1, flexShrink: 0, background: t.STR2, marginLeft: isMob ? 20 : 16, marginRight: isMob ? 20 : 16, opacity: isMob ? 0.45 : 1 }} />
    </>
  );
}

/* ─────────── Comparison Carousel (Apple Music style) ─────────── */
function ComparisonCarousel({ options, selected, onSelect, multiSelect }: {
  options: ComparisonOption[];
  selected: Set<string>;
  onSelect: (id: string) => void;
  multiSelect?: boolean;
}) {
  const { tokens: t, mode } = useParticipantTheme();
  const isDark = mode === "dark";
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  const CARD_W = 180;
  const CARD_GAP = 10;
  const VISIBLE_COUNT = 2.4;

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const update = () => {
      setScrollPos(el.scrollLeft);
      setMaxScroll(el.scrollWidth - el.clientWidth);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    return () => el.removeEventListener("scroll", update);
  }, [options.length]);

  const scroll = (dir: number) => {
    const el = scrollRef.current;
    if (!el) return;
    const pageW = CARD_W * Math.floor(VISIBLE_COUNT) + CARD_GAP * (Math.floor(VISIBLE_COUNT) - 1);
    el.scrollBy({ left: dir * pageW, behavior: "smooth" });
  };

  const canLeft = scrollPos > 2;
  const canRight = scrollPos < maxScroll - 2;

  return (
    <div style={{ position: "relative", flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
      {/* Scroll container */}
      <div ref={scrollRef} className="hide-scrollbar" style={{
        flex: 1, minHeight: 0, display: "flex", gap: CARD_GAP,
        overflowX: "auto", overflowY: "hidden", scrollSnapType: "x mandatory",
        paddingBottom: 4,
      }}>
        {options.map((opt) => {
          const isSel = selected.has(opt.id);
          return (
            <div key={opt.id} onClick={() => onSelect(opt.id)} style={{
              flexShrink: 0, width: CARD_W, scrollSnapAlign: "start",
              borderRadius: 14, overflow: "hidden", cursor: "pointer", position: "relative",
              aspectRatio: "4 / 3",
              boxShadow: isSel
                ? `inset 0 0 0 2.5px rgba(${t.ARGB}, 0.55), 0 0 24px rgba(${t.ARGB}, 0.10)`
                : `inset 0 0 0 1px ${t.STR2}`,
              transition: "box-shadow 0.22s ease, transform 0.18s ease",
            }}>
              {/* Image */}
              <ImageWithFallback src={opt.img} alt={opt.label} style={{
                width: "100%", height: "100%", objectFit: "cover", display: "block",
              }} />
              {/* Gradient overlay */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(0deg, rgba(0,0,0,0.62) 0%, rgba(0,0,0,0.08) 50%, transparent 100%)",
                pointerEvents: "none",
              }} />
              {/* Text overlay */}
              <div style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                padding: "10px 12px", display: "flex", flexDirection: "column", gap: 2,
              }}>
                {opt.subtitle && (
                  <span style={{ fontSize: 9.5, fontFamily: SF, fontWeight: 500, color: "rgba(255,255,255,0.60)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>
                    {opt.subtitle}
                  </span>
                )}
                <span style={{ fontSize: 12.5, fontFamily: SF, fontWeight: 600, color: "white", letterSpacing: "-0.01em" }}>
                  {opt.label}
                </span>
              </div>
              {/* Check badge */}
              <div style={{
                position: "absolute", top: 8, right: 8, width: 22, height: 22, borderRadius: 9999,
                background: isSel ? t.AMBER_SOLID : "rgba(255,255,255,0.14)",
                borderWidth: 1.5, borderStyle: "solid",
                borderColor: isSel ? t.AMBER_SOLID : "rgba(255,255,255,0.28)",
                display: "flex", alignItems: "center", justifyContent: "center",
                transition: "all 0.18s ease",
                backdropFilter: "blur(6px)",
              }}>
                {isSel && <CheckCircle size={13} color="white" />}
              </div>
            </div>
          );
        })}
      </div>

      {/* Left arrow */}
      {canLeft && (
        <div onClick={() => scroll(-1)} style={{
          position: "absolute", left: -4, top: "50%", transform: "translateY(-50%)",
          width: 30, height: 30, borderRadius: 9999, cursor: "pointer",
          background: isDark ? "rgba(0,0,0,0.55)" : "rgba(250,244,235,0.90)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.14)" : "0 2px 8px rgba(107,61,19,0.08)",
          transition: "opacity 0.16s ease",
        }}>
          <ChevronLeft size={16} color={isDark ? "white" : t.INK2} />
        </div>
      )}
      {/* Right arrow */}
      {canRight && (
        <div onClick={() => scroll(1)} style={{
          position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)",
          width: 30, height: 30, borderRadius: 9999, cursor: "pointer",
          background: isDark ? "rgba(0,0,0,0.55)" : "rgba(250,244,235,0.90)",
          backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.14)" : "0 2px 8px rgba(107,61,19,0.08)",
          transition: "opacity 0.16s ease",
        }}>
          <ChevronRight size={16} color={isDark ? "white" : t.INK2} />
        </div>
      )}
    </div>
  );
}

/* ─────────── Interview Content ─────────── */
function InterviewContent({ qIdx, speech, isActive, caption, userTranscript, micOn, camOn, typingMode, onSendTyped, onNextQuestion }: {
  qIdx: number; speech: Speech; isActive: boolean; caption: string; userTranscript: string;
  micOn: boolean; camOn: boolean; typingMode: boolean; onSendTyped: (text: string) => void;
  onNextQuestion: () => void;
}) {
  const { tokens: t, mode } = useParticipantTheme();
  const q = QS[qIdx];
  const isSpeaking  = speech === "speaking"  && isActive;
  const isListening = speech === "listening" && isActive;
  const isComparison = q.type === "comparison" && !!q.options;
  const [compSelected, setCompSelected] = useState<Set<string>>(new Set());
  const [typedText, setTypedText] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [sendHov, setSendHov] = useState(false);
  const [confirmHov, setConfirmHov] = useState(false);
  const [nextQHov, setNextQHov] = useState(false);
  const [isTypingNow, setIsTypingNow] = useState(false);
  const typingTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typingMode && isListening && inputRef.current) inputRef.current.focus();
  }, [typingMode, isListening]);
  useEffect(() => { setTypedText(""); setCompSelected(new Set()); }, [qIdx]);

  const handleCompSelect = useCallback((id: string) => {
    setCompSelected((prev) => {
      if (q.multiSelect) {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        return next;
      }
      return prev.has(id) ? new Set() : new Set([id]);
    });
  }, [q.multiSelect]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTypedText(e.target.value);
    setIsTypingNow(true);
    if (typingTimer.current) clearTimeout(typingTimer.current);
    typingTimer.current = setTimeout(() => setIsTypingNow(false), 300);
  }, []);

  const handleSend = useCallback(() => {
    if (typedText.trim()) { onSendTyped(typedText.trim()); setTypedText(""); }
  }, [typedText, onSendTyped]);

  const handleConfirm = useCallback(() => {
    if (compSelected.size > 0) {
      const labels = q.options!.filter((o) => compSelected.has(o.id)).map((o) => o.label).join(", ");
      onSendTyped(labels);
    }
  }, [compSelected, q.options, onSendTyped]);

  const handleKeyDown = useCallback((_e: React.KeyboardEvent) => {}, []);

  const isMobile = useIsMobile();
  const isDark = mode === "dark";
  const speakingBg    = isDark ? "rgba(97, 95, 255, 0.08)"  : "rgba(107, 61, 19, 0.07)";
  const speakingStr   = isDark ? "inset 0 0 0 1px rgba(97, 95, 255, 0.16)" : "inset 0 0 0 1px rgba(107, 61, 19, 0.14)";
  const speakingBar   = isDark ? "rgba(139, 128, 255, 0.85)" : "rgba(107, 61, 19, 0.82)";
  const speakingGlow  = isDark ? "rgba(97, 95, 255, 0.24)"   : "rgba(107, 61, 19, 0.15)";
  const speakingLabel = isDark ? "rgba(139, 128, 255, 0.85)" : "rgb(107, 61, 19)";

  /* Listening state — warm dark-gold in light, classic gold in dark */
  const listeningBg    = isDark ? "rgba(218, 165, 32, 0.08)"  : "rgba(160, 108, 24, 0.07)";
  const listeningStr   = isDark ? "inset 0 0 0 1px rgba(218, 165, 32, 0.16)" : "inset 0 0 0 1px rgba(160, 108, 24, 0.13)";
  const listeningBar   = isDark ? "rgba(218, 165, 32, 0.85)"  : "rgba(160, 108, 24, 0.82)";
  const listeningGlow  = isDark ? "rgba(218, 165, 32, 0.18)"  : "rgba(160, 108, 24, 0.14)";
  const listeningLabel = isDark ? "rgb(218, 165, 32)"          : "rgb(160, 108, 24)";

  /* ── Inline camera PiP (used in left col of comparison layout) ── */
  const inlinePiP = (
    <div style={{ flexShrink: 0, height: 159, width: "100%", borderRadius: 12, overflow: "hidden", position: "relative", boxShadow: `inset 0 0 0 1px ${t.STR2}` }}>
      {camOn ? (
        <img src={imgFace} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 18%", filter: "saturate(0.92) brightness(0.98)" }} />
      ) : (
        <div style={{ width: "100%", height: "100%", background: t.SURF1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <CameraOff size={20} color={t.INK4} />
        </div>
      )}
      {camOn && (<>
        <div style={{
          position: "absolute", top: "32%", left: "50%", transform: "translate(-50%,-50%)",
          width: 64, height: 64, borderRadius: 9999, pointerEvents: "none",
          borderWidth: 1.35, borderStyle: "dashed",
          borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)",
        }} />
        <div style={{
          position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5,
          padding: "3px 8px", borderRadius: 9999,
          background: isDark ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.82)",
          backdropFilter: "blur(6px)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
        }}>
          <MotionDiv animate={{ opacity: [1, 0.20, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: t.GREEN }} />
          <span style={{ fontSize: 9.5, fontFamily: SF, color: t.GREEN_TEXT, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Live</span>
        </div>
      </>)}
    </div>
  );

  /* ── Question header block (shared) ── */
  const isLastQ = qIdx >= QS.length - 1;
  const canAdvance = isListening && !isLastQ;
  const nextQ = !isLastQ ? QS[qIdx + 1] : null;

  const questionHeader = (compact?: boolean) => (
    <div style={{ flexShrink: 0, paddingTop: 4 }}>
      <div
        onClick={canAdvance ? onNextQuestion : undefined}
        onMouseEnter={() => canAdvance && setNextQHov(true)}
        onMouseLeave={() => setNextQHov(false)}
        style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          padding: "5px 12px", borderRadius: 8, marginBottom: compact ? 6 : 10,
          background: nextQHov && canAdvance ? `rgba(${t.ARGB}, 0.12)` : `rgba(${t.ARGB}, 0.06)`,
          boxShadow: nextQHov && canAdvance ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.24)` : `inset 0 0 0 1px rgba(${t.ARGB}, 0.12)`,
          cursor: canAdvance ? "pointer" : "default",
          userSelect: "none" as const,
          transition: "background 0.16s ease, box-shadow 0.16s ease",
        }}
      >
        <span style={{ fontSize: 10, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID, letterSpacing: "0.10em" }}>{q.num}</span>
        {canAdvance && nextQ && (
          <>
            <span style={{ fontSize: 9, color: t.INK4 }}>→</span>
            <span style={{ fontSize: 10, fontFamily: SF, fontWeight: 600, color: t.INK3, letterSpacing: "0.10em" }}>{nextQ.num}</span>
            <ChevronRight size={11} color={t.AMBER_SOLID} style={{ marginLeft: -2 }} />
          </>
        )}
        {isListening && isLastQ && (
          <>
            <span style={{ fontSize: 9, color: t.INK4 }}>·</span>
            <span style={{ fontSize: 10, fontFamily: SF, fontWeight: 500, color: t.INK4, letterSpacing: "0.06em" }}>Last</span>
          </>
        )}
      </div>
      <div style={{ fontSize: 10.5, fontFamily: SF, color: t.INK3, letterSpacing: "0.08em", textTransform: "uppercase" as const, marginBottom: compact ? 8 : 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{q.topic}</div>
      <AnimatePresence mode="wait">
        <MotionDiv key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.40, ease: [0.25, 0.1, 0.25, 1] }}>
          <p style={{
            margin: 0, fontSize: compact ? 16 : 24, fontFamily: SF, fontWeight: 400, color: t.INK1, lineHeight: 1.64, letterSpacing: "-0.024em",
            ...(compact ? { display: "-webkit-box", WebkitLineClamp: 4, WebkitBoxOrient: "vertical" as const, overflow: "hidden" } : {}),
          }}>
            {isSpeaking ? (<>{caption}<MotionSpan animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.50, repeat: Infinity }}
              style={{ display: "inline-block", width: 2.5, height: "0.52em", background: t.AMBER_SOLID, marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} /></>) : q.text}
          </p>
        </MotionDiv>
      </AnimatePresence>
    </div>
  );

  /* ── Response area (shared for bottom half) ── */
  const responseArea = (
    <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-start" }}>
      {isListening && userTranscript ? (
        <div style={{ flex: 1, minHeight: 0, overflowY: "auto", marginBottom: typingMode ? 10 : 0 }}>
          <p style={{ margin: 0, fontSize: 15, fontFamily: SF, fontWeight: 400, color: t.INK2, lineHeight: 1.64, letterSpacing: "-0.01em" }}>
            {userTranscript}
            {!typingMode && (
              <MotionSpan animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.80, repeat: Infinity }}
                style={{ display: "inline-block", width: 2, height: "0.48em", background: t.INK3, marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} />
            )}
          </p>
        </div>
      ) : !typingMode || !isListening ? (
        <div style={{ flex: 1 }}>
          <span style={{ fontSize: 13, fontFamily: SF, color: t.INK4, letterSpacing: "0.01em" }}>
            {isListening ? "Speak when ready..." : "Your response will appear here"}
          </span>
        </div>
      ) : (
        <div style={{ flex: 1 }} />
      )}

      {typingMode && isListening && (
        <MotionDiv initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }} style={{ flexShrink: 0 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, alignSelf: "flex-start", marginBottom: 6 }}>
            <Keyboard size={12} color={t.AMBER_SOLID} />
            <span style={{ fontSize: 10, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>Type your response</span>
          </div>
          <div style={{ position: "relative", display: "flex", borderRadius: 14, overflow: "hidden", background: t.SURF1, boxShadow: `inset 0 0 0 1px ${t.STR2}` }}>
            <textarea ref={inputRef} value={typedText} onChange={handleChange} onKeyDown={handleKeyDown}
              placeholder="Type your answer here..."
              style={{ width: "100%", minHeight: 80, resize: "none", border: "none", outline: "none", background: "transparent", padding: "12px 48px 12px 14px",
                fontSize: 14, fontFamily: SF, color: t.INK1, lineHeight: 1.6, letterSpacing: "-0.01em" }} />
            <div onClick={handleSend} onMouseEnter={() => setSendHov(true)} onMouseLeave={() => setSendHov(false)}
              style={{ position: "absolute", right: 8, bottom: 8, width: 32, height: 32, borderRadius: 10, cursor: "pointer",
                background: typedText.trim() ? (sendHov ? `rgba(${t.ARGB}, 0.18)` : `rgba(${t.ARGB}, 0.10)`) : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.14s ease" }}>
              <Send size={14} color={typedText.trim() ? t.AMBER_SOLID : t.INK4} />
            </div>
          </div>
        </MotionDiv>
      )}
    </div>
  );

  /* ── Dashed divider ── */
  const dashedDivider = (
    <div style={{ flexShrink: 0, padding: "8px 0" }}>
      <div style={{ width: "100%", height: 0, borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: t.STR1 }} />
    </div>
  );

  /* ═══════════════════════════════════════════
     P3: MOBILE STORIES LAYOUT (Comparison)
     ═══════════════════════════════════════════ */
  if (isMobile && isComparison && q.options) {
    return (
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
        {/* Compact waveform + question */}
        <div style={{ flexShrink: 0, padding: "12px 20px 0" }}>
          <MobileWaveStrip isSpeaking={isSpeaking} isListening={isListening}
            speakingBar={speakingBar} speakingGlow={speakingGlow} speakingLabel={speakingLabel} t={t} />
          {questionHeader(true)}
        </div>
        {/* Stories cards */}
        <MobileStories
          options={q.options} selected={compSelected} onSelect={handleCompSelect}
          multiSelect={q.multiSelect} onConfirm={handleConfirm} isSpeaking={isSpeaking} t={t}
        />
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     P2: MOBILE TEXT LAYOUT
     ═══════════════════════════════════════════ */
  if (isMobile) {
    return (
      <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", padding: "12px 20px 0" }}>
        {/* Compact waveform strip */}
        <MobileWaveStrip isSpeaking={isSpeaking} isListening={isListening}
          speakingBar={speakingBar} speakingGlow={speakingGlow} speakingLabel={speakingLabel} t={t} />
        {/* Question */}
        <div style={{ flexShrink: 0 }}>
          {questionHeader(true)}
        </div>
        {/* Divider */}
        {dashedDivider}
        {/* Response area — fills remaining space */}
        <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", paddingBottom: 12 }}>
          {responseArea}
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     DESKTOP COMPARISON LAYOUT (Figma 311)
     Left col (255px): orb + question + divider + transcript + camera
     Right col (flex-1): research panel + ComparisonCarousel
     ═══════════════════════════════════════════ */
  if (isComparison) {
    const selectedLabels = q.options!.filter((o) => compSelected.has(o.id)).map((o) => o.label);
    const panelBg     = isDark ? "rgba(255,255,255,0.035)" : "#faf8f3";
    const panelIconC  = isDark ? t.INK3 : "#8b7355";
    const panelTextC  = isDark ? t.INK3 : "#8b7355";
    const gridStroke  = isDark ? "rgba(255,255,255,0.04)" : "#FAF8F3";
    return (
      <div style={{ flex: 1, minHeight: 0, display: "flex", gap: 16, padding: "16px" }}>

        {/* ── Left column ── */}
        <div style={{ width: 255, flexShrink: 0, display: "flex", flexDirection: "column", gap: 16, alignSelf: "stretch" }}>
          {/* Orb (reduced opacity per Figma 311) */}
          <div style={{ display: "flex", justifyContent: "center", flexShrink: 0, paddingTop: 8 }}>
            <AIOrbSVG size={137} orbOpacity={0.65} isSpeaking={isSpeaking} isListening={isListening} />
          </div>

          {/* Question number + topic */}
          <div style={{ flexShrink: 0 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 7, marginBottom: 8,
              background: `rgba(${t.ARGB}, 0.06)`, boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.12)` }}>
              <span style={{ fontSize: 9.5, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID, letterSpacing: "0.10em" }}>{q.num}</span>
            </div>
            <AnimatePresence mode="wait">
              <MotionDiv key={q.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.36 }}>
                <p style={{ margin: 0, fontSize: 18, fontFamily: SF, fontWeight: 400, lineHeight: 1.33, letterSpacing: "-1px",
                  color: isDark ? t.INK1 : "rgba(65,49,9,0.82)",
                  display: "-webkit-box", WebkitLineClamp: 5, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
                  {isSpeaking ? caption : q.text}
                  {isSpeaking && <MotionSpan animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.50, repeat: Infinity }}
                    style={{ display: "inline-block", width: 2.5, height: "0.52em", background: t.AMBER_SOLID, marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} />}
                </p>
              </MotionDiv>
            </AnimatePresence>
          </div>

          {/* Dashed divider */}
          <div style={{ flexShrink: 0, height: 0, borderTopWidth: 0.675, borderTopStyle: "dashed", borderTopColor: isDark ? t.STR1 : "rgba(0,0,0,0.09)" }} />

          {/* Transcript (flex-1) */}
          <div style={{ flex: 1, minHeight: 0, overflow: "hidden" }}>
            {isListening && userTranscript ? (
              <p style={{ margin: 0, fontSize: 15, fontFamily: SF, fontWeight: 400, lineHeight: "24.6px", letterSpacing: "-0.15px",
                color: isDark ? t.INK2 : "rgba(0,0,0,0.5)" }}>
                {userTranscript}
                <MotionSpan animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.80, repeat: Infinity }}
                  style={{ display: "inline-block", width: 2, height: "0.48em", background: t.INK3, marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} />
              </p>
            ) : (
              <span style={{ fontSize: 13, fontFamily: SF, color: t.INK4 }}>
                {isListening ? "Speak when ready..." : "Your response will appear here"}
              </span>
            )}
          </div>

          {/* Camera PiP at bottom */}
          {inlinePiP}
        </div>

        {/* ── Right panel ── */}
        <div style={{
          flex: 1, minHeight: 0, display: "flex", flexDirection: "column",
          background: panelBg, borderRadius: 16,
          boxShadow: isDark ? `inset 0 0 0 1px ${t.STR1}` : "0 0 4px rgba(0,0,0,0.25)",
          padding: "12px 24px 16px", overflow: "hidden",
        }}>
          {/* Panel header */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginBottom: 12 }}>
            <BookOpen size={16} color={panelIconC} />
            <span style={{ fontSize: 14, fontFamily: SF, fontWeight: 400, color: panelTextC, letterSpacing: "-0.015em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {q.topic}
            </span>
          </div>

          {/* Carousel + grid overlay */}
          <div style={{ flex: 1, minHeight: 0, position: "relative", borderRadius: 10, overflow: "hidden",
            opacity: isSpeaking ? 0.30 : 0.92, pointerEvents: isSpeaking ? "none" : "auto", transition: "opacity 0.30s ease" }}>
            <ComparisonCarousel options={q.options!} selected={compSelected} onSelect={handleCompSelect} multiSelect={q.multiSelect} />
            {/* Decorative grid lines */}
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} fill="none">
              <line x1="0" y1="36%" x2="100%" y2="36%" stroke={gridStroke} strokeWidth="2" />
              <line x1="0" y1="65%" x2="100%" y2="65%" stroke={gridStroke} strokeWidth="2" />
              <line x1="33%" y1="0" x2="33%" y2="100%" stroke={gridStroke} strokeWidth="2" />
              <line x1="67%" y1="0" x2="67%" y2="100%" stroke={gridStroke} strokeWidth="2" />
            </svg>
          </div>

          {/* Selection summary + Confirm */}
          <div style={{ flexShrink: 0, height: 36, marginTop: 10, display: "flex", alignItems: "center" }}>
            {compSelected.size > 0 && !isSpeaking && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                <div style={{ flex: 1, display: "flex", alignItems: "center", gap: 6, minWidth: 0 }}>
                  <CheckCircle size={14} color={t.AMBER_SOLID} style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: 12, fontFamily: SF, color: t.INK3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" as const }}>
                    {q.multiSelect ? `${compSelected.size} selected` : "Selected"}{" "}
                    <span style={{ color: t.AMBER_SOLID, fontWeight: 600 }}>{selectedLabels.join(", ")}</span>
                  </span>
                </div>
                <div onClick={handleConfirm} onMouseEnter={() => setConfirmHov(true)} onMouseLeave={() => setConfirmHov(false)}
                  style={{
                    flexShrink: 0, padding: "7px 18px", borderRadius: 10, cursor: "pointer",
                    background: confirmHov ? `rgba(${t.ARGB}, 0.14)` : `rgba(${t.ARGB}, 0.08)`,
                    boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.20)`,
                    display: "flex", alignItems: "center", gap: 6, transition: "background 0.14s ease",
                  }}>
                  <span style={{ fontSize: 12, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID }}>Confirm</span>
                  <ChevronRight size={13} color={t.AMBER_SOLID} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     DESKTOP TEXT LAYOUT (Figma 307)
     Center column: orb → question → divider → transcript
     Camera PiP: absolute bottom-right
     ═══════════════════════════════════════════ */
  const qTextColor = isDark ? t.INK1 : "rgba(65,49,9,0.82)";
  const trColor    = isDark ? t.INK2 : "rgba(0,0,0,0.50)";
  const divColor   = isDark ? t.STR1 : "rgba(0,0,0,0.09)";
  return (
    <div style={{ flex: 1, minHeight: 0, position: "relative", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "space-between", padding: "20px 32px 28px" }}>

      {/* AI Orb (animated) */}
      <AIOrbSVG size={137} isSpeaking={isSpeaking} isListening={isListening} />

      {/* Question block */}
      <div style={{ flexShrink: 0, width: "100%", maxWidth: 394, textAlign: "center" }}>
        {/* Q num capsule */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 10 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 10px", borderRadius: 7,
            background: `rgba(${t.ARGB}, 0.06)`, boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.12)` }}>
            <span style={{ fontSize: 9.5, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID, letterSpacing: "0.10em" }}>{q.num}</span>
            {canAdvance && nextQ && (<>
              <span style={{ fontSize: 9, color: t.INK4 }}>→</span>
              <span style={{ fontSize: 9.5, fontFamily: SF, fontWeight: 600, color: t.INK3, letterSpacing: "0.10em" }}>{nextQ.num}</span>
            </>)}
          </div>
        </div>
        <AnimatePresence mode="wait">
          <MotionDiv key={q.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.40, ease: [0.25, 0.1, 0.25, 1] }}>
            <p style={{ margin: 0, fontSize: 18, fontFamily: SF, fontWeight: 400, color: qTextColor, lineHeight: 1.33, letterSpacing: "-0.576px" }}>
              {isSpeaking ? (<>{caption}<MotionSpan animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.50, repeat: Infinity }}
                style={{ display: "inline-block", width: 2.5, height: "0.52em", background: t.AMBER_SOLID, marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} /></>) : q.text}
            </p>
          </MotionDiv>
        </AnimatePresence>
      </div>

      {/* Dashed divider */}
      <div style={{ flexShrink: 0, width: "100%", maxWidth: 574, height: 0, borderTopWidth: 0.675, borderTopStyle: "dashed", borderTopColor: divColor }} />

      {/* Transcript */}
      <div style={{ flexShrink: 0, width: "100%", maxWidth: 432, minHeight: 72, display: "flex", flexDirection: "column", justifyContent: "center" }}>
        {isListening && userTranscript ? (
          <p style={{ margin: 0, fontSize: 15, fontFamily: SF, fontWeight: 400, color: trColor, lineHeight: "24.6px", letterSpacing: "-0.15px",
            display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical" as const, overflow: "hidden" }}>
            {userTranscript}
            <MotionSpan animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.80, repeat: Infinity }}
              style={{ display: "inline-block", width: 2, height: "0.48em", background: isDark ? t.INK3 : "rgba(0,0,0,0.30)", marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} />
          </p>
        ) : (
          <p style={{ margin: 0, fontSize: 15, fontFamily: SF, color: isDark ? t.INK4 : "rgba(0,0,0,0.28)", lineHeight: "24.6px" }}>
            {isListening ? "Speak when ready..." : "Your response will appear here"}
          </p>
        )}
      </div>

      {/* Typing mode input (if active) */}
      {typingMode && isListening && (
        <MotionDiv initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}
          style={{ flexShrink: 0, width: "100%", maxWidth: 432 }}>
          <div style={{ position: "relative", display: "flex", borderRadius: 14, overflow: "hidden", background: t.SURF1, boxShadow: `inset 0 0 0 1px ${t.STR2}` }}>
            <textarea ref={inputRef} value={typedText} onChange={handleChange}
              placeholder="Type your answer here..."
              style={{ width: "100%", minHeight: 72, resize: "none", border: "none", outline: "none", background: "transparent",
                padding: "12px 48px 12px 14px", fontSize: 14, fontFamily: SF, color: t.INK1, lineHeight: 1.6, letterSpacing: "-0.01em" }} />
            <div onClick={handleSend} onMouseEnter={() => setSendHov(true)} onMouseLeave={() => setSendHov(false)}
              style={{ position: "absolute", right: 8, bottom: 8, width: 32, height: 32, borderRadius: 10, cursor: "pointer",
                background: typedText.trim() ? (sendHov ? `rgba(${t.ARGB}, 0.18)` : `rgba(${t.ARGB}, 0.10)`) : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.14s ease" }}>
              <Send size={14} color={typedText.trim() ? t.AMBER_SOLID : t.INK4} />
            </div>
          </div>
        </MotionDiv>
      )}

      {/* Next Question button */}
      {canAdvance && (
        <MotionDiv initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.24 }}
          style={{ flexShrink: 0, display: "flex", justifyContent: "center" }}>
          <div onClick={onNextQuestion}
            onMouseEnter={() => setNextQHov(true)} onMouseLeave={() => setNextQHov(false)}
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "10px 24px", borderRadius: 12, cursor: "pointer",
              background: nextQHov ? (isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.07)") : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
              boxShadow: nextQHov
                ? `inset 0 0 0 1.5px ${isDark ? "rgba(255,255,255,0.16)" : "rgba(0,0,0,0.12)"}`
                : `inset 0 0 0 1px ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}`,
              transition: "all 0.16s ease", userSelect: "none" as const,
            }}>
            <span style={{ fontSize: 13, fontFamily: SF, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.55)", letterSpacing: "-0.01em" }}>Next Question</span>
            <ArrowRight size={14} color={isDark ? "rgba(255,255,255,0.50)" : "rgba(0,0,0,0.40)"} />
          </div>
        </MotionDiv>
      )}

      {/* Camera PiP — absolute bottom-right of card (Figma 307: right 24px, bottom 30px, 170×151px) */}
      <div style={{
        position: "absolute", right: 24, bottom: 30,
        width: 170, height: 151, borderRadius: 16, overflow: "hidden",
        boxShadow: isDark
          ? "0 4px 20px rgba(0,0,0,0.50), inset 0 0 0 1px rgba(255,255,255,0.08)"
          : "0 0 0 1px rgba(0,0,0,0.05)",
      }}>
        {camOn ? (
          <img src={imgFace} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 18%", filter: "saturate(0.92) brightness(0.98)" }} />
        ) : (
          <div style={{ width: "100%", height: "100%", background: t.SURF1, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <CameraOff size={18} color={t.INK4} />
          </div>
        )}
        {camOn && (<>
          <div style={{
            position: "absolute", top: "27px", left: "63px", width: 64, height: 64, borderRadius: 9999,
            borderWidth: 1.35, borderStyle: "dashed",
            borderColor: isDark ? "rgba(255,255,255,0.25)" : "rgba(0,0,0,0.18)", pointerEvents: "none",
          }} />
          <div style={{
            position: "absolute", top: 10, left: 10, display: "flex", alignItems: "center", gap: 5,
            padding: "3px 8px", borderRadius: 9999,
            background: isDark ? "rgba(0,0,0,0.40)" : "rgba(255,255,255,0.82)",
            backdropFilter: "blur(6px)", boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
          }}>
            <MotionDiv animate={{ opacity: [1, 0.20, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
              style={{ width: 5, height: 5, borderRadius: "50%", background: t.GREEN }} />
            <span style={{ fontSize: 9.5, fontFamily: SF, color: t.GREEN_TEXT, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Live</span>
          </div>
        </>)}
      </div>
    </div>
  );
}

/* ─────────── Ready ─────────── */
function ReadyContent({ onBegin }: { onBegin: () => void }) {
  const { tokens: t } = useParticipantTheme();
  const [hov, setHov] = useState(false);
  const isMob = useIsMobile();
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: isMob ? "24px 28px 32px" : "40px 36px 44px" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: `rgba(${t.ARGB}, 0.06)`, boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.14)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        marginBottom: 28,
      }}>
        <svg width={24} height={20} viewBox="0 0 24 20" fill="none">
          <path d="M5.35012 14.1415C5.35012 14.6502 5.7476 15.0636 6.24048 15.0636H13.2759L16.6545 20H5.35012C2.39285 19.9921 0 17.5199 0 14.4674V7.2496H5.35012V14.1415ZM24 19.9364H18.7373V7.06677H24V19.9444V19.9364ZM16.6545 5.52464H5.15932L1.78072 0H16.6545V5.52464ZM21.0189 0C22.6645 0 23.9921 1.3752 23.9921 3.06836V5.52464H18.7294V0H21.0109H21.0189Z" fill={t.AMBER_SOLID} />
        </svg>
      </div>
      <div style={{ fontSize: 10, color: t.AMBER_SOLID, letterSpacing: "0.20em", textTransform: "uppercase" as const, fontFamily: SF, fontWeight: 600, marginBottom: 14 }}>You qualified</div>
      <div style={{ fontSize: 32, fontFamily: SF, fontWeight: 700, color: t.INK1, letterSpacing: "-0.03em", lineHeight: 1.14, marginBottom: 14 }}>You're all set.</div>
      <div style={{ fontSize: 14.5, fontFamily: SF, color: t.INK3, lineHeight: 1.64, marginBottom: 36 }}>
        The AI will ask you 4 questions.<br />Speak naturally. Pause at any time.
      </div>
      <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onBegin}
        style={{
          padding: "14px 48px", borderRadius: 56, cursor: "pointer",
          background: hov ? `rgba(${t.ARGB}, 0.10)` : `rgba(${t.ARGB}, 0.05)`,
          boxShadow: hov ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.32), 0 0 32px rgba(${t.ARGB}, 0.06)` : `inset 0 0 0 1px rgba(${t.ARGB}, 0.20)`,
          transition: "all 0.18s ease", userSelect: "none" as const,
        }}>
        <span style={{ fontSize: 14.5, color: t.AMBER_SOLID, fontFamily: SF, fontWeight: 600 }}>Begin session</span>
      </div>
    </div>
  );
}

/* ─────────── Complete ─────────── */
function CompleteContent() {
  const { tokens: t } = useParticipantTheme();
  const isMob = useIsMobile();
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: isMob ? "24px 28px 32px" : "40px 32px 44px" }}>
      <div style={{
        width: 60, height: 60, borderRadius: "50%", background: t.GREEN_BG,
        boxShadow: `inset 0 0 0 1px ${t.GREEN_STR}`,
        display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 28,
      }}>
        <CheckCircle size={24} color={t.GREEN_TEXT} />
      </div>
      <div style={{ fontSize: 10, color: t.GREEN_TEXT, letterSpacing: "0.20em", textTransform: "uppercase" as const, fontFamily: SF, fontWeight: 600, marginBottom: 14 }}>Session complete</div>
      <div style={{ fontSize: 32, fontFamily: SF, fontWeight: 700, color: t.INK1, letterSpacing: "-0.03em", lineHeight: 1.14, marginBottom: 14 }}>Thank you,<br />Alex.</div>
      <div style={{ fontSize: 14.5, fontFamily: SF, color: t.INK3, lineHeight: 1.64 }}>Your responses have been recorded.<br />A summary will be sent within 24 hours.</div>
    </div>
  );
}

/* ─────────── Toolbar ─────────── */
function ToolBtn({ children, active, peachActive, onClick }: { children: React.ReactNode; active?: boolean; peachActive?: boolean; onClick: () => void }) {
  const { tokens: t, mode } = useParticipantTheme();
  const [hov, setHov] = useState(false);
  const isDark = mode === "dark";
  const activeBg = isDark
    ? `rgba(${t.ARGB}, 0.50)`
    : (peachActive ? "#fbd1a8" : `rgba(${t.ARGB}, 0.14)`);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        width: 41, height: 41, borderRadius: 16, cursor: "pointer",
        background: active
          ? activeBg
          : hov
            ? (isDark ? "rgba(255,255,255,0.10)" : `rgba(${t.ARGB}, 0.07)`)
            : (isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)"),
        display: "flex", alignItems: "center", justifyContent: "center",
        transform: hov ? "scale(0.94)" : "scale(1)",
        transition: "transform 0.12s ease, background 0.14s ease", userSelect: "none" as const,
      }}>
      {children}
    </div>
  );
}

function FloatingToolbar({ micOn, camOn, isPaused, typingMode, screenSharing, qLabel, onToggleTyping, onToggleMic, onToggleCam, onTogglePause, onToggleScreen, onEnd }: {
  micOn: boolean; camOn: boolean; isPaused: boolean; typingMode: boolean; screenSharing: boolean; qLabel?: string;
  onToggleTyping: () => void; onToggleMic: () => void; onToggleCam: () => void; onTogglePause: () => void; onToggleScreen: () => void; onEnd: () => void;
}) {
  const { tokens: t, mode } = useParticipantTheme();
  const [endHov, setEndHov] = useState(false);
  const isDark = mode === "dark";

  const iconActive = isDark ? "white" : "rgba(28,16,4,0.85)";
  const iconInactive = isDark ? "rgba(255,255,255,0.50)" : "rgba(28,16,4,0.40)";

  const screenActiveColor = "#34D399";
  const screenActiveBg = isDark ? "rgba(52, 211, 153, 0.22)" : "rgba(52, 211, 153, 0.16)";

  return (
    <div style={{
      position: "relative", display: "inline-flex", alignItems: "center", gap: 1,
      padding: "6px", borderRadius: 20,
      background: isDark ? "rgba(18, 20, 28, 0.72)" : "rgba(255, 255, 255, 0.72)",
      backdropFilter: "blur(40px) saturate(130%)", WebkitBackdropFilter: "blur(40px) saturate(130%)",
      borderWidth: 1, borderStyle: "solid",
      borderColor: screenSharing
        ? (isDark ? "rgba(52, 211, 153, 0.30)" : "rgba(52, 211, 153, 0.24)")
        : (isDark ? "rgba(255,255,255,0.10)" : "rgba(107,61,19,0.10)"),
      boxShadow: screenSharing
        ? (isDark
          ? "inset 0 1px 0 rgba(52,211,153,0.10), 0 8px 32px rgba(0,0,0,0.40), 0 0 24px rgba(52,211,153,0.08)"
          : "inset 0 1px 0 rgba(255,255,255,0.80), 0 8px 32px rgba(0,0,0,0.08), 0 0 24px rgba(52,211,153,0.06)")
        : (isDark
          ? "inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.40), 0 2px 8px rgba(0,0,0,0.20)"
          : "inset 0 1px 0 rgba(255,250,240,0.90), 0 8px 32px rgba(107,61,19,0.08), 0 2px 8px rgba(107,61,19,0.04)"),
    }}>
      <ToolBtn active={typingMode} onClick={onToggleTyping}><Keyboard size={17} color={typingMode ? iconActive : iconInactive} /></ToolBtn>
      <ToolBtn active={micOn} peachActive onClick={onToggleMic}>{micOn ? <Mic size={17} color={iconActive} /> : <MicOff size={17} color={iconInactive} />}</ToolBtn>
      <ToolBtn active={camOn} peachActive onClick={onToggleCam}>{camOn ? <Camera size={17} color={iconActive} /> : <CameraOff size={17} color={iconInactive} />}</ToolBtn>

      {/* Screen share button */}
      <ToolBtn active={screenSharing} onClick={onToggleScreen}>
        {screenSharing
          ? <MonitorUp size={17} color={screenActiveColor} />
          : <MonitorUp size={17} color={iconInactive} />}
      </ToolBtn>

      <ToolBtn onClick={onTogglePause}>{isPaused ? <Play size={17} color={iconActive} /> : <Pause size={17} color={iconInactive} />}</ToolBtn>
      <div style={{ width: 1, height: 24, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(107,61,19,0.10)", flexShrink: 0, margin: "0 2px" }} />

      {/* Question label capsule — shown during screen sharing */}
      {screenSharing && qLabel && (
        <div style={{
          display: "flex", alignItems: "center", gap: 6, padding: "0 10px",
          height: 32, borderRadius: 10,
          background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
        }}>
          <MotionDiv animate={{ opacity: [1, 0.18, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF4444", flexShrink: 0 }} />
          <span style={{ fontSize: 10, fontFamily: SF, fontWeight: 600, color: isDark ? "rgba(255,255,255,0.70)" : "rgba(0,0,0,0.50)", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>{qLabel}</span>
        </div>
      )}

      {/* Screen sharing indicator */}
      <AnimatePresence>
        {screenSharing && (
          <MotionDiv key="screen-ind" initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.24 }} style={{ overflow: "hidden", display: "flex", alignItems: "center" }}>
            <div style={{
              display: "flex", alignItems: "center", gap: 6, padding: "0 10px 0 6px",
              height: 32, borderRadius: 10,
              background: screenActiveBg,
            }}>
              <MotionDiv animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1.4, repeat: Infinity }}
                style={{ width: 6, height: 6, borderRadius: "50%", background: screenActiveColor, flexShrink: 0 }} />
              <span style={{ fontSize: 10, fontFamily: SF, fontWeight: 600, color: screenActiveColor, letterSpacing: "0.06em", textTransform: "uppercase" as const, whiteSpace: "nowrap" }}>Sharing</span>
            </div>
            <div style={{ width: 1, height: 24, background: isDark ? "rgba(255,255,255,0.06)" : "rgba(107,61,19,0.10)", flexShrink: 0, margin: "0 4px 0 6px" }} />
          </MotionDiv>
        )}
      </AnimatePresence>

      <div onClick={onEnd} onMouseEnter={() => setEndHov(true)} onMouseLeave={() => setEndHov(false)}
        style={{
          height: 42, borderRadius: 14, cursor: "pointer", padding: "0 14px",
          background: endHov ? "rgba(255,128,128,0.14)" : "rgba(255,128,128,0.08)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
          borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,128,128,0.12)",
          transform: endHov ? "scale(0.96)" : "scale(1)",
          transition: "transform 0.12s ease, background 0.14s ease", userSelect: "none" as const,
        }}>
        <LogOut size={14} color="#FF8080" />
        <span style={{ fontSize: 12, fontFamily: SF, fontWeight: 600, color: "#FF8080", letterSpacing: "0.02em" }}>Leave</span>
      </div>
    </div>
  );
}

/* ─────────── Paused ─────────── */
function PausedOverlay({ visible, onResume }: { visible: boolean; onResume: () => void }) {
  const { tokens: t } = useParticipantTheme();
  const [hov, setHov] = useState(false);
  useEffect(() => { if (!visible) setHov(false); }, [visible]);
  return (
    <AnimatePresence>
      {visible && (
        <MotionDiv key="p" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.36 }}
          style={{
            position: "fixed", inset: 0, zIndex: 80,
            background: t.OVERLAY_BG,
            backdropFilter: "blur(32px) saturate(80%)", WebkitBackdropFilter: "blur(32px) saturate(80%)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <div style={{ width: 40, height: 1, background: `linear-gradient(90deg, transparent, rgba(${t.ARGB}, 0.26), transparent)`, marginBottom: 40 }} />
            <div style={{ fontSize: 10, color: t.AMBER_SOLID, fontFamily: SF, letterSpacing: "0.24em", textTransform: "uppercase" as const, fontWeight: 600, marginBottom: 14 }}>Session Paused</div>
            <div style={{ fontSize: 40, fontFamily: SF, fontWeight: 700, color: t.INK1, letterSpacing: "-0.04em", lineHeight: 1.08, marginBottom: 14 }}>Take your time.</div>
            <div style={{ fontSize: 15, color: t.INK3, fontFamily: SF, marginBottom: 44 }}>We'll continue when you're ready.</div>
            <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)} onClick={onResume}
              style={{
                padding: "14px 44px", borderRadius: 56, cursor: "pointer",
                background: hov ? `rgba(${t.ARGB}, 0.10)` : `rgba(${t.ARGB}, 0.05)`,
                boxShadow: hov ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.32), 0 0 32px rgba(${t.ARGB}, 0.06)` : `inset 0 0 0 1px rgba(${t.ARGB}, 0.20)`,
                transition: "all 0.18s ease",
              }}>
              <span style={{ fontSize: 14.5, color: t.AMBER_SOLID, fontFamily: SF, fontWeight: 600 }}>Resume Session</span>
            </div>
          </div>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

/* ─────────── Disqualified ─────────── */
function DisqualifiedOverlay({ visible, reason }: { visible: boolean; reason: string }) {
  const { tokens: t } = useParticipantTheme();
  return (
    <AnimatePresence>
      {visible && (
        <MotionDiv key="dq" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.40 }}
          style={{
            position: "fixed", inset: 0, zIndex: 110,
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            background: t.mode === "dark" ? "rgba(0,0,0,0.80)" : "rgba(250,244,235,0.94)",
            backdropFilter: "blur(32px)", WebkitBackdropFilter: "blur(32px)", padding: "0 24px",
          }}>
          <MotionDiv initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.40, delay: 0.10 }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", maxWidth: 400 }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%", background: t.SURF1, boxShadow: `inset 0 0 0 1px ${t.STR2}`,
              display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, fontSize: 20, color: t.INK3,
            }}>×</div>
            <div style={{ fontSize: 10, color: t.INK4, letterSpacing: "0.20em", textTransform: "uppercase" as const, fontFamily: SF, fontWeight: 600, marginBottom: 14 }}>Thank you</div>
            <div style={{ fontSize: 28, fontFamily: SF, fontWeight: 700, color: t.INK1, letterSpacing: "-0.03em", lineHeight: 1.18, marginBottom: 16 }}>
              You don't quite<br />match this study.
            </div>
            <div style={{ fontSize: 14, fontFamily: SF, color: t.INK2, lineHeight: 1.64, marginBottom: 10 }}>{reason}</div>
            <div style={{ fontSize: 13, fontFamily: SF, color: t.INK4, lineHeight: 1.60 }}>Your responses may help match you to a future study.</div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}

/* ─────────── Theme Toggle ─────────── */
function ThemeToggle() {
  const { mode, toggle } = useParticipantTheme();
  const [hov, setHov] = useState(false);
  const isDark = mode === "dark";
  const isMob = useIsMobile();
  return (
    <div
      onClick={toggle}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "absolute", top: isMob ? SA_TOP + 8 : 20, right: isMob ? 16 : 20, zIndex: 50,
        width: 40, height: 40, borderRadius: 12, cursor: "pointer",
        backdropFilter: "blur(24px)", WebkitBackdropFilter: "blur(24px)",
        background: isDark
          ? (hov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)")
          : (hov ? "rgba(107,61,19,0.09)" : "rgba(107,61,19,0.05)"),
        borderWidth: 1, borderStyle: "solid",
        borderColor: isDark ? "rgba(255,255,255,0.10)" : "rgba(107,61,19,0.10)",
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "background 0.16s ease",
        boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.30)" : "0 2px 8px rgba(107,61,19,0.08)",
      }}
    >
      {isDark ? <Sun size={16} color="rgba(255,255,255,0.60)" /> : <Moon size={16} color="rgba(107,61,19,0.55)" />}
    </div>
  );
}

/* ─────────── Mobile Waveform Strip (P2) ─────────── */
function MobileWaveStrip({ isSpeaking, isListening, speakingBar, speakingGlow, speakingLabel, t }: {
  isSpeaking: boolean; isListening: boolean;
  speakingBar: string; speakingGlow: string; speakingLabel: string; t: any;
}) {
  const isLight = t.mode === "light";
  const mwListBg    = isLight ? "rgba(160,108,24,0.07)"  : "rgba(218,165,32,0.08)";
  const mwListStr   = isLight ? "rgba(160,108,24,0.13)"  : "rgba(218,165,32,0.16)";
  const mwListBar   = isLight ? "rgba(160,108,24,0.82)"  : "rgba(218,165,32,0.85)";
  const mwListGlow  = isLight ? "rgba(160,108,24,0.14)"  : "rgba(218,165,32,0.18)";
  const mwListLabel = isLight ? "rgb(160,108,24)"         : "rgb(218,165,32)";
  const mwSpkBg     = isLight ? "rgba(107,61,19,0.07)"   : "rgba(97,95,255,0.08)";
  const mwSpkStr    = isLight ? "rgba(107,61,19,0.14)"   : "rgba(97,95,255,0.16)";

  return (
    <div style={{
      flexShrink: 0, display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0 8px", marginBottom: 2,
    }}>
      <div style={{
        width: 60, height: 38, borderRadius: 12, overflow: "hidden",
        background: isSpeaking ? mwSpkBg : isListening ? mwListBg : t.SURF1,
        boxShadow: `inset 0 0 0 1px ${isSpeaking ? mwSpkStr : isListening ? mwListStr : t.STR2}`,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
      }}>
        <div style={{ width: "100%", height: 20 }}>
          {isLight ? (
            <AmplitudeDots active={isSpeaking || isListening} listening={isListening}
              dotColor={isListening ? mwListBar : speakingBar}
              glowColor={isListening ? mwListGlow : speakingGlow}
              compact />
          ) : (
            <Waveform active={isSpeaking || isListening} listening={isListening}
              barColor={isListening ? mwListBar : speakingBar}
              glowColor={isListening ? mwListGlow : speakingGlow} />
          )}
        </div>
      </div>
      <span style={{
        fontSize: 10, fontFamily: SF, fontWeight: 600, letterSpacing: "0.10em",
        textTransform: "uppercase" as const,
        color: isSpeaking ? speakingLabel : isListening ? mwListLabel : t.INK4,
      }}>
        {isSpeaking ? "AI Speaking" : isListening ? "Listening" : "Standby"}
      </span>
    </div>
  );
}

/* ─────────── Mobile Stories (P3) — Full-screen vertical swipe cards ─────────── */
function MobileStories({ options, selected, onSelect, multiSelect, onConfirm, isSpeaking, t }: {
  options: ComparisonOption[];
  selected: Set<string>;
  onSelect: (id: string) => void;
  multiSelect?: boolean;
  onConfirm: () => void;
  isSpeaking: boolean;
  t: any;
}) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const isDark = t.mode === "dark";

  useEffect(() => { setCurrentIdx(0); }, [options.length]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStart === null) return;
    const dy = e.changedTouches[0].clientY - touchStart;
    if (Math.abs(dy) > 50) {
      if (dy < 0 && currentIdx < options.length - 1) setCurrentIdx(i => i + 1);
      if (dy > 0 && currentIdx > 0) setCurrentIdx(i => i - 1);
    }
    setTouchStart(null);
  }, [touchStart, currentIdx, options.length]);

  const handleTap = useCallback((e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const w = rect.width;
    if (x < w * 0.25) {
      // Left tap → previous
      if (currentIdx > 0) setCurrentIdx(i => i - 1);
    } else if (x > w * 0.75) {
      // Right tap → next
      if (currentIdx < options.length - 1) setCurrentIdx(i => i + 1);
    } else {
      // Center tap → toggle select
      onSelect(options[currentIdx].id);
    }
  }, [currentIdx, options, onSelect]);

  const opt = options[currentIdx];
  const isSel = selected.has(opt.id);
  const selectedLabels = options.filter(o => selected.has(o.id)).map(o => o.label);

  return (
    <div style={{
      flex: 1, minHeight: 0, display: "flex", flexDirection: "column", position: "relative",
      opacity: isSpeaking ? 0.25 : 1, pointerEvents: isSpeaking ? "none" : "auto",
      transition: "opacity 0.3s ease",
    }}>
      {/* Progress dots */}
      <div style={{
        flexShrink: 0, display: "flex", gap: 4, padding: "6px 20px 10px",
      }}>
        {options.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 9999,
            background: i === currentIdx
              ? t.AMBER_SOLID
              : i < currentIdx
                ? `rgba(${t.ARGB}, 0.30)`
                : t.STR2,
            transition: "background 0.2s ease",
          }} />
        ))}
      </div>

      {/* Card area */}
      <div
        style={{
          flex: 1, minHeight: 0, position: "relative", borderRadius: 18,
          margin: "0 16px", overflow: "hidden", cursor: "pointer",
        }}
        onClick={handleTap}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <AnimatePresence mode="wait">
          <MotionDiv key={opt.id}
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <ImageWithFallback src={opt.img} alt={opt.label} style={{
              width: "100%", height: "100%", objectFit: "cover", display: "block",
            }} />
            {/* Gradient overlay */}
            <div style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(0deg, rgba(0,0,0,0.70) 0%, rgba(0,0,0,0.08) 40%, transparent 100%)",
              pointerEvents: "none",
            }} />
            {/* Card info */}
            <div style={{
              position: "absolute", bottom: 0, left: 0, right: 0,
              padding: "20px 16px", display: "flex", flexDirection: "column", gap: 4,
            }}>
              {opt.subtitle && (
                <span style={{ fontSize: 11, fontFamily: SF, fontWeight: 500, color: "rgba(255,255,255,0.55)", letterSpacing: "0.08em", textTransform: "uppercase" as const, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {opt.subtitle}
                </span>
              )}
              <span style={{ fontSize: 18, fontFamily: SF, fontWeight: 600, color: "white", letterSpacing: "-0.01em", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {opt.label}
              </span>
              <span style={{ fontSize: 11.5, fontFamily: SF, color: "rgba(255,255,255,0.45)", marginTop: 6, letterSpacing: "0.02em" }}>
                {currentIdx + 1} / {options.length} · Tap to {isSel ? "deselect" : "select"}
              </span>
            </div>
            {/* Selection check */}
            <div style={{
              position: "absolute", top: 14, right: 14, width: 28, height: 28, borderRadius: 9999,
              background: isSel ? t.AMBER_SOLID : "rgba(255,255,255,0.14)",
              borderWidth: 2, borderStyle: "solid",
              borderColor: isSel ? t.AMBER_SOLID : "rgba(255,255,255,0.30)",
              display: "flex", alignItems: "center", justifyContent: "center",
              backdropFilter: "blur(8px)", transition: "all 0.18s ease",
            }}>
              {isSel && <CheckCircle size={16} color="white" />}
            </div>
          </MotionDiv>
        </AnimatePresence>

        {/* Left/right tap zones (visual hint) */}
        {currentIdx > 0 && (
          <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)",
            width: 28, height: 28, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.30)", backdropFilter: "blur(8px)", pointerEvents: "none" }}>
            <ChevronLeft size={16} color="rgba(255,255,255,0.85)" />
          </div>
        )}
        {currentIdx < options.length - 1 && (
          <div style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
            width: 28, height: 28, borderRadius: 9999, display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.30)", backdropFilter: "blur(8px)", pointerEvents: "none" }}>
            <ChevronRight size={16} color="rgba(255,255,255,0.85)" />
          </div>
        )}
      </div>

      {/* Bottom confirm bar */}
      {selected.size > 0 && (
        <MotionDiv initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.22 }}
          style={{ flexShrink: 0, padding: `10px 16px ${8 + SA_BOTTOM}px` }}>
          <div onClick={onConfirm} style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "12px 0", borderRadius: 12, cursor: "pointer",
            background: `rgba(${t.ARGB}, 0.08)`,
            boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.20)`,
          }}>
            <CheckCircle size={14} color={t.AMBER_SOLID} />
            <span style={{ fontSize: 13, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID }}>
              Confirm {multiSelect ? `${selected.size} selected` : selectedLabels[0]}
            </span>
            <ChevronRight size={14} color={t.AMBER_SOLID} />
          </div>
        </MotionDiv>
      )}
    </div>
  );
}

/* ─────────── Mobile Viewfinder (P4) — In-Home Visit rear camera mode ─────────── */
type ViewfinderState = "scanning" | "detected" | "timeout_voice" | "fallback";

function MobileViewfinder({ qText, qNum, speech, subtitleText, subtitleLabel, onExit, t }: {
  qText: string; qNum: string; speech: Speech; subtitleText: string; subtitleLabel: string;
  onExit: () => void; t: any;
}) {
  const [vfState, setVfState] = useState<ViewfinderState>("scanning");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDark = t.mode === "dark";
  const isSpeaking = speech === "speaking";
  const isListening = speech === "listening";

  // State machine timers
  useEffect(() => {
    setVfState("scanning");
    // 8s timeout → voice guidance
    timerRef.current = setTimeout(() => {
      setVfState("timeout_voice");
      // 18s total → fallback
      setTimeout(() => setVfState("fallback"), 10000);
    }, 8000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [qNum]);

  // Simulate detection at 4s
  useEffect(() => {
    const det = setTimeout(() => {
      setVfState(prev => prev === "scanning" ? "detected" : prev);
    }, 4000);
    return () => clearTimeout(det);
  }, [qNum]);

  const stateLabel = {
    scanning: "Point camera at the item",
    detected: "Item detected — hold steady",
    timeout_voice: "Try describing what you see",
    fallback: "Tell us about it verbally",
  }[vfState];

  const stateColor = {
    scanning: "rgba(255,255,255,0.70)",
    detected: "#34D399",
    timeout_voice: "#FBBF24",
    fallback: "rgba(255,255,255,0.50)",
  }[vfState];

  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: "absolute", inset: 0, zIndex: 20,
        background: "#000",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Simulated camera feed */}
      <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
        {/* Fake camera gradient */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(145deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)",
        }} />
        {/* Scan line animation */}
        <MotionDiv
          animate={{ y: ["0%", "100%", "0%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          style={{
            position: "absolute", left: "12%", right: "12%", height: 2,
            background: vfState === "detected"
              ? "rgba(52,211,153,0.40)"
              : "rgba(255,255,255,0.12)",
            boxShadow: vfState === "detected"
              ? "0 0 20px rgba(52,211,153,0.30)"
              : "0 0 12px rgba(255,255,255,0.06)",
          }}
        />

        {/* Corner brackets (targeting frame) */}
        {["top-left", "top-right", "bottom-left", "bottom-right"].map((pos) => {
          const isTop = pos.includes("top");
          const isLeft = pos.includes("left");
          const bracketColor = vfState === "detected" ? "#34D399" : "rgba(255,255,255,0.40)";
          return (
            <div key={pos} style={{
              position: "absolute",
              top: isTop ? "16%" : undefined,
              bottom: !isTop ? "16%" : undefined,
              left: isLeft ? "12%" : undefined,
              right: !isLeft ? "12%" : undefined,
              width: 32, height: 32,
              borderColor: bracketColor,
              borderWidth: 2.5,
              borderStyle: "solid",
              borderTopStyle: isTop ? "solid" : "none",
              borderBottomStyle: !isTop ? "solid" : "none",
              borderLeftStyle: isLeft ? "solid" : "none",
              borderRightStyle: !isLeft ? "solid" : "none",
              borderRadius: isTop && isLeft ? "6px 0 0 0"
                : isTop && !isLeft ? "0 6px 0 0"
                : !isTop && isLeft ? "0 0 0 6px"
                : "0 0 6px 0",
              transition: "border-color 0.4s ease",
            }} />
          );
        })}

        {/* Detection pulse */}
        {vfState === "detected" && (
          <MotionDiv
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0, 0.4] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              position: "absolute", top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 80, height: 80, borderRadius: 9999,
              border: "2px solid #34D399",
            }}
          />
        )}

        {/* State indicator pill */}
        <div style={{
          position: "absolute", top: SA_TOP + 12,
          left: "50%", transform: "translateX(-50%)",
          display: "flex", alignItems: "center", gap: 8,
          padding: "7px 16px", borderRadius: 9999,
          background: "rgba(0,0,0,0.55)",
          backdropFilter: "blur(16px)",
        }}>
          {vfState === "scanning" && (
            <MotionDiv animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }}>
              <Scan size={14} color={stateColor} />
            </MotionDiv>
          )}
          {vfState === "detected" && (
            <MotionDiv animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}>
              <CheckCircle size={14} color={stateColor} />
            </MotionDiv>
          )}
          {vfState === "timeout_voice" && <Volume2 size={14} color={stateColor} />}
          {vfState === "fallback" && <Mic size={14} color={stateColor} />}
          <span style={{ fontSize: 11, fontFamily: SF, fontWeight: 600, color: stateColor, letterSpacing: "0.02em" }}>
            {stateLabel}
          </span>
        </div>

        {/* Question prompt floating card */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          padding: "0 16px 20px",
        }}>
          <div style={{
            padding: "16px 18px", borderRadius: 18,
            background: "rgba(0,0,0,0.60)",
            backdropFilter: "blur(24px)",
            borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <div style={{
                padding: "2px 8px", borderRadius: 6,
                background: "rgba(255,255,255,0.10)",
              }}>
                <span style={{ fontSize: 9, fontFamily: SF, fontWeight: 700, color: "rgba(255,255,255,0.60)", letterSpacing: "0.10em" }}>{qNum}</span>
              </div>
              {(isSpeaking || isListening) && (
                <div style={{ display: "flex", alignItems: "center", gap: 3, height: 10 }}>
                  {[0.3, 0.7, 1, 0.6, 0.4].map((v, i) => (
                    <MotionDiv key={i}
                      animate={{ scaleY: [v * 0.1, v, v * 0.15] }}
                      transition={{ duration: 0.7 + i * 0.08, repeat: Infinity, ease: "easeInOut" }}
                      style={{ width: 2, height: "100%", borderRadius: 9999, transformOrigin: "center",
                        background: isListening ? "rgba(218,165,32,0.80)" : "rgba(139,128,255,0.80)" }}
                    />
                  ))}
                </div>
              )}
            </div>
            <p style={{
              margin: 0, fontSize: 14, fontFamily: SF, fontWeight: 400,
              color: "rgba(255,255,255,0.88)", lineHeight: 1.5, letterSpacing: "-0.01em",
              display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" as const, overflow: "hidden",
            }}>
              {isSpeaking && subtitleText ? subtitleText : qText}
            </p>
            {/* Subtitle text from user */}
            {isListening && subtitleText && (
              <p style={{
                margin: "8px 0 0", fontSize: 13, fontFamily: SF, color: "rgba(255,255,255,0.55)",
                lineHeight: 1.5, borderTopWidth: 1, borderTopStyle: "dashed", borderTopColor: "rgba(255,255,255,0.10)",
                paddingTop: 8,
              }}>
                {subtitleText}
                <MotionSpan animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 0.8, repeat: Infinity }}
                  style={{ display: "inline-block", width: 2, height: "0.48em", background: "rgba(255,255,255,0.40)", marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} />
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Bottom toolbar area */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center",
        padding: `14px 20px ${14 + SA_BOTTOM}px`,
        background: "rgba(0,0,0,0.85)",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}>
        <div onClick={onExit} style={{
          display: "flex", alignItems: "center", gap: 8,
          padding: "12px 24px", borderRadius: 14, cursor: "pointer",
          background: "rgba(255,255,255,0.10)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.12), 0 2px 8px rgba(0,0,0,0.20)",
          backdropFilter: "blur(12px)",
        }}>
          <MonitorUp size={15} color="rgba(255,255,255,0.80)" />
          <span style={{ fontSize: 13, fontFamily: SF, fontWeight: 600, color: "rgba(255,255,255,0.80)", letterSpacing: "0.02em" }}>Exit Camera</span>
        </div>
      </div>
    </MotionDiv>
  );
}

/* ─────────── Mobile Toolbar (P2) ─────────── */
function MobileToolbar({ micOn, camOn, isPaused, onToggleMic, onToggleCam, onTogglePause, onToggleScreen, onEnd }: {
  micOn: boolean; camOn: boolean; isPaused: boolean;
  onToggleMic: () => void; onToggleCam: () => void; onTogglePause: () => void; onToggleScreen: () => void; onEnd: () => void;
}) {
  const { tokens: t, mode } = useParticipantTheme();
  const isDark = mode === "dark";
  const iconActive = isDark ? "white" : "rgba(28,16,4,0.85)";
  const iconInactive = isDark ? "rgba(255,255,255,0.45)" : "rgba(28,16,4,0.38)";

  const Btn = ({ children, active, onClick, danger }: { children: React.ReactNode; active?: boolean; onClick: () => void; danger?: boolean }) => (
    <div onClick={onClick} style={{
      width: 44, height: 44, borderRadius: 14, cursor: "pointer",
      background: danger ? "rgba(255,128,128,0.10)"
        : active ? (isDark ? `rgba(${t.ARGB}, 0.40)` : `rgba(${t.ARGB}, 0.14)`)
        : (isDark ? "rgba(255,255,255,0.05)" : `rgba(${t.ARGB}, 0.04)`),
      display: "flex", alignItems: "center", justifyContent: "center",
      transition: "background 0.14s ease",
    }}>
      {children}
    </div>
  );

  return (
    <div style={{
      flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
      padding: `10px 20px ${10 + SA_BOTTOM}px`,
      background: isDark ? "rgba(10,12,22,0.80)" : "rgba(250,244,235,0.88)",
      backdropFilter: "blur(24px) saturate(130%)",
      WebkitBackdropFilter: "blur(24px) saturate(130%)",
      borderTop: `1px solid ${t.STR2}`,
    }}>
      <Btn active={micOn} onClick={onToggleMic}>{micOn ? <Mic size={18} color={iconActive} /> : <MicOff size={18} color={iconInactive} />}</Btn>
      <Btn active={camOn} onClick={onToggleCam}>{camOn ? <Camera size={18} color={iconActive} /> : <CameraOff size={18} color={iconInactive} />}</Btn>
      <Btn onClick={onToggleScreen}><MonitorUp size={18} color={iconInactive} /></Btn>
      <Btn onClick={onTogglePause}>{isPaused ? <Play size={18} color={iconActive} /> : <Pause size={18} color={iconInactive} />}</Btn>
      <Btn onClick={onEnd} danger><LogOut size={16} color="#FF8080" /></Btn>
    </div>
  );
}

/* ─────────── iOS Safe Area Constants (iPhone 16 — 393×852) ─────────── */
const SA_TOP = 54;    // Dynamic Island status bar height
const SA_BOTTOM = 34; // Home Indicator area height

/* ─────────── iOS Status Bar (mobile only) ─────────── */
function MobileStatusBar() {
  const { mode } = useParticipantTheme();
  const isDark = mode === "dark";
  const [time, setTime] = useState(() => {
    const d = new Date();
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`;
  });
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setTime(`${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}`);
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const iconColor = isDark ? "white" : "#3D1F06";

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 200,
      height: SA_TOP, display: "flex", alignItems: "flex-end",
      padding: "0 24px 8px",
      pointerEvents: "none",
    }}>
      {/* Time — left */}
      <div style={{ flex: 1, display: "flex", alignItems: "center" }}>
        <span style={{
          fontFamily: "'SF Pro', -apple-system, system-ui, sans-serif",
          fontSize: 16, fontWeight: 600, color: iconColor,
          letterSpacing: "0.02em",
        }}>
          {time}
        </span>
      </div>

      {/* Dynamic Island — center */}
      <div style={{
        position: "absolute", top: 10, left: "50%", transform: "translateX(-50%)",
        width: 126, height: 36, borderRadius: 9999,
        background: "#000",
      }} />

      {/* Signal icons — right */}
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 7 }}>
        {/* Cellular */}
        <svg width={19} height={12} viewBox="0 0 19.2 12.2264" fill="none">
          <path d={svgIconPaths.p1e09e400} fill={iconColor} fillRule="evenodd" clipRule="evenodd" />
        </svg>
        {/* WiFi */}
        <svg width={17} height={12} viewBox="0 0 17.1417 12.3283" fill="none">
          <path d={svgIconPaths.p18b35300} fill={iconColor} fillRule="evenodd" clipRule="evenodd" />
        </svg>
        {/* Battery */}
        <svg width={27} height={13} viewBox="0 0 27.328 13" fill="none">
          <rect height="12" rx="3.8" stroke={iconColor} strokeOpacity="0.35" width="24" x="0.5" y="0.5" fill="none" />
          <path d={svgIconPaths.p7a14d80} fill={iconColor} opacity="0.4" />
          <rect fill={iconColor} height="9" rx="2.5" width="21" x="2" y="2" />
        </svg>
      </div>
    </div>
  );
}

/* ─────────── iOS Home Indicator (mobile only) ─────────── */
function MobileHomeIndicator() {
  const { mode } = useParticipantTheme();
  const isDark = mode === "dark";
  return (
    <div style={{
      position: "fixed", bottom: 8, left: "50%", transform: "translateX(-50%)",
      zIndex: 200, pointerEvents: "none",
    }}>
      <div style={{
        width: 134, height: 5, borderRadius: 9999,
        background: isDark ? "rgba(255,255,255,0.30)" : "rgba(107,61,19,0.22)",
      }} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   ROOT INNER (uses theme context)
═══════════════════════════════════════════════════════ */
function ParticipantInner() {
  const { tokens: t, mode } = useParticipantTheme();
  const [stage, setStage]     = useState<Stage>("language");
  const [lang, setLang]       = useState("en");
  const [dqReason, setDqReason] = useState("");
  const [speech, setSpeech]   = useState<Speech>("speaking");
  const [qIdx, setQIdx]       = useState(0);
  const [micOn, setMicOn]     = useState(true);
  const [camOn, setCamOn]     = useState(true);
  const [typingMode, setTypingMode] = useState(false);
  const [screenSharing, setScreenSharing] = useState(false);

  const isInterview = stage === "interview";
  const isPaused    = stage === "paused";
  const showToolbar = isInterview || isPaused;

  const isSpeaking = speech === "speaking" && isInterview;
  const caption = useTypewriter(QS[qIdx].text, isSpeaking, 22);
  const isListening = speech === "listening" && isInterview;
  const userTranscript = useTypewriter(USER_TRANSCRIPTS[qIdx] || "", isListening, 28);

  useEffect(() => {
    if (caption === QS[qIdx].text && speech === "speaking" && isInterview) {
      const id = setTimeout(() => setSpeech("listening"), 720);
      return () => clearTimeout(id);
    }
  }, [caption, qIdx, speech, isInterview]);

  const handlePause   = useCallback(() => setStage("paused"), []);
  const handleResume  = useCallback(() => { setStage("interview"); setSpeech("thinking"); setTimeout(() => setSpeech("speaking"), 340); }, []);
  const handleBegin   = useCallback(() => { setStage("interview"); setSpeech("speaking"); }, []);
  const handleQualify = useCallback(() => setStage("ready"), []);
  const handleDisqualify = useCallback((r: string) => { setDqReason(r); setStage("disqualified"); }, []);
  const handleEnd     = useCallback(() => setStage("complete"), []);

  /* Manual advance: triggered by Q badge click or onNextQuestion */
  const advanceQuestion = useCallback(() => {
    if (qIdx < QS.length - 1) {
      setQIdx((i) => i + 1);
      setSpeech("thinking");
      setTimeout(() => setSpeech("speaking"), 400);
    } else {
      handleEnd();
    }
  }, [qIdx, handleEnd]);

  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.code === "Space" && e.target === document.body) {
        e.preventDefault();
        if (isPaused) handleResume(); else if (isInterview) handlePause();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [isPaused, isInterview, handlePause, handleResume]);

  const progress = useMemo(() => {
    if (isInterview || isPaused) return ((BEFORE + qIdx + 1) / TOTAL) * 100;
    return 0;
  }, [isInterview, isPaused, qIdx]);

  const isMobile = useIsMobile();
  const isWide = isInterview || isPaused;
  const cardW  = isMobile ? "100%" : (isWide ? 860 : 480);
  const cardH  = isMobile ? "100%" : (isWide ? "min(80vh, 560px)" : "min(88vh, 720px)");
  const isDark = mode === "dark";

  /* Subtitle text for screen-sharing cinema mode — with 2s auto-fade */
  const subtitleTextLive = isSpeaking ? caption : isListening ? userTranscript : "";
  const subtitleLabelLive = isSpeaking ? "AI" : isListening ? "You" : "";
  const [subtitleVisible, setSubtitleVisible] = useState(false);
  const [frozenSubtitle, setFrozenSubtitle] = useState({ text: "", label: "" });
  const subtitleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (subtitleTextLive.length > 0) {
      setSubtitleVisible(true);
      setFrozenSubtitle({ text: subtitleTextLive, label: subtitleLabelLive });
      if (subtitleTimer.current) clearTimeout(subtitleTimer.current);
    } else {
      // Keep last text visible during fade-out grace period
      subtitleTimer.current = setTimeout(() => setSubtitleVisible(false), 2000);
    }
    return () => { if (subtitleTimer.current) clearTimeout(subtitleTimer.current); };
  }, [subtitleTextLive, subtitleLabelLive]);

  const subtitleText = subtitleTextLive.length > 0 ? subtitleTextLive : frozenSubtitle.text;
  const subtitleLabel = subtitleTextLive.length > 0 ? subtitleLabelLive : frozenSubtitle.label;
  const showSubtitle = screenSharing && isInterview && subtitleVisible;

  return (
    <div style={{ position: "relative", width: "100vw", height: isMobile ? "100dvh" : "100vh", overflow: "hidden", background: isDark ? "#0a0b0f" : "#F5E8C8" }}>
      {/* Background — desktop wallpaper when screen sharing (desktop only), else normal mode bg */}
      <AnimatePresence mode="wait">
        {!isMobile && screenSharing && isInterview ? (
          <MotionDiv key="desktop-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
            style={{ position: "absolute", inset: 0 }}>
            <ImageWithFallback src={SCREEN_SHARE_IMG} alt="" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover",
            }} />
          </MotionDiv>
        ) : isDark ? (
          <MotionDiv key="dark-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            style={{ position: "absolute", inset: 0 }}>
            <img src={imgDarkBg} alt="" style={{
              position: "absolute", inset: 0, width: "100%", height: "100%",
              objectFit: "cover", filter: "brightness(0.88) contrast(1.04)",
            }} />
          </MotionDiv>
        ) : (
          <MotionDiv key="light-bg" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.6 }}
            style={{ position: "absolute", inset: 0 }}>
            {/* ── Light Orb System ── */}
            {/* 1. Warm amber base — more saturated than before */}
            <div style={{ position: "absolute", inset: 0, background: "#F5E8C8" }} />

            {/* 2. Primary cream glow — 900px, low blur so it stays crisp */}
            <div style={{ position: "absolute", width: 900, height: 900, left: "calc(50% - 560px)", top: "calc(50% - 500px)", borderRadius: "50%", background: "radial-gradient(circle, #FCEBC8 0%, #F9DCA0 22%, rgba(249,215,140,0.38) 52%, transparent 74%)", filter: "blur(6px)", pointerEvents: "none" }} />

            {/* 3. Orange-red bloom #FF5200 — 0.26 opacity, tight blur */}
            <div style={{ position: "absolute", width: 520, height: 520, left: "calc(50% - 100px)", top: "calc(50% - 360px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,82,0,0.26) 0%, rgba(255,120,40,0.14) 38%, transparent 68%)", filter: "blur(18px)", pointerEvents: "none" }} />

            {/* 4. Gold ring halo — high enough opacity to see */}
            <div style={{ position: "absolute", width: 580, height: 580, left: "calc(50% - 500px)", top: "calc(50% - 400px)", borderRadius: "50%", border: "1.5px solid rgba(216,185,131,0.60)", boxShadow: "0 0 0 24px rgba(216,185,131,0.15), 0 0 0 50px rgba(216,185,131,0.10), 0 0 0 82px rgba(216,185,131,0.065), 0 0 0 122px rgba(216,185,131,0.040), 0 0 0 170px rgba(216,185,131,0.025), 0 0 0 228px rgba(216,185,131,0.014)", pointerEvents: "none" }} />

            {/* 5. Yellow-gold accent centre (Figma #FFEA00) */}
            <div style={{ position: "absolute", width: 340, height: 220, left: "calc(50% + 20px)", top: "calc(50% - 110px)", borderRadius: "50%", background: "radial-gradient(ellipse, rgba(255,228,0,0.20) 0%, rgba(215,249,208,0.08) 55%, transparent 80%)", filter: "blur(14px)", pointerEvents: "none", transform: "rotate(-18deg)" }} />

            {/* 6. Secondary orb bottom-right */}
            <div style={{ position: "absolute", width: 680, height: 680, right: "-120px", bottom: "-120px", borderRadius: "50%", background: "radial-gradient(circle, #FCEBC8 0%, #F9DCA0 20%, rgba(249,215,140,0.28) 50%, transparent 72%)", filter: "blur(6px)", pointerEvents: "none", opacity: 0.85 }} />

            {/* 7. Secondary orange */}
            <div style={{ position: "absolute", width: 380, height: 380, right: "30px", bottom: "70px", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,82,0,0.20) 0%, transparent 65%)", filter: "blur(16px)", pointerEvents: "none" }} />

            {/* 8. Secondary gold rings */}
            <div style={{ position: "absolute", width: 460, height: 460, right: "0px", bottom: "0px", borderRadius: "50%", border: "1.5px solid rgba(216,185,131,0.50)", boxShadow: "0 0 0 18px rgba(216,185,131,0.12), 0 0 0 40px rgba(216,185,131,0.08), 0 0 0 68px rgba(216,185,131,0.05), 0 0 0 104px rgba(216,185,131,0.028)", pointerEvents: "none" }} />
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Vignette — hide during screen share */}
      {!screenSharing && (
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: t.VIGNETTE }} />
      )}

      {/* Theme toggle — hide during screen share */}
      {!screenSharing && <ThemeToggle />}

      {/* ─── Normal mode: Card + Toolbar centered ─── */}
      <AnimatePresence>
        {!screenSharing && (
          <MotionDiv key="card-container"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.92 }}
            transition={{ duration: 0.44, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              position: "absolute", inset: 0, zIndex: 10,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: isMobile ? "stretch" : "center",
              padding: isMobile ? 0 : 24, pointerEvents: "none", gap: isMobile ? 0 : 16, overflow: isMobile ? "hidden" : "auto",
            }}>
            <MotionDiv
              animate={{ scale: isMobile ? 1 : (isPaused ? 0.97 : 1), opacity: isPaused ? 0.46 : 1, width: cardW }}
              transition={{ duration: 0.56, ease: [0.25, 0.1, 0.25, 1] }}
              style={{
                pointerEvents: "auto", position: "relative", width: cardW, maxWidth: "100%",
                height: cardH, maxHeight: "100%", borderRadius: isMobile ? 0 : 28, overflow: "hidden",
                display: "flex", flexDirection: "column",
                ...(isMobile ? { flex: 1 } : {}),
              }}
            >
              {/* Glass layers */}
              <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", backdropFilter: t.GLASS_BLUR, WebkitBackdropFilter: t.GLASS_BLUR, background: t.GLASS_BG }} />
              {!isMobile && <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", borderWidth: 1, borderStyle: "solid", borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.72)" }} />}
              <div style={{ position: "absolute", inset: 0, borderRadius: "inherit", pointerEvents: "none", boxShadow: t.CARD_SHADOW }} />

              {/* Content */}
              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
                {stage !== "disqualified" && <CardHeader stage={stage} progress={progress} qIdx={qIdx} />}
                <div style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column" }}>
                  {stage === "language"    && <LanguageStep onNext={(l) => { setLang(l); setStage("terms"); }} />}
                  {stage === "terms"       && <TermsStep lang={lang} onNext={() => setStage("setup")} />}
                  {stage === "setup"       && <SetupStep onNext={() => setStage("screener")} />}
                  {stage === "screener"    && <ScreenerStep onQualify={handleQualify} onDisqualify={handleDisqualify} />}
                  {stage === "ready"       && <ReadyContent onBegin={handleBegin} />}
                  {(isInterview || isPaused) && (
                    <InterviewContent qIdx={qIdx} speech={speech} isActive={isInterview}
                      caption={caption} userTranscript={userTranscript}
                      micOn={micOn} camOn={camOn} typingMode={typingMode}
                      onNextQuestion={advanceQuestion}
                      onSendTyped={(text) => { advanceQuestion(); }} />
                  )}
                  {stage === "complete" && <CompleteContent />}
                </div>

                {/* Mobile floating PiP camera */}
                {isMobile && (isInterview || isPaused) && camOn && !screenSharing && (
                  <MotionDiv
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: isPaused ? 0.4 : 1, scale: 1 }}
                    transition={{ duration: 0.28 }}
                    style={{
                      position: "absolute", bottom: 84, right: 16, zIndex: 20,
                      width: 80, height: 108, borderRadius: 16, overflow: "hidden",
                      boxShadow: isDark
                        ? "0 4px 20px rgba(0,0,0,0.50), inset 0 0 0 1px rgba(255,255,255,0.10)"
                        : "0 4px 20px rgba(107,61,19,0.10), inset 0 0 0 1px rgba(107,61,19,0.10)",
                    }}
                  >
                    <img src={imgFace} alt="You" style={{
                      width: "100%", height: "100%", objectFit: "cover",
                      objectPosition: "center 18%", filter: "saturate(0.92) brightness(0.98)",
                    }} />
                    <div style={{
                      position: "absolute", top: "30%", left: "50%", transform: "translate(-50%, -50%)",
                      width: 40, height: 40, borderRadius: 9999,
                      borderWidth: 1, borderStyle: "dashed",
                      borderColor: isDark ? "rgba(255,255,255,0.22)" : "rgba(107,61,19,0.18)",
                      pointerEvents: "none",
                    }} />
                    <div style={{
                      position: "absolute", top: 5, left: 5,
                      display: "flex", alignItems: "center", gap: 3,
                      padding: "2px 6px", borderRadius: 9999,
                      background: isDark ? "rgba(0,0,0,0.45)" : "rgba(250,244,235,0.88)",
                      backdropFilter: "blur(6px)",
                    }}>
                      <MotionDiv animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                        style={{ width: 4, height: 4, borderRadius: "50%", background: t.GREEN }} />
                      <span style={{ fontSize: 7.5, fontFamily: SF, fontWeight: 600, color: t.GREEN_TEXT, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Live</span>
                    </div>
                    {isInterview && (isSpeaking || isListening) && (
                      <div style={{
                        position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)",
                        display: "flex", alignItems: "center", gap: 1.5, height: 10,
                      }}>
                        {[0.3, 0.6, 1, 0.7, 0.4].map((v, i) => (
                          <MotionDiv key={i}
                            animate={{ scaleY: isListening ? [v * 0.1, v, v * 0.15] : [v * 0.05, v * 0.5, v * 0.08] }}
                            transition={{ duration: isListening ? 0.6 + i * 0.08 : 1.0 + i * 0.06, repeat: Infinity, ease: "easeInOut" }}
                            style={{ width: 1.5, height: "100%", borderRadius: 9999, transformOrigin: "center",
                              background: isListening ? "rgba(218,165,32,0.80)" : "rgba(139,128,255,0.80)" }}
                          />
                        ))}
                      </div>
                    )}
                  </MotionDiv>
                )}

                {/* Mobile toolbar — pinned bottom inside card content */}
                {isMobile && showToolbar && !isPaused && (
                  <MobileToolbar micOn={micOn} camOn={camOn} isPaused={isPaused}
                    onToggleMic={() => setMicOn((m) => !m)}
                    onToggleCam={() => setCamOn((c) => !c)}
                    onTogglePause={() => isPaused ? handleResume() : handlePause()}
                    onToggleScreen={() => setScreenSharing(true)}
                    onEnd={handleEnd} />
                )}
              </div>
            </MotionDiv>

            {/* Floating toolbar (normal mode) — desktop only */}
            {!isMobile && (
              <AnimatePresence>
                {showToolbar && (
                  <MotionDiv key="tb" initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: isPaused ? 0 : 1, y: isPaused ? 10 : 0 }}
                    exit={{ opacity: 0, y: 12 }} transition={{ duration: 0.32 }}
                    style={{ pointerEvents: "auto" }}>
                    <FloatingToolbar micOn={micOn} camOn={camOn} isPaused={isPaused} typingMode={typingMode} screenSharing={false}
                      onToggleTyping={() => setTypingMode((v) => !v)}
                      onToggleMic={() => setMicOn((m) => !m)}
                      onToggleCam={() => setCamOn((c) => !c)}
                      onTogglePause={() => isPaused ? handleResume() : handlePause()}
                      onToggleScreen={() => setScreenSharing(true)}
                      onEnd={handleEnd} />
                  </MotionDiv>
                )}
              </AnimatePresence>
            )}

          </MotionDiv>
        )}
      </AnimatePresence>

      {/* ─── P4: Mobile Viewfinder (In-Home Visit) ─── */}
      <AnimatePresence>
        {isMobile && screenSharing && isInterview && (
          <MobileViewfinder
            key="mobile-viewfinder"
            qText={QS[qIdx].text}
            qNum={QS[qIdx].num}
            speech={speech}
            subtitleText={isSpeaking ? caption : isListening ? userTranscript : ""}
            subtitleLabel={isSpeaking ? "AI" : isListening ? "You" : ""}
            onExit={() => setScreenSharing(false)}
            t={t}
          />
        )}
      </AnimatePresence>

      {/* ─── Desktop Screen sharing mode: Cinema subtitle + Toolbar pinned bottom ─── */}
      <AnimatePresence>
        {!isMobile && screenSharing && isInterview && (
          <MotionDiv key="share-hud" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.40 }}
            style={{
              position: "absolute", inset: 0, zIndex: 20, pointerEvents: "none",
              display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "center",
              padding: "0 24px 32px",
            }}>

            {/* Mini PiP camera — bottom right */}
            {camOn && (
              <MotionDiv initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.32 }}
                style={{
                  position: "absolute", bottom: 100, right: 32, pointerEvents: "auto",
                  width: 140, height: 100, borderRadius: 14, overflow: "hidden",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.40), inset 0 0 0 1px rgba(255,255,255,0.10)",
                }}>
                <img src={imgFace} alt="You" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 18%", filter: "saturate(0.92) brightness(0.96)" }} />
                <div style={{
                  position: "absolute", top: 6, left: 6, display: "flex", alignItems: "center", gap: 4,
                  padding: "2px 7px", borderRadius: 9999,
                  background: "rgba(0,0,0,0.50)", backdropFilter: "blur(8px)",
                }}>
                  <MotionDiv animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                    style={{ width: 4, height: 4, borderRadius: "50%", background: "#34D399" }} />
                  <span style={{ fontSize: 8, fontFamily: SF, fontWeight: 600, color: "rgba(255,255,255,0.80)", letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Live</span>
                </div>
                {/* Mini waveform indicator */}
                {(isSpeaking || isListening) && (
                  <div style={{
                    position: "absolute", bottom: 6, left: "50%", transform: "translateX(-50%)",
                    display: "flex", alignItems: "center", gap: 2, height: 12,
                  }}>
                    {[0.3, 0.6, 1, 0.7, 0.4].map((v, i) => (
                      <MotionDiv key={i}
                        animate={{ scaleY: isListening ? [v * 0.1, v, v * 0.15] : [v * 0.05, v * 0.5, v * 0.08] }}
                        transition={{ duration: isListening ? 0.6 + i * 0.08 : 1.0 + i * 0.06, repeat: Infinity, ease: "easeInOut" }}
                        style={{ width: 2, height: "100%", borderRadius: 9999, transformOrigin: "center", background: isListening ? "rgba(218,165,32,0.80)" : "rgba(139,128,255,0.80)" }}
                      />
                    ))}
                  </div>
                )}
              </MotionDiv>
            )}

            {/* Cinema subtitle bar */}
            <AnimatePresence>
              {showSubtitle && (
                <MotionDiv key="subtitle" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                  transition={{ duration: 0.28 }}
                  style={{
                    pointerEvents: "auto",
                    maxWidth: "60vw", padding: "10px 20px", borderRadius: 14,
                    background: "rgba(0, 0, 0, 0.64)",
                    backdropFilter: "blur(24px) saturate(120%)", WebkitBackdropFilter: "blur(24px) saturate(120%)",
                    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.30)",
                    display: "flex", alignItems: "flex-start", gap: 10,
                    marginBottom: 20,
                  }}>
                  {/* Speaker label pill */}
                  <div style={{
                    flexShrink: 0, padding: "2px 8px", borderRadius: 6, marginTop: 1,
                    background: subtitleLabel === "AI" ? "rgba(139, 128, 255, 0.20)" : "rgba(218, 165, 32, 0.20)",
                  }}>
                    <span style={{
                      fontSize: 9.5, fontFamily: SF, fontWeight: 700, letterSpacing: "0.10em", textTransform: "uppercase" as const,
                      color: subtitleLabel === "AI" ? "rgba(179, 170, 255, 0.90)" : "rgba(240, 200, 100, 0.90)",
                    }}>{subtitleLabel}</span>
                  </div>
                  {/* Text */}
                  <p style={{
                    margin: 0, fontSize: 15, fontFamily: SF, fontWeight: 400,
                    color: "rgba(255,255,255,0.92)", lineHeight: 1.56, letterSpacing: "-0.01em",
                  }}>
                    {subtitleText}
                    <MotionSpan animate={{ opacity: [1, 0, 1] }} transition={{ duration: 0.6, repeat: Infinity }}
                      style={{ display: "inline-block", width: 2, height: "0.50em", background: "rgba(255,255,255,0.60)", marginLeft: 3, verticalAlign: "text-bottom", borderRadius: 1 }} />
                  </p>
                </MotionDiv>
              )}
            </AnimatePresence>

            {/* Toolbar (screen sharing mode) */}
            <div style={{ pointerEvents: "auto" }}>
              <FloatingToolbar micOn={micOn} camOn={camOn} isPaused={isPaused} typingMode={typingMode} screenSharing={true}
                qLabel={`Q${BEFORE + qIdx + 1} / ${TOTAL}`}
                onToggleTyping={() => setTypingMode((v) => !v)}
                onToggleMic={() => setMicOn((m) => !m)}
                onToggleCam={() => setCamOn((c) => !c)}
                onTogglePause={() => isPaused ? handleResume() : handlePause()}
                onToggleScreen={() => setScreenSharing(false)}
                onEnd={handleEnd} />
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      <PausedOverlay visible={isPaused} onResume={handleResume} />
      <DisqualifiedOverlay visible={stage === "disqualified"} reason={dqReason} />

      {/* iOS System Chrome — mobile only */}
      {isMobile && <MobileStatusBar />}
      {isMobile && <MobileHomeIndicator />}
    </div>
  );
}

/* ─────────── Exported page with provider ─────────── */
export function ParticipantPage() {
  return (
    <ParticipantThemeProvider defaultMode="light">
      <ParticipantInner />
    </ParticipantThemeProvider>
  );
}
