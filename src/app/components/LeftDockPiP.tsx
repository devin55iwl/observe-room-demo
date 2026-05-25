/**
 * LeftDockPiP — Static PiP camera view for the left dock.
 *
 * Only visible when task view (shared screen) is active.
 *
 * NORMAL mode:  Switch toggles between interviewee / AI feeds.
 * SHARED mode:  Switch toggles face ↔ task screen (big/small swap).
 *
 * Both video slots use forwarded refs so the backend can connect
 * WebRTC streams without any component re-renders:
 *
 *   faceVideoRef.current.srcObject   = cameraStream;
 *   screenVideoRef.current.srcObject = screenShareStream;
 *
 * The <img> elements behind each <video> act as visual placeholders
 * until a real stream is connected.
 */
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Monitor } from "lucide-react";
import { R, C, T, surfaceStyle } from "./constants";
import imgReflectionA from "figma:asset/23ba928371385f05d2596d28574ae1b0ff2726c3.png";
import imgReflectionB from "figma:asset/74d0697514bad9978e8c7782df5125fed444578b.png";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

interface LeftDockPiPProps {
  imgInterviewee: string;
  imgCookiyAI: string;
  participantId?: string;
  pipSwapped: boolean;
  setPipSwapped: React.Dispatch<React.SetStateAction<boolean>>;
  /** When true, Switch = face ↔ task screen swap (shared mode) */
  taskViewOpen: boolean;
  /** Ref for participant face camera — backend: ref.current.srcObject = cameraStream */
  faceVideoRef?: React.RefObject<HTMLVideoElement>;
  /** Ref for screen share — backend: ref.current.srcObject = screenShareStream */
  screenVideoRef?: React.RefObject<HTMLVideoElement>;
}

/* ── Screen share placeholder (shown until screenVideoRef gets a stream) ── */
function ScreenSharePlaceholder() {
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", gap: 3, padding: 8, background: "#f5f0e8" }}>
      <div style={{ flex: 1, borderRadius: 6, overflow: "hidden", position: "relative" }}>
        <img src={imgReflectionA} alt="A" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.45)", borderRadius: 10, padding: "1px 7px",
          color: "rgba(255,255,255,0.80)", fontSize: 7, whiteSpace: "nowrap",
        }}>Option A</div>
      </div>
      <div style={{ flex: 1, borderRadius: 6, overflow: "hidden", position: "relative" }}>
        <img src={imgReflectionB} alt="B" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{
          position: "absolute", bottom: 5, left: "50%", transform: "translateX(-50%)",
          background: "rgba(0,0,0,0.45)", borderRadius: 10, padding: "1px 7px",
          color: "rgba(255,255,255,0.80)", fontSize: 7, whiteSpace: "nowrap",
        }}>Option B</div>
      </div>
      <div style={{
        position: "absolute", top: 6, left: "50%", transform: "translateX(-50%)",
        background: "rgba(199,136,68,0.85)", borderRadius: 8, padding: "2px 8px",
        color: "white", fontSize: 7, whiteSpace: "nowrap", letterSpacing: "0.3px",
      }}>
        Shared Screen
      </div>
    </div>
  );
}

