/**
 * ActionToast — Real-time behavioral signal notifications.
 *
 * Generates periodic mock events (Hesitation, Strong Reaction, Confusion,
 * Engagement Drop) and displays them as auto-dismissing toast cards.
 * The toast stack is snap-draggable. A persistent handle shows when
 * no active toasts are displayed.
 *
 * Exports:
 *  - useActionEvents() — Hook that generates random events on a timer
 *  - ActionToastStack  — Renders the toast cards with animation
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Pause, Zap, HelpCircle, TrendingDown, GripVertical, Bell, BellOff } from "lucide-react";
import { R, C, T, glass } from "./constants";
import type { PRect, SnapLine } from "./SnapEngine";
import { useSnapDrag } from "./hooks";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

/* ── Action Event Types ── */
export interface ActionEvent {
  id: number;
  icon: React.ElementType;
  label: string;
  detail: string;
  color: string;
  time: string;
}

const ACTION_POOL: Omit<ActionEvent, "id" | "time">[] = [
  { icon: Pause,        label: "Hesitation",       detail: "Participant paused or hesitated — possible uncertainty or internal conflict", color: C.warning },
  { icon: Zap,          label: "Strong Reaction",  detail: "Notable emotional response detected — surprise, frustration, or excitement",   color: C.negative },
  { icon: HelpCircle,   label: "Confusion",        detail: "Signs of confusion observed — furrowed brow, repeated re-reading, or verbal cues", color: "rgba(255,255,255,0.50)" },
  { icon: TrendingDown, label: "Engagement Drop",  detail: "Participant engagement declining — reduced eye contact, shorter responses",    color: C.accent },
];

const TOAST_DURATION = 4000;
const TOAST_STACK_ID = "__toast_stack__";

/* ── Shared style helpers (muted vs active) ── */
const handleColors = (muted: boolean) => ({
  bg:       muted ? "rgba(255,80,80,0.06)"  : "rgba(97,95,255,0.06)",
  border:   muted ? "rgba(255,80,80,0.14)"  : "rgba(97,95,255,0.14)",
  icon:     muted ? "rgba(255,80,80,0.55)"  : "rgba(97,95,255,0.55)",
  badgeBg:  muted ? "rgba(255,80,80,0.06)"  : "rgba(255,255,255,0.04)",
  badgeClr: muted ? "rgba(255,80,80,0.30)"  : "rgba(255,255,255,0.20)",
});

/* ── Hook: Action event generator ── */
export function useActionEvents(enabled: boolean = true) {
  const [events, setEvents] = useState<ActionEvent[]>([]);
  const [history, setHistory] = useState<ActionEvent[]>([]);
  const idRef = useRef(0);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();
  const eventsRef = useRef<ActionEvent[]>([]);
  eventsRef.current = events;

  const dismiss = useCallback((id: number) => {
    const found = eventsRef.current.find(e => e.id === id);
    if (found) setHistory(h => [found, ...h].slice(0, 20));
    setEvents(prev => prev.filter(e => e.id !== id));
  }, []);

  const clearHistory = useCallback(() => setHistory([]), []);

  const addEvent = useCallback((template: Omit<ActionEvent, "id" | "time">) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    const evt: ActionEvent = { ...template, id: idRef.current++, time };
    setEvents(prev => [evt, ...prev].slice(0, 3));
    setTimeout(() => dismiss(evt.id), TOAST_DURATION);
  }, [dismiss]);

  useEffect(() => {
    if (!enabled) { clearTimeout(timerRef.current); return; }

    const makeTimeStr = () => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    };

    const scheduleNext = () => {
      const delay = 6000 + Math.random() * 12000;
      timerRef.current = setTimeout(() => {
        const template = ACTION_POOL[Math.floor(Math.random() * ACTION_POOL.length)];
        const evt: ActionEvent = { ...template, id: idRef.current++, time: makeTimeStr() };
        setEvents(prev => [evt, ...prev].slice(0, 3));
        setTimeout(() => dismiss(evt.id), TOAST_DURATION);
        scheduleNext();
      }, delay);
    };

    const initTimer = setTimeout(() => {
      const template = ACTION_POOL[0];
      const evt: ActionEvent = { ...template, id: idRef.current++, time: makeTimeStr() };
      setEvents([evt]);
      setTimeout(() => dismiss(evt.id), TOAST_DURATION);
      scheduleNext();
    }, 3000);

    return () => { clearTimeout(initTimer); clearTimeout(timerRef.current); };
  }, [dismiss, enabled]);

  return { events, dismiss, history, clearHistory, addEvent };
}

