import React from "react";
import { ScrollText, Sparkles, User } from "lucide-react";
import { R, C, T } from "../constants";
import { Card } from "../primitives";
import { TRANSCRIPT } from "../data";
import { TranslateButton, getTranslation } from "../TranslateButton";
import type { LangCode } from "../TranslateButton";

/* ── Detection Badge (inline, with hover tooltip) ── */
function DetectionBadge({ tag, detail }: { tag: string; detail: string }) {
  return (
    <span className="relative inline-flex group/det ml-1 align-baseline">
      <span
        className="inline-flex items-center gap-1 px-[5px] py-[1px] cursor-default transition-colors
          group-hover/det:!bg-[rgba(255,209,102,0.12)]"
        style={{
          fontSize: 8,
          letterSpacing: 0.3,
          color: C.warning,
          background: "rgba(255,209,102,0.06)",
          border: "0.5px solid rgba(255,209,102,0.14)",
          borderRadius: 4,
          lineHeight: 1.4,
        }}
      >
        <span style={{ fontSize: 7 }}>&#9888;</span>
        {tag}
      </span>
      {/* Hover tooltip */}
      <span
        className="absolute left-0 bottom-full mb-1.5 w-[220px]
          opacity-0 scale-[0.96] pointer-events-none
          group-hover/det:opacity-100 group-hover/det:scale-100
          transition-all duration-200 delay-200 z-[60]"
        style={{
          fontSize: T.micro,
          lineHeight: 1.45,
          color: "rgba(255,255,255,0.65)",
          background: "rgba(10,12,18,0.82)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "0.5px solid rgba(255,255,255,0.12)",
          borderRadius: R.sm,
          padding: "8px 10px",
          boxShadow: [
            "inset  0.5px  0.5px 1px rgba(255,255,255,0.06)",
            "inset -0.5px -0.5px 1px rgba(0,0,0,0.20)",
            "0 6px 20px rgba(0,0,0,0.40)",
          ].join(", "),
        }}
      >
        {detail}
      </span>
    </span>
  );
}

interface Props {
  translateLang: LangCode;
  onTranslateLangChange: (lang: LangCode) => void;
}

export function TranscriptContent({ translateLang, onTranslateLangChange }: Props) {
  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0">
      <div className="flex-1 overflow-y-auto scroll-area">
        {/* Recording status bar */}
        <Card className="px-3.5 py-2.5 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="size-1.5 rounded-full animate-pulse" style={{ background: C.negative }} />
            <span className="text-white/28 uppercase tracking-[0.12em]" style={{ fontSize: T.micro }}>Recording</span>
          </div>
          <TranslateButton lang={translateLang} onChange={onTranslateLangChange} direction="down" />
        </Card>

        {/* Timeline */}
        <div className="space-y-0.5">
          {TRANSCRIPT.map((msg, i) => {
            const isMod = msg.speaker === "mod";
            const isLast = i === TRANSCRIPT.length - 1;
            const sentColor = msg.sentiment === "positive" ? C.positive : msg.sentiment === "negative" ? C.negative : "rgba(255,255,255,0.20)";
            return (
              <div key={`msg-${msg.id}`} className="flex gap-3 px-2 py-2.5"
                style={isLast ? { background: "rgba(97,95,255,0.04)", border: "0.5px solid rgba(97,95,255,0.08)", borderRadius: R.md } : {}}>
                <span className="text-white/14 font-mono shrink-0 mt-0.5 w-10 text-right" style={{ fontSize: T.micro }}>{msg.time}</span>
                <div className="size-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: isMod ? C.accent : "rgba(97,95,255,0.20)", color: "white", fontSize: 7 }}>
                  {isMod ? <Sparkles size={9} /> : <User size={9} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={isMod ? "text-white/28" : "text-white/50"} style={{ fontSize: T.caption }}>{msg.name}</span>
                    {!isMod && msg.sentiment && <div className="size-1.5 rounded-full shrink-0" style={{ background: sentColor }} />}
                    {isLast && <span className="text-white/14 uppercase tracking-[0.1em]" style={{ fontSize: 7 }}>Latest</span>}
                  </div>
                  <p className={isMod ? "text-white/28" : "text-white/50"} style={{ fontSize: T.body, lineHeight: 1.6 }}>
                    {msg.text}
                    {msg.detection && (
                      <DetectionBadge tag={msg.detection.tag} detail={msg.detection.detail} />
                    )}
                  </p>
                  {translateLang && (
                    <p className="text-white/20 mt-1 italic" style={{ fontSize: T.caption }}>
                      {getTranslation(translateLang, msg.text)}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Sentiment legend */}
        <div className="flex items-center gap-4 pt-3 px-2">
          {[
            { label: "Positive", color: C.positive },
            { label: "Neutral", color: "rgba(255,255,255,0.20)" },
            { label: "Negative", color: C.negative },
          ].map(s => (
            <div key={s.label} className="flex items-center gap-1.5">
              <div className="size-1.5 rounded-full" style={{ background: s.color }} />
              <span className="text-white/14" style={{ fontSize: T.micro }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}