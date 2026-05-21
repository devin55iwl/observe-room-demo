/**
 * data.ts — Mock data & tab definitions for the interview observer.
 *
 * All data here is static mock data for demo/prototype purposes.
 * In production, these would be replaced by API responses.
 *
 * Types are defined in ./types.ts and re-exported here for convenience.
 */

/* ── Re-export all types for backward compatibility ── */
export type { QuestionSignal, QuestionStatus, SessionQuestion, FollowUpQuestion } from "./types";
import type { Session, InsightsData, TranscriptTurn, ConversationAnalysisItem, QuotaGroup } from "./types";

export const SESSIONS: Session[] = [
  {
    id: 1, label: "Session 01", date: "Jan 12", duration: "28m",
    questions: [
      {
        id: 1, text: "Background & current role", completed: true, status: "done",
        engagement: 72, timeRange: "00:00 – 08:30",
        summary: "Participant gave a clear, structured answer. Moderate engagement with steady eye contact throughout.",
        signals: [
          { icon: "agreement", label: "Agreement", detail: "Consistent nodding pattern detected during self-description." },
        ],
      },
      {
        id: 2, text: "Daily tools usage", completed: true, status: "done",
        engagement: 85, timeRange: "08:30 – 17:00",
        summary: "High engagement — spoke enthusiastically about tooling stack. Speech rate increased when describing favorite tools.",
        signals: [
          { icon: "speed", label: "Speech rate ↑", detail: "Tempo +22% when discussing Figma & Notion integration." },
          { icon: "emotion", label: "Positive affect", detail: "Micro-expressions of joy detected 4× during tool walkthrough." },
        ],
      },
      {
        id: 3, text: "Entry into product design", completed: true, status: "done",
        engagement: 58, timeRange: "17:00 – 28:00",
        summary: "Lower engagement — gave a rehearsed-sounding answer. Possible interview fatigue toward session end.",
        signals: [
          { icon: "gaze", label: "Gaze drift", detail: "Eye contact dropped to 40% in final 3 minutes." },
          { icon: "hesitation", label: "Hesitation", detail: "1.8s pause before answering — may indicate discomfort with topic." },
        ],
      },
    ],
  },
  {
    id: 2, label: "Session 02", date: "Jan 26", duration: "31m",
    questions: [
      {
        id: 1, text: "Workflow changes past year", completed: true, status: "done",
        engagement: 78, timeRange: "00:00 – 07:30",
        summary: "Detailed comparison of before/after workflows. Good depth of reflection.",
        signals: [
          { icon: "agreement", label: "Self-correction", detail: "Participant corrected initial statement twice, indicating careful thought." },
        ],
      },
      {
        id: 2, text: "Design review process", completed: true, status: "done",
        engagement: 65, timeRange: "07:30 – 14:00",
        summary: "Moderate engagement. Expressed some frustration with current review cadence.",
        signals: [
          { icon: "hesitation", label: "Hesitation", detail: "Multiple filler words (\"um\", \"like\") — possible uncertainty about process." },
          { icon: "pitch", label: "Pitch shift ↓", detail: "Voice pitch dropped when discussing stakeholder feedback loops." },
        ],
      },
      {
        id: 3, text: "Component build prioritization", completed: true, status: "done",
        engagement: 91, timeRange: "14:00 – 23:00",
        summary: "Peak engagement of session. Participant leaned forward and spoke with high conviction about prioritization frameworks.",
        signals: [
          { icon: "speed", label: "Speech rate ↑", detail: "Tempo +30% — highest velocity of the session." },
          { icon: "emotion", label: "Strong conviction", detail: "Elevated facial muscle activation consistent with passionate expression." },
          { icon: "agreement", label: "Self-referencing", detail: "Used \"I believe\" and \"in my experience\" 6× — high ownership." },
        ],
      },
      {
        id: 4, text: "Successful handoff criteria", completed: true, status: "done",
        engagement: 70, timeRange: "23:00 – 31:00",
        summary: "Gave a practical, list-style answer. Engagement tapered off slightly toward end.",
        signals: [
          { icon: "filler", label: "Filler language", detail: "\"Sort of\" and \"kind of\" used 5× — hedging on specifics." },
        ],
      },
    ],
  },
  {
    id: 3, label: "Session 03", date: "Feb 14", duration: "Live",
    questions: [
      {
        id: 1, text: "Handoff workflow walkthrough", completed: true, status: "done",
        engagement: 88, timeRange: "00:00 – 02:10",
        summary: "Very engaged — demonstrated actual workflow with screen-share. Rich qualitative data captured.",
        suggestedFollowUp: "Which step in the handoff takes the most time?",
        signals: [
          { icon: "speed", label: "Speech rate ↑", detail: "Rapid narration during live demo — high comfort level." },
          { icon: "emotion", label: "Frustration spike", detail: "Micro-expression of disgust when showing manual export step." },
        ],
      },
      {
        id: 2, text: "Collaboration pain points", completed: true, status: "done",
        engagement: 62, timeRange: "02:10 – 05:50",
        summary: "Candid response about team friction. Hesitation before naming specific colleagues' roles.",
        suggestedFollowUp: "How do you typically resolve disagreements with engineers?",
        signals: [
          { icon: "hesitation", label: "Hesitation", detail: "2.1s pause before discussing cross-team dynamics." },
          { icon: "pitch", label: "Pitch shift ↑", detail: "Voice raised when describing version conflicts — emotional trigger." },
        ],
      },
      {
        id: 3, text: "How easy was onboarding?", completed: true, status: "done",
        engagement: 92, timeRange: "05:50 – 10:20",
        summary: "Peak engagement — participant reacted strongly when describing the first-time setup experience.",
        suggestedFollowUp: "What would have made the first-time setup easier?",
        signals: [
          { icon: "emotion", label: "Strong reaction", detail: "Facial action units peaked when recalling initial confusion." },
          { icon: "speed", label: "Speech rate ↑", detail: "Tempo +35% during onboarding story — high emotional investment." },
          { icon: "agreement", label: "Emphatic gestures", detail: "Hand gestures frequency 3× baseline when describing 'aha moment'." },
        ],
      },
      {
        id: 4, text: "Feature discovery patterns", completed: true, status: "done",
        engagement: 55, timeRange: "10:20 – 14:40",
        summary: "Lower engagement — gave short, surface-level answers. Possible unfamiliarity with advanced features.",
        suggestedFollowUp: "What part of the setup was hardest?",
        signals: [
          { icon: "hesitation", label: "Hesitation", detail: "3.2s average pause before each answer — uncertainty about feature names." },
          { icon: "filler", label: "Filler language", detail: "\"I guess\" and \"maybe\" used 7× — low confidence in responses." },
          { icon: "gaze", label: "Gaze aversion", detail: "Eye contact dropped to 30% — possible discomfort or disengagement." },
        ],
      },
      {
        id: 5, text: "Design system adoption", completed: true, status: "done",
        engagement: 78, timeRange: "14:40 – 17:20",
        summary: "Solid engagement when discussing component libraries. Expressed pride in team's system maturity.",
        signals: [
          { icon: "agreement", label: "Nodding", detail: "Consistent affirmative gestures while describing adoption process." },
        ],
      },
      {
        id: 6, text: "Cross-team communication", completed: true, status: "done",
        engagement: 45, timeRange: "17:20 – 19:50",
        summary: "Lowest engagement of session. Gave brief, deflective answers about PM-designer dynamics.",
        signals: [
          { icon: "gaze", label: "Gaze drift", detail: "Eye contact at 25% — avoidance pattern when discussing PM relationship." },
          { icon: "hesitation", label: "Long pause", detail: "4.1s silence before answering — significant hesitation." },
        ],
      },
      {
        id: 7, text: "Prototype testing methods", completed: true, status: "done",
        engagement: 71, timeRange: "19:50 – 22:30",
        summary: "Moderate engagement. Described a pragmatic but limited testing approach.",
        signals: [
          { icon: "filler", label: "Hedging", detail: "\"Sort of\" used 4× — uncertainty about testing rigor." },
        ],
      },
      {
        id: 8, text: "Stakeholder feedback loops", completed: true, status: "done",
        engagement: 83, timeRange: "22:30 – 25:10",
        summary: "Re-engaged when discussing direct stakeholder interaction. Animated storytelling.",
        signals: [
          { icon: "speed", label: "Speech rate ↑", detail: "Tempo +28% — energized by topic." },
          { icon: "emotion", label: "Positive affect", detail: "Genuine smile clusters detected 3×." },
        ],
      },
      {
        id: 9, text: "Documentation practices", completed: true, status: "done",
        engagement: 58, timeRange: "25:10 – 27:40",
        summary: "Acknowledged documentation debt. Tone shifted to slightly apologetic.",
        signals: [
          { icon: "pitch", label: "Pitch shift ↓", detail: "Voice dropped when admitting sparse documentation." },
        ],
      },
      {
        id: 10, text: "Tool switching frequency", completed: true, status: "done",
        engagement: 67, timeRange: "27:40 – 30:00",
        summary: "Pragmatic response about context-switching costs. Mid-range engagement.",
        signals: [],
      },
      {
        id: 11, text: "Accessibility integration", completed: true, status: "done",
        engagement: 74, timeRange: "30:00 – 33:15",
        summary: "Showed awareness of a11y but admitted gaps in practice. Slightly defensive tone.",
        signals: [
          { icon: "hesitation", label: "Hesitation", detail: "1.9s pause before discussing a11y audit failures." },
        ],
      },
      {
        id: 12, text: "Design token management", completed: true, status: "done",
        engagement: 89, timeRange: "33:15 – 36:40",
        summary: "High engagement — this is clearly a passion area. Detailed walkthrough of token architecture.",
        signals: [
          { icon: "speed", label: "Speech rate ↑", detail: "Tempo +32% — deep expertise and enthusiasm." },
          { icon: "agreement", label: "Self-referencing", detail: "\"I built\" and \"my system\" used 5× — strong ownership." },
          { icon: "emotion", label: "Pride", detail: "Elevated facial muscle activation consistent with satisfaction." },
        ],
      },
      {
        id: 13, text: "Version control pain points", completed: true, status: "done",
        engagement: 52, timeRange: "36:40 – 39:20",
        summary: "Energy dipped. Brief, factual answers with minimal elaboration.",
        signals: [
          { icon: "gaze", label: "Gaze drift", detail: "Looking away 60% of response — fatigue or disinterest." },
          { icon: "filler", label: "Filler language", detail: "\"Um\" and \"yeah\" increased — cognitive load or boredom." },
        ],
      },
      {
        id: 14, text: "AI feature expectations", completed: true, status: "done",
        engagement: 95, timeRange: "39:20 – 43:00",
        summary: "Peak engagement of entire session. Leaned forward, rapid speech, vivid scenario descriptions.",
        suggestedFollowUp: "Which AI capability would you want first?",
        signals: [
          { icon: "emotion", label: "Excitement", detail: "Peak positive valence — eyes widened, spontaneous laughter." },
          { icon: "speed", label: "Speech rate ↑", detail: "Fastest tempo of session — +40% above baseline." },
        ],
      },
      {
        id: 15, text: "Privacy concerns with AI", completed: true, status: "done",
        engagement: 70, timeRange: "43:00 – 45:30",
        summary: "Measured response. Balanced view — excited about AI but cautious about data handling.",
        signals: [
          { icon: "pitch", label: "Pitch shift ↓", detail: "Voice sobered when discussing data privacy implications." },
        ],
      },
      {
        id: 16, text: "Design versioning approach", completed: true, status: "done",
        engagement: 63, timeRange: "45:30 – 48:10",
        summary: "Moderate engagement. Described workarounds rather than ideal solutions.",
        signals: [
          { icon: "filler", label: "Hedging", detail: "\"Kind of\" and \"I suppose\" — low conviction about current approach." },
        ],
      },
      {
        id: 17, text: "Ideal future workflow", completed: false, status: "active",
      },
      {
        id: 18, text: "Team scaling challenges", completed: false, status: "pending",
      },
      {
        id: 19, text: "Learning & growth desires", completed: false, status: "pending",
      },
      {
        id: 20, text: "Closing reflections", completed: false, status: "pending",
      },
    ],
  },
];

