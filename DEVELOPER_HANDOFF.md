# UX Research Interview Observer - Developer Handoff Guide

> Last updated: 2026-03-12
> Status: Frontend prototype complete, ready for backend integration

---

## 1. Project Overview

This is an **AI-powered UX research interview observation tool** that provides real-time transcription, behavioral signal analysis, and session management for research teams. The interface follows **Apple Vision Pro spatial computing aesthetics** with glass-morphism surfaces, snap-to-grid panel management, and adaptive theming.

**Target users:**
- UX Researchers (moderators) conducting live interviews
- Observers watching sessions in real-time
- Research ops teams reviewing session data

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18+ (functional components, hooks only) |
| Styling | Tailwind CSS v4 + inline `CSSProperties` |
| Animation | Motion (formerly Framer Motion) via `motion/react` |
| Icons | lucide-react |
| Routing | None (pure state-driven view switching) |
| State | React `useState` / `useRef` / `useCallback` / `useMemo` |
| Type System | TypeScript (strict) |

---

## 3. Architecture Overview

```
App.tsx (Root Orchestrator, ~555 lines)
  |
  |-- State Management (13 state groups)
  |-- Layout Engine (dock computation, panel registration)
  |-- Render Tree (13 layered UI zones)
  |
  |-- components/
  |   |-- constants.ts        # Design tokens (typography, colors, layout, glass styles)
  |   |-- types.ts            # All TypeScript interfaces & domain types
  |   |-- data.ts             # Mock data (sessions, transcripts, insights, tabs)
  |   |-- hooks.ts            # Shared hooks (clock, glass tint, snap-drag)
  |   |-- primitives.tsx      # Surface, Card, SectionLabel, PanelContentArea
  |   |
  |   |-- BackgroundLayer.tsx # Full-viewport video background with crossfade
  |   |-- StatusBar.tsx       # Top-left session info (room name, timer, recording)
  |   |-- ControlBar.tsx      # Bottom-center media controls (mic, video, share, volume)
  |   |-- RightNav.tsx        # Right-side tab bar (panel toggles + reset layout)
  |   |-- DraggablePanel.tsx  # Floating/dockable panel container with resize
  |   |-- LiveTranscript.tsx  # Bottom-center live transcript bubble
  |   |-- PiPView.tsx         # Picture-in-Picture draggable video feed
  |   |-- FollowUpBar.tsx     # Top-center follow-up question queue
  |   |-- ActionToast.tsx     # Behavioral signal notification toasts
  |   |-- FaceAnalysisView.tsx# Facial expression analysis panel content
  |   |-- AnalysisPill.tsx    # Minimized analysis indicator pill
  |   |-- SnapEngine.tsx      # Edge-snap alignment system for panels
  |   |-- TranslateButton.tsx # Inline translation toggle (multi-language)
  |   |-- Tip.tsx             # Tooltip wrapper component
  |   |-- DiscardModal.tsx    # Session discard confirmation dialog
  |   |
  |   |-- panels/
  |   |   |-- PersonaContent.tsx    # Participant profile panel
  |   |   |-- CheckListContent.tsx  # Interview guide / question checklist
  |   |   |-- InsightsContent.tsx   # Live analysis (sentiment, keywords)
  |   |   |-- TranscriptContent.tsx # Full transcript with detections
  |   |   |-- checklist/
  |   |       |-- tile-utils.ts     # Shared tile rendering helpers
```

---

## 4. Render Layer Stack (z-index order)

The UI is composed of 13 absolute-positioned layers:

| Layer | Component | z-index | Position | Description |
|-------|-----------|---------|----------|-------------|
| 0 | `BackgroundLayer` | 0 | Full viewport | Video feeds with gradient overlays |
| 1 | `FollowUpBar` | 10 | Top center | Follow-up question queue (visible when CheckList open) |
| 2 | `ActionToastStack` | 12 | Below status bar, left | Behavioral signal notifications |
| 3 | `StatusBar` | 10 | Top-left | Room name, timer, recording indicator |
| 4 | `PiPView` | (managed) | Bottom-left (default) | Draggable PiP video feed |
| 5 | `RightNav` | 30 | Right center | Tab buttons for panel toggling |
| 6 | `LiveTranscript` | 10 | Bottom center, above ControlBar | Last 2 conversation turns |
| 7 | `SnapGuides` | 52 | Full viewport | Alignment guides (pointer-events: none) |
| 8 | Right Panels | (managed) | Right column | DraggablePanel instances |
| 9 | Analysis Panel | (managed) | Left column | FaceAnalysisView in DraggablePanel |
| 10 | `AnalysisPill` | (managed) | Top-left | Minimized analysis indicator |
| 11 | `ControlBar` | 20 | Bottom center | Media controls |
| 12 | Discard Button | 10 | Bottom right | Quality termination trigger |
| 13 | `DiscardModal` | (overlay) | Center | Confirmation dialog |

