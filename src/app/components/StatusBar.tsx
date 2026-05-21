/**
 * StatusBar — Top-left session info strip.
 *
 * Displays:
 *  - Room name & research project title
 *  - Live recording indicator (pulsing red dot)
 *  - Elapsed session timer (HH:MM)
 */
import React, { useState } from "react";
import { R, C, T, G } from "./constants";
import { Surface } from "./primitives";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

interface StatusBarProps {
  clock: string;
}

export function StatusBar({ clock }: StatusBarProps) {
  const projectName = "AI AI AI aaananan Tools Research";
  const [showTooltip, setShowTooltip] = useState(false);
  const { mode } = useObserveTheme();
  const isLight = mode === "light";

  return (
    <Surface className="px-4 py-2.5 flex items-center gap-0">
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className="min-w-0">
          <div className={`${isLight ? "text-black/80" : "text-white/90"} truncate`} style={{ fontSize: 15 }}>Observe Room #9527</div>
          <div className="flex items-center gap-1.5" style={{ marginTop: 1 }}>
            <span
              className={`${isLight ? "text-black/40" : "text-white/40"} truncate relative cursor-default`}
              style={{ fontSize: T.micro, maxWidth: 200 }}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              {projectName}
              {showTooltip && (
                <span
                  className="absolute left-0 whitespace-nowrap pointer-events-none z-50"
                  style={{
                    top: "calc(100% + 6px)",
                    fontSize: T.micro,
                    color: isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.85)",
                    background: isLight ? "rgba(255,255,255,0.92)" : "rgba(20,20,25,0.92)",
                    backdropFilter: "blur(12px)",
                    border: isLight ? "0.5px solid rgba(0,0,0,0.08)" : "0.5px solid rgba(255,255,255,0.12)",
                    borderRadius: 6,
                    padding: "4px 8px",
                    boxShadow: isLight ? "0 4px 12px rgba(0,0,0,0.08)" : "0 4px 12px rgba(0,0,0,0.4)",
                  }}
                >
                  {projectName}
                </span>
              )}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: "50%", background: isLight ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.15)", flexShrink: 0, display: "inline-block" }} />
            <span style={{
              fontSize: T.micro,
              color: isLight ? "rgba(0,0,0,0.50)" : "rgba(97,95,255,0.70)",
              background: isLight ? "rgba(0,0,0,0.04)" : "rgba(97,95,255,0.10)",
              borderWidth: 0.5, borderStyle: "solid",
              borderColor: isLight ? "rgba(0,0,0,0.10)" : "rgba(97,95,255,0.20)",
              borderRadius: 4,
              padding: "0px 5px",
              letterSpacing: "0.03em",
              whiteSpace: "nowrap",
            }}>
              Research Ops
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0 pl-3 ml-3"
        style={{ borderLeft: isLight ? "0.5px solid rgba(0,0,0,0.06)" : "0.5px solid rgba(255,255,255,0.06)" }}>
        <div className="flex items-center gap-1.5 px-2 py-1"
          style={{ borderRadius: R.pill, background: "rgba(255,128,128,0.08)", border: "0.5px solid rgba(255,128,128,0.12)" }}>
          <div className="size-1.5 rounded-full animate-pulse" style={{ background: isLight ? "#ef4444" : C.negative }} />
          <span className={`${isLight ? "text-black/40" : "text-white/50"} uppercase tracking-[0.1em]`} style={{ fontSize: T.micro }}>Rec</span>
        </div>
        <span className={`${isLight ? "text-black/50" : "text-white/50"} font-mono tabular-nums`} style={{ fontSize: T.body }}>{clock}</span>
      </div>
    </Surface>
  );
}
