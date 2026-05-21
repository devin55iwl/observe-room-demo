/**
 * RightNav — Vertical tab bar on the right edge.
 *
 * Contains icon buttons for each panel (Participant Profile, Check List,
 * Insights, Transcript). Clicking toggles the corresponding panel.
 * Below the tab buttons, a reset-layout button appears when any panel
 * has been opened or moved.
 *
 * Also shows a pending follow-up badge on the Check List tab when there
 * are un-asked follow-up questions.
 */
import React from "react";
import type { ReactNode, CSSProperties } from "react";
import { motion, AnimatePresence } from "motion/react";
import { RotateCcw, Monitor } from "lucide-react";
import { R, C, T, tipStyle, surfaceStyle } from "./constants";
import { Surface } from "./primitives";
import { Tip } from "./Tip";
import { TABS } from "./data";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

interface RightNavProps {
  openPanels: Set<string>;
  togglePanel: (id: string) => void;
  resetLayout: () => void;
  pendingCount: number;
  rightCount: number;
  analysisOpen: boolean;
  panelsMoved: boolean;
  detachedCount: number;
  surfaceStyle: CSSProperties;
  taskViewOpen: boolean;
  onToggleTaskView: () => void;
}

export function RightNav({
  openPanels, togglePanel, resetLayout,
  pendingCount, rightCount, analysisOpen, panelsMoved,
  detachedCount, surfaceStyle,
  taskViewOpen, onToggleTaskView,
}: RightNavProps) {
  const { mode } = useObserveTheme();
  const isLight = mode === "light";

  const lightTipStyle = {
    backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
    borderRadius: R.sm,
    background: "rgba(255,255,255,0.80)",
    border: "0.5px solid rgba(0,0,0,0.08)",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    color: "rgba(0,0,0,0.60)",
  };

  return (
    <div>
      <Surface className="flex flex-col gap-1 p-1.5">
        {/* ── Regular panel tabs ── */}
        {TABS.filter(tab => tab.id !== "Analysis").map(tab => {
          const isActive = openPanels.has(tab.id);
          const Icon = tab.icon;
          const showBadge = tab.id === "Check List" && !isActive && pendingCount > 0;
          return (
            <button key={tab.id}
              onClick={() => togglePanel(tab.id)}
              className="relative p-3 flex items-center justify-center group cursor-pointer"
              style={{
                borderRadius: R.md,
                background: isActive
                  ? (isLight ? "rgba(0,0,0,0.80)" : C.accent)
                  : "transparent",
                color: isActive
                  ? "white"
                  : (isLight ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.28)"),
                transitionProperty: "background, color",
                transitionDuration: "0.15s",
                transitionTimingFunction: "ease",
              }}
              onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = isLight ? "rgba(0,0,0,0.04)" : "rgba(255,255,255,0.06)"; }}
              onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
              <Icon size={16} />
              {/* Pending follow-ups badge */}
              <AnimatePresence>
                {showBadge && (
                  <MotionDiv
                    initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                    transition={{ type: "spring", damping: 22, stiffness: 340 }}
                    className="absolute flex items-center justify-center"
                    style={{
                      top: 4, right: 4, minWidth: 14, height: 14,
                      borderRadius: 999, background: C.warning,
                      boxShadow: `0 0 6px ${C.warning}60, 0 1px 3px rgba(0,0,0,0.3)`,
                      fontSize: 8, color: "rgba(0,0,0,0.75)", padding: "0 3px", lineHeight: 1,
                    }}
                  >
                    {pendingCount}
                  </MotionDiv>
                )}
              </AnimatePresence>
              {/* Tooltip */}
              <div className="absolute right-full mr-3 px-3 py-2 opacity-0 group-hover:opacity-100 scale-[0.97] group-hover:scale-100 pointer-events-none whitespace-nowrap"
                style={{
                  ...(isLight ? lightTipStyle : tipStyle), fontSize: T.caption,
                  transitionProperty: "opacity, transform",
                  transitionDuration: "0.2s",
                  transitionDelay: "0.25s",
                  transitionTimingFunction: "ease",
                }}>
                <div style={{ fontSize: T.caption, color: isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.80)" }}>{tab.id}</div>
                <div style={{ fontSize: T.micro, color: isLight ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.28)", marginTop: 2 }}>
                  {showBadge ? `${pendingCount} pending follow-up${pendingCount > 1 ? "s" : ""}` : tab.desc}
                </div>
              </div>
            </button>
          );
        })}

        {/* ── Divider ── */}
        <div style={{ height: 0.5, background: isLight ? "rgba(0,0,0,0.07)" : "rgba(255,255,255,0.07)", margin: "2px 4px" }} />

        {/* ── Monitor tab: Participant Screen ── */}
        <div className="relative group/monitor">
          <button
            onClick={onToggleTaskView}
            className="relative p-3 flex items-center justify-center cursor-pointer w-full"
            style={{
              borderRadius: R.md,
              background: taskViewOpen ? "rgba(199,136,68,0.16)" : "transparent",
              color: taskViewOpen ? "rgba(199,136,68,0.90)" : (isLight ? "rgba(0,0,0,0.30)" : "rgba(255,255,255,0.28)"),
              transitionProperty: "background, color",
              transitionDuration: "0.15s",
              transitionTimingFunction: "ease",
            }}
            onMouseEnter={e => {
              if (!taskViewOpen) {
                e.currentTarget.style.background = "rgba(199,136,68,0.08)";
                e.currentTarget.style.color = "rgba(199,136,68,0.65)";
              }
            }}
            onMouseLeave={e => {
              if (!taskViewOpen) {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "rgba(255,255,255,0.28)";
              }
            }}
          >
            <Monitor size={16} />
            {/* Active pulse dot */}
            <AnimatePresence>
              {taskViewOpen && (
                <MotionDiv
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: "spring", damping: 22, stiffness: 340 }}
                  style={{
                    position: "absolute", top: 5, right: 5,
                    width: 6, height: 6, borderRadius: 3,
                    background: "rgba(199,136,68,0.90)",
                    boxShadow: "0 0 5px rgba(199,136,68,0.70)",
                  }}
                />
              )}
            </AnimatePresence>
          </button>

          {/* Tooltip */}
          <div
            className="absolute right-full mr-3 px-3 py-2 opacity-0 group-hover/monitor:opacity-100 scale-[0.97] group-hover/monitor:scale-100 pointer-events-none whitespace-nowrap"
            style={{
              ...tipStyle, fontSize: T.caption,
              transitionProperty: "opacity, transform",
              transitionDuration: "0.2s",
              transitionDelay: "0.25s",
              transitionTimingFunction: "ease",
            }}
          >
            <div className="text-white/80" style={{ fontSize: T.caption }}>
              {taskViewOpen ? "Hide participant screen" : "Participant Screen"}
            </div>
            <div style={{ fontSize: T.micro, color: "rgba(255,255,255,0.28)", marginTop: 2 }}>
              {taskViewOpen ? "Currently visible" : "View current task"}
            </div>
          </div>
        </div>
      </Surface>

      {/* Reset layout button — appears when panels have been opened or moved */}
      <div className="relative">
        <AnimatePresence>
          {(rightCount > 0 || analysisOpen || panelsMoved) && (
            <MotionDiv
              initial={{ opacity: 0, y: -6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.9 }}
              transition={{ type: "spring", damping: 24, stiffness: 300 }}
              className="absolute top-2 left-0 right-0"
            >
              <Tip text={detachedCount > 0 ? "Dock all panels back" : "Reset layout"} align="right">
                <button onClick={resetLayout}
                  className="w-full flex items-center justify-center gap-1.5 p-2.5 cursor-pointer"
                  style={{
                    ...surfaceStyle, color: (panelsMoved || detachedCount > 0) ? C.accent : "rgba(255,255,255,0.28)",
                    transitionProperty: "transform",
                    transitionDuration: "0.15s",
                    transitionTimingFunction: "ease",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <RotateCcw size={13} />
                </button>
              </Tip>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}