---

## 5. Design Token System (`constants.ts`)

### 5.1 Typography Scale
```typescript
T = { display: 20, title: 15, body: 13, caption: 11, micro: 9 } // px
```

### 5.2 Layout Constants
```typescript
G = 12             // Universal grid gap (px)
NAV_W = 54         // Right nav icon column width
LEFT_W = 345       // Left panel & PiP width
CTRL_BAR_H = 52    // Control bar height
STATUS_H = 61      // Status bar height
STATUS_GAP = 3     // Gap below status bar
PANEL_W = 356      // Standard right panel width
PANEL_DEFAULT_H = 420 // Default panel height
PANEL_MIN_H = 180  // Min resize height
PANEL_MAX_H = 800  // Max resize height
SNAP_DIST = 10     // Snap alignment threshold
```

### 5.3 Color Palette
```typescript
C = {
  accent:       "#615FFF",              // Primary brand purple
  accentMuted:  "rgba(97,95,255,0.10)", // Subtle accent background
  accentBorder: "rgba(97,95,255,0.18)", // Accent border
  negative:     "#FF8080",              // Error / low quality
  positive:     "#6DD4A0",              // Success / high quality
  warning:      "#FFD166",              // Warning / medium quality
}
```

### 5.4 Glass-Morphism Presets

All glass styles use `rgba()` values (never oklch) to avoid animation engine conflicts:

- **`surfaceStyle`** -- Primary container: blur(48px), neumorphic inset shadows, depth shadow
- **`cardStyle`** -- Inner card: subtle inset bevel, no depth shadow
- **`cardGlowStyle`** -- Active card: cardStyle + accent glow
- **`tipStyle`** -- Tooltip: dark semi-transparent, smaller radius
- **`glass`** -- Raw backdrop-filter (blur + saturate + brightness)

### 5.5 Adaptive Glass Tinting

The system samples the background image's luminance (0-1) and adjusts all glass surfaces:
- Dark backgrounds -> white frosted glass (`rgba(255,255,255,~0.03)`)
- Bright backgrounds -> dark tinted glass (inverted tone, higher opacity)

Function: `tintedBg(luminance, baseAlpha)` in `constants.ts`
Hook: `useAdaptiveGlass()` in `hooks.ts` returns `{ surface, card, cardGlow }` style objects

---

## 6. Core Data Types (`types.ts`)

### 6.1 Session & Questions
```typescript
interface Session {
  id: number;
  label: string;        // "Session 03"
  date: string;         // "Feb 14"
  duration: string;     // "31m" or "Live"
  questions: SessionQuestion[];
}

interface SessionQuestion {
  id: number;
  text: string;                    // Question text
  completed: boolean;
  status: "done" | "active" | "pending";
  engagement?: number;             // 0-100 score
  summary?: string;                // AI-generated summary
  signals?: QuestionSignal[];      // Behavioral detections
  timeRange?: string;              // "00:00 - 08:30"
  suggestedFollowUp?: string;      // AI suggestion
}
```

### 6.2 Behavioral Signals
```typescript
type SignalIconType = "hesitation" | "pitch" | "filler" | "speed" | "emotion" | "gaze" | "agreement";

interface QuestionSignal {
  icon: SignalIconType;
  label: string;    // "Speech rate up"
  detail: string;   // "Tempo +22% when discussing..."
}
```

### 6.3 Transcript
```typescript
interface TranscriptTurn {
  id: number;
  time: string;                    // "01:28"
  speaker: "mod" | "int";         // Moderator or Interviewee
  name: string;                   // "Cookiy AI" or "#9527"
  text: string;
  sentiment?: "positive" | "neutral" | "negative";
  detection?: {
    tag: string;    // "Hesitation detected"
    detail: string; // Explanation
  };
}
```

