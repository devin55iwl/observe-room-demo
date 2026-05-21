import React, { useState, useCallback, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronRight, Check } from "lucide-react";
import { PrimaryBtn, SF, useParticipantTheme, useIsMobile } from "./FunnelShell";

const MotionDiv = motion.div;

type Route =
  | { type: "question"; id: string }
  | { type: "qualify" }
  | { type: "disqualify"; reason: string };
type SingleQ = { id: string; type: "single"; num: string; topic: string; text: string; options: { id: string; label: string; sub?: string; route: Route }[] };
type MultiQ  = { id: string; type: "multi"; num: string; topic: string; text: string; hint: string; options: { id: string; label: string; sub?: string }[]; minSelect: number; onEnough: Route; onTooFew: Route };
type Question = SingleQ | MultiQ;

const DQ_FREQ = "This study is designed for professionals who actively use AI tools.";
const DQ_DESIGN = "This study focuses on participants with hands-on AI design tool experience in the past 3 months.";
const DQ_RESEARCH = "This study focuses on participants with hands-on AI research tool experience in the past 3 months.";

const QUESTIONS: Question[] = [
  { id: "q1", type: "single", num: "S1", topic: "AI Usage", text: "How often do you use AI tools in your work?", options: [
    { id: "a", label: "Every day", sub: "Daily workflow", route: { type: "question", id: "q2" } },
    { id: "b", label: "A few times a week", sub: "Regular but not daily", route: { type: "question", id: "q2" } },
    { id: "c", label: "Occasionally", sub: "A few times a month", route: { type: "question", id: "q2" } },
    { id: "d", label: "I don't use AI tools", sub: "Not currently", route: { type: "disqualify", reason: DQ_FREQ } },
  ]},
  { id: "q2", type: "single", num: "S2", topic: "Your Role", text: "What best describes your primary professional role?", options: [
    { id: "a", label: "Product Designer", sub: "UI/UX, visual design", route: { type: "question", id: "q3a" } },
    { id: "b", label: "UX Researcher", sub: "User research, testing", route: { type: "question", id: "q3b" } },
    { id: "c", label: "Developer", sub: "Frontend / full-stack", route: { type: "question", id: "q3a" } },
    { id: "d", label: "Product Manager", sub: "Roadmap, strategy", route: { type: "question", id: "q3a" } },
    { id: "e", label: "Other", sub: "Another professional role", route: { type: "question", id: "q3a" } },
  ]},
  { id: "q3a", type: "multi", num: "S3", topic: "AI Design Tools", text: "Which AI design tools have you used in the past 3 months?", hint: "Select all that apply", options: [
    { id: "a", label: "Figma AI", sub: "Generate, rewrite, translate" },
    { id: "b", label: "Adobe Firefly", sub: "Generative fill, text-to-image" },
    { id: "c", label: "Framer AI", sub: "AI-powered web design" },
    { id: "d", label: "Canva AI", sub: "Magic Design, text-to-image" },
    { id: "e", label: "Other AI design tool", sub: "Another tool not listed" },
  ], minSelect: 1, onEnough: { type: "qualify" }, onTooFew: { type: "disqualify", reason: DQ_DESIGN } },
  { id: "q3b", type: "multi", num: "S3", topic: "AI Research Tools", text: "Which AI research tools have you used in the past 3 months?", hint: "Select all that apply", options: [
    { id: "a", label: "Notion AI", sub: "Writing, summarisation" },
    { id: "b", label: "Otter.ai / Fireflies", sub: "Meeting transcription" },
    { id: "c", label: "Dovetail AI", sub: "Insight extraction" },
    { id: "d", label: "ChatGPT / Claude for research", sub: "Analysis, synthesis" },
    { id: "e", label: "Other AI research tool", sub: "Another tool not listed" },
  ], minSelect: 1, onEnough: { type: "qualify" }, onTooFew: { type: "disqualify", reason: DQ_RESEARCH } },
];

const Q_MAP: Record<string, Question> = Object.fromEntries(QUESTIONS.map((q) => [q.id, q]));

interface Props { onQualify: () => void; onDisqualify: (reason: string) => void; }