export function LeftDockPiP({
  imgInterviewee,
  imgCookiyAI,
  participantId = "#9527",
  pipSwapped,
  setPipSwapped,
  taskViewOpen,
  faceVideoRef,
  screenVideoRef,
}: LeftDockPiPProps) {

  /* Shared mode:  pipSwapped=false → PiP shows face, center = task screen (default)
                  pipSwapped=true  → PiP shows screen, center = face (swapped)
     Normal mode:  pipSwapped=false → PiP shows interviewee
                  pipSwapped=true  → PiP shows AI                                */
  const showingScreen = taskViewOpen && pipSwapped;
  const showingAI     = !taskViewOpen && pipSwapped;

  const badgeLabel = taskViewOpen
    ? (pipSwapped ? "Screen" : participantId)
    : (pipSwapped ? "Cookiy AI" : participantId);

  /* Hover hint describes what WILL happen on click */
  const switchLabel = taskViewOpen
    ? (pipSwapped ? "Show face" : "Show screen")
    : "Switch";

  const SwitchIcon = taskViewOpen
    ? (pipSwapped ? User : Monitor)
    : User;

  return (
    <div
      className="relative overflow-hidden group/pip cursor-pointer shrink-0"
      style={{ ...surfaceStyle, padding: 0, height: 194, borderRadius: R.md }}
      onClick={() => setPipSwapped(s => !s)}
    >

      {/* ════════════════════════════════════
          FACE SLOT  (default visible)
          ════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          opacity: pipSwapped ? 0 : 1,
          transitionProperty: "opacity",
          transitionDuration: "0.5s",
          transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Placeholder image — shown until faceVideoRef gets a stream */}
        <img
          src={pipSwapped && !taskViewOpen ? imgCookiyAI : imgInterviewee}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Live face video — transparent until srcObject assigned */}
        {/* Backend: faceVideoRef.current.srcObject = cameraMediaStream */}
        <video
          ref={faceVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ background: "transparent" }}
        />
      </div>

      {/* ════════════════════════════════════
          AI FEED SLOT  (normal mode, swapped)
          ════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          opacity: showingAI ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "0.5s",
          transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <img src={imgCookiyAI} alt="" className="absolute inset-0 w-full h-full object-cover" />
      </div>

      {/* ════════════════════════════════════
          SCREEN SHARE SLOT  (shared mode, swapped)
          ════════════════════════════════════ */}
      <div
        className="absolute inset-0"
        style={{
          opacity: showingScreen ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "0.5s",
          transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
          pointerEvents: showingScreen ? "auto" : "none",
        }}
      >
        {/* Placeholder — same task images, shown until screenVideoRef gets a stream */}
        <ScreenSharePlaceholder />
        {/* Live screen share video — transparent until srcObject assigned */}
        {/* Backend: screenVideoRef.current.srcObject = screenShareMediaStream */}
        <video
          ref={screenVideoRef}
          autoPlay
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ background: "transparent", borderRadius: R.md }}
        />
      </div>

      {/* ── Bottom gradient scrim (hidden over screen slot) ── */}
      <MotionDiv
        className="absolute inset-x-0 bottom-0 pointer-events-none z-[1]"
        animate={{ opacity: showingScreen ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{ height: "55%", background: "linear-gradient(to top, rgba(0,0,0,0.52) 0%, rgba(0,0,0,0.18) 50%, transparent 100%)" }}
      />

      {/* ── Top edge inner shine ── */}
      <div
        className="absolute inset-x-0 top-0 pointer-events-none z-[1]"
        style={{ height: 1, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 30%, rgba(255,255,255,0.18) 50%, rgba(255,255,255,0.12) 70%, transparent)" }}
      />

      {/* ── LIVE badge ── */}
      <MotionDiv
        className="absolute top-2.5 left-2.5 z-20 flex items-center gap-1.5 px-2 py-[3px]"
        animate={{ opacity: showingScreen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ borderRadius: R.pill, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "0.5px solid rgba(255,255,255,0.06)" }}
      >
        <div className="relative">
          <div className="size-[5px] rounded-full bg-red-500" />
          <div className="absolute inset-0 size-[5px] rounded-full bg-red-500 animate-ping" style={{ animationDuration: "1.8s" }} />
        </div>
        <span className="uppercase tracking-[0.1em] text-white/60" style={{ fontSize: 7 }}>Live</span>
      </MotionDiv>

      {/* ── Signal quality ── */}
      <MotionDiv
        className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 px-2 py-[3px]"
        animate={{ opacity: showingScreen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ borderRadius: R.pill, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(8px)", border: "0.5px solid rgba(255,255,255,0.06)" }}
      >
        <div className="flex items-end gap-[2px]" style={{ height: 8 }}>
          {[3, 5, 7, 8].map((h, i) => (
            <div key={i} className="rounded-[0.5px]" style={{ width: 2, height: h, background: i < 3 ? C.positive : "rgba(109,212,160,0.35)" }} />
          ))}
        </div>
        <span className="text-white/35 font-mono" style={{ fontSize: 7 }}>HD</span>
      </MotionDiv>

      {/* ── Audio waveform ── */}
      <MotionDiv
        className="absolute bottom-[18px] z-20 flex items-end gap-[2px]"
        animate={{ opacity: showingScreen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
        style={{ right: 52, height: 10 }}
      >
        {[0, 0.12, 0.24, 0.36, 0.48].map((delay, i) => (
          <MotionDiv
            key={i}
            className="rounded-full"
            style={{ width: 2, background: C.positive, opacity: 0.55 }}
            animate={{ height: [3, 8, 4, 10, 3] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut", delay }}
          />
        ))}
      </MotionDiv>

      {/* ── Hover overlay with switch hint ── */}
      <div
        className="absolute inset-0 z-10 flex items-center justify-center opacity-0 group-hover/pip:opacity-100"
        style={{
          background: showingScreen ? "rgba(0,0,0,0.18)" : "rgba(0,0,0,0.25)",
          backdropFilter: "blur(2px)",
          transitionProperty: "opacity",
          transitionDuration: "0.2s",
          transitionTimingFunction: "ease",
        }}
      >
        <div
          className="flex items-center gap-2 px-3 py-1.5"
          style={{
            borderRadius: R.pill,
            background: "rgba(255,255,255,0.10)",
            borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.15)",
          }}
        >
          <SwitchIcon size={11} className="text-white/70" />
          <span className="text-white/70" style={{ fontSize: T.micro }}>{switchLabel}</span>
        </div>
      </div>

      {/* ── Name badge ── */}
      <AnimatePresence mode="wait">
        <MotionDiv
          key={badgeLabel}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.25, delay: 0.1 }}
          className="absolute bottom-3 left-3 z-20 px-2 py-0.5 flex items-center gap-1.5"
          style={{
            borderRadius: R.sm,
            background: "rgba(0,0,0,0.50)",
            backdropFilter: "blur(12px)",
            borderWidth: 0.5, borderStyle: "solid",
            borderColor: taskViewOpen && pipSwapped
              ? "rgba(199,136,68,0.25)"
              : pipSwapped && !taskViewOpen
                ? "rgba(255,255,255,0.08)"
                : "rgba(97,95,255,0.15)",
          }}
        >
          <span className="text-white/60" style={{ fontSize: T.micro }}>{badgeLabel}</span>
        </MotionDiv>
      </AnimatePresence>
    </div>
  );
}
