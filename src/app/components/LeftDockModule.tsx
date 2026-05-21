/**
 * LeftDockModule — Unified left-dock transcript module.
 *
 * COLLAPSED: compact LiveBar showing the last completed utterance + LIVE dot
 * EXPANDED:  scrollable history + pinned LiveBar footer
 *
 * Live bar state comes from the shared useLiveSimulation engine via the
 * `liveData` prop — no independent simulation runs here.
 *
 * Req-1: Expanded Live Bar shows TranscribingDots instead of streaming text
 * Req-2: TranslateButton moved to speaker row (always bottom-right); Header is clean
 */
import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ChevronUp, Sparkles, User } from "lucide-react";
import { R, C, T, surfaceStyle } from "./constants";
import { TRANSCRIPT } from "./data";
import { TranslateButton, getTranslation } from "./TranslateButton";
import type { LangCode } from "./TranslateButton";
import type { LiveSimulationState } from "./useLiveSimulation";
import { SPEAKER_META } from "./useLiveSimulation";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

/* ── pre-destructure for Figma sandbox ── */
const MotionDiv = motion.div;

/* ── Unified Toggle Strip ───────────────────────────────────────
   Single affordance for both expand & collapse.
   Lives at the bottom of the outer container in all states.
   Chevron rotates 180° to signal directionality.
   ─────────────────────────────────────────────────────────────── */
function ToggleStrip({ isExpanded, onToggle }: { isExpanded: boolean; onToggle: () => void }) {
  const [hovered, setHovered] = useState(false);
  const { mode, tokens: ot } = useObserveTheme();
  const isLight = mode === "light";
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
        width: "100%", height: 28,
        background: hovered
          ? (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.045)")
          : "transparent",
        borderTop: `0.5px solid ${isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)"}`,
        borderRight: "none", borderBottom: "none", borderLeft: "none",
        cursor: "pointer",
        transitionProperty: "background", transitionDuration: "0.18s", transitionTimingFunction: "ease",
      }}
    >
      {/* Left rule */}
      <div style={{
        flex: 1, height: 0.5,
        background: hovered
          ? (isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)")
          : (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"),
        transitionProperty: "background", transitionDuration: "0.18s", transitionTimingFunction: "ease",
      }} />

      {/* Icon + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
        <MotionDiv
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 260 }}
          style={{ display: "flex", alignItems: "center", color: hovered ? ot.ink2 : ot.ink4 }}
        >
          <ChevronUp size={10} strokeWidth={1.8} />
        </MotionDiv>
        <span style={{
          fontSize: 9, letterSpacing: "0.08em", textTransform: "uppercase",
          color: hovered ? ot.ink2 : ot.ink4,
          transitionProperty: "color", transitionDuration: "0.18s", transitionTimingFunction: "ease",
        }}>
          {isExpanded ? "Collapse" : "Transcript"}
        </span>
      </div>

      {/* Right rule */}
      <div style={{
        flex: 1, height: 0.5,
        background: hovered
          ? (isLight ? "rgba(0,0,0,0.10)" : "rgba(255,255,255,0.10)")
          : (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.04)"),
        transitionProperty: "background", transitionDuration: "0.18s", transitionTimingFunction: "ease",
      }} />
    </button>
  );
}

/* ── [Req-1] Transcribing dots ── */
function TranscribingDots({ color }: { color: string }) {
  const { tokens: ot } = useObserveTheme();
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "6px 0 2px" }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: "50%", background: color, opacity: 0.55,
          animation: `transcribe-dot 1.4s ease-in-out ${i * 0.22}s infinite`,
        }} />
      ))}
      <span style={{ fontSize: T.micro, color: ot.ink4, letterSpacing: "0.04em", marginLeft: 2 }}>
        Transcribing…
      </span>
    </div>
  );
}

/* ── History = all but last entry (static pre-loaded turns) ── */
const HISTORY = TRANSCRIPT.slice(0, -1);