### 6.4 Insights
```typescript
interface InsightsData {
  sentiment: { positive: number; neutral: number; negative: number };  // percentages
  highlights: InsightHighlight[];  // { text, intensity: 0-1 }
  keywords: InsightKeyword[];      // { tag, count }
}
```

### 6.5 Follow-Up Questions
```typescript
interface FollowUpQuestion {
  id: number;
  text: string;
  urgent: boolean;
  status: "pending" | "asked" | "failed";
  time: string;       // submission time
  observer: string;   // "Observer 1" or "AI"
}
```

### 6.6 Quality Derivation
Engagement score maps to quality levels:
- **High** (>= 80): Green `#6DD4A0`
- **Mid** (>= 60): Yellow `#FFD166`
- **Low** (< 60): Red `#FF8080`

---

## 7. State Management (App.tsx)

All state lives in `App.tsx` and is passed down via props. There are **13 state groups**:

### 7.1 Panel Management
```typescript
openPanels: Set<string>           // Which panels are visible
detached: Record<string, {x,y,h}> // Floating panel positions
draggingId: string | null          // Currently dragged panel
resetKey: number                   // Incremented to force remount
panelsMoved: boolean               // True if any panel was dragged
```

### 7.2 Media Controls
```typescript
isMicOn, isVideoOn, isScreenSharing, isSpeakerOn: boolean
volume: number (0-100)
```

### 7.3 Analysis Panel
```typescript
analysisMinimized: boolean  // Collapsed to pill
analysisOpen: boolean       // Derived from openPanels.has("Analysis")
```

### 7.4 PiP (Picture-in-Picture)
```typescript
pipSwapped: boolean         // Swap main/pip video feeds
pipDockedRight: boolean     // PiP docked into right panel stack
aiModDragging: boolean      // PiP being dragged
pipX, pipY, pipW, pipH: MotionValue<number>  // Animated position/size
```

### 7.5 Translation
```typescript
translateLang: LangCode  // null | "zh" | "ja" | "ko" | "es" | "fr" | "de"
```

### 7.6 Follow-Up Queue
```typescript
followUps: FollowUpQuestion[]  // Observable queue with async delivery simulation
```

### 7.7 Discard Session
```typescript
discardOpen: boolean
discardReason: string | null
discarded: boolean
```

### 7.8 Notifications
```typescript
notificationsOn: boolean  // Toggle behavioral signal toasts
```

---

## 8. Panel System

### 8.1 Available Panels

| Panel ID | Position | Content | Tab Icon |
|----------|----------|---------|----------|
| `Participant Profile` | Right dock | Persona card, criteria, quota info | User |
| `Check List` | Right dock | Interview guide with progress tracking | HelpCircle |
| `Insights` | Right dock | Sentiment, highlights, keywords | BarChart3 |
| `Transcript` | Right dock | Full transcript with detections | ScrollText |
| `Analysis` | Left dock | Facial expression analysis | ScanFace |

### 8.2 Dock Layout Algorithm

Right panels stack vertically with automatic height distribution:
- **1 panel**: Full available height
- **2 panels**: `min(420, (availH - gap) / 2)`
- **3+ panels**: `min(360, (availH - gaps) / count)`, narrower width (320px)

PiP can dock into the right stack as an additional panel.

### 8.3 Drag Lifecycle
1. **Drag Start** -> Panel registers in drag state
2. **Drag Move** -> Snap engine computes alignment with other panels
3. **Drag End** -> If near right edge: re-dock. Otherwise: float at drop position
4. **Double-click header** -> Re-dock to right column
5. **Reset Layout** -> All panels animate back to dock positions

### 8.4 Compact Levels (PanelContentArea)

Each panel measures its content height and reports a compact level:
- **Level 0** (>500px): Full layout
- **Level 1** (180-500px): Half-compact
- **Level 2** (120-180px): Compact
- **Level 3** (<120px): Minimal

Panel content components adapt their rendering based on `useCompact()`.

---

## 9. Snap-to-Grid System (`SnapEngine.tsx`)

### 9.1 Algorithm
- Panels register their bounding rect in `panelRectsRef: Record<string, PRect>`
- During drag, `computeSnap()` compares dragged panel edges against all other panels
- Snap types: **edge-to-edge**, **edge-to-edge + gap(G)**, **center-to-center**
- Threshold: 10px (`SNAP_DIST`)
- Returns `{ dx, dy, lines }` -- offset correction + visual guide lines

### 9.2 Visual Guides
`SnapGuides` renders alignment lines as gradient-faded lines with dot endpoints, using the accent color.

