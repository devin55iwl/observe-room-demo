/**
 * DiscardModal — Session quality-termination confirmation dialog.
 *
 * Allows the observer to discard the current session with a mandatory
 * reason selection. Shows a radio-button list of predefined reasons
 * and a "Discard Session" confirmation button.
 *
 * Overlays with a blurred backdrop. Closes on outside click or Cancel.
 */
import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";
import { R, C, T, surfaceStyle } from "./constants";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

/** Predefined discard reasons */
const DISCARD_REASONS = [
  "Low quality responses",
  "Duplicate session",
  "Wrong participant profile",
  "Technical issues during session",
  "Other",
];

interface DiscardModalProps {
  open: boolean;
  onClose: () => void;
  reason: string | null;
  onReasonChange: (reason: string) => void;
  onConfirm: () => void;
  discarded: boolean;
}

export function DiscardModal({ open, onClose, reason, onReasonChange, onConfirm, discarded }: DiscardModalProps) {
  let themeData: any = null;
  try { themeData = useObserveTheme(); } catch {}
  const isLight = themeData?.mode === "light";
  const ot = themeData?.tokens;

  return (
    <AnimatePresence>
      {open && (
        <MotionDiv
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
          style={{
            background: isLight ? "rgba(0,0,0,0.20)" : "rgba(0,0,0,0.55)",
            backdropFilter: "blur(8px)",
          }}
          onClick={onClose}
        >
          <MotionDiv
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", damping: 28, stiffness: 320 }}
            onClick={e => e.stopPropagation()}
            className="relative flex flex-col"
            style={{
              width: 420,
              ...(isLight ? {
                backdropFilter: "blur(40px) saturate(130%)",
                WebkitBackdropFilter: "blur(40px) saturate(130%)",
                borderRadius: 24,
                background: "rgba(255,255,255,0.85)",
                borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.70)",
                boxShadow: "0 8px 40px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.60)",
              } : {
                ...surfaceStyle,
                background: "rgba(22,24,32,0.92)",
                borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,255,255,0.12)",
              }),
              padding: 0, overflow: "hidden",
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-0">
              <div className="flex items-center justify-center size-8 rounded-full shrink-0"
                style={{ background: "rgba(255,128,128,0.10)" }}>
                <AlertTriangle size={16} style={{ color: C.negative }} />
              </div>
              <span className={isLight ? "text-black/80" : "text-white/90"} style={{ fontSize: T.title, letterSpacing: -0.3 }}>
                Discard #9527
              </span>
            </div>

            {/* Body */}
            <div className="px-6 pt-4 pb-2">
              <p style={{ fontSize: T.body, lineHeight: 1.6, color: isLight ? "rgba(0,0,0,0.55)" : "rgba(255,255,255,0.55)" }}>
                This will change the session status to{" "}
                <span className={isLight ? "text-black/80" : "text-white/90"}>Not Qualify</span>.
              </p>
              <p className="mt-1.5" style={{ fontSize: T.body, lineHeight: 1.6, color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}>
                The respondent will not receive payment if recruited via Cint or similar platforms.
              </p>
            </div>

            {/* Reason selection */}
            <div className="px-6 pt-4 pb-4">
              <div style={{ fontSize: T.micro, color: isLight ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.30)", textTransform: "uppercase", letterSpacing: "0.12em", marginBottom: 12 }}>
                Reason
              </div>
              <div className="flex flex-col gap-0.5">
                {DISCARD_REASONS.map(r => {
                  const selected = reason === r;
                  return (
                    <button key={r} onClick={() => onReasonChange(r)}
                      className="flex items-center gap-3 px-3 py-2.5 cursor-pointer transition-colors text-left"
                      style={{ borderRadius: R.sm, background: selected ? (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)") : "transparent" }}>
                      <div className="size-[18px] rounded-full shrink-0 flex items-center justify-center transition-all"
                        style={{ border: `1.5px solid ${selected ? C.negative : (isLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.14)")}`, background: selected ? "rgba(255,128,128,0.08)" : "transparent" }}>
                        <AnimatePresence>
                          {selected && (
                            <MotionDiv
                              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                              transition={{ type: "spring", damping: 20, stiffness: 400 }}
                              className="size-2 rounded-full" style={{ background: C.negative }} />
                          )}
                        </AnimatePresence>
                      </div>
                      <span style={{ fontSize: T.body, color: selected ? (isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.80)") : (isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.50)") }}>
                        {r}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div style={{ height: 0.5, background: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)" }} />

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4">
              <button onClick={onClose}
                className="px-4 py-2 cursor-pointer transition-colors"
                style={{ borderRadius: R.sm, fontSize: T.body, color: isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.50)" }}>
                Cancel
              </button>
              <button onClick={onConfirm} disabled={!reason}
                className="px-5 py-2 cursor-pointer transition-all"
                style={{
                  borderRadius: R.sm, fontSize: T.body,
                  background: reason ? C.negative : (isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)"),
                  color: reason ? "white" : (isLight ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.20)"),
                  opacity: reason ? 1 : 0.6,
                  boxShadow: reason ? "0 2px 12px rgba(255,128,128,0.25)" : "none",
                }}>
                {discarded ? "Discarded" : "Discard Session"}
              </button>
            </div>
          </MotionDiv>
        </MotionDiv>
      )}
    </AnimatePresence>
  );
}