function OptionRow({ label, sub, selected, multi, onClick, t }: {
  label: string; sub?: string; selected: boolean; multi: boolean; onClick: () => void; t: any;
}) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 14,
        padding: "14px 16px", borderRadius: 12, cursor: "pointer",
        background: selected ? `rgba(${t.ARGB}, 0.06)` : hov ? t.SURF1 : "transparent",
        boxShadow: selected
          ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.26)`
          : hov
            ? `inset 0 0 0 1px ${t.STR1}`
            : `inset 0 0 0 1px ${t.STR2}`,
        transition: "background 0.14s ease, box-shadow 0.14s ease",
        userSelect: "none" as const,
      }}
    >
      <div style={{
        flexShrink: 0, width: 18, height: 18, borderRadius: multi ? 5 : "50%",
        background: selected ? `rgba(${t.ARGB}, 0.08)` : "transparent",
        boxShadow: selected
          ? `inset 0 0 0 1.5px rgba(${t.ARGB}, 0.36)`
          : `inset 0 0 0 1.5px ${t.STR1}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        transition: "all 0.14s ease",
      }}>
        {selected && multi && <Check size={10} color={t.AMBER_SOLID} strokeWidth={2.5} />}
        {selected && !multi && <div style={{ width: 6, height: 6, borderRadius: "50%", background: t.AMBER_SOLID }} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontFamily: SF, fontWeight: 500, color: selected ? t.INK1 : t.INK2 }}>{label}</div>
        {sub && <div style={{ fontSize: 11, fontFamily: SF, color: selected ? t.AMBER_SOLID : t.INK3, marginTop: 3 }}>{sub}</div>}
      </div>
    </div>
  );
}

