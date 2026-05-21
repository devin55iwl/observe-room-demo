/**
 * ParticipantTaskView — Observer mirror of the participant's active task screen.
 *
 * Shows in the center stage when a participant is performing a structured task
 * (image comparison, web page review, prototype testing, etc.).
 *
 * Full-width single-column layout: task content only (images / webpage).
 * The Observer Context panel has been removed — Live Transcript lives in the
 * left dock LeftDockModule; there is no need to duplicate it here.
 *
 * Triggered by RightNav "Monitor" tab (NOT ControlBar).
 * Minimizes to compact pill.
 */
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, X, Minimize2, Maximize2, Mic, Clock,
  ChevronRight,
} from "lucide-react";
import svgPaths from "../../imports/svg-o742tbrz7p";
import imgReflectionComponent from "figma:asset/23ba928371385f05d2596d28574ae1b0ff2726c3.png";
import imgReflectionComponent1 from "figma:asset/74d0697514bad9978e8c7782df5125fed444578b.png";
import { R, T, C, glass } from "./constants";
import { VideoStreamSlot } from "./VideoStreamSlot";

/* pre-destructure for Figma sandbox */
const MotionDiv = motion.div;

/* ─────────────────────────────────────────
   Design tokens — warm amber palette
   ───────────────────────────────────────── */
const A = {
  gold:       "rgba(199,136,68,1)",
  goldMid:    "rgba(199,136,68,0.75)",
  goldDim:    "rgba(199,136,68,0.40)",
  goldTint:   "rgba(199,136,68,0.10)",
  goldBorder: "rgba(199,136,68,0.18)",
  warmBg:     "#faf4eb",
  warmCard:   "#faf8f3",
  brown:      "#8b7355",
};

/* ─────────────────────────────────────────
   Research Question Icon (from Figma SVG)
   ───────────────────────────────────────── */
function ResearchIcon({ size = 14 }: { size?: number }) {
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg style={{ position: "absolute", width: "100%", height: "100%" }} fill="none" viewBox="0 0 16 16">
        <path d={svgPaths.p19d57600} stroke={A.brown} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p2fe1fe40} stroke={A.brown} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
        <path d={svgPaths.p25c2200}  stroke={A.brown} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
      </svg>
    </div>
  );
}

/* ─────────────────────────────────────────
   TASK CONTENT — full-width, single column
   Faithful to Figma — the images the participant
   is currently looking at.
   ───────────────────────────────────────── */
