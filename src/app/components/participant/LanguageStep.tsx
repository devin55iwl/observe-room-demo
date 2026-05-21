import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Check, ChevronDown, ChevronRight, Globe } from "lucide-react";
import { PrimaryBtn, SF, useParticipantTheme, useIsMobile } from "./FunnelShell";

const MotionDiv = motion.div;

type Lang = { code: string; native: string; english: string };

const PRIMARY: Lang[] = [
  { code: "en", native: "English",  english: "English" },
  { code: "zh", native: "简体中文",  english: "Simplified Chinese" },
  { code: "ja", native: "日本語",    english: "Japanese" },
  { code: "ko", native: "한국어",    english: "Korean" },
  { code: "es", native: "Español",   english: "Spanish" },
  { code: "fr", native: "Français",  english: "French" },
];

const MORE: Lang[] = [
  { code: "de", native: "Deutsch",       english: "German" },
  { code: "pt", native: "Português",     english: "Portuguese" },
  { code: "it", native: "Italiano",      english: "Italian" },
  { code: "nl", native: "Nederlands",    english: "Dutch" },
  { code: "sv", native: "Svenska",       english: "Swedish" },
  { code: "da", native: "Dansk",         english: "Danish" },
  { code: "no", native: "Norsk",         english: "Norwegian" },
  { code: "fi", native: "Suomi",         english: "Finnish" },
  { code: "pl", native: "Polski",        english: "Polish" },
  { code: "ru", native: "Русский",       english: "Russian" },
  { code: "uk", native: "Українська",    english: "Ukrainian" },
  { code: "tr", native: "Türkçe",        english: "Turkish" },
  { code: "ar", native: "العربية",       english: "Arabic" },
  { code: "he", native: "עברית",         english: "Hebrew" },
  { code: "hi", native: "हिन्दी",        english: "Hindi" },
  { code: "bn", native: "বাংলা",         english: "Bengali" },
  { code: "th", native: "ไทย",           english: "Thai" },
  { code: "vi", native: "Tiếng Việt",    english: "Vietnamese" },
  { code: "id", native: "Bahasa Indonesia", english: "Indonesian" },
  { code: "ms", native: "Bahasa Melayu", english: "Malay" },
  { code: "tl", native: "Tagalog",       english: "Tagalog" },
  { code: "zh-tw", native: "繁體中文",   english: "Traditional Chinese" },
];

interface Props { onNext: (lang: string) => void; }

