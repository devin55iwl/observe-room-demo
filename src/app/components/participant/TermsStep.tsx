import React, { useState, useRef, useCallback } from "react";
import { Check } from "lucide-react";
import { PrimaryBtn, Divider, SF, MONO, useParticipantTheme, useIsMobile } from "./FunnelShell";

const LANG_NAMES: Record<string, string> = {
  en: "English", zh: "简体中文", ja: "日本語", ko: "한국어",
  es: "Español",  fr: "Français", de: "Deutsch", pt: "Português",
  ar: "العربية", ru: "Русский",  da: "Dansk",   hi: "हिन्दी",
};

const SECTIONS = [
  { title: "1. Purpose of This Study", body: `This research study is conducted by Cookiy Research Lab to investigate how professional designers, researchers, developers, and product managers adopt, evaluate, and integrate AI-powered tools into their daily workflows.\n\nThe study is funded by Cookiy Inc. and has received approval from the Institutional Review Board (IRB) under reference IRB-2024-0419.` },
  { title: "2. What You Will Be Asked to Do", body: `Participation involves a single session lasting approximately 20 minutes. During this session, you will engage in a structured conversation with an AI-guided interviewer.\n\nThe session will be audio and video recorded. Your camera and microphone must remain active throughout.` },
  { title: "3. Data Collection and Processing", body: `We collect the following data:\n\n• Audio and video recordings\n• Transcripts generated from your speech\n• Non-verbal behavioural data (gaze, facial expressions)\n• Screener responses and background information\n• Technical metadata (device type, browser, session duration)\n\nAll data is encrypted in transit and at rest using TLS 1.3 and AES-256.` },
  { title: "4. Confidentiality and Anonymisation", body: `Your identity will be anonymised before any data is used in research outputs. Direct identifying information will be replaced with a participant ID. Recordings will be retained for a maximum of 24 months.` },
  { title: "5. Your Rights as a Participant", body: `Your participation is entirely voluntary. You have the right to:\n\n• Withdraw from the study at any time\n• Request access to the data we hold about you\n• Request deletion of your data\n• Lodge a complaint with a data protection authority\n\nContact us at: research@cookiy.com` },
  { title: "6. Contact Information", body: `Cookiy Research Lab\nEmail: research@cookiy.com\nDPO: dpo@cookiy.com\nAddress: 1 Canal Street, London, EC1A 1BB` },
];

interface Props { lang: string; onNext: () => void; }

export function TermsStep({ lang, onNext }: Props) {
  const { tokens: t } = useParticipantTheme();
  const isMobile = useIsMobile();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const langName = LANG_NAMES[lang] ?? "English";
  const isNonEn = lang !== "en";

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || scrolled) return;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 24) setScrolled(true);
  }, [scrolled]);

  const canContinue = scrolled && agreed;
  const ctaLabel = !scrolled
    ? "Scroll to read all terms"
    : !agreed
      ? "Check the box to continue"
      : "I agree — Continue";

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
      {isNonEn && (
        <div style={{ padding: "14px 28px 8px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 14px", borderRadius: 10,
            background: `rgba(${t.ARGB}, 0.05)`,
            boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.12)`,
          }}>
            <span style={{ fontSize: 11, color: t.AMBER_SOLID, fontFamily: SF }}>
              {langName} selected · Terms displayed in English
            </span>
          </div>
        </div>
      )}

      <Divider />

      <div style={{ position: "relative", flex: 1, minHeight: 0 }}>
        {!scrolled && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 96, zIndex: 2,
            background: t.SCROLL_FADE,
            pointerEvents: "none",
            display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 16,
          }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 14px", borderRadius: 9999,
              background: t.SCROLL_PILL_BG,
              boxShadow: `inset 0 0 0 1px ${t.STR2}, 0 2px 8px rgba(0,0,0,0.10)`,
              backdropFilter: "blur(8px)",
            }}>
              <span style={{ fontSize: 10, color: t.INK3, fontFamily: SF, fontWeight: 500, letterSpacing: "0.10em", textTransform: "uppercase" as const }}>
                ↓ scroll to read
              </span>
            </div>
          </div>
        )}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          style={{
            position: "absolute", inset: 0, overflowY: "auto",
            padding: "24px 28px 32px", scrollbarWidth: "none" as const,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
            <span style={{ fontSize: 10.5, color: t.INK4, fontFamily: MONO, letterSpacing: "0.04em" }}>v2.4 · March 2026</span>
            <div style={{ width: 3, height: 3, borderRadius: "50%", background: t.INK4 }} />
            <span style={{ fontSize: 10.5, color: t.GREEN_TEXT, fontFamily: MONO, letterSpacing: "0.04em" }}>IRB-2024-0419</span>
          </div>
          {SECTIONS.map((sec, i) => (
            <div key={i} style={{ marginBottom: 28 }}>
              <div style={{
                fontSize: 11, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID,
                letterSpacing: "0.06em", textTransform: "uppercase" as const, marginBottom: 10,
              }}>
                {sec.title}
              </div>
              <div style={{
                fontSize: 13.5, fontFamily: SF, color: t.INK2,
                lineHeight: 1.76, letterSpacing: "-0.005em", whiteSpace: "pre-line" as const,
              }}>
                {sec.body}
              </div>
            </div>
          ))}
          <div style={{ textAlign: "center" as const, paddingTop: 8 }}>
            <span style={{ fontSize: 10, color: t.INK4, fontFamily: MONO }}>— End of document —</span>
          </div>
        </div>
      </div>

      <Divider />

      <div style={{ flexShrink: 0, padding: isMobile ? "18px 20px 54px" : "18px 28px 24px", display: "flex", flexDirection: "column", gap: 14,
        background: t.mode === "light"
          ? "linear-gradient(to top, rgba(255,255,255,0.97) 60%, rgba(255,255,255,0) 100%)"
          : "linear-gradient(to top, rgba(10,12,22,0.98) 60%, rgba(10,12,22,0) 100%)",
        position: "relative", zIndex: 10,
      }}>
        <div
          onClick={() => scrolled && setAgreed((a) => !a)}
          style={{
            display: "flex", alignItems: "flex-start", gap: 12,
            cursor: scrolled ? "pointer" : "default",
            opacity: scrolled ? 1 : 0.36,
            transition: "opacity 0.22s ease",
            userSelect: "none" as const,
          }}
        >
          <div style={{
            flexShrink: 0, width: 18, height: 18, borderRadius: 5, marginTop: 1,
            background: agreed ? `rgba(${t.ARGB}, 0.08)` : "transparent",
            boxShadow: agreed
              ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.38)`
              : `inset 0 0 0 1.5px ${t.STR1}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.14s ease",
          }}>
            {agreed && <Check size={10} color={t.AMBER_SOLID} strokeWidth={2.5} />}
          </div>
          <span style={{
            fontSize: 12.5, fontFamily: SF, color: t.INK2, lineHeight: 1.62, letterSpacing: "-0.005em",
          }}>
            I have read and agree to the Terms of Participation and Privacy Policy. I understand my session will be recorded.
          </span>
        </div>
        <PrimaryBtn label={ctaLabel} disabled={!canContinue} onClick={onNext} />
      </div>
    </div>
  );
}