/* ── Toast Stack Component ── */
export function ActionToastStack({
  events,
  onDismiss,
  panelRectsRef,
  onSnapLines,
  notificationsOn,
  onToggleNotifications,
}: {
  events: ActionEvent[];
  onDismiss: (id: number) => void;
  panelRectsRef?: React.MutableRefObject<Record<string, PRect>>;
  onSnapLines?: (lines: SnapLine[]) => void;
  notificationsOn?: boolean;
  onToggleNotifications?: () => void;
}) {
  const snap = useSnapDrag(TOAST_STACK_ID, panelRectsRef, onSnapLines);
  const muted = notificationsOn === false;
  let themeData: any = null;
  try { themeData = useObserveTheme(); } catch {}
  const isLight = themeData?.mode === "light";
  const ot = themeData?.tokens;

  const clr = {
    bg:       muted ? "rgba(255,80,80,0.06)"  : (isLight ? "rgba(0,0,0,0.04)" : "rgba(97,95,255,0.06)"),
    border:   muted ? "rgba(255,80,80,0.14)"  : (isLight ? "rgba(0,0,0,0.08)" : "rgba(97,95,255,0.14)"),
    icon:     muted ? "rgba(255,80,80,0.55)"  : (isLight ? "rgba(0,0,0,0.45)" : "rgba(97,95,255,0.55)"),
    badgeBg:  muted ? "rgba(255,80,80,0.06)"  : (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"),
    badgeClr: muted ? "rgba(255,80,80,0.30)"  : (isLight ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.20)"),
  };

  const toggleNotif = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleNotifications?.();
  }, [onToggleNotifications]);

  const BellIcon = muted ? BellOff : Bell;

  return (
    <MotionDiv
      ref={snap.containerRef}
      style={{ maxWidth: 320, touchAction: "none", display: "flex", flexDirection: "column-reverse", gap: 8, x: snap.x, y: snap.y }}
      onPointerDown={snap.onPointerDown}
      onPointerMove={snap.onPointerMove}
      onPointerUp={snap.onPointerUp}
    >
      {/* ── Toast cards (first in DOM = bottom visually with col-reverse) ── */}
      <AnimatePresence>
        {events.map((evt) => {
          const Icon = evt.icon;
          return (
            <MotionDiv
              key={evt.id}
              layout
              initial={{ opacity: 0, y: 10, scale: 0.96, filter: "blur(6px)" }}
              animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: 6, scale: 0.97, filter: "blur(3px)" }}
              transition={{
                type: "spring", damping: 30, stiffness: 240, mass: 0.8,
                filter: { duration: 0.25 },
              }}
              style={{ cursor: "pointer", pointerEvents: "auto" }}
              onClick={() => { if (!snap.didDrag.current) onDismiss(evt.id); }}
            >
              <div
                style={{
                  ...(isLight ? {
                    backdropFilter: "blur(40px) saturate(130%)",
                    WebkitBackdropFilter: "blur(40px) saturate(130%)",
                  } : glass),
                  display: "flex", alignItems: "flex-start", gap: 12,
                  padding: "12px 16px", position: "relative", overflow: "hidden",
                  borderRadius: R.md,
                  background: isLight ? "rgba(255,255,255,0.80)" : "rgba(10,12,18,0.55)",
                  borderWidth: 0.5, borderStyle: "solid",
                  borderColor: isLight ? "rgba(255,255,255,0.70)" : "rgba(255,255,255,0.10)",
                  boxShadow: isLight
                    ? "0 2px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.70)"
                    : "inset 0 0.5px 0 rgba(255,255,255,0.06), 0 8px 24px rgba(0,0,0,0.30), 0 0 0 0.5px rgba(255,255,255,0.03)",
                }}
              >
                {/* Icon ring */}
                <div
                  style={{
                    flexShrink: 0, marginTop: 2, width: 28, height: 28,
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                    background: `${evt.color}15`,
                    borderWidth: 0.5, borderStyle: "solid", borderColor: `${evt.color}30`,
                  }}
                >
                  <Icon size={13} style={{ color: evt.color }} />
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: T.caption, color: isLight ? "rgba(0,0,0,0.80)" : "rgba(255,255,255,0.80)" }}>{evt.label}</span>
                    <span style={{ fontSize: T.micro, color: isLight ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.14)", fontFamily: "monospace" }}>{evt.time}</span>
                  </div>
                  <p style={{ fontSize: T.micro, color: isLight ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)", lineHeight: 1.4, margin: "2px 0 0" }}>{evt.detail}</p>
                </div>

                {/* Progress bar (auto-dismiss indicator) */}
                <MotionDiv
                  style={{
                    position: "absolute", bottom: 0, left: 12, right: 12,
                    height: 1.5, borderRadius: 9999, originX: 0,
                    background: evt.color, opacity: 0.25,
                  }}
                  initial={{ scaleX: 1 }}
                  animate={{ scaleX: 0 }}
                  transition={{ duration: TOAST_DURATION / 1000, ease: "linear" }}
                />
              </div>
            </MotionDiv>
          );
        })}
      </AnimatePresence>

      {/* ── Persistent handle (visible when no active toasts) ── */}
      {events.length === 0 && (
        <div
          style={{
            alignSelf: "flex-end",
            display: "flex", alignItems: "center", gap: 8,
            padding: "7px 12px",
            borderRadius: R.md,
            background: clr.bg,
            borderWidth: 0.5, borderStyle: "solid", borderColor: clr.border,
            boxShadow: isLight
              ? "0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.50)"
              : "0 2px 8px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
            cursor: "grab",
          }}
        >
          <GripVertical size={12} style={{ color: isLight ? "rgba(0,0,0,0.20)" : "rgba(255,255,255,0.30)" }} />
          <BellIcon
            size={11}
            style={{ color: clr.icon, cursor: "pointer" }}
            onClick={toggleNotif}
          />
          <span
            style={{ fontSize: T.micro, color: isLight ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.45)", cursor: "pointer" }}
            onClick={toggleNotif}
          >
            {muted ? "Muted" : "Signals"}
          </span>
          <span
            style={{
              fontSize: 7,
              background: clr.badgeBg,
              color: clr.badgeClr,
              borderWidth: 0.5, borderStyle: "solid",
              borderColor: isLight ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)",
              borderRadius: 4, padding: "1px 6px", marginLeft: 2, cursor: "pointer",
              fontFamily: "monospace",
            }}
            onClick={toggleNotif}
          >
            {muted ? "Off" : "0"}
          </span>
        </div>
      )}
    </MotionDiv>
  );
}