function TaskContentPanel() {
  const [hovered, setHovered] = useState<"A" | "B" | null>(null);

  return (
    <div style={{
      flex: 1,
      background: A.warmCard,
      borderRadius: R.md,
      boxShadow: "0px 0px 4px 0px rgba(0,0,0,0.15)",
      display: "flex",
      flexDirection: "column",
      padding: "14px 16px 16px",
      gap: 12,
      minWidth: 0,
      overflow: "hidden",
    }}>
      {/* Header: research question label */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <ResearchIcon size={15} />
        <span style={{ color: A.brown, fontSize: T.caption, letterSpacing: "-0.1px", fontFamily: "sans-serif" }}>
          Research Question Name
        </span>
        {/* Task type pill */}
        <div style={{
          marginLeft: "auto",
          fontSize: T.micro, color: A.goldMid,
          background: A.goldTint,
          borderRadius: 4, padding: "2px 7px",
          borderWidth: 0.5, borderStyle: "solid", borderColor: A.goldBorder,
          letterSpacing: "0.3px", flexShrink: 0,
        }}>
          Image Comparison
        </div>
      </div>

      {/* Images grid — fills all remaining height */}
      <div style={{ flex: 1, display: "flex", gap: 10, minHeight: 0 }}>
        {([
          { label: "A", src: imgReflectionComponent },
          { label: "B", src: imgReflectionComponent1 },
        ] as const).map(({ label, src }) => (
          <div
            key={label}
            onMouseEnter={() => setHovered(label as "A" | "B")}
            onMouseLeave={() => setHovered(null)}
            style={{
              flex: 1, position: "relative", borderRadius: 12, overflow: "hidden",
              opacity: hovered && hovered !== label ? 0.55 : 0.90,
              transitionProperty: "opacity, box-shadow",
              transitionDuration: "0.22s",
              transitionTimingFunction: "ease",
              boxShadow: hovered === label
                ? `0 0 0 2.5px ${A.gold}, 0 8px 28px rgba(199,136,68,0.22)`
                : "0 2px 12px rgba(0,0,0,0.10)",
              cursor: "default",
            }}
          >
            <img
              alt={`Option ${label}`}
              src={src}
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
            />
            {/* Label badge */}
            <div style={{
              position: "absolute", bottom: 14, left: "50%",
              transform: "translateX(-50%)",
              background: "rgba(0,0,0,0.50)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: 20, padding: "4px 16px",
              color: "rgba(255,255,255,0.88)", fontSize: T.caption,
              letterSpacing: "0.6px",
              borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.14)",
              whiteSpace: "nowrap",
            }}>
              Option {label}
            </div>
          </div>
        ))}
      </div>

      {/* Participant status — read-only indicator */}
      <div style={{
        flexShrink: 0, display: "flex", alignItems: "center", gap: 8,
        padding: "6px 10px",
        background: "rgba(199,136,68,0.05)",
        borderRadius: R.sm,
        borderWidth: 0.5, borderStyle: "solid", borderColor: A.goldBorder,
      }}>
        <Eye size={11} style={{ color: A.goldDim, flexShrink: 0 }} />
        <span style={{ fontSize: T.micro, color: A.brown, letterSpacing: "0.2px" }}>
          Participant is viewing
        </span>
        <div style={{
          marginLeft: "auto", display: "flex", alignItems: "center", gap: 5,
          background: A.goldTint, borderRadius: 4, padding: "1px 7px",
          borderWidth: 0.5, borderStyle: "solid", borderColor: A.goldBorder,
          color: A.goldMid, fontSize: T.micro,
        }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: A.gold, boxShadow: `0 0 4px ${A.gold}` }} />
          Comparing images
        </div>
        <div style={{
          display: "flex", alignItems: "center", gap: 4,
          color: C.positive, fontSize: T.micro,
        }}>
          <Mic size={10} />
          <span>Recording</span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   MINIMIZED PILL
   ───────────────────────────────────────── */
function MinimizedPill({ onExpand, onClose }: { onExpand: () => void; onClose: () => void }) {
  return (
    <MotionDiv
      initial={{ opacity: 0, y: -8, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ type: "spring", damping: 28, stiffness: 260 }}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "6px 10px 6px 12px",
        borderRadius: 999,
        background: "rgba(10,12,20,0.78)",
        ...glass,
        borderWidth: 0.5, borderStyle: "solid", borderColor: A.goldBorder,
        boxShadow: `0 4px 16px rgba(0,0,0,0.35), 0 0 0 0.5px ${A.goldBorder}, inset 0 1px 0 rgba(255,255,255,0.06)`,
        cursor: "pointer",
      }}
      onClick={onExpand}
    >
      <div style={{ width: 6, height: 6, borderRadius: "50%", background: A.gold, boxShadow: `0 0 6px ${A.gold}`, flexShrink: 0 }} />
      <Eye size={12} style={{ color: A.goldMid, flexShrink: 0 }} />
      <span style={{ color: "rgba(255,255,255,0.75)", fontSize: T.caption, whiteSpace: "nowrap" }}>
        Participant Screen
      </span>
      <div style={{
        fontSize: T.micro, color: A.goldMid,
        background: A.goldTint, borderRadius: 4, padding: "1px 6px",
        borderWidth: 0.5, borderStyle: "solid", borderColor: A.goldBorder,
        flexShrink: 0,
      }}>
        Image Comparison · Q 3/5
      </div>
      <button
        onClick={e => { e.stopPropagation(); onExpand(); }}
        style={{ color: "rgba(255,255,255,0.32)", cursor: "pointer", display: "flex", padding: 3, borderRadius: 5 }}
        title="Expand"
      >
        <Maximize2 size={11} />
      </button>
      <button
        onClick={e => { e.stopPropagation(); onClose(); }}
        style={{ color: "rgba(255,255,255,0.22)", cursor: "pointer", display: "flex", padding: 3, borderRadius: 5 }}
        title="Close"
      >
        <X size={11} />
      </button>
    </MotionDiv>
  );
}

/* ─────────────────────────────────────────
   MAIN EXPORT
   ───────────────────────────────────────── */