export const AI_FOLLOWUPS = [
  { id: 10, text: "Walk through last video ad creation process" },
  { id: 11, text: "Most time-consuming / frustrating step?" },
  { id: 12, text: "Workarounds for version conflicts?" },
  { id: 13, text: "Ideal AI-assisted workflow?" },
];

export const INSIGHTS: InsightsData = {
  sentiment: { positive: 65, neutral: 25, negative: 10 },
  highlights: [
    { text: "Mentioned 'seamless integration' 4 times", intensity: 0.9 },
    { text: "Expressed frustration with manual handoffs", intensity: 0.7 },
    { text: "High engagement when discussing AI features", intensity: 0.85 },
  ],
  keywords: [
    { tag: "Workflow", count: 8 },
    { tag: "Integration", count: 6 },
    { tag: "Collaboration", count: 5 },
    { tag: "Efficiency", count: 4 },
    { tag: "SaaS", count: 3 },
  ],
};

export const TRANSCRIPT: TranscriptTurn[] = [
  { id: 1, time: "00:00", speaker: "mod" as const, name: "Cookiy AI", text: "Thanks for joining. Could you tell me about your current role?" },
  { id: 2, time: "00:32", speaker: "int" as const, name: "#9527", text: "Sure. I'm a product designer at a mid-size SaaS company. I lead the design system and handle most handoff workflows.", sentiment: "neutral" as const },
  { id: 3, time: "01:15", speaker: "mod" as const, name: "Cookiy AI", text: "Can you describe your current workflow for design handoffs?" },
  { id: 4, time: "01:28", speaker: "int" as const, name: "#9527", text: "Right now it's a mix of Figma specs and Notion. We annotate frames, export assets, and leave comments. It works, but lots of manual steps.", sentiment: "neutral" as const, detection: { tag: "Filler language", detail: "Hedging phrase \"it works, but\" suggests underlying dissatisfaction not fully expressed. Consider probing deeper." } as const },
  { id: 5, time: "02:10", speaker: "mod" as const, name: "Cookiy AI", text: "What are the biggest pain points during collaboration?" },
  { id: 6, time: "02:24", speaker: "int" as const, name: "#9527", text: "The manual part. Exporting, re-uploading, syncing versions \u2014 it's tedious. There's no single source of truth.", sentiment: "negative" as const, detection: { tag: "Hesitation detected", detail: "1.4s pause before \"there's no single source of truth\" — participant may be weighing how candid to be about tooling frustrations." } as const },
  { id: 7, time: "03:05", speaker: "mod" as const, name: "Cookiy AI", text: "How do you currently handle design versioning?" },
  { id: 8, time: "03:18", speaker: "int" as const, name: "#9527", text: "We use Figma branches, but it's not ideal. We've lost work before because of merge conflicts.", sentiment: "negative" as const, detection: { tag: "Pitch shift ↑", detail: "Voice pitch rose 18% on \"lost work\" — strong emotional response indicating this is a significant pain point worth exploring." } as const },
  { id: 9, time: "04:02", speaker: "mod" as const, name: "Cookiy AI", text: "If you could change one thing about your tooling, what would it be?" },
  { id: 10, time: "04:15", speaker: "int" as const, name: "#9527", text: "Seamless integration. I want tools that talk to each other without me being the glue in between.", sentiment: "positive" as const },
  { id: 11, time: "05:50", speaker: "mod" as const, name: "Cookiy AI", text: "How do you feel about AI-powered features in design tools?" },
  { id: 12, time: "06:58", speaker: "int" as const, name: "#9527", text: "Really excited. If AI could handle the repetitive parts \u2014 generating tokens, suggesting variants \u2014 that would free me up for actual design thinking.", sentiment: "positive" as const, detection: { tag: "Speech rate ↑", detail: "Speaking tempo increased 25% — elevated enthusiasm and engagement when discussing AI capabilities." } as const },
];