/* ── Figma-aligned container ── */
const containerBase: React.CSSProperties = {
  ...surfaceStyle,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

/* ── Detection badge (inline, with hover tooltip) ── */
function DetectionBadge({ tag, detail }: { tag: string; detail: string }) {
  const [hovered, setHovered] = useState(false);
  const { mode, tokens: ot } = useObserveTheme();
  const isLight = mode === "light";
  return (
    <span
      style={{ position: "relative", display: "inline-flex", marginLeft: 4, verticalAlign: "middle" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{
        display: "inline-flex", alignItems: "center", gap: 3,
        padding: "1px 5px", fontSize: 8, letterSpacing: 0.3, lineHeight: 1.4,
        color: C.warning,
        background: hovered ? "rgba(255,209,102,0.12)" : "rgba(255,209,102,0.06)",
        borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,209,102,0.18)",
        borderRadius: 4, cursor: "default",
      }}>
        <span style={{ fontSize: 7 }}>&#9888;</span>
        {tag}
      </span>
      {hovered && (
        <span style={{
          position: "absolute", left: 0, bottom: "calc(100% + 6px)",
          width: 210, zIndex: 60, fontSize: T.micro, lineHeight: 1.45,
          color: isLight ? ot.ink2 : "rgba(255,255,255,0.65)",
          background: isLight ? "rgba(255,255,255,0.92)" : "rgba(10,12,18,0.88)",
          backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)",
          borderWidth: 0.5, borderStyle: "solid",
          borderColor: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.10)",
          borderRadius: R.sm, padding: "8px 10px",
          boxShadow: isLight ? "0 6px 20px rgba(0,0,0,0.08)" : "0 6px 20px rgba(0,0,0,0.40)",
          pointerEvents: "none",
        }}>
          {detail}
        </span>
      )}
    </span>
  );
}

/* ── Props ── */
interface LeftDockModuleProps {
  isExpanded: boolean;
  onToggle: () => void;
  translateLang: LangCode;
  onTranslateLangChange: (lang: LangCode) => void;
  /** Live caption state from the shared useLiveSimulation hook */
  liveData: LiveSimulationState;
}

