/**
 * StarryBackground — Immersive starry sky for the researcher's paused state.
 *
 * Visual layers (bottom → top):
 *   1. Deep midnight-blue gradient background
 *   2. Canvas — 110 randomly placed twinkling stars, varied sizes
 *   3. SVG overlay — Cancer constellation with connecting lines + labels
 *   4. Subtle ambient glow in the upper-center (matches reference image)
 *
 * Cancer constellation star positions are based on actual sky coordinates,
 * scaled and centered on the viewport.
 *
 * Usage:
 *   <StarryBackground visible={isPaused} />
 *
 * The component fades in with motion/react AnimatePresence.
 * Canvas animation loop is cleaned up when invisible.
 */

import React, { useEffect, useRef, useCallback } from "react";
import { AnimatePresence, motion } from "motion/react";

/* ── Motion pre-destructure ── */
const MotionDiv = motion.div;

/* ── Cancer constellation data ── */
/* Positions as [x%, y%] of container dimensions */
/* Magnitudes drive star brightness / size on screen */
const CANCER_STARS = [
  { id: "beta",  name: "β Tarf",  x: 58.5, y: 58.0, mag: 3.5, label: true  }, // brightest
  { id: "delta", name: "δ",       x: 48.0, y: 50.0, mag: 3.9, label: false },
  { id: "iota",  name: "ι",       x: 40.5, y: 36.5, mag: 4.0, label: false },
  { id: "gamma", name: "γ",       x: 45.0, y: 44.0, mag: 4.7, label: false },
  { id: "alpha", name: "α Acubens",x: 55.0, y: 57.0, mag: 4.3, label: true  },
  { id: "zeta",  name: "ζ",       x: 35.5, y: 52.0, mag: 5.1, label: false },
] as const;

/* Connecting lines between constellation stars */
const CANCER_LINES: Array<[string, string]> = [
  ["iota",  "gamma"],
  ["gamma", "delta"],
  ["delta", "alpha"],
  ["alpha", "beta"],
  ["gamma", "zeta"],
];

/* Magnitude → rendered radius on screen */
function magToRadius(mag: number): number {
  // mag 3.5 = 3.2px, mag 5.1 = 1.4px
  return Math.max(1.2, (6.2 - mag) * 0.9);
}

/* ── Canvas star field ── */
interface Star {
  x: number;
  y: number;
  r: number;
  opacity: number;
  speed: number;
  phase: number;
  color: [number, number, number];
}

function buildStars(w: number, h: number, count = 110): Star[] {
  const stars: Star[] = [];
  for (let i = 0; i < count; i++) {
    const r = Math.random() < 0.12 ? 1.6 + Math.random() * 1.2 : 0.5 + Math.random() * 1.0;
    // Color: mostly cold white, some warm, some slightly blue-tinted
    const tint = Math.random();
    const color: [number, number, number] = tint < 0.20
      ? [210, 225, 255]  // blue-white
      : tint < 0.30
      ? [255, 235, 210]  // warm
      : [230, 240, 255]; // cool white

    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      r,
      opacity: 0.35 + Math.random() * 0.55,
      speed: 0.3 + Math.random() * 0.9,
      phase: Math.random() * Math.PI * 2,
      color,
    });
  }
  return stars;
}

