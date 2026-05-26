/**
 * ControlBar — Bottom-center media controls strip.
 *
 * Contains:
 *  - Mic toggle (disabled in observer mode) and camera preview toggle
 *  - Screen share toggle (disabled in observer mode)
 *  - Volume control with vertical slider popup
 *  - Brightness control with vertical slider popup
 *  - "Leave Room" button
 *
 * All controls wrapped in a glass Surface container.
 */
import React, { useState, useRef, useCallback } from "react";
import type { ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

import {
  Mic, MicOff, Video as VideoIcon, VideoOff, Share, Volume2, VolumeOff,
  LogOut, Sun, Bell, BellOff,
} from "lucide-react";
import { R, C, T, glass, tipStyle } from "./constants";
import { Surface } from "./primitives";
import { useObserveTheme } from "./observe-room/ObserveThemeContext";

/* ── Control Button ── */
function CtrlBtn({ on, onClick, iconOn, iconOff, danger, highlight, tip, disabled }: {
  on: boolean; onClick: () => void; iconOn: ReactNode; iconOff: ReactNode;
  danger?: boolean; highlight?: boolean; tip?: string; disabled?: boolean;
}) {
  let themeTokens: any = null;
  try { themeTokens = useObserveTheme(); } catch {}
  const isLight = themeTokens?.mode === "light";

  return (
    <div className="relative group/ctrl">
      <button onClick={disabled ? undefined : onClick} className={`p-3 transition-colors ${disabled ? "cursor-not-allowed opacity-35" : "cursor-pointer hover:brightness-110"}`}
        style={{
          background: disabled
            ? (isLight ? "rgba(0,0,0,0.02)" : "rgba(255,255,255,0.02)")
            : danger ? (isLight ? "#ef4444" : C.negative) : highlight ? (isLight ? "rgba(0,0,0,0.80)" : C.accent) : (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)"),
          color: disabled
            ? (isLight ? "rgba(0,0,0,0.15)" : "rgba(255,255,255,0.18)")
            : danger || highlight ? (isLight ? "white" : "rgba(255,255,255,0.95)") : (isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.50)"),
          borderRadius: R.md,
        }}>
        {on ? iconOn : iconOff}
      </button>
      {tip && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1.5
          opacity-0 scale-[0.97] group-hover/ctrl:opacity-100 group-hover/ctrl:scale-100
          transition-all duration-200 delay-300 pointer-events-none z-[60] whitespace-nowrap"
          style={{
            ...(isLight ? {
              backdropFilter: "blur(40px)", WebkitBackdropFilter: "blur(40px)",
              borderRadius: R.sm,
              background: "rgba(255,255,255,0.80)",
              border: "0.5px solid rgba(0,0,0,0.08)",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              color: "rgba(0,0,0,0.60)",
            } : tipStyle),
            fontSize: T.micro,
          }}>
          {tip}
        </div>
      )}
    </div>
  );
}