---

## 10. Key Interaction Patterns

### 10.1 LiveTranscript
- **Drag** to reposition anywhere on screen
- **Double-click** to animate back to default position (above control bar)
- **Reset Layout** also returns transcript to default position
- Shows last 2 conversation turns with optional inline translation

### 10.2 PiP Video
- **Drag** to reposition
- **Click swap icon** to swap main/PiP video feeds
- **Drag to right edge** to dock into right panel stack
- **Drag out** to undock back to floating

### 10.3 Follow-Up Questions
- Visible when CheckList panel is open
- New questions added via CheckList panel or FollowUpBar
- Async delivery simulation: 2-5s delay, 70% success rate
- Urgent questions pushed to top of queue

### 10.4 Action Toasts
- Auto-generated behavioral signal notifications (mock: every 8-15s)
- Auto-dismiss after 6s
- Snap-draggable as a group
- Toggle notifications via bell icon in toast handle

### 10.5 Discard Session
- Opens confirmation modal with reason selection
- Reasons: "Failed technical setup", "Participant no-show", "Wrong participant", "Participant requested"
- Custom reason input field
- Animated confirmation state

---

## 11. Backend API Integration Points

All data is currently **mocked** in `data.ts`. Here are the API endpoints needed for production:

### 11.1 Real-time Data Streams (WebSocket / SSE)

| Stream | Current Mock | Expected Payload | Frequency |
|--------|-------------|-----------------|-----------|
| **Live Transcript** | Static 2 turns in `LiveTranscript.tsx` | `TranscriptTurn` objects | Per speech turn |
| **Behavioral Signals** | Random timer in `useActionEvents()` | `{ type, detail, confidence, timestamp }` | Event-driven |
| **Emotion Analysis** | Cycling mock in `useEmotionCycle()` | `{ emotion, confidence, valence, arousal, landmarks? }` | ~1-3 fps |
| **Session Timer** | `useClock()` counting from 0 | Server-synced elapsed time | Every second |

### 11.2 REST API Endpoints

| Endpoint | Method | Purpose | Request | Response |
|----------|--------|---------|---------|----------|
| `/api/sessions` | GET | Fetch session list | -- | `Session[]` |
| `/api/sessions/:id` | GET | Fetch session detail | -- | `Session` with full questions |
| `/api/sessions/:id/transcript` | GET | Fetch transcript history | `?from=timestamp` | `TranscriptTurn[]` |
| `/api/sessions/:id/insights` | GET | Fetch aggregated insights | -- | `InsightsData` |
| `/api/sessions/:id/follow-ups` | GET | Fetch follow-up queue | -- | `FollowUpQuestion[]` |
| `/api/sessions/:id/follow-ups` | POST | Submit new follow-up | `{ text, urgent }` | `FollowUpQuestion` |
| `/api/sessions/:id/follow-ups/:fid` | PATCH | Update follow-up status | `{ status }` | `FollowUpQuestion` |
| `/api/sessions/:id/discard` | POST | Discard session | `{ reason }` | `{ success }` |
| `/api/sessions/:id/persona` | GET | Fetch participant persona | -- | Persona profile data |
| `/api/sessions/:id/analysis` | GET | Fetch conversation analysis | -- | `ConversationAnalysisItem[]` |
| `/api/translate` | POST | Translate text | `{ text, targetLang }` | `{ translated }` |

### 11.3 Media Streams

| Stream | Current Mock | Production |
|--------|-------------|------------|
| Main video feed | Static image | WebRTC / HLS stream |
| PiP video feed | Static image | WebRTC / HLS stream |
| Audio | Not implemented | WebRTC audio track |
| Screen share | Toggle state only | WebRTC screen capture |

### 11.4 Authentication & Permissions

Not implemented in prototype. Expected:
- **Observer role**: Read-only access, can submit follow-up questions
- **Moderator role**: Full control (mic, camera, question flow)
- **Admin role**: Discard sessions, manage quota groups

---

## 12. Translation System

### 12.1 Supported Languages
```
null (off) | "zh" (Chinese) | "ja" (Japanese) | "ko" (Korean)
| "es" (Spanish) | "fr" (French) | "de" (German)
```

### 12.2 Current Implementation
Static lookup table in `TranslateButton.tsx` with hardcoded translations for demo sentences.

