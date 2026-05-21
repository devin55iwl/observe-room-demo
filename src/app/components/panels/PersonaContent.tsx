import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;
const MotionLi = motion.li;

import { ChevronDown, Loader2 } from "lucide-react";
import { R, C, T } from "../constants";
import { PERSONA_CRITERIA, QUOTA_GROUP, CONVERSATION_ANALYSIS } from "../data";

export function PersonaContent() {
  const [screenerOpen, setScreenerOpen] = useState(false);

  return (
    <div className="space-y-3 overflow-y-auto scroll-area flex-1">
      {/* ── Quota Group Card (accent gradient) ── */}
      <div
        className="overflow-hidden"
        style={{
          background: "linear-gradient(180deg, rgba(97,95,255,0.20) 0%, rgba(97,95,255,0.08) 100%)",
          border: "0.5px solid rgba(97,95,255,0.15)",
          borderRadius: R.md,
          boxShadow: "inset 0 0.5px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(97,95,255,0.08)",
        }}
      >
        {/* Header: quota description + toggle */}
        <button
          onClick={() => setScreenerOpen(v => !v)}
          className="w-full flex items-center justify-between px-3.5 py-3 cursor-pointer text-left"
        >
          <p className="text-white/80 flex-1 pr-3" style={{ fontSize: T.body, lineHeight: 1.35, letterSpacing: -0.15 }}>
            {QUOTA_GROUP.description}
          </p>
          <MotionDiv
            animate={{ rotate: screenerOpen ? 180 : 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 300 }}
            className="shrink-0 flex items-center justify-center"
            style={{ width: 22, height: 22, borderRadius: R.sm }}
          >
            <ChevronDown size={12} style={{ color: "rgba(255,255,255,0.25)" }} />
          </MotionDiv>
        </button>

        {/* Collapsible screener criteria */}
        <AnimatePresence initial={false}>
          {screenerOpen && (
            <MotionDiv
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="overflow-hidden"
            >
              <div className="px-3.5 pb-3.5">
                {/* Screener Answers subtitle */}
                <span
                  className="uppercase tracking-[0.08em] text-white/20 block mb-2.5"
                  style={{ fontSize: T.micro, letterSpacing: "0.06em" }}
                >
                  Screener Answers
                </span>
                <div className="flex flex-col gap-2.5">
                  {PERSONA_CRITERIA.map((item, i) => (
                    <MotionDiv
                      key={i}
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.04 * i, type: "spring", damping: 24, stiffness: 260 }}
                      className="flex items-baseline gap-2"
                    >
                      <div
                        className="shrink-0 size-[4px] rounded-full relative top-[-1px]"
                        style={{ background: "rgba(97,95,255,0.45)" }}
                      />
                      <span className="text-white/45" style={{ fontSize: T.caption, lineHeight: 1.38, letterSpacing: -0.08 }}>
                        {item}
                      </span>
                    </MotionDiv>
                  ))}
                </div>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      {/* ── Conversation Analysis — segmented bullet list ── */}
      <div className="px-4 pt-1">
        <ul className="flex flex-col gap-2.5 list-disc pl-[18px]">
          {CONVERSATION_ANALYSIS.map((seg, i) => (
            <MotionLi
              key={seg.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, type: "spring", damping: 24, stiffness: 260 }}
              className="text-white/50"
              style={{ fontSize: T.caption, lineHeight: 1.42 }}
            >
              {seg.status === "analysing" ? (
                <span className="flex items-center gap-1.5 text-white/30">
                  <Loader2 size={10} className="animate-spin" style={{ color: C.accent }} />
                  <span style={{ color: "rgba(255,255,255,0.30)" }}>{seg.text}</span>
                </span>
              ) : (
                <span>{seg.text}</span>
              )}
            </MotionLi>
          ))}
        </ul>
      </div>
    </div>
  );
}