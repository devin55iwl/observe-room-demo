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
  const activeImg = pipSwapped ? imgCookiyAI : imgInterviewee;
  const secondaryImg = pipSwapped ? imgInterviewee : imgCookiyAI;
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
        <img ref={bgImgRef} src={activeImg} alt=""
          className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous"
          style={{ ...fullBleedImage, filter: "brightness(0.58) contrast(1.03) saturate(0.86)", opacity: 0, pointerEvents: "none" }} />

        <img
          src={activeImg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            ...fullBleedImage,
            inset: "-3%",
            width: "106%",
            height: "106%",
            filter: "blur(28px) brightness(0.28) contrast(1.02) saturate(0.84)",
            opacity: 0.9,
            transform: "scale(1.03)",
          }}
        />

        <div
          className="absolute inset-0"
          style={{
            ...fullBleed,
            background:
              "linear-gradient(90deg, rgba(0,0,0,0.74) 0%, rgba(0,0,0,0.36) 20%, rgba(0,0,0,0.03) 43%, rgba(0,0,0,0.07) 58%, rgba(0,0,0,0.54) 82%, rgba(0,0,0,0.80) 100%)",
          }}
        />

        <div
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            width: "min(76vw, 1080px)",
            height: "min(86vh, 820px)",
            transform: "translate(-50%, -50%)",
            overflow: "visible",
            WebkitMaskImage:
              "radial-gradient(ellipse 76% 72% at 50% 45%, #000 0%, #000 50%, rgba(0,0,0,0.78) 64%, rgba(0,0,0,0.26) 82%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 76% 72% at 50% 45%, #000 0%, #000 50%, rgba(0,0,0,0.78) 64%, rgba(0,0,0,0.26) 82%, transparent 100%)",
          }}
        >
          <img
            src={activeImg}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "50% 42%",
              filter: "brightness(0.86) contrast(1.04) saturate(0.96)",
              transitionProperty: "opacity",
              transitionDuration: "0.6s",
              transitionTimingFunction: "ease",
            }}
          />
          <img
            src={secondaryImg}
            alt=""
            style={{
              position: "absolute",
              right: 22,
              bottom: 22,
              width: 162,
              height: 96,
              objectFit: "cover",
              borderRadius: 16,
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.46), inset 0 0 24px rgba(0,0,0,0.38)",
              filter: "brightness(0.76) contrast(1.03)",
              opacity: 0.72,
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              boxShadow:
                "inset 0 0 92px rgba(0,0,0,0.58), inset 0 -140px 128px rgba(0,0,0,0.58), inset 0 96px 90px rgba(0,0,0,0.32)",
              pointerEvents: "none",
            }}
          />
        </div>

        <div className="absolute inset-0" style={{ ...fullBleed, background: "radial-gradient(ellipse 58% 68% at 50% 44%, rgba(255,255,255,0.045) 0%, rgba(255,255,255,0.012) 36%, rgba(3,7,14,0.64) 100%)", pointerEvents: "none" }} />
        <div className="absolute inset-0" style={{ ...fullBleed, background: "linear-gradient(180deg, rgba(3,7,14,0.54) 0%, rgba(3,7,14,0.06) 30%, rgba(3,7,14,0.28) 58%, rgba(3,7,14,0.86) 100%)", pointerEvents: "none" }} />
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
