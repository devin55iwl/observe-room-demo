/**
 * SetupStep — Combined Study Brief + Permissions (single page)
 *
 * Upper half: research overview + stats
 * Lower half: device permissions
 * One-click flow: Allow & Continue
 */
import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Camera, Mic, Check, Clock, MessageSquare, Monitor } from "lucide-react";
import { PrimaryBtn, Divider, SF, MONO, useParticipantTheme, useIsMobile } from "./FunnelShell";
import imgFace from "figma:asset/fa0d16c39081a2c44765b4fd4bdd1d40747ed8e5.png";

const MotionDiv = motion.div;

interface Props { onNext: () => void; }

export function SetupStep({ onNext }: Props) {
  const { tokens: t, mode } = useParticipantTheme();
  const isMobile = useIsMobile();
  const [granted, setGranted] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const isDark = mode === "dark";

  useEffect(() => {
    if (!granted) return;
    const id = setInterval(() => setMicLevel(0.20 + Math.random() * 0.80), 110);
    return () => clearInterval(id);
  }, [granted]);

  const STATS = [
    { Icon: Clock, value: "~20 min", label: "Duration" },
    { Icon: MessageSquare, value: "4 Qs", label: "AI-guided" },
    { Icon: Monitor, value: "1 segment", label: "Screen share" },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", scrollbarWidth: "thin" as const }}>

        {/* ── Study overview ── */}
        <div style={{ padding: "28px 28px 0" }}>
          <div style={{
            fontSize: 10, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID,
            letterSpacing: "0.18em", textTransform: "uppercase" as const, marginBottom: 12,
          }}>Research Study</div>
          <div style={{
            fontSize: 26, fontFamily: SF, fontWeight: 700, color: t.INK1,
            letterSpacing: "-0.03em", lineHeight: 1.18, marginBottom: 8,
          }}>
            AI Tools in Design<br />Workflows
          </div>
          <div style={{ fontSize: 13, fontFamily: SF, color: t.INK3, lineHeight: 1.60 }}>
            How teams adopt AI-powered tools across product & design.
          </div>
        </div>

        {/* Stats row */}
        <div style={{ display: "flex", padding: "20px 28px 16px" }}>
          {STATS.map(({ Icon, value, label }, i) => (
            <div key={label} style={{ display: "flex", flex: 1, alignItems: "center" }}>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <Icon size={14} color={t.AMBER_SOLID} style={{ marginBottom: 2 }} />
                <div style={{ fontSize: 15, fontFamily: SF, fontWeight: 600, color: t.INK1 }}>{value}</div>
                <div style={{ fontSize: 10, fontFamily: SF, color: t.INK3, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{label}</div>
              </div>
              {i < 2 && <div style={{ width: 1, background: t.STR2, alignSelf: "stretch", margin: "2px 0" }} />}
            </div>
          ))}
        </div>

        <Divider />

        {/* ── Permissions ── */}
        <div style={{ padding: "18px 28px 12px" }}>
          <div style={{
            fontSize: 10, fontFamily: SF, fontWeight: 600, color: t.INK3,
            letterSpacing: "0.14em", textTransform: "uppercase" as const, marginBottom: 14,
          }}>Device Setup</div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            {[
              { Icon: Camera, label: "Camera" },
              { Icon: Mic, label: "Microphone" },
            ].map(({ Icon, label }) => (
              <div key={label} style={{
                padding: "16px 14px", borderRadius: 14,
                background: granted ? t.GREEN_BG : `rgba(${t.ARGB}, 0.04)`,
                boxShadow: granted
                  ? `inset 0 0 0 1px ${t.GREEN_STR}`
                  : `inset 0 0 0 1px rgba(${t.ARGB}, 0.10)`,
                display: "flex", alignItems: "center", gap: 10,
                transition: "background 0.3s ease, box-shadow 0.3s ease",
              }}>
                <div style={{
                  width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                  background: granted ? `${t.GREEN_BG}` : `rgba(${t.ARGB}, 0.06)`,
                  boxShadow: granted
                    ? `inset 0 0 0 1px ${t.GREEN_STR}`
                    : `inset 0 0 0 1px rgba(${t.ARGB}, 0.14)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {granted
                    ? <Check size={14} color={t.GREEN_TEXT} strokeWidth={2.5} />
                    : <Icon size={14} color={t.AMBER_SOLID} />
                  }
                </div>
                <div>
                  <div style={{ fontSize: 13, fontFamily: SF, fontWeight: 600, color: granted ? t.GREEN_TEXT : t.INK1 }}>{label}</div>
                  <div style={{ fontSize: 10.5, fontFamily: SF, color: granted ? t.GREEN_TEXT : t.INK4, marginTop: 2 }}>
                    {granted ? "Connected" : "Required"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Camera preview + mic level — appears after grant */}
          <AnimatePresence>
            {granted && (
              <MotionDiv
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.32, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
                  {/* Camera thumbnail */}
                  <div style={{
                    width: 96, height: 72, borderRadius: 10, overflow: "hidden", flexShrink: 0,
                    position: "relative",
                    boxShadow: `inset 0 0 0 1px ${t.STR2}`,
                  }}>
                    <img src={imgFace} alt="Camera preview" style={{
                      width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 18%",
                      filter: "saturate(0.88) brightness(0.95)", transform: "scaleX(-1)",
                    }} />
                    <div style={{
                      position: "absolute", top: 5, left: 5,
                      display: "flex", alignItems: "center", gap: 3,
                      padding: "2px 6px", borderRadius: 9999,
                      background: isDark ? "rgba(0,0,0,0.50)" : "rgba(255,255,255,0.88)",
                      backdropFilter: "blur(6px)",
                    }}>
                      <MotionDiv animate={{ opacity: [1, 0.20, 1] }} transition={{ duration: 1.6, repeat: Infinity }}
                        style={{ width: 4, height: 4, borderRadius: "50%", background: t.GREEN }} />
                      <span style={{ fontSize: 8, fontFamily: SF, color: t.GREEN_TEXT, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" as const }}>Live</span>
                    </div>
                  </div>

                  {/* Mic level */}
                  <div style={{
                    flex: 1, padding: "12px 14px", borderRadius: 10,
                    background: t.SURF1, boxShadow: `inset 0 0 0 1px ${t.STR2}`,
                    display: "flex", flexDirection: "column", justifyContent: "center", gap: 8,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <Mic size={11} color={t.AMBER_SOLID} />
                      <span style={{ fontSize: 10.5, fontFamily: SF, color: t.INK2 }}>Input level</span>
                    </div>
                    <div style={{ height: 3, borderRadius: 9999, background: t.STR2, overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 9999,
                        width: `${micLevel * 100}%`,
                        background: `linear-gradient(90deg, rgba(${t.ARGB},0.60), rgba(${t.ARGB},0.28))`,
                        transition: "width 0.09s ease",
                      }} />
                    </div>
                  </div>
                </div>
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div style={{ padding: "8px 28px 12px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <MotionDiv animate={{ opacity: [1, 0.20, 1] }} transition={{ duration: 1.80, repeat: Infinity }}>
              <div style={{ width: 5, height: 5, borderRadius: "50%", background: t.GREEN }} />
            </MotionDiv>
            <span style={{ fontSize: 11, fontFamily: SF, color: t.INK3 }}>Ethically approved</span>
          </div>
          <span style={{ fontSize: 9.5, fontFamily: MONO, color: t.INK4, letterSpacing: "0.04em" }}>IRB-2024-0419</span>
        </div>
      </div>

      {/* Fixed bottom CTA */}
      <div style={{
        flexShrink: 0, padding: isMobile ? "12px 20px 54px" : "12px 28px 28px",
        background: isDark
          ? "linear-gradient(to top, rgba(10,12,22,0.98) 60%, rgba(10,12,22,0) 100%)"
          : "linear-gradient(to top, rgba(255,255,255,0.97) 60%, rgba(255,255,255,0) 100%)",
        position: "relative", zIndex: 60,
        display: "flex", flexDirection: "column", gap: 10,
      }}>
        {!granted ? (
          <PrimaryBtn
            label="Allow Camera & Microphone"
            onClick={() => setGranted(true)}
            icon={<Camera size={14} color={t.AMBER_SOLID} />}
          />
        ) : (
          <PrimaryBtn
            label="Looks good — Continue"
            onClick={onNext}
          />
        )}
        <div style={{ textAlign: "center" as const }}>
          <span style={{ fontSize: 10, fontFamily: SF, color: t.INK4 }}>
            Screen sharing will be requested later during the session.
          </span>
        </div>
      </div>
    </div>
  );
}