export function LeftDockModule({
  isExpanded,
  onToggle,
  translateLang,
  onTranslateLangChange,
  liveData,
}: LeftDockModuleProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [liveBarHovered, setLiveBarHovered] = useState(false);
  const { mode, tokens: ot } = useObserveTheme();
  const isLight = mode === "light";

  const { lastTurn, isStreaming, activeSpeaker, isOverlap, modBubble, intBubble } = liveData;

  /* Derive speaker display tokens from live data */
  const speaker     = activeSpeaker ?? "mod";
  const isMod       = speaker === "mod";
  const speakerMeta = SPEAKER_META[speaker];
  const speakerAccent = speakerMeta.color;
  const speakerName   = speakerMeta.name;
  const speakerBg     = speakerMeta.bg;

  /* Auto-scroll history to bottom on expand */
  useEffect(() => {
    if (isExpanded && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [isExpanded]);

  const handleBarClick      = useCallback(() => { if (!isExpanded) onToggle(); }, [isExpanded, onToggle]);
  const handleBarMouseEnter = useCallback(() => { if (!isExpanded) setLiveBarHovered(true); }, [isExpanded]);
  const handleBarMouseLeave = useCallback(() => setLiveBarHovered(false), []);

  /* Text to show in the live bar (last completed turn) */
  const lastText = lastTurn
    ? (translateLang ? getTranslation(translateLang, lastTurn.text) : lastTurn.text)
    : null;
  const lastSpeaker = lastTurn ? lastTurn.speaker : null;

  /* Light-mode accent colors */
  const accentColor = isLight ? "rgba(0,0,0,0.70)" : C.accent;
  const accentMuted = isLight ? "rgba(0,0,0,0.06)" : "rgba(97,95,255,0.10)";
  const accentBorder = isLight ? "rgba(0,0,0,0.12)" : "rgba(97,95,255,0.20)";
  const accentText = isLight ? "rgba(0,0,0,0.50)" : "rgba(97,95,255,0.70)";
  const accentDivider = isLight ? "rgba(0,0,0,0.08)" : "rgba(97,95,255,0.16)";
  const accentDividerText = isLight ? "rgba(0,0,0,0.30)" : "rgba(97,95,255,0.50)";

  /* Light-mode container style override */
  const containerStyle: React.CSSProperties = isLight ? {
    ...ot.surfaceBlur,
    borderRadius: 24,
    background: ot.surfaceBg,
    borderWidth: 1, borderStyle: "solid", borderColor: ot.surfaceBorder,
    boxShadow: ot.surfaceShadow,
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
  } : containerBase;

  return (
    <div style={{
      ...containerStyle,
      flex: isExpanded ? "1 1 0" : undefined,
      minHeight: isExpanded ? 0 : undefined,
    }}>

      {/* ════════════════════════════
          HEADER — expanded only
          ════════════════════════════ */}
      <AnimatePresence>
        {isExpanded && (
          <MotionDiv
            key="tr-header"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.32, 0.72, 0, 1] }}
            style={{
              flexShrink: 0, display: "flex", alignItems: "center",
              justifyContent: "space-between", padding: "0 14px", height: 48,
              borderBottomWidth: 0.5, borderBottomStyle: "solid",
              borderBottomColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
              <svg width="12" height="13" viewBox="0 0 12 13" fill="none">
                <rect x="1" y="1" width="10" height="11" rx="2" stroke={ot.ink3} strokeWidth="1.1" />
                <path d="M3.5 4.5h5M3.5 6.5h5M3.5 8.5h3" stroke={ot.ink3} strokeWidth="1.1" strokeLinecap="round" />
              </svg>
              <span style={{ fontSize: T.title, letterSpacing: -0.46, color: ot.ink1 }}>Transcript</span>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* ════════════════════════════
          HISTORY SCROLL — expanded only
          ════════════════════════════ */}
      <AnimatePresence>
        {isExpanded && (
          <MotionDiv
            key="tr-history"
            ref={scrollRef}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, delay: 0.07, ease: "easeOut" }}
            style={{ flex: "1 1 0", minHeight: 0, overflowY: "auto", padding: "6px 0" }}
            className="scroll-area"
          >
            {HISTORY.map((msg) => {
              const isModMsg = msg.speaker === "mod";
              const sc =
                msg.sentiment === "positive" ? C.positive
                : msg.sentiment === "negative" ? C.negative
                : ot.ink4;
              return (
                <div key={`dm-${msg.id}`} style={{ display: "flex", gap: 9, padding: "5px 12px" }}>
                  <span style={{
                    width: 32, flexShrink: 0, textAlign: "right",
                    fontSize: T.micro, color: ot.ink4,
                    fontFamily: "monospace", lineHeight: "16px", marginTop: 2,
                  }}>
                    {msg.time}
                  </span>
                  <div style={{
                    width: 16, height: 16, borderRadius: 8, flexShrink: 0,
                    background: isModMsg ? accentColor : (isLight ? "rgba(0,0,0,0.15)" : "rgba(97,95,255,0.22)"),
                    display: "flex", alignItems: "center", justifyContent: "center", marginTop: 2,
                  }}>
                    {isModMsg ? <Sparkles size={7} color="white" /> : <User size={7} color="white" />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 3 }}>
                      <span style={{ fontSize: T.micro, color: isModMsg ? ot.ink3 : ot.ink2 }}>
                        {msg.name}
                      </span>
                      {!isModMsg && msg.sentiment && (
                        <div style={{ width: 5, height: 5, borderRadius: 3, background: sc, flexShrink: 0 }} />
                      )}
                    </div>
                    <p style={{
                      fontSize: T.caption, lineHeight: 1.58, margin: 0,
                      color: isModMsg ? ot.ink3 : ot.ink2,
                      fontStyle: isModMsg ? "italic" : "normal",
                    }}>
                      {translateLang ? getTranslation(translateLang, msg.text) : msg.text}
                      {msg.detection && <DetectionBadge tag={msg.detection.tag} detail={msg.detection.detail} />}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* ── NOW divider ── */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 12px 4px" }}>
              <div style={{ flex: 1, height: 0.5, background: accentDivider }} />
              <span style={{ fontSize: T.micro, color: accentDividerText, letterSpacing: "1.2px", textTransform: "uppercase" }}>
                Now
              </span>
              <div style={{ flex: 1, height: 0.5, background: accentDivider }} />
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════
          LIVE BAR — pinned footer
          ════════════════════════════════════════════════════════════ */}
      <div
        onClick={handleBarClick}
        onMouseEnter={handleBarMouseEnter}
        onMouseLeave={handleBarMouseLeave}
        style={{
          flexShrink: 0, position: "relative", padding: "11px 14px 11px 18px",
          background: !isExpanded && liveBarHovered
            ? (isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.04)")
            : isExpanded
              ? isMod
                ? (isLight ? "rgba(0,0,0,0.03)" : "rgba(97,95,255,0.06)")
                : (isLight ? "rgba(16,185,129,0.04)" : "rgba(86,220,130,0.04)")
              : "transparent",
          cursor: !isExpanded ? "pointer" : "default",
          transitionProperty: "background, opacity, max-height",
          transitionDuration: "0.22s",
          transitionTimingFunction: "ease",
          overflow: "hidden",
          maxHeight: isExpanded ? 0 : 300,
          opacity: isExpanded ? 0 : 1,
          pointerEvents: isExpanded ? "none" : "auto",
          paddingTop: isExpanded ? 0 : "11px",
          paddingBottom: isExpanded ? 0 : "11px",
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: 0.5,
          background: speakerAccent,
          opacity: isExpanded ? 0.22 : 0,
          transitionProperty: "opacity, background", transitionDuration: "0.20s", transitionTimingFunction: "ease",
          pointerEvents: "none",
        }} />
        {/* Left accent bar */}
        <div style={{
          position: "absolute", top: 10, bottom: 10, left: 0,
          width: 2, borderRadius: 2, background: speakerAccent,
          opacity: isExpanded ? 1 : 0,
          transitionProperty: "opacity, background", transitionDuration: "0.25s", transitionTimingFunction: "ease",
        }} />

        {/* ── Speaker row ── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 7 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 9, flexShrink: 0, background: speakerBg,
              display: "flex", alignItems: "center", justifyContent: "center",
              transitionProperty: "background", transitionDuration: "0.25s", transitionTimingFunction: "ease",
            }}>
              {isMod ? <Sparkles size={8} color="white" /> : <User size={8} color="white" />}
            </div>
            <span style={{ fontSize: T.micro, color: isMod ? ot.ink3 : ot.ink2 }}>
              {speakerName}
            </span>
            {/* Badges */}
            {!isMod && (
              <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <div style={{ width: 5, height: 5, borderRadius: 3, background: C.positive, flexShrink: 0 }} />
                <span style={{ fontSize: T.micro, color: ot.ink4 }}>Positive</span>
              </div>
            )}
            {isMod && (
              <span style={{
                fontSize: 8, letterSpacing: 0.4, color: accentText,
                background: accentMuted,
                borderWidth: 0.5, borderStyle: "solid", borderColor: accentBorder,
                borderRadius: 4, padding: "1px 5px",
              }}>AI</span>
            )}
          </div>

          {/* [Req-2] TranslateButton + LIVE dot */}
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <TranslateButton lang={translateLang} onChange={onTranslateLangChange} direction="up" />
            <div style={{ width: 0.5, height: 12, background: isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.10)", flexShrink: 0 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ position: "relative", width: 6, height: 6, flexShrink: 0 }}>
                <div style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: isStreaming ? "rgba(255,100,100,0.90)" : "rgba(255,100,100,0.40)",
                  position: "absolute",
                  transitionProperty: "background", transitionDuration: "0.3s", transitionTimingFunction: "ease",
                }} />
                {isStreaming && (
                  <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "rgba(255,100,100,0.65)", position: "absolute",
                    animation: "liveping 1.8s cubic-bezier(0,0,0.2,1) infinite",
                  }} />
                )}
              </div>
              <span style={{ fontSize: T.micro, color: ot.ink4, textTransform: "uppercase", letterSpacing: "0.10em" }}>
                Live
              </span>
            </div>
          </div>
        </div>

        {/* ── Content area ── */}
        {isExpanded ? (
          /* Expanded: show actual streaming text */
          isOverlap ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: isLight ? "rgba(0,0,0,0.15)" : "rgba(97,95,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <Sparkles size={6} color="white" />
                </div>
                <p style={{ fontSize: T.caption, lineHeight: 1.5, margin: 0, color: ot.ink3, fontStyle: "italic", flex: 1, minWidth: 0 }}>
                  {modBubble?.displayed ?? "…"}
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
                <div style={{ width: 12, height: 12, borderRadius: 6, background: isLight ? "rgba(16,185,129,0.20)" : "rgba(86,220,130,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                  <User size={6} color="white" />
                </div>
                <p style={{ fontSize: T.caption, lineHeight: 1.5, margin: 0, color: ot.ink2, flex: 1, minWidth: 0 }}>
                  {intBubble?.displayed ?? "…"}
                </p>
              </div>
            </div>
          ) : (
            <p style={{
              fontSize: T.caption, lineHeight: 1.62, margin: 0,
              color: isMod ? ot.ink3 : ot.ink2,
              fontStyle: isMod ? "italic" : "normal",
            }}>
              {isStreaming
                ? (isMod ? (modBubble?.displayed ?? "…") : (intBubble?.displayed ?? "…"))
                : (lastText ?? "Waiting for speech…")}
            </p>
          )
        ) : isOverlap ? (
          /* Collapsed overlap: stacked two-speaker rows */
          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginBottom: 2 }}>
              <div style={{ flex: 1, height: 0.5, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }} />
              <span style={{ fontSize: 8, color: ot.ink4, letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
                speaking simultaneously
              </span>
              <div style={{ flex: 1, height: 0.5, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }} />
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: isLight ? "rgba(0,0,0,0.15)" : "rgba(97,95,255,0.28)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Sparkles size={6} color="white" />
              </div>
              <p style={{ fontSize: T.caption, lineHeight: 1.5, margin: 0, color: ot.ink3, fontStyle: "italic", flex: 1, minWidth: 0 }}>
                &ldquo;{modBubble?.displayed ?? ""}&rdquo;
              </p>
            </div>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 7 }}>
              <div style={{ width: 14, height: 14, borderRadius: 7, background: isLight ? "rgba(16,185,129,0.20)" : "rgba(86,220,130,0.20)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <User size={6} color="white" />
              </div>
              <p style={{ fontSize: T.caption, lineHeight: 1.5, margin: 0, color: ot.ink2, flex: 1, minWidth: 0 }}>
                &ldquo;{intBubble?.displayed ?? ""}&rdquo;
              </p>
            </div>
          </div>

        ) : (
          /* Collapsed single-speaker: show last completed turn */
          <div>
            {lastText ? (
              <p style={{
                fontSize: T.caption, lineHeight: 1.62, margin: 0,
                color: lastSpeaker === "mod" ? ot.ink3 : ot.ink2,
                fontStyle: lastSpeaker === "mod" ? "italic" : "normal",
                overflow: "hidden",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical" as const,
              }}>
                <span style={{ color: ot.ink4 }}>&ldquo;</span>
                {lastText}
                <span style={{ color: ot.ink4 }}>&rdquo;</span>
              </p>
            ) : (
              <p style={{ fontSize: T.caption, lineHeight: 1.62, margin: 0, color: ot.ink4, fontStyle: "italic" }}>
                Waiting for speech…
              </p>
            )}
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════
          UNIFIED TOGGLE STRIP — always at bottom
          ════════════════════════════════════════════ */}
      <ToggleStrip isExpanded={isExpanded} onToggle={onToggle} />

      {/* ── Keyframes ── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes liveping { 75%, 100% { transform: scale(2.2); opacity: 0; } }
        @keyframes transcribe-dot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.55; }
          30% { transform: translateY(-4px); opacity: 1; }
        }
      ` }} />
    </div>
  );
}