export const PERSONA_CRITERIA = [
  "5+ years of experience in product design or UX research roles",
  "Daily active user of collaborative design & prototyping tools",
  "Led or participated in user research for SaaS platforms",
  "Comfortable articulating workflow pain-points in detail",
];

export const QUOTA_GROUP: QuotaGroup = {
  name: "Quota Group A",
  description: "25–27 y/o · Mid-level UX · B2B SaaS",
};

export const CONVERSATION_ANALYSIS: ConversationAnalysisItem[] = [
  { id: 1, text: "The participant described their current design handoff workflow, highlighting frustrations with manual processes.", time: "00:00 - 02:10", status: "done" as const },
  { id: 2, text: "Key pain points include version control issues and cross-team communication gaps.", time: "02:10 - 03:18", status: "done" as const },
  { id: 3, text: "Expressed strong interest in AI-powered automation for repetitive design tasks and token generation.", time: "03:18 - 05:50", status: "done" as const },
  { id: 4, text: "Discussed desire for seamless tool integration — wants tools to communicate without manual effort.", time: "05:50 - 06:58", status: "done" as const },
  { id: 5, text: "Analysing", time: "06:58 - now", status: "analysing" as const },
];

/* ── Tab definitions ── */
import { User, HelpCircle, BarChart3, ScrollText, ScanFace } from "lucide-react";

export const TABS = [
  { id: "Participant Profile", icon: User, desc: "Participant profile" },
  { id: "Check List", icon: HelpCircle, desc: "Interview guide" },
  { id: "Insights", icon: BarChart3, desc: "Live analysis" },
  { id: "Transcript", icon: ScrollText, desc: "Conversation history" },
  { id: "Analysis", icon: ScanFace, desc: "Facial expression analysis" },
] as const;

export const RIGHT_IDS = ["Participant Profile", "Check List", "Insights"] as const;