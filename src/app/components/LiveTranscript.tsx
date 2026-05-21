/**
 * LiveTranscript — Real-time dual-speaker caption bubble (floating, bottom-center).
 *
 * PURELY PRESENTATIONAL — all simulation state comes from useLiveSimulation()
 * via the `engine` prop. No internal timers or clock; `clock` is passed from App.
 *
 * Visual modes:
 *  • Single speaker  → full-width bubble with typewriter cursor
 *  • Overlap (both)  → two-column split, each streaming independently
 *  • Idle            → listening… waveform
 *
 * Snap-draggable via shared SnapEngine / useSnapDrag.
 */
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import type { MotionValue } from "motion/react";
import { R, T, surfaceStyle } from "./constants";
import { TranslateButton, getTranslation } from "./TranslateButton";
import type { LangCode } from "./TranslateButton";
import type { LiveSimulationState, LiveBubble, Speaker, HistoryTurn } from "./useLiveSimulation";
import { SPEAKER_META } from "./useLiveSimulation";

/* pre-destructure for Figma sandbox compatibility */
const MotionDiv = motion.div;

/* ── Blinking cursor ─────────────────────────────────────────── */
function Cursor({ color }: { color: string }) {
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setInterval(() => setOn(v => !v), 530);
    return () => clearInterval(t);
  }, []);
  return (
    <span style={{
      display: "inline-block", width: 1.5, height: "0.9em",
      borderRadius: 1, background: on ? color : "transparent",
      verticalAlign: "text-bottom", marginLeft: 1,
      transition: "background 0.08s",
    }} />
  );
}

/* ── Speaker avatar ──────────────────────────────────────────── */
function SpeakerAvatar({ speaker, size = 20 }: { speaker: Speaker; size?: number }) {
  const meta = SPEAKER_META[speaker];
  const { Icon } = meta;
  return (
    <div style={{
      width: size, height: size, borderRadius: "50%",
      background: meta.bg,
      borderWidth: 0.5, borderStyle: "solid", borderColor: meta.border,
      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
    }}>
      <Icon size={size * 0.45} style={{ color: meta.color }} strokeWidth={1.5} />
    </div>
  );
}

/* ── Live bubble card ────────────────────────────────────────── */
function LiveBubbleCard({ bubble, compact, translateLang }: {
  bubble: LiveBubble; compact: boolean; translateLang: LangCode;
}) {
  const meta = SPEAKER_META[bubble.speaker];
  const streaming = !bubble.done;
  return (
    <div style={{
      flex: 1, minWidth: 0,
      borderRadius: R.sm,
      background: meta.bg,
      borderWidth: 0.5, borderStyle: "solid", borderColor: meta.border,
      padding: compact ? "10px 12px" : "12px 14px",
      boxShadow: `inset 0 0.5px 0 rgba(255,255,255,0.06), 0 0 16px ${meta.bg}`,
    }}>
      {/* Speaker header */}
      <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 8 }}>
        <SpeakerAvatar speaker={bubble.speaker} size={18} />
        <span style={{ fontSize: T.caption, color: meta.color, letterSpacing: 0.1 }}>{bubble.name}</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 4 }}>
          {streaming ? (
            <div style={{ display: "flex", gap: 2, alignItems: "flex-end", height: 12 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{
                  width: 2, borderRadius: 1, background: meta.color,
                  animation: `ltWave${i} 0.8s ease-in-out infinite`,
                  animationDelay: `${i * 0.13}s`,
                }} />
              ))}
            </div>
          ) : (
            <div style={{ width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.15)" }} />
          )}
        </div>
      </div>
      {/* Text */}
      <p style={{
        fontSize: T.body, lineHeight: 1.6, margin: 0, fontStyle: "italic",
        color: streaming ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.50)",
        wordBreak: "break-word",
        transition: "color 0.4s",
      }}>
        &ldquo;{bubble.displayed}
        {streaming && <Cursor color={meta.color} />}
        {!streaming && "\u201D"}
      </p>
      {translateLang && bubble.done && bubble.displayed.length > 0 && (
        <p style={{ fontSize: T.caption, color: "rgba(255,255,255,0.28)", marginTop: 5, fontStyle: "italic" }}>
          {getTranslation(translateLang, bubble.displayed)}
        </p>
      )}
    </div>
  );
}

