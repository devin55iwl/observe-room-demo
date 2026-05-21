/**
 * AnalysisPill — Minimized floating pill for the Analysis panel.
 *
 * When the user minimizes the left Analysis panel, this pill appears
 * in its place showing a compact emotion summary:
 *  - Pulsing live dot
 *  - Animated emoji + primary emotion label
 *  - Confidence percentage
 *  - Valence indicator dot (positive / neutral / negative)
 *
 * Clicking the pill restores the full Analysis panel.
 */
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { ScanFace } from "lucide-react";
import { T, G, R, C, STATUS_H, STATUS_GAP, surfaceStyle } from "./constants";
import type { EmotionState } from "./FaceAnalysisView";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionButton = motion.button;
const MotionSpan = motion.span;

interface AnalysisPillProps {
  emotion: EmotionState;
  onRestore: () => void;
}

export function AnalysisPill({ emotion, onRestore }: AnalysisPillProps) {
  return (
    <MotionButton
      initial={{ opacity: 0, x: -20, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.9 }}
      transition={{ type: "spring", damping: 24, stiffness: 260 }}
      onClick={onRestore}
      className="absolute z-20 flex items-center gap-2 px-3 py-2 cursor-pointer group"
      style={{
        top: G + STATUS_H + STATUS_GAP, left: G + 1,
        ...surfaceStyle, borderRadius: R.md, background: "rgba(255,255,255,0.04)",
      }}
    >
      {/* Live indicator */}
      <div className="relative">
        <div className="size-1.5 rounded-full animate-pulse" style={{ background: C.negative }} />
        <div className="absolute inset-0 size-1.5 rounded-full animate-ping" style={{ background: C.negative, opacity: 0.3 }} />
      </div>

      {/* Animated emoji */}
      <AnimatePresence mode="wait">
        <MotionSpan key={emotion.emoji}
          initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }} style={{ fontSize: 14 }}>
          {emotion.emoji}
        </MotionSpan>
      </AnimatePresence>

      {/* Label + confidence */}
      <div className="flex flex-col items-start">
        <AnimatePresence mode="wait">
          <MotionSpan key={emotion.primary}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="text-white/70" style={{ fontSize: T.caption, lineHeight: 1.2 }}>
            {emotion.primary}
          </MotionSpan>
        </AnimatePresence>
        <span className="text-white/25 font-mono" style={{ fontSize: 7 }}>
          {emotion.confidence}% conf
        </span>
      </div>

      {/* Valence dot */}
      <div className="size-1.5 rounded-full ml-1"
        style={{ background: emotion.valence > 0.3 ? C.positive : emotion.valence < -0.3 ? C.negative : "rgba(255,255,255,0.25)" }} />

      {/* Expand hint on hover */}
      <ScanFace size={10} className="text-white/0 group-hover:text-white/30 transition-colors ml-0.5" />
    </MotionButton>
  );
}