export function LanguageStep({ onNext }: Props) {
  const { tokens: t } = useParticipantTheme();
  const isMobile = useIsMobile();
  const [selected, setSelected] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected MORE lang for display
  const selectedMoreLang = MORE.find(l => l.code === selected);
  const isPrimarySelected = PRIMARY.some(l => l.code === selected);

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dropdownOpen]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Scrollable language selection area */}
      <div style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: isMobile ? "20px 20px 12px" : "24px 28px 12px", scrollbarWidth: "thin" as const }}>
        {/* Primary language cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
          {PRIMARY.map((lang) => {
            const sel = selected === lang.code;
            return (
              <div key={lang.code}
                onClick={() => { setSelected(lang.code); setDropdownOpen(false); }}
                style={{
                  padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                  background: sel ? `rgba(${t.ARGB}, 0.07)` : t.SURF1,
                  boxShadow: sel
                    ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.30)`
                    : `inset 0 0 0 1px ${t.STR2}`,
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  transition: "background 0.14s ease, box-shadow 0.14s ease",
                  userSelect: "none" as const,
                }}
              >
                <div>
                  <div style={{ fontSize: 14, fontFamily: SF, fontWeight: 500, color: sel ? t.INK1 : t.INK2, letterSpacing: "-0.01em" }}>{lang.native}</div>
                  <div style={{ fontSize: 11, fontFamily: SF, marginTop: 3, color: sel ? t.AMBER_SOLID : t.INK3 }}>{lang.english}</div>
                </div>
                {sel && (
                  <div style={{
                    width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                    background: `rgba(${t.ARGB}, 0.10)`,
                    boxShadow: `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.34)`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    <Check size={10} color={t.AMBER_SOLID} strokeWidth={2.5} />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* More languages dropdown */}
        <div ref={dropdownRef} style={{ position: "relative" }}>
          <div
            onClick={() => setDropdownOpen(v => !v)}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "12px 16px", borderRadius: 10, cursor: "pointer",
              background: (selectedMoreLang && !isPrimarySelected) ? `rgba(${t.ARGB}, 0.05)` : t.SURF2,
              boxShadow: (selectedMoreLang && !isPrimarySelected)
                ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.24)`
                : `inset 0 0 0 1px ${t.STR2}`,
              transition: "background 0.14s ease, box-shadow 0.14s ease",
              userSelect: "none" as const,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Globe size={14} color={(selectedMoreLang && !isPrimarySelected) ? t.AMBER_SOLID : t.INK3} />
              {(selectedMoreLang && !isPrimarySelected) ? (
                <div>
                  <span style={{ fontSize: 13, fontFamily: SF, fontWeight: 500, color: t.INK1 }}>{selectedMoreLang.native}</span>
                  <span style={{ fontSize: 11, fontFamily: SF, color: t.AMBER_SOLID, marginLeft: 8 }}>{selectedMoreLang.english}</span>
                </div>
              ) : (
                <span style={{ fontSize: 12.5, fontFamily: SF, color: t.INK2 }}>More languages</span>
              )}
            </div>
            <div style={{
              transform: dropdownOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.20s ease",
              display: "flex",
            }}>
              <ChevronDown size={13} color={t.INK3} />
            </div>
          </div>

          {/* Dropdown list */}
          <AnimatePresence>
            {dropdownOpen && (
              <MotionDiv
                initial={{ opacity: 0, y: -4, scaleY: 0.96 }}
                animate={{ opacity: 1, y: 0, scaleY: 1 }}
                exit={{ opacity: 0, y: -4, scaleY: 0.96 }}
                transition={{ duration: 0.16 }}
                style={{
                  position: "absolute", left: 0, right: 0, top: "calc(100% + 6px)",
                  zIndex: 50, borderRadius: 12, overflow: "hidden",
                  background: t.GLASS_BG,
                  boxShadow: `inset 0 0 0 1px ${t.STR2}, 0 12px 40px rgba(0,0,0,0.35)`,
                  backdropFilter: t.GLASS_BLUR,
                  transformOrigin: "top center",
                  maxHeight: 240, overflowY: "auto",
                  scrollbarWidth: "thin" as const,
                }}
              >
                {MORE.map((lang) => {
                  const sel = selected === lang.code;
                  return (
                    <div
                      key={lang.code}
                      onClick={() => { setSelected(lang.code); setDropdownOpen(false); }}
                      style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "10px 16px", cursor: "pointer",
                        background: sel ? `rgba(${t.ARGB}, 0.06)` : "transparent",
                        transition: "background 0.12s ease",
                        userSelect: "none" as const,
                      }}
                      onMouseEnter={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = t.SURF1; }}
                      onMouseLeave={(e) => { if (!sel) (e.currentTarget as HTMLDivElement).style.background = "transparent"; }}
                    >
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                        <span style={{ fontSize: 13.5, fontFamily: SF, fontWeight: 500, color: sel ? t.INK1 : t.INK2 }}>{lang.native}</span>
                        <span style={{ fontSize: 10.5, fontFamily: SF, color: sel ? t.AMBER_SOLID : t.INK3 }}>{lang.english}</span>
                      </div>
                      {sel && <Check size={12} color={t.AMBER_SOLID} strokeWidth={2.5} />}
                    </div>
                  );
                })}
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed bottom button */}
      <div style={{
        flexShrink: 0, padding: isMobile ? "12px 20px 54px" : "12px 28px 28px",
        background: t.mode === "light"
          ? "linear-gradient(to top, rgba(255,255,255,0.97) 60%, rgba(255,255,255,0) 100%)"
          : "linear-gradient(to top, rgba(10,12,22,0.98) 60%, rgba(10,12,22,0) 100%)",
        position: "relative", zIndex: 60,
      }}>
        <PrimaryBtn
          label="Continue"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
          icon={<ChevronRight size={14} color={selected ? t.AMBER_SOLID : t.INK3} />}
        />
      </div>
    </div>
  );
}