/* ── History row ─────────────────────────────────────────────── */
function HistoryRow({ turn, opacity }: { turn: HistoryTurn; opacity: number }) {
  const meta = SPEAKER_META[turn.speaker];
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, opacity }}>
      <SpeakerAvatar speaker={turn.speaker} size={16} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 1 }}>
          <span style={{ fontSize: T.micro, color: meta.color, letterSpacing: 0.1 }}>{turn.name}</span>
          <span style={{ fontSize: T.micro, color: "rgba(255,255,255,0.15)", fontFamily: "monospace" }}>{turn.time}</span>
        </div>
        <p style={{ fontSize: T.caption, color: "rgba(255,255,255,0.38)", lineHeight: 1.5, margin: 0, fontStyle: "italic" }}>
          &ldquo;{turn.text}&rdquo;
        </p>
      </div>
    </div>
  );
}

/* ── Overlap badge ───────────────────────────────────────────── */
function OverlapBadge() {
  return (
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
      padding: "2px 8px", borderRadius: R.pill, alignSelf: "center",
      background: "rgba(255,255,255,0.04)",
      borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.08)",
    }}>
      <div style={{ display: "flex", gap: 3 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: SPEAKER_META.mod.color, opacity: 0.7 }} />
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: SPEAKER_META.int.color, opacity: 0.7 }} />
      </div>
      <span style={{ fontSize: 8, color: "rgba(255,255,255,0.28)", letterSpacing: "0.05em", whiteSpace: "nowrap" }}>
        speaking simultaneously
      </span>
    </div>
  );
}

/* ── Props ───────────────────────────────────────────────────── */
interface LiveTranscriptProps {
  engine: LiveSimulationState;
  clock: string;
  translateLang: LangCode;
  setTranslateLang: React.Dispatch<React.SetStateAction<LangCode>>;
  snapDrag: {
    containerRef: React.RefObject<HTMLDivElement | null>;
    x: MotionValue<number>;
    y: MotionValue<number>;
    reset: () => void;
    onPointerDown: (e: React.PointerEvent) => void;
    onPointerMove: (e: React.PointerEvent) => void;
    onPointerUp: (e: React.PointerEvent) => void;
  };
}

