/**
 * VideoStreamSlot — WebRTC-ready <video> wrapper.
 *
 * Renders a transparent <video> element over a placeholder.
 * The placeholder shows until a real MediaStream is assigned:
 *
 *   videoRef.current.srcObject = mediaStream;
 *
 * Once srcObject is set the video naturally covers the placeholder.
 * No internal state needed — zero re-renders on stream connect.
 *
 * Usage:
 *   <VideoStreamSlot ref={screenVideoRef} placeholder={<TaskContentPanel />}
 *     style={{ flex: 1 }} />
 */
import React, { forwardRef } from "react";
import type { CSSProperties, ReactNode } from "react";

interface VideoStreamSlotProps {
  /** Shown beneath the video until a stream is connected */
  placeholder?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** CSS object-fit for the video element (default: "cover") */
  objectFit?: "cover" | "contain";
}

export const VideoStreamSlot = forwardRef<HTMLVideoElement, VideoStreamSlotProps>(
  ({ placeholder, className, style, objectFit = "cover" }, ref) => {
    return (
      <div
        className={className}
        style={{ position: "relative", overflow: "hidden", ...style }}
      >
        {/* ── Placeholder: visible until stream connects ── */}
        {placeholder && (
          <div style={{ position: "absolute", inset: 0, display: "flex" }}>
            {placeholder}
          </div>
        )}

        {/* ── Live video feed — transparent until srcObject assigned ── */}
        {/* Backend hookup:
            screenVideoRef.current.srcObject = screenStream;  // participant screen share
            faceVideoRef.current.srcObject   = faceStream;    // participant camera     */}
        <video
          ref={ref}
          autoPlay
          muted
          playsInline
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit,
            display: "block",
            background: "transparent",
          }}
        />
      </div>
    );
  }
);

VideoStreamSlot.displayName = "VideoStreamSlot";
