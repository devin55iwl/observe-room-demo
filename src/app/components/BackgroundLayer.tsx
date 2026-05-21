/**
 * BackgroundLayer — Full-viewport video background with crossfade.
 *
 * Renders the interviewee and AI moderator camera feeds as stacked
 * full-bleed images, with a crossfade driven by `pipSwapped`.
 * Also includes:
 *  - A hidden <img> for luminance sampling (adaptive glass tinting).
 *  - Radial + linear gradient overlays for readability.
 *  - Left/right edge darkening gradients for panel contrast.
 *
 * When `taskViewOpen` is true the video feeds fade out completely —
 * the app's base dark background (#0a0b0f) becomes the backdrop, and
 * the participant's face lives exclusively in the left-dock PiP.
 */
import React from "react";

interface BackgroundLayerProps {
  imgInterviewee: string;
  imgCookiyAI: string;
  pipSwapped: boolean;
  /** Ref attached to a hidden img for brightness sampling */
  bgImgRef: React.RefObject<HTMLImageElement | null>;
  /** When true AND pipSwapped is false, video feeds fade out (task view is main stage).
   *  When pipSwapped flips to true, the face comes back to center so feeds show again. */
  taskViewOpen: boolean;
}

export function BackgroundLayer({ imgInterviewee, imgCookiyAI, pipSwapped, bgImgRef, taskViewOpen }: BackgroundLayerProps) {
  /* Hide the background entirely when task view is open — regardless of pipSwapped.
     Face in swapped mode now lives inside FaceStageView (Q3=B). */
  const feedsVisible = !taskViewOpen;
  const fullBleed: React.CSSProperties = {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
  };
  const fullBleedImage: React.CSSProperties = {
    ...fullBleed,
    objectFit: "cover",
  };

  return (
    <div>
      {/* Video feeds */}
      <div
        className="absolute inset-0"
        style={{
          ...fullBleed,
          opacity: feedsVisible ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "0.55s",
          transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Hidden reference image for luminance sampling */}
        <img ref={bgImgRef} src={pipSwapped ? imgCookiyAI : imgInterviewee} alt=""
          className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous"
          style={{ ...fullBleedImage, filter: "brightness(0.88) contrast(1.04)", opacity: 0, pointerEvents: "none" }} />
        {/* Interviewee feed */}
        <img src={imgInterviewee} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ ...fullBleedImage, filter: "brightness(0.88) contrast(1.04)", opacity: pipSwapped ? 0 : 1, transitionProperty: "opacity", transitionDuration: "0.6s", transitionTimingFunction: "ease" }} />
        {/* AI Moderator feed */}
        <img src={imgCookiyAI} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ ...fullBleedImage, filter: "brightness(0.88) contrast(1.04)", opacity: pipSwapped ? 1 : 0, transitionProperty: "opacity", transitionDuration: "0.6s", transitionTimingFunction: "ease" }} />
        {/* Radial vignette */}
        <div className="absolute inset-0" style={{ ...fullBleed, background: "radial-gradient(ellipse 80% 70% at 42% 42%, transparent 25%, rgba(10,12,18,0.55) 100%)" }} />
        {/* Vertical gradient */}
        <div className="absolute inset-0" style={{ ...fullBleed, background: "linear-gradient(180deg, rgba(10,11,15,0.25) 0%, transparent 30%, transparent 50%, rgba(10,11,15,0.60) 100%)" }} />
      </div>

      {/* Edge gradients — also hidden when task view is active */}
      <div
        className="absolute left-0 top-0 h-full z-[1] pointer-events-none"
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
          width: "41%",
          backgroundImage: "linear-gradient(92deg, rgba(0,0,0,0.5) 7%, rgba(115,115,115,0) 97.5%)",
          opacity: feedsVisible ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "0.55s",
          transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
        }}
      />
      <div
        className="absolute right-0 top-0 h-full z-[1] pointer-events-none"
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          height: "100%",
          zIndex: 1,
          pointerEvents: "none",
          width: "38%",
          backgroundImage: "linear-gradient(268deg, rgba(0,0,0,0.5) 7%, rgba(115,115,115,0) 97.5%)",
          opacity: feedsVisible ? 1 : 0,
          transitionProperty: "opacity",
          transitionDuration: "0.55s",
          transitionTimingFunction: "cubic-bezier(0.32,0.72,0,1)",
        }}
      />
    </div>
  );
}
