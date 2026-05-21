/**
 * observe-room/ — Components exclusive to the Researcher Observe Room (route: /)
 *
 * The Observe Room is a cinematic dark-glass interface where researchers
 * watch an AI-moderated interview in real time. It includes:
 *
 *   Layout & Chrome
 *   ├── BackgroundLayer     — Full-viewport video background with crossfade
 *   ├── StarryBackground    — Immersive starry sky for paused state
 *   ├── StatusBar           — Top-left session info strip (room name, rec indicator, timer)
 *   ├── ControlBar          — Bottom-center media controls (mic, cam, volume, brightness)
 *   ├── RightNav            — Right-edge vertical tab bar for panel toggling
 *   ├── LeftNav             — Left-edge placeholder
 *   └── DiscardModal        — Session discard confirmation dialog
 *
 *   Panels (right-side draggable)
 *   ├── DraggablePanel      — Floating resizable panel container
 *   ├── panels/PersonaContent    — Participant profile & screener criteria
 *   ├── panels/CheckListContent  — Interview question checklist (4-state adaptive)
 *   ├── panels/InsightsContent   — Live sentiment & keyword analysis
 *   └── panels/TranscriptContent — Full conversation history
 *
 *   Video & Face Analysis
 *   ├── FaceAnalysisView    — Emotion detection panel (AU indicators, gauges)
 *   ├── FaceStageView       — Face in main stage frame (when PiP swapped)
 *   ├── AnalysisPill        — Minimized floating pill for Analysis panel
 *   ├── LeftDockPiP         — Picture-in-picture camera view (left dock)
 *   └── VideoStreamSlot     — WebRTC-ready <video> wrapper
 *
 *   Live Transcript & Follow-ups
 *   ├── LiveTranscript      — Floating dual-speaker caption bubble
 *   ├── LeftDockModule      — Left-dock transcript module (collapsed/expanded)
 *   ├── FollowUpBar         — Top-center follow-up question queue
 *   ├── TranslateButton     — Inline translation language picker
 *   └── useLiveSimulation   — Shared live caption simulation engine
 *
 *   Interaction
 *   ├── ActionToast          — Real-time behavioral signal toast notifications
 *   ├── SnapEngine           — Snap-to-grid alignment system
 *   └── ParticipantTaskView  — Observer mirror of participant's active task screen
 */

// Layout & Chrome
export { BackgroundLayer } from "../BackgroundLayer";
export { StarryBackground } from "../StarryBackground";
export { StatusBar } from "../StatusBar";
export { ControlBar } from "../ControlBar";
export { RightNav } from "../RightNav";
export { LeftNav } from "../LeftNav";
export { DiscardModal } from "../DiscardModal";

// Panels
export { DraggablePanel } from "../DraggablePanel";
export { PersonaContent } from "../panels/PersonaContent";
export { CheckListContent } from "../panels/CheckListContent";
export { InsightsContent } from "../panels/InsightsContent";
export { TranscriptContent } from "../panels/TranscriptContent";

// Video & Face Analysis
export { AnalysisContent, useEmotionCycle, FaceMeshOverlay } from "../FaceAnalysisView";
export type { EmotionState } from "../FaceAnalysisView";
export { FaceStageView } from "../FaceStageView";
export { AnalysisPill } from "../AnalysisPill";
export { LeftDockPiP } from "../LeftDockPiP";
export { VideoStreamSlot } from "../VideoStreamSlot";

// Live Transcript & Follow-ups
export { LiveTranscript } from "../LiveTranscript";
export { LeftDockModule } from "../LeftDockModule";
export { FollowUpBar } from "../FollowUpBar";
export { TranslateButton, getTranslation } from "../TranslateButton";
export type { LangCode } from "../TranslateButton";
export { useLiveSimulation } from "../useLiveSimulation";

// Interaction
export { ActionToastStack, useActionEvents } from "../ActionToast";
export { SnapGuides, computeSnap } from "../SnapEngine";
export type { PRect, SnapLine } from "../SnapEngine";
export { ParticipantTaskView } from "../ParticipantTaskView";

// Shared utilities (re-exported for convenience)
export { Tip } from "../Tip";