interface ParticipantTaskViewProps {
  onClose: () => void;
  defaultMinimized?: boolean;
  /** Forwarded ref → backend sets .srcObject = screenShareStream */
  screenVideoRef?: React.RefObject<HTMLVideoElement>;
}

export function ParticipantTaskView({ onClose, defaultMinimized = false, screenVideoRef }: ParticipantTaskViewProps) {
  const [minimized, setMinimized] = useState(defaultMinimized);

  return (
    <AnimatePresence mode="wait">
      {minimized ? (
        <MinimizedPill
          key="pill"
          onExpand={() => setMinimized(false)}
          onClose={onClose}
        />
      ) : (
        <MotionDiv
          key="full"
          initial={{ opacity: 0, y: 20, scale: 0.975, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: 14, scale: 0.985, filter: "blur(3px)" }}
          transition={{
            type: "spring", damping: 34, stiffness: 260, mass: 0.85,
            filter: { duration: 0.20 },
          }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            borderRadius: R.lg,
            overflow: "hidden",
            boxShadow: [
              "0 28px 90px rgba(0,0,0,0.60)",
              `0 0 0 0.5px ${A.goldBorder}`,
              "inset 0 1px 0 rgba(255,255,255,0.06)",
            ].join(", "),
          }}
        >
          {/* ══════════════════════════════════════
              OBSERVER CHROME HEADER
              ══════════════════════════════════════ */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "9px 14px",
            background: "rgba(8,9,16,0.90)",
            ...glass,
            borderBottomWidth: 0.5, borderBottomStyle: "solid", borderBottomColor: A.goldBorder,
            flexShrink: 0,
          }}>
            {/* Live indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: A.gold, boxShadow: `0 0 8px ${A.gold}` }} />
              <Eye size={13} style={{ color: A.goldMid }} />
            </div>

            <span style={{ fontSize: T.caption, color: "rgba(255,255,255,0.88)", letterSpacing: "0.1px" }}>
              Participant Screen
            </span>

            {/* Task type */}
            <div style={{
              fontSize: T.micro, color: A.goldMid,
              background: A.goldTint, borderRadius: 4, padding: "2px 7px",
              borderWidth: 0.5, borderStyle: "solid", borderColor: A.goldBorder,
              letterSpacing: "0.3px", flexShrink: 0,
            }}>
              Image Comparison
            </div>

            {/* Question progress */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5, flexShrink: 0,
              fontSize: T.micro, color: "rgba(255,255,255,0.28)",
            }}>
              <ChevronRight size={10} style={{ opacity: 0.5 }} />
              Question 3 of 5
            </div>

            {/* Observer-only label */}
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              marginLeft: 4,
              fontSize: T.micro, color: "rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.03)",
              borderRadius: 4, padding: "2px 7px",
              borderWidth: 0.5, borderStyle: "solid", borderColor: "rgba(255,255,255,0.07)",
              flexShrink: 0,
            }}>
              Observer View · Read Only
            </div>

            <div style={{ flex: 1 }} />

            {/* Minimize */}
            <button
              onClick={() => setMinimized(true)}
              title="Minimize"
              style={{
                color: "rgba(255,255,255,0.32)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 5, borderRadius: R.sm,
                transitionProperty: "background, color", transitionDuration: "0.15s", transitionTimingFunction: "ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "rgba(255,255,255,0.65)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.32)"; }}
            >
              <Minimize2 size={13} />
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              title="Close"
              style={{
                color: "rgba(255,255,255,0.26)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                padding: 5, borderRadius: R.sm,
                transitionProperty: "background, color", transitionDuration: "0.15s", transitionTimingFunction: "ease",
              }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,80,80,0.08)"; e.currentTarget.style.color = "rgba(255,128,128,0.80)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "rgba(255,255,255,0.26)"; }}
            >
              <X size={13} />
            </button>
          </div>

          {/* ══════════════════════════════════════
              CONTENT AREA — full-width task content
              ══════════════════════════════════════ */}
          <VideoStreamSlot
            ref={screenVideoRef}
            objectFit="contain"
            placeholder={<TaskContentPanel />}
            style={{
              flex: 1,
              minHeight: 0,
              background: "#f5f0e8",
            }}
          />
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}