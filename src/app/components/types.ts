/**
 * types.ts — Shared TypeScript definitions for the interview observer.
 *
 * Centralises all domain types so they can be imported independently
 * of mock data. In production, these types would align with your API
 * response schemas.
 */

/* ── Question-level behavioral signal ── */
export type SignalIconType = "hesitation" | "pitch" | "filler" | "speed" | "emotion" | "gaze" | "agreement";

export interface QuestionSignal {
  icon: SignalIconType;
  label: string;
  detail: string;
}

/* ── Question status within a session ── */
export type QuestionStatus = "done" | "active" | "pending" | "skipped";

/* ── Individual interview question ── */
export interface SessionQuestion {
  id: number;
  text: string;
  completed: boolean;
  status: QuestionStatus;
  /** Engagement score 0–100 (meaningful only when status is "done") */
  engagement?: number;
  /** Short AI-generated summary shown on hover */
  summary?: string;
  /** Behavioral signals detected during this question */
  signals?: QuestionSignal[];
  /** Time range covered (e.g. "00:00 – 08:30") */
  timeRange?: string;
  /** AI-suggested follow-up question */
  suggestedFollowUp?: string;
}

/* ── Session grouping ── */
export interface Session {
  id: number;
  label: string;
  date: string;
  duration: string;
  questions: SessionQuestion[];
}

/* ── Observer-submitted follow-up question ── */
export interface FollowUpQuestion {
  id: number;
  text: string;
  urgent: boolean;
  status: "pending" | "asked" | "failed";
  time: string;
  observer: string;
}

/* ── Insight aggregates ── */
export interface InsightsSentiment {
  positive: number;
  neutral: number;
  negative: number;
}

export interface InsightHighlight {
  text: string;
  /** 0–1 intensity */
  intensity: number;
}

export interface InsightKeyword {
  tag: string;
  count: number;
}

export interface InsightsData {
  sentiment: InsightsSentiment;
  highlights: InsightHighlight[];
  keywords: InsightKeyword[];
}

/* ── Transcript turn ── */
export interface TranscriptTurn {
  id: number;
  time: string;
  speaker: "mod" | "int";
  name: string;
  text: string;
  sentiment?: "positive" | "neutral" | "negative";
  detection?: {
    tag: string;
    detail: string;
  };
}

/* ── Conversation analysis item ── */
export interface ConversationAnalysisItem {
  id: number;
  text: string;
  time: string;
  status: "done" | "analysing";
}

/* ── Quota group definition ── */
export interface QuotaGroup {
  name: string;
  description: string;
}

/* ── Quality level derived from engagement score ── */
export type QualityLevel = "high" | "mid" | "low";