### 12.3 Production Replacement
Replace `getTranslation(lang, text)` with an async API call to a translation service. Consider caching translations per session to avoid redundant API calls.

---

## 13. Checklist / Interview Guide System

### 13.1 Question Lifecycle
```
pending -> active -> done
```

### 13.2 Session Sections
Questions are grouped into logical sections:
- **S1 Onboarding** (Q1-Q4)
- **S2 Workflow** (Q5-Q10)
- **S3 Collaboration** (Q11-Q16)
- **S4 Strategy** (Q17-Q20)

### 13.3 Engagement Visualization
Each completed question has an engagement score (0-100) displayed as:
- Color-coded tile background (green/yellow/red)
- Mini bar indicator (1-3 bars based on quality)
- Signal icons (emotion, hesitation, gaze indicators)

### 13.4 AI-Suggested Follow-Ups
Some completed questions have `suggestedFollowUp` strings. In production, these should be generated by the AI moderator based on conversation analysis.

---

## 14. Behavioral Signal Types

| Signal | Icon | Color Family | Description |
|--------|------|-------------|-------------|
| `emotion` | Star | Green | Strong emotional reaction detected |
| `speed` | Star | Green | Speech rate change (usually increase = engagement) |
| `agreement` | Star | Green | Nodding / affirmative gestures |
| `hesitation` | Warning | Yellow | Long pause before speaking |
| `pitch` | Warning | Yellow | Voice pitch shift (up = stress, down = deflation) |
| `filler` | Warning | Yellow | Filler words ("um", "like", "sort of") |
| `gaze` | Warning | Red | Gaze drift / aversion |

---

## 15. Known Technical Constraints

### 15.1 Figma Make Sandbox
- No `React.Fragment` shorthand (`<>...</>`) -- use real DOM elements
- `motion` components must be destructured at module top level: `const MotionDiv = motion.div`
- All hooks must be called unconditionally at component top level

### 15.2 Tailwind v4 + Motion Conflict
- Tailwind v4 uses `oklch()` color format internally
- Motion's animation engine only parses `rgba()` values
- **Rule**: All animated CSS properties must use `rgba()` inline styles
- **Rule**: Never combine `transition-colors` Tailwind class with inline border/background styles
- **Rule**: CSS `border` shorthand must be split into `borderWidth`, `borderStyle`, `borderColor`

### 15.3 Color Format
- Never use `text-white/8` or other opacity shorthand Tailwind classes on elements with Motion animations
- Use `rgba(255,255,255,0.08)` inline style instead

---

## 16. Mock Data Replacement Checklist

When connecting to a real backend, replace these mock sources:

| Mock Location | Replace With |
|--------------|-------------|
| `data.ts` > `SESSIONS` | GET `/api/sessions/:id` |
| `data.ts` > `TRANSCRIPT` | WebSocket live stream + GET history |
| `data.ts` > `INSIGHTS` | GET `/api/sessions/:id/insights` (polling or SSE) |
| `data.ts` > `AI_FOLLOWUPS` | AI-generated suggestions via WebSocket |
| `data.ts` > `PERSONA_CRITERIA` | GET `/api/sessions/:id/persona` |
| `data.ts` > `QUOTA_GROUP` | Session metadata from API |
| `data.ts` > `CONVERSATION_ANALYSIS` | SSE stream of analysis chunks |
| `FaceAnalysisView.tsx` > `useEmotionCycle()` | WebSocket emotion stream |
| `ActionToast.tsx` > `useActionEvents()` | WebSocket behavioral signal stream |
| `LiveTranscript.tsx` > static turns | WebSocket transcript stream |
| `TranslateButton.tsx` > `getTranslation()` | POST `/api/translate` |
| `hooks.ts` > `useClock()` | Server-synced session timer |
| `BackgroundLayer.tsx` > static images | WebRTC/HLS video streams |

---

## 17. Recommended Production Enhancements

1. **State Management**: Consider Zustand or Jotai for complex state (13 state groups in App.tsx)
2. **Real-time**: WebSocket connection manager with reconnection logic
3. **Performance**: Virtualized transcript list for long sessions (react-window)
4. **Persistence**: Save panel layout preferences per user
5. **Accessibility**: Add keyboard navigation for panel management
6. **Testing**: Component-level tests for DraggablePanel snap logic, quality derivation
7. **Error Handling**: Network failure states, reconnection UI, data staleness indicators
8. **Mobile**: Current design is desktop-only; consider a simplified mobile observer view
