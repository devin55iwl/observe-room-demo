import React, { useMemo } from "react";

type GeneratedStar = {
  id: number;
  layer: 1 | 2 | 3;
  cx: number;
  cy: number;
  r: number;
  opacity: number;
  twinkleDuration: number;
  twinkleDelay: number;
  driftX: number;
  driftY: number;
  driftDuration: number;
  color: string;
};

const VIEWBOX_SIZE = 1000;
const STAR_COUNT = 2600;

const cancerStars = [
  { cx: 750, cy: 650, r: 2.5 },
  { cx: 880, cy: 680, r: 2.3 },
  { cx: 820, cy: 600, r: 2.2 },
  { cx: 810, cy: 570, r: 2.0 },
  { cx: 780, cy: 520, r: 2.1 },
];

const aquariusStars = [
  { cx: 500, cy: 300, r: 2.8 },
  { cx: 450, cy: 250, r: 2.2 },
  { cx: 550, cy: 240, r: 2.4 },
  { cx: 500, cy: 360, r: 2.3 },
  { cx: 350, cy: 280, r: 3.5 },
  { cx: 200, cy: 350, r: 3.8 },
  { cx: 650, cy: 320, r: 2.8 },
  { cx: 380, cy: 650, r: 3.2 },
  { cx: 120, cy: 450, r: 2.4 },
  { cx: 600, cy: 500, r: 2.6 },
  { cx: 680, cy: 600, r: 2.5 },
  { cx: 480, cy: 430, r: 1.8 },
  { cx: 530, cy: 490, r: 2.0 },
  { cx: 490, cy: 560, r: 1.7 },
  { cx: 550, cy: 640, r: 1.9 },
  { cx: 510, cy: 720, r: 2.1 },
  { cx: 580, cy: 800, r: 3.0 },
];

function getStarColor() {
  const rand = Math.random();
  if (rand > 0.9) return "#b8d4ff";
  if (rand > 0.8) return "#ffd2a1";
  if (rand > 0.7) return "#fff4e8";
  return "#ffffff";
}

function generateStars(count: number): GeneratedStar[] {
  return Array.from({ length: count }).map((_, id) => {
    const rand = Math.random();
    let layer: 1 | 2 | 3 = 1;
    let r = Math.random() * 0.5 + 0.2;

    if (rand > 0.7) {
      layer = 2;
      r = Math.random() * 0.6 + 0.7;
    }

    if (rand > 0.95) {
      layer = 3;
      r = Math.random() * 1.2 + 1.3;
    }

    const angle = Math.random() * Math.PI * 2;
    const radius = Math.sqrt(Math.random()) * 1500;

    return {
      id,
      layer,
      cx: 500 + Math.cos(angle) * radius,
      cy: 500 + Math.sin(angle) * radius,
      r,
      opacity: Math.random() * 0.4 + 0.1,
      twinkleDuration: Math.random() * 5 + 3,
      twinkleDelay: Math.random() * -10,
      driftX: (Math.random() - 0.5) * (layer * 5),
      driftY: (Math.random() - 0.5) * (layer * 5),
      driftDuration: Math.random() * 30 + 30,
      color: getStarColor(),
    };
  });
}

function Star({ star }: { star: GeneratedStar }) {
  return (
    <g>
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`0,0; ${star.driftX},${star.driftY}; 0,0`}
        dur={`${star.driftDuration}s`}
        begin={`${star.twinkleDelay}s`}
        repeatCount="indefinite"
      />
      <circle
        cx={star.cx}
        cy={star.cy}
        r={star.r}
        fill={star.color}
        className="interactive-star"
        stroke="transparent"
        strokeWidth="15"
        style={{
          "--base-opacity": star.opacity,
          "--twinkle-dur": `${star.twinkleDuration}s`,
          "--twinkle-delay": `${star.twinkleDelay}s`,
          "--star-color": star.color,
        } as React.CSSProperties}
      />
    </g>
  );
}

function ConstellationStar({
  star,
  index,
  prefix,
}: {
  star: { cx: number; cy: number; r: number };
  index: number;
  prefix: string;
}) {
  const motion = useMemo(() => ({
    twinkleDur: Math.random() * 2 + 3,
    driftDur: Math.random() * 15 + 20,
    delay: Math.random() * -10,
    driftX: (Math.random() - 0.5) * 5,
    driftY: (Math.random() - 0.5) * 5,
    vibrationDur: Math.random() * 1.5 + 1.5,
  }), []);
  const isCancer = prefix === "can";

  return (
    <g key={`${prefix}-${index}`}>
      <animateTransform
        attributeName="transform"
        type="translate"
        values={`0,0; ${motion.driftX},${motion.driftY}; 0,0`}
        dur={`${motion.driftDur}s`}
        begin={`${motion.delay}s`}
        repeatCount="indefinite"
        additive="sum"
      />
      <animateTransform
        attributeName="transform"
        type="translate"
        values="0,0; 0.3,0.3; -0.3,-0.3; 0,0"
        dur={`${motion.vibrationDur}s`}
        begin={`${motion.delay}s`}
        repeatCount="indefinite"
        additive="sum"
      />
      <circle cx={star.cx} cy={star.cy} r={star.r * 5} fill="url(#constellationGlow)" opacity="0.5">
        <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${motion.twinkleDur}s`} begin={`${motion.delay}s`} repeatCount="indefinite" />
      </circle>
      <circle
        cx={star.cx}
        cy={star.cy}
        r={star.r * 0.8}
        fill="#e6f2ff"
        filter="url(#glow)"
        className="constellation-star"
        stroke="transparent"
        strokeWidth="20"
      >
        <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${motion.twinkleDur}s`} begin={`${motion.delay}s`} repeatCount="indefinite" />
      </circle>
      {isCancer && <circle cx={star.cx} cy={star.cy} r={star.r * 12} fill="url(#constellationGlow)" className="cancer-pulse" />}
      {isCancer && <circle cx={star.cx} cy={star.cy} r={star.r * 1.5} fill="#ffffff" filter="url(#glow)" className="cancer-pulse" />}
    </g>
  );
}