/* ── StarCanvas ── */
function StarCanvas({ visible }: { visible: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);
  const rafRef = useRef<number>(0);
  const startRef = useRef<number>(0);

  const drawFrame = useCallback((ts: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    if (!startRef.current) startRef.current = ts;
    const t = (ts - startRef.current) / 1000; // seconds

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const s of starsRef.current) {
      // Twinkling: sine wave on opacity with individual phase & speed
      const twinkle = Math.sin(t * s.speed + s.phase);
      const alpha = Math.max(0.08, s.opacity + twinkle * 0.28 * (s.opacity - 0.2));

      // Very large stars get a subtle glow
      if (s.r > 1.4) {
        const grd = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4.5);
        grd.addColorStop(0, `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${(alpha * 0.35).toFixed(3)})`);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Core star dot
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${s.color[0]},${s.color[1]},${s.color[2]},${alpha.toFixed(3)})`;
      ctx.fill();
    }

    rafRef.current = requestAnimationFrame(drawFrame);
  }, []);

  /* Init / resize canvas */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      starsRef.current = buildStars(canvas.width, canvas.height);
      startRef.current = 0;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  /* Animation loop — only when visible */
  useEffect(() => {
    if (visible) {
      rafRef.current = requestAnimationFrame(drawFrame);
    } else {
      cancelAnimationFrame(rafRef.current);
    }
    return () => cancelAnimationFrame(rafRef.current);
  }, [visible, drawFrame]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}

/* ── Cancer constellation SVG overlay ── */
function CancerConstellation() {
  const starMap = Object.fromEntries(CANCER_STARS.map((s) => [s.id, s]));

  return (
    <svg
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "visible",
        pointerEvents: "none",
      }}
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
    >
      <defs>
        {/* Glow filter for constellation stars */}
        <filter id="star-glow" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="0.6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="star-glow-bright" x="-200%" y="-200%" width="500%" height="500%">
          <feGaussianBlur stdDeviation="0.9" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Constellation connecting lines */}
      {CANCER_LINES.map(([fromId, toId]) => {
        const from = starMap[fromId];
        const to = starMap[toId];
        return (
          <line
            key={`${fromId}-${toId}`}
            x1={from.x}
            y1={from.y}
            x2={to.x}
            y2={to.y}
            stroke="rgba(160,190,255,0.18)"
            strokeWidth="0.15"
            strokeLinecap="round"
          />
        );
      })}

      {/* Constellation star points */}
      {CANCER_STARS.map((s) => {
        const r = magToRadius(s.mag) * 0.32; // scale to SVG viewBox units
        const isBright = s.mag <= 3.9;
        const baseOpacity = isBright ? 0.92 : 0.70;
        return (
          <g key={s.id} filter={isBright ? "url(#star-glow-bright)" : "url(#star-glow)"}>
            {/* Outer soft halo */}
            <circle
              cx={s.x}
              cy={s.y}
              r={r * 3.2}
              fill={`rgba(180,210,255,${isBright ? 0.06 : 0.03})`}
            />
            {/* Core */}
            <circle
              cx={s.x}
              cy={s.y}
              r={r}
              fill={`rgba(210,230,255,${baseOpacity})`}
            />
          </g>
        );
      })}

      {/* Constellation label */}
      <text
        x="47"
        y="67"
        textAnchor="middle"
        style={{
          fontSize: "2.2px",
          fill: "rgba(160,185,255,0.30)",
          fontFamily: "'Inter', sans-serif",
          letterSpacing: "0.4px",
          textTransform: "uppercase",
        }}
      >
        CANCER
      </text>

      {/* Star name labels for labeled stars */}
      {CANCER_STARS.filter((s) => s.label).map((s) => (
        <text
          key={`label-${s.id}`}
          x={s.x + (s.x > 50 ? -1.5 : 1.2)}
          y={s.y - 1.5}
          textAnchor={s.x > 50 ? "end" : "start"}
          style={{
            fontSize: "1.6px",
            fill: "rgba(180,200,255,0.25)",
            fontFamily: "'Inter', sans-serif",
            letterSpacing: "0.15px",
          }}
        >
          {s.name}
        </text>
      ))}
    </svg>
  );
}

/* ════════════════════════════════════
   StarryBackground — exported component
   ════════════════════════════════════ */
export function StarryBackground({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <MotionDiv
          key="starry-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 5,
            overflow: "hidden",
          }}
        >
          {/* ── Gradient base — deep midnight navy ── */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: [
                "radial-gradient(ellipse 90% 60% at 50% 28%, rgba(12,28,68,0.90) 0%, transparent 70%)",
                "radial-gradient(ellipse 60% 40% at 30% 70%, rgba(8,16,42,0.50) 0%, transparent 60%)",
                "linear-gradient(175deg, #040c1e 0%, #020810 42%, #010609 100%)",
              ].join(", "),
            }}
          />

          {/* ── Upper ambient glow (matches reference image's blue bloom) ── */}
          <div
            style={{
              position: "absolute",
              top: "-10%",
              left: "15%",
              right: "15%",
              height: "55%",
              background:
                "radial-gradient(ellipse 80% 70% at 50% 20%, rgba(20,50,110,0.45) 0%, rgba(10,25,65,0.22) 50%, transparent 80%)",
              filter: "blur(30px)",
              pointerEvents: "none",
            }}
          />

          {/* ── Canvas: animated star field ── */}
          <StarCanvas visible={visible} />

          {/* ── SVG: Cancer constellation ── */}
          <CancerConstellation />

          {/* ── "Session Paused" label at top-center ── */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 0,
              right: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 6,
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "5px 16px",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 20,
                borderWidth: 0.5,
                borderStyle: "solid",
                borderColor: "rgba(255,255,255,0.08)",
              }}
            >
              {/* Pulsing dim dot */}
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "rgba(180,200,255,0.35)",
                  boxShadow: "0 0 6px rgba(180,200,255,0.25)",
                  animation: "starPulse 3s ease-in-out infinite",
                }}
              />
              <span
                style={{
                  fontSize: 10,
                  color: "rgba(180,200,255,0.38)",
                  letterSpacing: "0.18em",
                  textTransform: "uppercase",
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                Session Paused · Observing
              </span>
            </div>
          </div>

          {/* ── Inject keyframes ── */}
          <style dangerouslySetInnerHTML={{
            __html: `
              @keyframes starPulse {
                0%, 100% { opacity: 0.55; }
                50%       { opacity: 1; }
              }
            `,
          }} />
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}
