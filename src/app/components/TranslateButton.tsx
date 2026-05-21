/**
 * TranslateButton — Language selection dropdown for inline translation.
 *
 * Renders a small globe icon button that opens a dropdown of supported
 * languages. Selected language is applied to the LiveTranscript and
 * TranscriptContent panels for inline translation display.
 *
 * Exports:
 *  - TranslateButton — The dropdown component
 *  - getTranslation  — Returns a mock translated string for a given lang
 *  - LangCode        — Union type of supported language codes | null
 */
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

/* pre-destructure motion components for Figma sandbox compatibility */
const MotionDiv = motion.div;

import { Languages, Check } from "lucide-react";
import { T, R, C } from "./constants";

export const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
  { code: "ja", label: "日本語", flag: "🇯🇵" },
  { code: "ko", label: "한국어", flag: "🇰🇷" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
  { code: "ar", label: "العربية", flag: "🇸🇦" },
] as const;

export type LangCode = (typeof LANGUAGES)[number]["code"] | null;

interface TranslateButtonProps {
  lang: LangCode;
  onChange: (lang: LangCode) => void;
  /** dropdown opens upward (default) or downward */
  direction?: "up" | "down";
}

export function TranslateButton({ lang, onChange, direction = "up" }: TranslateButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const active = lang !== null;
  const selected = LANGUAGES.find(l => l.code === lang);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-0.5 transition-colors cursor-pointer"
        style={{
          fontSize: T.micro,
          borderRadius: R.pill,
          color: active ? C.accent : "rgba(255,255,255,0.28)",
          background: active ? C.accentMuted : "transparent",
          border: `0.5px solid ${active ? C.accentBorder : "rgba(255,255,255,0.06)"}`,
        }}
      >
        <Languages size={11} />
        <span>{active && selected ? selected.flag + " " + selected.label : "Translate"}</span>
      </button>

      <AnimatePresence>
        {open && (
          <MotionDiv
            initial={{ opacity: 0, scale: 0.95, y: direction === "up" ? 6 : -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: direction === "up" ? 6 : -6 }}
            transition={{ type: "spring", damping: 28, stiffness: 380, mass: 0.6 }}
            className="absolute z-[100] py-1.5"
            style={{
              [direction === "up" ? "bottom" : "top"]: "calc(100% + 6px)",
              right: 0,
              width: 180,
              background: "rgba(22,24,32,0.92)",
              backdropFilter: "blur(40px) saturate(1.4)",
              borderWidth: 0.5, borderStyle: "solid" as const, borderColor: "rgba(255,255,255,0.10)",
              borderRadius: R.md,
              boxShadow: "0 12px 40px rgba(0,0,0,0.50), 0 0 1px rgba(255,255,255,0.05)",
            }}
          >
            {/* Off option */}
            <button
              onClick={() => { onChange(null); setOpen(false); }}
              className="w-full flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors text-left hover:bg-white/[0.05]"
              style={{ borderRadius: 0 }}
            >
              <span className="w-5 text-center" style={{ fontSize: 12 }}>—</span>
              <span style={{ fontSize: T.caption, color: !active ? "rgba(255,255,255,0.80)" : "rgba(255,255,255,0.40)" }}>
                Off
              </span>
              {!active && (
                <Check size={11} className="ml-auto" style={{ color: C.accent }} />
              )}
            </button>

            <div className="mx-2.5 my-1" style={{ height: 0.5, background: "rgba(255,255,255,0.06)" }} />

            {LANGUAGES.map(l => {
              const isSel = lang === l.code;
              return (
                <button
                  key={l.code}
                  onClick={() => { onChange(l.code); setOpen(false); }}
                  className="w-full flex items-center gap-2.5 px-3 py-2 cursor-pointer transition-colors text-left hover:bg-white/[0.05]"
                  style={{ borderRadius: 0 }}
                >
                  <span className="w-5 text-center" style={{ fontSize: 12 }}>{l.flag}</span>
                  <span style={{ fontSize: T.caption, color: isSel ? "rgba(255,255,255,0.90)" : "rgba(255,255,255,0.50)" }}>
                    {l.label}
                  </span>
                  {isSel && (
                    <MotionDiv
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 20, stiffness: 400 }}
                      className="ml-auto"
                    >
                      <Check size={11} style={{ color: C.accent }} />
                    </MotionDiv>
                  )}
                </button>
              );
            })}
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Mock translations keyed by lang code ── */
export const MOCK_TRANSLATIONS: Record<string, Record<string, string>> = {
  es: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"He estado buscando herramientas que se integren perfectamente en los flujos de trabajo existentes.\"",
    "What do you feel is the core pain point in your current experience?":
      "\"¿Cuál crees que es el punto de dolor principal en tu experiencia actual?\"",
  },
  zh: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"我一直在寻找能够无缝融入现有工作流的工具。\"",
    "What do you feel is the core pain point in your current experience?":
      "\"你觉得当前体验中最核心的痛点是什么？\"",
  },
  ja: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"既存のワークフローにシームレスに統合できるツールを探していました。\"",
    "What do you feel is the core pain point in your current experience?":
      "\"現在の体験で最も大きな課題は何だと感じていますか？\"",
  },
  ko: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"기존 워크플로우에 원활하게 통합되는 도구를 찾고 있었습니다.\"",
    "What do you feel is the core pain point in your current experience?":
      "\"현재 경험에서 가장 핵심적인 문제점은 무엇이라고 생각하시나요?\"",
  },
  fr: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"Je cherchais des outils qui s'intègrent parfaitement aux flux de travail existants.\"",
    "What do you feel is the core pain point in your current experience?":
      "\"Quel est selon vous le principal point de douleur dans votre expérience actuelle ?\"",
  },
  de: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"Ich habe nach Tools gesucht, die sich nahtlos in bestehende Workflows integrieren lassen.\"",
    "What do you feel is the core pain point in your current experience?":
      "\"Was empfinden Sie als den größten Schmerzpunkt in Ihrer aktuellen Erfahrung?\"",
  },
  pt: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"Estive procurando ferramentas que se integrem perfeitamente aos fluxos de trabalho existentes.\"",
    "What do you feel is the core pain point in your current experience?":
      "\"Qual você sente que é o principal ponto de dor na sua experiência atual?\"",
  },
  ar: {
    "I've been looking for tools that integrate seamlessly into existing workflows.":
      "\"كنت أبحث عن أدوات تتكامل بسلاسة مع سير العمل الحالي.\"",
    "What do you feel is the core pain point in your current experience?":
      "\"ما الذي تشعر أنه نقطة الألم الأساسية في تجربتك الحالية؟\"",
  },
};

/** Get a mock translation for a text string. Falls back to a generic placeholder. */
export function getTranslation(lang: string, text: string): string {
  const dict = MOCK_TRANSLATIONS[lang];
  if (dict) {
    // Try exact match first
    for (const [key, val] of Object.entries(dict)) {
      if (text.includes(key)) return val;
    }
  }
  // Fallback: show language label
  const l = LANGUAGES.find(x => x.code === lang);
  return `[${l?.label ?? lang} translation]`;
}