export function CancerStarryNight() {
  const stars = useMemo(() => generateStars(STAR_COUNT), []);
  const layer1 = stars.filter((star) => star.layer === 1);
  const layer2 = stars.filter((star) => star.layer === 2);
  const layer3 = stars.filter((star) => star.layer === 3);

  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        background: "#000",
        pointerEvents: "auto",
      }}
    >
      <svg
        viewBox={`0 0 ${VIEWBOX_SIZE} ${VIEWBOX_SIZE}`}
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <defs>
          <radialGradient id="skyGradient" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stopColor="#0b132b" />
            <stop offset="60%" stopColor="#050814" />
            <stop offset="100%" stopColor="#000000" />
          </radialGradient>
          <radialGradient id="constellationGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a6d8ff" stopOpacity="0.4" />
            <stop offset="40%" stopColor="#4da6ff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#0055ff" stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <style>
          {`
            .interactive-star {
              animation: cancerTwinkle var(--twinkle-dur) infinite ease-in-out;
              animation-delay: var(--twinkle-delay);
              pointer-events: all;
              transition: opacity 0.2s, filter 0.2s, stroke 0.2s;
            }
            @keyframes cancerTwinkle {
              0%, 100% { opacity: var(--base-opacity); }
              50% { opacity: calc(var(--base-opacity) + 0.5); }
            }
            .interactive-star:hover {
              animation: none;
              opacity: 1 !important;
              filter: drop-shadow(0 0 6px #fff) drop-shadow(0 0 12px var(--star-color));
              stroke: rgba(255, 255, 255, 0.4);
              stroke-width: 4px;
              cursor: pointer;
            }
            .constellation-star {
              pointer-events: all;
              transition: filter 0.2s, stroke 0.2s;
            }
            .constellation-star:hover {
              filter: drop-shadow(0 0 10px #fff) drop-shadow(0 0 20px #a6d8ff);
              stroke: rgba(166, 216, 255, 0.6);
              stroke-width: 6px;
              cursor: pointer;
            }
            @keyframes pulseFlash {
              0%, 82%, 100% { opacity: 0; }
              86%, 96% { opacity: 1; }
            }
            .cancer-pulse {
              animation: pulseFlash 15s infinite cubic-bezier(0.4, 0, 0.2, 1);
              pointer-events: none;
            }
          `}
        </style>

        <rect width="100%" height="100%" fill="url(#skyGradient)" />

        <g>
          <animateTransform attributeName="transform" type="translate" from="-100 0" to="100 0" dur="720s" repeatCount="indefinite" additive="sum" />
          <animateTransform attributeName="transform" type="rotate" from="0 500 500" to="360 500 500" dur="720s" repeatCount="indefinite" additive="sum" />
          {layer1.map((star) => <Star key={star.id} star={star} />)}
        </g>

        <g>
          <animateTransform attributeName="transform" type="translate" from="-200 0" to="200 0" dur="480s" repeatCount="indefinite" additive="sum" />
          <animateTransform attributeName="transform" type="rotate" from="0 500 500" to="360 500 500" dur="480s" repeatCount="indefinite" additive="sum" />
          {layer2.map((star) => <Star key={star.id} star={star} />)}
          <g transform="translate(-150, -100)">
            {aquariusStars.map((star, index) => <ConstellationStar key={`aq-${index}`} star={star} index={index} prefix="aq" />)}
          </g>
          <g transform="translate(-320, -100)">
            {cancerStars.map((star, index) => <ConstellationStar key={`can-${index}`} star={star} index={index} prefix="can" />)}
          </g>
        </g>

        <g>
          <animateTransform attributeName="transform" type="translate" from="-400 0" to="400 0" dur="240s" repeatCount="indefinite" additive="sum" />
          <animateTransform attributeName="transform" type="rotate" from="0 500 500" to="360 500 500" dur="240s" repeatCount="indefinite" additive="sum" />
          {layer3.map((star) => <Star key={star.id} star={star} />)}
        </g>
      </svg>
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: [
            "radial-gradient(ellipse 72% 58% at 48% 42%, transparent 0%, rgba(0,0,0,0.16) 45%, rgba(0,0,0,0.62) 100%)",
            "linear-gradient(90deg, rgba(0,0,0,0.38), transparent 32%, transparent 68%, rgba(0,0,0,0.44))",
            "linear-gradient(180deg, rgba(0,0,0,0.12), transparent 45%, rgba(0,0,0,0.48))",
          ].join(", "),
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