export function ScreenerStep({ onQualify, onDisqualify }: Props) {
  const { tokens: t } = useParticipantTheme();
  const isMobile = useIsMobile();
  const [currentId, setCurrentId] = useState("q1");
  const [singleAnswer, setSingleAnswer] = useState<Record<string, string>>({});
  const [singleRoute, setSingleRoute] = useState<Record<string, Route>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, Set<string>>>({});
  const [dir, setDir] = useState<1 | -1>(1);
  const [tooltipShown, setTooltipShown] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = Q_MAP[currentId];
  const multiSelected = current.type === "multi" ? (multiAnswers[current.id] ?? new Set<string>()) : new Set<string>();

  const navigate = useCallback((nextId: string) => { setDir(1); setCurrentId(nextId); }, []);

  const resolveRoute = useCallback((route: Route) => {
    if (route.type === "question") navigate(route.id);
    else if (route.type === "qualify") onQualify();
    else onDisqualify(route.reason);
  }, [navigate, onQualify, onDisqualify]);

  const handleSingle = useCallback((qId: string, optId: string, route: Route) => {
    setSingleAnswer((a) => ({ ...a, [qId]: optId }));
    setSingleRoute((r) => ({ ...r, [qId]: route }));
  }, []);

  const handleNextSingle = useCallback(() => {
    const route = singleRoute[current.id];
    if (!route) return;
    if (!tooltipShown) {
      setTooltipShown(true);
      setShowTooltip(true);
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
      tooltipTimer.current = setTimeout(() => {
        setShowTooltip(false);
        setTimeout(() => resolveRoute(route), 200);
      }, 1800);
      return;
    }
    resolveRoute(route);
  }, [current, singleRoute, tooltipShown, resolveRoute]);

  useEffect(() => {
    return () => { if (tooltipTimer.current) clearTimeout(tooltipTimer.current); };
  }, []);

  const handleMultiToggle = useCallback((qId: string, optId: string) => {
    setMultiAnswers((prev) => {
      const s = new Set(prev[qId] ?? []);
      s.has(optId) ? s.delete(optId) : s.add(optId);
      return { ...prev, [qId]: s };
    });
  }, []);

  const handleMultiContinue = useCallback(() => {
    if (current.type !== "multi") return;
    const sel = multiAnswers[current.id] ?? new Set();
    if (!tooltipShown) {
      setTooltipShown(true);
      setShowTooltip(true);
      if (tooltipTimer.current) clearTimeout(tooltipTimer.current);
      tooltipTimer.current = setTimeout(() => {
        setShowTooltip(false);
        setTimeout(() => resolveRoute(sel.size >= current.minSelect ? current.onEnough : current.onTooFew), 200);
      }, 1800);
      return;
    }
    resolveRoute(sel.size >= current.minSelect ? current.onEnough : current.onTooFew);
  }, [current, multiAnswers, resolveRoute, tooltipShown]);

  const canContinueMulti = current.type === "multi" && multiSelected.size >= current.minSelect;
  const canContinueSingle = current.type === "single" && !!singleAnswer[current.id];

  return (
    <AnimatePresence mode="wait" custom={dir}>
      <MotionDiv key={current.id} custom={dir}
        initial={{ opacity: 0, x: dir * 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: dir * -20 }}
        transition={{ duration: 0.26, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ padding: isMobile ? "20px 20px 54px" : "24px 28px 28px", display: "flex", flexDirection: "column" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
          <div style={{
            padding: "4px 12px", borderRadius: 9999,
            background: `rgba(${t.ARGB}, 0.06)`,
            boxShadow: `inset 0 0 0 1px rgba(${t.ARGB}, 0.14)`,
          }}>
            <span style={{ fontSize: 11, fontFamily: SF, fontWeight: 600, color: t.AMBER_SOLID, letterSpacing: "0.08em" }}>{current.num}</span>
          </div>
          <span style={{ fontSize: 11, fontFamily: SF, color: t.INK3, letterSpacing: "0.08em", textTransform: "uppercase" as const }}>{current.topic}</span>
          {current.type === "multi" && <span style={{ fontSize: 11, fontFamily: SF, color: t.INK3, marginLeft: 2 }}>· {current.hint}</span>}
        </div>

        <div style={{
          fontSize: 20, fontFamily: SF, fontWeight: 600, color: t.INK1,
          letterSpacing: "-0.02em", lineHeight: 1.40, marginBottom: 20,
        }}>
          {current.text}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {current.type === "single" && current.options.map((opt) => (
            <OptionRow key={opt.id} label={opt.label} sub={opt.sub} selected={singleAnswer[current.id] === opt.id} multi={false} t={t}
              onClick={() => handleSingle(current.id, opt.id, opt.route)} />
          ))}
          {current.type === "multi" && current.options.map((opt) => (
            <OptionRow key={opt.id} label={opt.label} sub={opt.sub} selected={multiSelected.has(opt.id)} multi t={t}
              onClick={() => handleMultiToggle(current.id, opt.id)} />
          ))}
        </div>

        {/* Next button — unified for single & multi */}
        <div style={{ marginTop: 20, position: "relative" }}>
          {current.type === "single" && (
            <PrimaryBtn
              label={canContinueSingle ? "Next" : "Select an option to continue"}
              disabled={!canContinueSingle}
              onClick={handleNextSingle}
              icon={canContinueSingle ? <ChevronRight size={14} color={t.AMBER_SOLID} /> : undefined}
            />
          )}
          {current.type === "multi" && (
            <PrimaryBtn
              label={canContinueMulti ? `Continue with ${multiSelected.size} selected` : "Select at least one to continue"}
              disabled={!canContinueMulti}
              onClick={handleMultiContinue}
              icon={canContinueMulti ? <ChevronRight size={14} color={t.AMBER_SOLID} /> : undefined}
            />
          )}

          {/* One-time tooltip */}
          <AnimatePresence>
            {showTooltip && (
              <MotionDiv
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 2 }}
                transition={{ duration: 0.22 }}
                style={{
                  position: "absolute", left: "50%", transform: "translateX(-50%)",
                  bottom: "calc(100% + 10px)", whiteSpace: "nowrap",
                  padding: "7px 14px", borderRadius: 10,
                  background: t.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(40,22,6,0.84)",
                  backdropFilter: "blur(12px)",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
                }}
              >
                <span style={{
                  fontSize: 11.5, fontFamily: SF, fontWeight: 500,
                  color: t.mode === "dark" ? "rgba(255,255,255,0.88)" : "rgba(255,248,238,0.95)",
                  letterSpacing: "0.01em",
                }}>
                  Answers cannot be changed once submitted
                </span>
                {/* Arrow */}
                <div style={{
                  position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%) rotate(45deg)",
                  width: 8, height: 8,
                  background: t.mode === "dark" ? "rgba(255,255,255,0.12)" : "rgba(40,22,6,0.84)",
                }} />
              </MotionDiv>
            )}
          </AnimatePresence>
        </div>
      </MotionDiv>
    </AnimatePresence>
  );
}