/* ── Volume Control with Popup ── */
function VolumeControl({ isSpeakerOn, onToggle, volume, onVolumeChange }: {
  isSpeakerOn: boolean; onToggle: () => void; volume: number; onVolumeChange: (v: number) => void;
}) {
  const [showPopup, setShowPopup] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowPopup(true);
  }, []);

  const handleLeave = useCallback(() => {
    hideTimeout.current = setTimeout(() => setShowPopup(false), 200);
  }, []);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onVolumeChange(Number(e.target.value));
  }, [onVolumeChange]);

  const displayVol = isSpeakerOn ? volume : 0;

  return (
    <div className="relative" ref={containerRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button onClick={onToggle} className="p-3 cursor-pointer transition-colors hover:brightness-110"
        style={{
          background: !isSpeakerOn ? C.negative : "rgba(255,255,255,0.04)",
          color: !isSpeakerOn ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.50)",
          borderRadius: R.md,
        }}>
        {isSpeakerOn ? <Volume2 size={17} /> : <VolumeOff size={17} />}
      </button>

      <AnimatePresence>
        {showPopup && (
          <MotionDiv
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[70]"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <div className="flex flex-col items-center gap-2.5 px-3 py-4" style={{
              ...glass,
              borderRadius: R.lg,
              background: "rgba(18,20,28,0.85)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 40px rgba(0,0,0,0.50)",
              width: 48,
            }}>
              <span className="text-white/50 font-mono tabular-nums" style={{ fontSize: T.micro }}>
                {displayVol}
              </span>

              <div className="relative flex items-center justify-center" style={{ height: 120, width: 20 }}>
                <div className="absolute rounded-full" style={{
                  width: 4, height: 120,
                  background: "rgba(255,255,255,0.06)",
                }} />
                <div className="absolute bottom-0 rounded-full" style={{
                  width: 4, height: `${displayVol}%`,
                  background: !isSpeakerOn ? "rgba(255,255,255,0.12)" : C.accent,
                  transition: "height 0.15s ease",
                }} />
                <input
                  type="range" min={0} max={100} value={displayVol}
                  onChange={handleSliderChange}
                  className="volume-slider-vertical"
                  style={{
                    position: "absolute",
                    width: 120, height: 20,
                    transform: "rotate(-90deg)",
                    transformOrigin: "center center",
                    opacity: 0, cursor: "pointer", margin: 0,
                  }}
                />
                <div className="absolute" style={{
                  bottom: `calc(${displayVol}% - 6px)`,
                  width: 12, height: 12,
                  borderRadius: "50%",
                  background: !isSpeakerOn ? "rgba(255,255,255,0.30)" : C.accent,
                  boxShadow: `0 0 0 2px rgba(0,0,0,0.30), 0 0 8px ${!isSpeakerOn ? "transparent" : "rgba(97,95,255,0.40)"}`,
                  transition: "bottom 0.15s ease, background 0.15s ease",
                  pointerEvents: "none",
                }} />
              </div>

              <button onClick={onToggle} className="cursor-pointer transition-colors" style={{
                color: !isSpeakerOn ? C.negative : "rgba(255,255,255,0.40)",
              }}>
                {isSpeakerOn ? <Volume2 size={13} /> : <VolumeOff size={13} />}
              </button>
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Brightness Control with Popup ── */
function BrightnessControl() {
  const [brightness, setBrightness] = useState(75);
  const [showPopup, setShowPopup] = useState(false);
  const hideTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleEnter = useCallback(() => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setShowPopup(true);
  }, []);

  const handleLeave = useCallback(() => {
    hideTimeout.current = setTimeout(() => setShowPopup(false), 200);
  }, []);

  const handleSliderChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setBrightness(Number(e.target.value));
  }, []);

  const sunColor = brightness >= 50
    ? `rgba(255,209,102,${0.4 + (brightness / 100) * 0.55})`
    : "rgba(255,255,255,0.35)";

  return (
    <div className="relative" ref={containerRef} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
      <button className="p-3 cursor-pointer transition-colors hover:brightness-110"
        style={{
          background: showPopup ? "rgba(255,209,102,0.08)" : "rgba(255,255,255,0.04)",
          color: sunColor,
          borderRadius: R.md,
        }}>
        <Sun size={17} />
      </button>

      <AnimatePresence>
        {showPopup && (
          <MotionDiv
            initial={{ opacity: 0, y: 6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-[70]"
            onMouseEnter={handleEnter}
            onMouseLeave={handleLeave}
          >
            <div className="flex flex-col items-center gap-2.5 px-3 py-4" style={{
              ...glass,
              borderRadius: R.lg,
              background: "rgba(18,20,28,0.85)",
              border: "1px solid rgba(255,255,255,0.14)",
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.08), 0 12px 40px rgba(0,0,0,0.50)",
              width: 48,
            }}>
              <span className="text-white/50 font-mono tabular-nums" style={{ fontSize: T.micro }}>
                {brightness}
              </span>

              <div className="relative flex items-center justify-center" style={{ height: 120, width: 20 }}>
                <div className="absolute rounded-full" style={{
                  width: 4, height: 120,
                  background: "rgba(255,255,255,0.06)",
                }} />
                <div className="absolute bottom-0 rounded-full" style={{
                  width: 4, height: `${brightness}%`,
                  background: `rgba(255,209,102,${0.35 + (brightness / 100) * 0.55})`,
                  transition: "height 0.15s ease",
                }} />
                <input
                  type="range" min={10} max={100} value={brightness}
                  onChange={handleSliderChange}
                  className="volume-slider-vertical"
                  style={{
                    position: "absolute",
                    width: 120, height: 20,
                    transform: "rotate(-90deg)",
                    transformOrigin: "center center",
                    opacity: 0, cursor: "pointer", margin: 0,
                  }}
                />
                <div className="absolute" style={{
                  bottom: `calc(${brightness}% - 6px)`,
                  width: 12, height: 12,
                  borderRadius: "50%",
                  background: `rgba(255,209,102,${0.5 + (brightness / 100) * 0.45})`,
                  boxShadow: `0 0 0 2px rgba(0,0,0,0.30), 0 0 8px rgba(255,209,102,0.30)`,
                  transition: "bottom 0.15s ease, background 0.15s ease",
                  pointerEvents: "none",
                }} />
              </div>

              <Sun size={13} style={{ color: sunColor }} />
            </div>
          </MotionDiv>
        )}
      </AnimatePresence>

      {/* Tooltip (only when popup is closed) */}
      {!showPopup && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1.5
          opacity-0 scale-[0.97] group-hover/bright:opacity-100 group-hover/bright:scale-100
          transition-all duration-200 delay-300 pointer-events-none z-[60] whitespace-nowrap"
          style={{ ...tipStyle, fontSize: T.micro }}>
          Brightness
        </div>
      )}
    </div>
  );
}