/* ── Main component ──────────────────────────────────────────── */
export function LiveTranscript({ engine, clock, translateLang, setTranslateLang, snapDrag }: LiveTranscriptProps) {
  const { modBubble, intBubble, history, isOverlap, hasLive } = engine;
  const historyRef = useRef<HTMLDivElement>(null);

  /* Auto-scroll history */
  useEffect(() => {
    const el = historyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  return (
    <MotionDiv
      ref={snapDrag.containerRef}
      className="absolute left-1/2 -translate-x-1/2 z-25 w-full max-w-[520px] px-4 cursor-grab active:cursor-grabbing"
      style={{ x: snapDrag.x, y: snapDrag.y, touchAction: "none", bottom: 76 }}
      onPointerDown={snapDrag.onPointerDown}
      onPointerMove={snapDrag.onPointerMove}
      onPointerUp={snapDrag.onPointerUp}
      onDoubleClick={snapDrag.reset}
    >
      <div style={surfaceStyle}>

        {/* ── Header ── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 16px 8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: T.micro, color: "rgba(255,255,255,0.18)", textTransform: "uppercase", letterSpacing: "0.14em" }}>
              Live Transcript
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: T.micro, color: "rgba(255,255,255,0.20)", fontFamily: "monospace" }}>{clock}</span>
            <TranslateButton lang={translateLang} onChange={setTranslateLang} direction="up" />
          </div>
        </div>

        {/* ── History rail ── */}
        <div
          ref={historyRef}
          style={{
            maxHeight: 110, overflowY: "auto", padding: "4px 14px",
            display: "flex", flexDirection: "column", gap: 7,
            scrollbarWidth: "none",
          }}
        >
          {history.map((turn, i) => {
            const opacity = Math.max(0.18, 0.18 + (i / Math.max(history.length - 1, 1)) * 0.42);
            return <HistoryRow key={turn.id} turn={turn} opacity={opacity} />;
          })}
        </div>

        {/* ── Separator ── */}
        <div style={{ height: 0.5, background: "rgba(255,255,255,0.06)", margin: "4px 14px" }} />

        {/* ── Live zone ── */}
        <div style={{ padding: "8px 12px 10px", minHeight: 80 }}>
          <AnimatePresence>
            {isOverlap && (
              <MotionDiv
                key="overlap-badge"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", damping: 24, stiffness: 320 }}
                style={{ marginBottom: 8 }}
              >
                <OverlapBadge />
              </MotionDiv>
            )}
          </AnimatePresence>

          <AnimatePresence mode="sync">
            {hasLive ? (
              <MotionDiv
                key={isOverlap ? "overlap" : modBubble ? "mod-solo" : "int-solo"}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ type: "spring", damping: 26, stiffness: 300 }}
                style={{ display: "flex", gap: 8, alignItems: "stretch" }}
              >
                {modBubble && (
                  <LiveBubbleCard bubble={modBubble} compact={isOverlap} translateLang={translateLang} />
                )}
                {intBubble && (
                  <LiveBubbleCard bubble={intBubble} compact={isOverlap} translateLang={translateLang} />
                )}
              </MotionDiv>
            ) : (
              <MotionDiv
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 56, gap: 6 }}
              >
                <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 10, opacity: 0.22 }}>
                  {[0, 1, 2, 1, 0].map((h, i) => (
                    <div key={i} style={{
                      width: 2, height: 4 + h * 2, borderRadius: 1,
                      background: "rgba(255,255,255,0.6)",
                      animation: `ltWave${i % 3} 1.2s ease-in-out infinite`,
                      animationDelay: `${i * 0.12}s`,
                    }} />
                  ))}
                </div>
                <span style={{ fontSize: T.micro, color: "rgba(255,255,255,0.18)", letterSpacing: "0.08em" }}>
                  listening…
                </span>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* ── Speaker legend ── */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "4px 14px 10px" }}>
          <div style={{ height: 0.5, flex: 1, background: "rgba(255,255,255,0.04)" }} />
          {(["mod", "int"] as Speaker[]).map(sp => {
            const meta = SPEAKER_META[sp];
            const isActive = sp === "mod"
              ? !!modBubble && !modBubble.done
              : !!intBubble && !intBubble.done;
            return (
              <div key={sp} style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
                <SpeakerAvatar speaker={sp} size={14} />
                <span style={{ fontSize: 9, color: isActive ? meta.color : "rgba(255,255,255,0.22)", letterSpacing: 0.05, transition: "color 0.3s" }}>
                  {meta.name}
                </span>
                <div style={{
                  width: 4, height: 4, borderRadius: "50%",
                  background: isActive ? meta.color : "rgba(255,255,255,0.10)",
                  boxShadow: isActive ? `0 0 5px ${meta.color}` : "none",
                  transition: "background 0.3s, box-shadow 0.3s",
                }} />
              </div>
            );
          })}
          <div style={{ height: 0.5, flex: 1, background: "rgba(255,255,255,0.04)" }} />
        </div>
      </div>

      <style>{`
        @keyframes ltWave0 { 0%,100%{height:3px} 50%{height:9px} }
        @keyframes ltWave1 { 0%,100%{height:5px} 50%{height:12px} }
        @keyframes ltWave2 { 0%,100%{height:4px} 50%{height:7px} }
      `}</style>
    </MotionDiv>
  );
}
