/**
 * FaceStageView — Participant face displayed INSIDE the main stage frame.
 *
 * Shown when pipSwapped=true in shared screen mode.
 * The face stays within the same rounded-frame boundaries as
 * ParticipantTaskView — it does NOT fill the background.
 *
 * The only Switch trigger is the PiP hover overlay (Q1=B).
 * This component is purely a display frame with no switch controls.
 */
import React from "react";
import { motion } from "motion/react";
import { Video } from "lucide-react";
import { R, T, glass } from "./constants";
import imgInterviewee from "figma:asset/fa0d16c39081a2c44765b4fd4bdd1d40747ed8e5.png";

const MotionDiv = motion.div;

interface FaceStageViewProps {
  /** Ref forwarded from App — backend sets .srcObject = cameraStream */
  faceVideoRef?: React.RefObject<HTMLVideoElement>;
}

export function FaceStageView({ faceVideoRef }: FaceStageViewProps) {
  return (
    <MotionDiv
      key="face-stage"
      initial={{ opacity: 0, scale: 0.985, filter: "blur(4px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={{ opacity: 0, scale: 0.985, filter: "blur(4px)" }}
      transition={{ duration: 0.38, ease: [0.32, 0.72, 0, 1] }}
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        borderRadius: R.lg,
        overflow: "hidden",
        boxShadow: [
          "0 28px 90px rgba(0,0,0,0.60)",
          "0 0 0 0.5px rgba(255,255,255,0.08)",
          "inset 0 1px 0 rgba(255,255,255,0.06)",
        ].join(", "),
      }}
    >
      {/* ── Header chrome ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "9px 14px",
          background: "rgba(8,9,16,0.90)",
          ...glass,
          borderBottomWidth: 0.5,
          borderBottomStyle: "solid",
          borderBottomColor: "rgba(255,255,255,0.07)",
          flexShrink: 0,
        }}
      >
        {/* Live dot */}
        <div style={{ display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}>
          <div
            style={{
              position: "relative",
              width: 7,
              height: 7,
            }}
          >
            <div style={{ width: 7, height: 7, borderRadius: "50%", background: "rgba(86,220,130,1)", boxShadow: "0 0 8px rgba(86,220,130,0.8)" }} />
            <div
              style={{
                position: "absolute",
                inset: 0,
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "rgba(86,220,130,0.6)",
                animationName: "ping",
                animationDuration: "1.8s",
                animationIterationCount: "infinite",
              }}
            />
          </div>
          <Video size={13} style={{ color: "rgba(86,220,130,0.75)" }} />
        </div>

        <span style={{ fontSize: T.caption, color: "rgba(255,255,255,0.88)", letterSpacing: "0.1px" }}>
          Participant Camera
        </span>

        {/* Live badge */}
        <div
          style={{
            fontSize: T.micro,
            color: "rgba(86,220,130,0.85)",
            background: "rgba(86,220,130,0.10)",
            borderRadius: 4,
            padding: "2px 7px",
            borderWidth: 0.5,
            borderStyle: "solid",
            borderColor: "rgba(86,220,130,0.22)",
            letterSpacing: "0.3px",
            flexShrink: 0,
          }}
        >
          Live
        </div>

        <div style={{ flex: 1 }} />

        {/* Hint: switch via PiP — B4 fix: was "Click camera below" which is wrong
            when PiP is showing the screen share thumbnail (pipSwapped=true state) */}
        <span
          style={{
            fontSize: T.micro,
            color: "rgba(255,255,255,0.18)",
            letterSpacing: "0.1px",
          }}
        >
          Click thumbnail below to switch back
        </span>
      </div>

      {/* ── Face video / placeholder ── */}
      <div style={{ flex: 1, position: "relative", minHeight: 0, background: "#0d0e14" }}>
        {/* Placeholder image */}
        <img
          src={imgInterviewee}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.92) contrast(1.03)",
          }}
        />

        {/* Live video — transparent until faceVideoRef.current.srcObject is set */}
        {faceVideoRef && (
          <video
            ref={faceVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              background: "transparent",
            }}
          />
        )}

        {/* Subtle vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 90% 85% at 50% 45%, transparent 40%, rgba(0,0,0,0.35) 100%)",
            pointerEvents: "none",
          }}
        />

        {/* Bottom name badge */}
        <div
          style={{
            position: "absolute",
            bottom: 18,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "6px 16px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            borderWidth: 0.5,
            borderStyle: "solid",
            borderColor: "rgba(255,255,255,0.10)",
            boxShadow: "0 4px 20px rgba(0,0,0,0.40)",
            whiteSpace: "nowrap",
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "rgba(86,220,130,1)",
              boxShadow: "0 0 6px rgba(86,220,130,0.8)",
              flexShrink: 0,
            }}
          />
          <span style={{ fontSize: T.caption, color: "rgba(255,255,255,0.85)" }}>
            #9527
          </span>
          <span
            style={{
              fontSize: T.micro,
              color: "rgba(255,255,255,0.35)",
              borderLeftWidth: 1,
              borderLeftStyle: "solid",
              borderLeftColor: "rgba(255,255,255,0.12)",
              paddingLeft: 8,
            }}
          >
            Participant
          </span>
        </div>
      </div>
    </MotionDiv>
  );
}