/* ── Control Bar (exported) ── */
/* eslint-disable react-hooks/rules-of-hooks */
export function ControlBar({
  isMicOn, setIsMicOn,
  isVideoOn, setIsVideoOn,
  isScreenSharing, setIsScreenSharing,
  isSpeakerOn, setIsSpeakerOn,
  volume, setVolume,
  analysisOpen, toggleAnalysis,
  notificationsOn, onToggleNotifications,
}: {
  isMicOn: boolean; setIsMicOn: (v: boolean) => void;
  isVideoOn: boolean; setIsVideoOn: (v: boolean) => void;
  isScreenSharing: boolean; setIsScreenSharing: (v: boolean) => void;
  isSpeakerOn: boolean; setIsSpeakerOn: (v: boolean) => void;
  volume: number; setVolume: (v: number) => void;
  analysisOpen: boolean; toggleAnalysis: () => void;
  notificationsOn: boolean; onToggleNotifications: () => void;
}) {
  let themeTokens: any = null;
  try { themeTokens = useObserveTheme(); } catch {}
  const isLight = themeTokens?.mode === "light";
  const divCls = isLight ? "w-px h-6 mx-0.5 bg-black/[0.06]" : "w-px h-6 mx-0.5 bg-white/[0.06]";
  const handleLeaveRoom = useCallback(() => {
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "cookiy-observe-room-leave" }, "https://cookiy-ai-portfolio-demo.vercel.app");
      return;
    }

    if (document.referrer) {
      window.location.href = document.referrer;
      return;
    }

    window.history.back();
  }, []);

  return (
    <Surface className="flex items-center gap-1 px-2 py-1.5">
      <CtrlBtn on={isMicOn} onClick={() => setIsMicOn(!isMicOn)}
        iconOn={<Mic size={17} />} iconOff={<MicOff size={17} />}
        disabled tip="AI Moderator controls the microphone" />
      <CtrlBtn on={isVideoOn} onClick={() => setIsVideoOn(!isVideoOn)}
        iconOn={<VideoIcon size={17} />} iconOff={<VideoOff size={17} />}
        tip={isVideoOn ? "Turn camera preview off" : "Turn camera preview on"} />
      <div className={divCls} />
      <CtrlBtn on={!isScreenSharing} onClick={() => setIsScreenSharing(!isScreenSharing)}
        iconOn={<Share size={17} />} iconOff={<Share size={17} />}
        disabled tip="Screen share is managed by AI Moderator" />

      <VolumeControl isSpeakerOn={isSpeakerOn} onToggle={() => setIsSpeakerOn(!isSpeakerOn)}
        volume={volume} onVolumeChange={setVolume} />
      <BrightnessControl />

      <div className={divCls} />

      {/* ── Bell: toggle real-time notifications ── */}
      <div className="relative group/bell">
        <button
          onClick={onToggleNotifications}
          className="p-3 cursor-pointer hover:brightness-110"
          style={{
            background: notificationsOn
              ? (isLight ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.04)")
              : "rgba(255,128,128,0.08)",
            color: notificationsOn
              ? (isLight ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.50)")
              : (isLight ? "#ef4444" : C.negative),
            borderRadius: R.md,
            transitionProperty: "background, color",
            transitionDuration: "0.18s",
            transitionTimingFunction: "ease",
            position: "relative",
          }}
        >
          {notificationsOn ? <Bell size={17} /> : <BellOff size={17} />}

          {/* Strike-through line when muted */}
          <AnimatePresence>
            {!notificationsOn && (
              <MotionDiv
                key="bell-strike"
                initial={{ scaleX: 0, opacity: 0 }}
                animate={{ scaleX: 1, opacity: 1 }}
                exit={{ scaleX: 0, opacity: 0 }}
                transition={{ duration: 0.16, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  pointerEvents: "none",
                }}
              />
            )}
          </AnimatePresence>
        </button>

        {/* Tooltip */}
        <div
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1.5
            opacity-0 scale-[0.97] group-hover/bell:opacity-100 group-hover/bell:scale-100
            pointer-events-none z-[60] whitespace-nowrap"
          style={{
            ...tipStyle, fontSize: T.micro,
            transitionProperty: "opacity, transform",
            transitionDuration: "0.2s",
            transitionDelay: "0.3s",
            transitionTimingFunction: "ease",
          }}
        >
          {notificationsOn ? "Mute notifications" : "Unmute notifications"}
        </div>
      </div>

      <div className={divCls} />
      <div className="relative group/leave">
        <button
          onClick={handleLeaveRoom}
          className="flex items-center gap-2 px-3.5 py-3 cursor-pointer transition-colors hover:brightness-110"
          style={{
            background: "rgba(255,128,128,0.08)",
            borderRadius: R.md,
            color: C.negative,
            border: "0.5px solid rgba(255,128,128,0.12)",
          }}>
          <LogOut size={17} />
          <span style={{ fontSize: T.caption }}>Leave</span>
        </button>
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2.5 px-2.5 py-1.5
          opacity-0 scale-[0.97] group-hover/leave:opacity-100 group-hover/leave:scale-100
          transition-all duration-200 delay-300 pointer-events-none z-[60] whitespace-nowrap"
          style={{ ...tipStyle, fontSize: T.micro }}>
          Leave without ending
        </div>
      </div>
    </Surface>
  );
}
