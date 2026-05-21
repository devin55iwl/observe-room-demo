/**
 * ============================================================================
 *  OBSERVE ROOM — Complete Frontend Specification
 *  For AI-assisted 100% reproduction of the researcher observation interface
 * ============================================================================
 *
 *  Route: `/` (ResearcherView.tsx)
 *  Role:  Research observer watches a live AI-moderated interview.
 *         Observer is passive (mic/cam disabled), but can inject follow-up
 *         questions and toggle analysis panels.
 *
 * ============================================================================
 *  TABLE OF CONTENTS
 * ============================================================================
 *
 *  0. GLOBAL ENVIRONMENT CONSTRAINTS
 *  1. VIEWPORT & COORDINATE SYSTEM
 *  2. Z-INDEX STACK
 *  3. BACKGROUND LAYER (BackgroundLayer.tsx)
 *  4. STARRY BACKGROUND — PAUSED STATE (StarryBackground.tsx)
 *  5. STATUS BAR (StatusBar.tsx)
 *  6. LEFT DOCK — TRANSCRIPT MODULE (LeftDockModule.tsx)
 *  7. LEFT DOCK — PiP CAMERA (LeftDockPiP.tsx)
 *  8. FOLLOW-UP BAR (FollowUpBar.tsx)
 *  9. ACTION TOAST STACK (ActionToast.tsx)
 * 10. RIGHT NAV — ICON TABS (RightNav.tsx)
 * 11. DRAGGABLE PANELS — RIGHT COLUMN (DraggablePanel.tsx)
 * 12. ANALYSIS PANEL & PILL (FaceAnalysisView.tsx, AnalysisPill.tsx)
 * 13. CONTROL BAR — BOTTOM (ControlBar.tsx)
 * 14. DISCARD MODAL (DiscardModal.tsx)
 * 15. TASK VIEW & FACE STAGE (ParticipantTaskView.tsx, FaceStageView.tsx)
 * 16. SNAP ENGINE (SnapEngine.tsx)
 * 17. LIVE SIMULATION ENGINE (useLiveSimulation.ts)
 * 18. DESIGN TOKENS (constants.ts)
 * 19. ADAPTIVE GLASS SYSTEM (hooks.ts)
 * 20. ORCHESTRATOR STATE MACHINE (ResearcherView.tsx)
 *
 * ============================================================================
 *
 *  READING GUIDE:
 *  - Every section specifies exact pixel values, colors, animations, and
 *    responsive behavior.
 *  - "Motion" refers to the `motion/react` library (formerly Framer Motion).
 *  - All animation values are copy-paste ready.
 *  - This file is `.tsx` so it lives in the source tree and is always
 *    co-located with the implementation.
 *
 * ============================================================================
 */

// This file is documentation only. It exports nothing.
// It exists so AI tools can `read` it and reproduce the Observe Room exactly.

export {};

/* ============================================================================
 *  0. GLOBAL ENVIRONMENT CONSTRAINTS
 * ============================================================================
 *
 *  The app runs inside Figma Make's iframe sandbox. These constraints MUST
 *  be followed in every file:
 *
 *  A) IMPORT ORDER
 *     All `import` statements MUST come before any `const`/`let`/`function`
 *     declarations. No interleaving.
 *
 *  B) MOTION PRE-DESTRUCTURE
 *     After all imports, immediately create module-level constants:
 *       const MotionDiv = motion.div;
 *       const MotionSpan = motion.span;
 *     Then use <MotionDiv> in JSX instead of <motion.div>.
 *
 *  C) NO CSS SHORTHAND MIXING
 *     In style objects, never mix `border` shorthand with `borderColor` etc.
 *     Always use the expanded form:
 *       { borderWidth: 1, borderStyle: "solid", borderColor: "rgba(…)" }
 *
 *  D) NO TAILWIND TRANSITION CLASSES
 *     Do NOT use Tailwind transition classes (`transition-all`, `duration-200`).
 *     Use inline style: { transitionProperty: "…", transitionDuration: "…" }
 *     Exception: Only in rare static elements where Motion is not used.
 *
 *  E) ALL COLORS IN rgba()
 *     Tailwind v4 uses oklch internally. Motion animations parsing oklch
 *     will crash. Always use rgba() for any color that might be animated.
 *
 *  F) FONT
 *     System font stack: `'Inter', -apple-system, sans-serif`
 *     Referred to as `SF` in participant page; no custom font loading needed.
 */

/* ============================================================================
 *  1. VIEWPORT & COORDINATE SYSTEM
 * ============================================================================
 *
 *  The root container is `h-screen w-screen overflow-hidden` with
 *  `bg-[#0a0b0f]` (near-black).
 *
 *  All UI elements are positioned with a universal grid gap:
 *
 *    G = 12px  (gap between every element and viewport edges)
 *
 *  Key layout measurements:
 *
 *    NAV_W    = 54px    Right nav icon column width
 *    LEFT_W   = 345px   Left column width (status bar, transcript, PiP)
 *    CTRL_BAR_H = 52px  Bottom control bar height
 *    STATUS_H = 61px    Top status bar height
 *    STATUS_GAP = 3px   Gap below status bar
 *    PANEL_W  = 356px   Standard right panel width
 *    PANEL_DEFAULT_H = 420px
 *    PANEL_MIN_H = 180px
 *    PANEL_MAX_H = 800px
 *
 *  Layout zones (left to right):
 *
 *    ┌──────────────────────────────────────────────────────────┐
 *    │ G │ LEFT_W │ G │     CENTER STAGE      │ G │ PANELS │ G │ NAV_W │ G │
 *    └──────────────────────────────────────────────────────────┘
 *
 *  The CENTER STAGE area is where the full-bleed video background shows.
 *  Its right edge is dynamically computed as `centreRight`:
 *
 *    centreRight = G + NAV_W + G                         (no panels open)
 *    centreRight = G + NAV_W + G + PANEL_W + G           (1-2 panels)
 *    centreRight = G + NAV_W + G + 320 + G               (3+ panels, narrower)
 *
 *  When centreRight changes, the control bar, follow-up bar, and toast stack
 *  all animate with:
 *    transition: "right 0.32s cubic-bezier(0.32,0.72,0,1)"
 */

/* ============================================================================
 *  2. Z-INDEX STACK
 * ============================================================================
 *
 *  From back to front:
 *
 *    z-0   BackgroundLayer (video feeds + vignette + edge gradients)
 *    z-5   StarryBackground (only when session paused)
 *    z-10  Left dock column (StatusBar, LeftDockModule)
 *    z-10  Follow-up bar (top center)
 *    z-18  Task view / Face stage (when screen share active)
 *    z-20  Control bar (bottom center)
 *    z-25  Discard button (bottom right)
 *    z-30  Right nav (tab bar)
 *    z-35  Action toast stack (right of center)
 *    z-50  DraggablePanel instances (default)
 *    z-60  Tooltips
 *    z-70  Volume/Brightness popup sliders
 *    z-80  PausedOverlay (participant side only)
 */

/* ============================================================================
 *  3. BACKGROUND LAYER  (BackgroundLayer.tsx)
 * ============================================================================
 *
 *  PURPOSE: Full-viewport video background with crossfade between two feeds.
 *
 *  STRUCTURE (bottom to top):
 *    1. Hidden <img> for luminance sampling (opacity: 0, crossOrigin="anonymous")
 *    2. Interviewee feed — <img> full-bleed, object-cover
 *    3. AI Moderator feed — <img> full-bleed, object-cover
 *    4. Radial vignette overlay
 *    5. Vertical gradient overlay
 *    6. Left edge gradient (41% width)
 *    7. Right edge gradient (38% width)
 *
 *  IMAGE FILTER: brightness(0.88) contrast(1.04) on both feeds
 *
 *  CROSSFADE:
 *    - Driven by `pipSwapped` boolean
 *    - Interviewee: opacity = pipSwapped ? 0 : 1
 *    - AI Moderator: opacity = pipSwapped ? 1 : 0
 *    - transition: opacity 0.6s ease
 *
 *  VIGNETTE (layer 4):
 *    radial-gradient(ellipse 80% 70% at 42% 42%, transparent 25%, rgba(10,12,18,0.55) 100%)
 *
 *  VERTICAL GRADIENT (layer 5):
 *    linear-gradient(180deg,
 *      rgba(10,11,15,0.25) 0%,
 *      transparent 30%,
 *      transparent 50%,
 *      rgba(10,11,15,0.60) 100%
 *    )
 *
 *  LEFT EDGE (layer 6):
 *    width: 41%
 *    linear-gradient(92deg, rgba(0,0,0,0.5) 7%, rgba(115,115,115,0) 97.5%)
 *
 *  RIGHT EDGE (layer 7):
 *    width: 38%
 *    linear-gradient(268deg, rgba(0,0,0,0.5) 7%, rgba(115,115,115,0) 97.5%)
 *
 *  TASK VIEW BEHAVIOR:
 *    When taskViewOpen === true, all feeds + edge gradients fade out:
 *    opacity: 0, transition: opacity 0.55s cubic-bezier(0.32,0.72,0,1)
 *    The base #0a0b0f background shows through.
 *
 *  ADAPTIVE GLASS TINTING:
 *    The hidden <img> is sampled via canvas to get average luminance (0-1).
 *    This value feeds into GlassTintCtx, which adjusts all panel backgrounds
 *    so they remain readable on both dark and bright video content.
 *    See section 19 for details.
 */

/* ============================================================================
 *  4. STARRY BACKGROUND — PAUSED STATE  (StarryBackground.tsx)
 * ============================================================================
 *
 *  PURPOSE: When the session is paused (P or Space key), an immersive starry
 *  sky replaces the video background.
 *
 *  LAYERS (bottom to top):
 *    1. Deep midnight gradient base
 *    2. Upper ambient glow (blue bloom)
 *    3. Canvas — 110 randomly twinkling stars
 *    4. SVG — Cancer constellation with connecting lines + labels
 *    5. "Session Paused · Observing" pill at top center
 *
 *  GRADIENT BASE:
 *    Three composited gradients:
 *    - radial-gradient(ellipse 90% 60% at 50% 28%, rgba(12,28,68,0.90) 0%, transparent 70%)
 *    - radial-gradient(ellipse 60% 40% at 30% 70%, rgba(8,16,42,0.50) 0%, transparent 60%)
 *    - linear-gradient(175deg, #040c1e 0%, #020810 42%, #010609 100%)
 *
 *  AMBIENT GLOW:
 *    Position: top -10%, left/right 15%, height 55%
 *    radial-gradient(ellipse 80% 70% at 50% 20%,
 *      rgba(20,50,110,0.45) 0%, rgba(10,25,65,0.22) 50%, transparent 80%)
 *    filter: blur(30px)
 *
 *  STAR FIELD (Canvas):
 *    - 110 stars, randomly placed
 *    - 12% are large (r = 1.6-2.8px), rest small (r = 0.5-1.5px)
 *    - Color tints: 20% blue-white [210,225,255], 10% warm [255,235,210], 70% cool white [230,240,255]
 *    - Animation: each star has sinusoidal opacity oscillation
 *      alpha = max(0.08, baseOpacity + sin(t * speed + phase) * 0.28 * (baseOpacity - 0.2))
 *    - Large stars (r > 1.4) get a radial glow halo at 4.5x radius, alpha * 0.35
 *    - requestAnimationFrame loop, only runs when visible
 *    - ResizeObserver rebuilds star array on canvas resize
 *
 *  CANCER CONSTELLATION (SVG):
 *    6 stars with astronomical positions mapped to [x%, y%]:
 *      beta (Tarf):   58.5, 58.0  mag 3.5 (brightest)
 *      delta:         48.0, 50.0  mag 3.9
 *      iota:          40.5, 36.5  mag 4.0
 *      gamma:         45.0, 44.0  mag 4.7
 *      alpha (Acubens): 55.0, 57.0  mag 4.3
 *      zeta:          35.5, 52.0  mag 5.1
 *
 *    Connecting lines: iota→gamma→delta→alpha→beta, gamma→zeta
 *    Line style: stroke rgba(160,190,255,0.18), strokeWidth 0.15
 *
 *    Star rendering: SVG circles with gaussian blur filter (stdDeviation 0.6-0.9)
 *    Magnitude → radius: max(1.2, (6.2 - mag) * 0.9) * 0.32 (SVG units)
 *    Labels: "CANCER" at [47, 67], font 2.2px, fill rgba(160,185,255,0.30)
 *
 *  ENTRY/EXIT:
 *    <AnimatePresence> with MotionDiv
 *    initial: { opacity: 0 }
 *    animate: { opacity: 1 }
 *    exit: { opacity: 0 }
 *    transition: { duration: 1.2, ease: "easeInOut" }
 *
 *  PAUSED PILL (top center):
 *    padding: 5px 16px, borderRadius: 20
 *    background: rgba(255,255,255,0.04)
 *    border: 0.5px solid rgba(255,255,255,0.08)
 *    Contains pulsing dot (5px, rgba(180,200,255,0.35), animation: starPulse 3s)
 *    Text: "Session Paused · Observing", 10px, rgba(180,200,255,0.38), letter-spacing: 0.18em
 */

/* ============================================================================
 *  5. STATUS BAR  (StatusBar.tsx)
 * ============================================================================
 *
 *  POSITION: Top-left, absolute z-10
 *    top: G, left: G, width: LEFT_W (345px)
 *
 *  CONTAINER: <Surface> (adaptive glass) — see section 18 for Surface spec
 *    className: px-4 py-2.5 flex items-center
 *
 *  LEFT SECTION:
 *    - Title: "Observe Room #9527", fontSize: T.body (13px), color: white/90
 *    - Subtitle row:
 *      - "AI Tools Research", fontSize: T.micro (9px), color: white/40
 *      - Dot separator: 2px circle, rgba(255,255,255,0.15)
 *      - Badge: "Research Ops"
 *        fontSize: T.micro, color: rgba(97,95,255,0.70)
 *        background: rgba(97,95,255,0.10)
 *        border: 0.5px solid rgba(97,95,255,0.20)
 *        borderRadius: 4px, padding: 0 5px
 *
 *  RIGHT SECTION (separated by 0.5px left border white/6):
 *    - REC indicator pill:
 *      borderRadius: pill (9999), background: rgba(255,128,128,0.08)
 *      border: 0.5px solid rgba(255,128,128,0.12)
 *      Pulsing red dot: 6px (1.5 class), animate-pulse, color: C.negative (#FF8080)
 *      Label: "Rec", T.micro, white/50, uppercase, tracking 0.1em
 *    - Clock: T.body, white/50, font-mono tabular-nums, format "MM:SS"
 */

/* ============================================================================
 *  6. LEFT DOCK — TRANSCRIPT MODULE  (LeftDockModule.tsx)
 * ============================================================================
 *
 *  POSITION: Left column, below status bar, above PiP
 *    flexbox child inside left dock column
 *
 *  TWO STATES:
 *
 *  A) COLLAPSED (default):
 *     Compact LiveBar showing the last completed utterance + LIVE dot.
 *     Height: ~44px auto, inside a Surface container.
 *     Click anywhere → expand.
 *
 *     LiveBar content:
 *     - Speaker icon (Sparkles for mod, User for int), size 11px
 *     - Speaker name, T.micro (9px), speaker color
 *     - Utterance text (truncated), T.caption (11px), white/50
 *     - LIVE dot: 5px pulsing circle, color rgba(109,212,160,0.75)
 *
 *  B) EXPANDED:
 *     flex: "1 1 0", fills available vertical space.
 *     Scrollable history of past turns + pinned LiveBar footer.
 *
 *     History area:
 *     - Scrollable, scrollbar hidden (scrollbarWidth: "none")
 *     - Each turn: speaker badge + timestamp + text
 *     - Speaker badge: 18px circle with icon, colored per speaker
 *     - Timestamp: T.micro, white/20, monospace
 *     - Text: T.caption, white/60, line-height 1.55
 *     - Auto-scroll to bottom on new turns (scrollIntoView smooth)
 *
 *     Footer LiveBar:
 *     - Shows TranscribingDots animation when streaming
 *     - TranslateButton positioned bottom-right of speaker row
 *
 *  EXPAND/COLLAPSE ANIMATION:
 *    Uses Motion layout animation:
 *    <MotionDiv layout transition={{ duration: 0.32, ease: [0.32,0.72,0,1] }}>
 *    When expanded: style { flex: "1 1 0", minHeight: 0 }
 *    When collapsed: style { flexShrink: 0 }
 *
 *  TOGGLE STRIP (bottom of module):
 *    height: 28px, full width
 *    borderTop: 0.5px solid rgba(255,255,255,0.06)
 *    Contains chevron (ChevronUp) that rotates 180deg when expanded
 *    Hover: background rgba(255,255,255,0.045)
 *    Left/right decorative rules: 40px lines, rgba(255,255,255,0.06)
 */

/* ============================================================================
 *  7. LEFT DOCK — PiP CAMERA  (LeftDockPiP.tsx)
 * ============================================================================
 *
 *  PURPOSE: Thumbnail camera feeds, only visible when task view is open.
 *
 *  ENTRY ANIMATION:
 *    initial: { opacity: 0, y: 12, scale: 0.96 }
 *    animate: { opacity: 1, y: 0, scale: 1 }
 *    exit: { opacity: 0, y: 8, scale: 0.97 }
 *    transition: { type: "spring", damping: 28, stiffness: 260 }
 *
 *  CONTAINER: Surface with overflow hidden, borderRadius: R.lg (24px)
 *    Width: LEFT_W (345px), aspect ratio driven by content
 *
 *  CONTENT:
 *    Two overlapping image layers (interviewee + AI) with crossfade
 *    Toggle switch: User / Monitor icons
 *    - Active: C.accent background
 *    - Inactive: rgba(255,255,255,0.08)
 *    - Pill container: rgba(0,0,0,0.50) with backdrop-blur(24px)
 *
 *  VIDEO REFS:
 *    faceVideoRef and screenVideoRef are forwarded for WebRTC attachment.
 *    <video> elements are overlaid on <img> placeholders.
 *    When a real stream connects: video becomes visible, img stays behind.
 *
 *  REFLECTION OVERLAYS:
 *    Two lens-flare/reflection images composited on top for visual polish.
 *    Mix-blend-mode: screen, opacity ~0.35
 */

/* ============================================================================
 *  8. FOLLOW-UP BAR  (FollowUpBar.tsx)
 * ============================================================================
 *
 *  POSITION: Top center, between left dock and right panels
 *    top: G, left: G + LEFT_W + G, right: centreRight
 *    z-10, flex column, gap 2
 *
 *  PURPOSE: Shows queued follow-up questions from the observer/AI.
 *
 *  CONTAINER: Adaptive glass surface
 *    px-4 py-3, borderRadius: R.lg (24px)
 *    AnimatePresence wraps the whole bar
 *
 *  QUESTION ITEMS:
 *    Each question has:
 *    - Status dot (pending=yellow, asked=green, failed=red) with glow
 *    - Text: T.caption (11px), white/72
 *    - Observer badge: "AI" or "Observer 1", T.micro
 *    - Timestamp: T.micro, monospace, white/30
 *    - Dismiss X button (appears on hover)
 *
 *  STATUS COLORS:
 *    pending: C.warning (#FFD166)
 *    asked:   C.positive (#6DD4A0)
 *    failed:  C.negative (#FF8080)
 *
 *  INPUT (bottom):
 *    Inline text input for typing new follow-up questions
 *    Submit with Enter; Shift+Enter for urgent (priority queuing)
 *    Placeholder: "Type a follow-up question..."
 *
 *  ITEM ANIMATIONS:
 *    initial: { opacity: 0, y: -8 }
 *    animate: { opacity: 1, y: 0 }
 *    exit: { opacity: 0, x: 24 }
 *    transition: spring, damping 22, stiffness 240
 */

/* ============================================================================
 *  9. ACTION TOAST STACK  (ActionToast.tsx)
 * ============================================================================
 *
 *  POSITION: Right of center stage, above control bar
 *    bottom: G + CTRL_BAR_H + G, right: centreRight, width: 300px
 *    z-35, animated right with centreRight
 *
 *  PURPOSE: Notification toasts for system events (question skipped,
 *  analysis alert, etc.)
 *
 *  TOAST STRUCTURE:
 *    - Icon (lucide), label text, detail text
 *    - Glass surface with colored left accent border
 *    - Auto-dismiss after ~4 seconds
 *    - Manual dismiss via X
 *
 *  STACKING: Bottom-up, newest at bottom
 *  ANIMATIONS: slide in from right, fade + scale out
 *
 *  NOTIFICATION TOGGLE:
 *    When notificationsOn === false, toasts are suppressed.
 *    Toggle via bell icon in control bar.
 */

/* ============================================================================
 * 10. RIGHT NAV — ICON TABS  (RightNav.tsx)
 * ============================================================================
 *
 *  POSITION: Right edge, vertically centered
 *    right: G, top: 50%, transform: translateY(-50%)
 *    z-30
 *
 *  CONTAINER: <Surface> (adaptive glass)
 *    Width: NAV_W (54px), vertical flex column
 *    borderRadius: R.lg (24px), padding: 8px 0
 *
 *  TAB BUTTONS (top section):
 *    4 main tabs: Participant Profile, Check List, Insights, Transcript
 *    + Analysis (ScanFace) toggle below a separator
 *
 *    Each button: 54×44px, centered icon (size 18)
 *    States:
 *      - Default: icon white/40
 *      - Hover: icon white/70, bg rgba(255,255,255,0.06)
 *      - Active (panel open): icon C.accent (#615FFF), bg rgba(97,95,255,0.10)
 *        Left accent bar: 2px × 20px, C.accent, borderRadius: 1px, left edge
 *
 *    Badge on Check List tab:
 *      pendingCount > 0 → yellow dot (6px) with count
 *      position: top-right corner of button
 *
 *  TASK VIEW BUTTON:
 *    Monitor icon, toggles screen share view
 *    Active: C.accent coloring
 *
 *  RESET BUTTON (bottom):
 *    RotateCcw icon, appears when panelsMoved or detachedCount > 0
 *    Resets all panels to default positions
 *    white/25 → white/50 on hover
 *
 *  TOOLTIPS:
 *    Each tab has a Tip component (left-aligned tooltip on hover)
 *    Appears after 300ms delay, fontSize T.micro (9px)
 */

/* ============================================================================
 * 11. DRAGGABLE PANELS — RIGHT COLUMN  (DraggablePanel.tsx)
 * ============================================================================
 *
 *  PURPOSE: Floating, resizable information panels that dock to the right
 *  column or can be dragged anywhere on screen.
 *
 *  PANEL IDS: "Participant Profile", "Check List", "Insights", "Transcript"
 *
 *  DOCKING BEHAVIOR:
 *    Default: Panels stack vertically in right column
 *    1 panel: full available height
 *    2 panels: each min(PANEL_DEFAULT_H, (availH - G) / 2)
 *    3+ panels: each min(360, (availH - gaps) / count), width shrinks to 320px
 *
 *    Position formula for docked panel at index i:
 *      x: vw - rightOffset - panelWidth
 *      y: G + i * (panelH + G)
 *
 *  DETACHING:
 *    Drag header to detach. Panel becomes free-floating.
 *    If released within 80px of dock zone (right edge), auto-redocks.
 *    Double-click header → redock immediately.
 *
 *  RESIZE:
 *    Bottom edge handle, drag vertical
 *    Constraints: PANEL_MIN_H (180px) ≤ h ≤ PANEL_MAX_H (800px)
 *    Handle visual: 32px wide centered line, 2px height
 *      Default: rgba(255,255,255,0.06)
 *      Hover: rgba(255,255,255,0.20)
 *
 *  SNAP ENGINE:
 *    While dragging, edges snap to other panels within SNAP_DIST (10px).
 *    Cyan alignment guides appear during snap.
 *    See section 16 for snap algorithm details.
 *
 *  PANEL HEADER:
 *    height: ~36px, flex row
 *    - Grip dots: 2×3 grid, GripVertical icon (size 12), white/15
 *    - Icon: panel-specific lucide icon, size 14, C.accent
 *    - Title: T.caption (11px), white/70, uppercase tracking 0.06em
 *    - Meta badge: e.g. "12 sessions", "Live", T.micro, white/30
 *    - Minimize button (if applicable): Minus icon, only on Analysis panel
 *    - Close button: X icon, white/25 → white/50 on hover
 *
 *  PANEL CONTENT:
 *    <PanelContentArea> wrapper with scroll-aware bottom fade
 *    Fade: 36px height, linear-gradient rgba(10,12,18,0.65) → transparent
 *    Compact level detection via ResizeObserver:
 *      0 = full (>500px), 1 = half (180-500), 2 = compact (120-180), 3 = minimal (<120)
 *
 *  PANEL SURFACE STYLE:
 *    Uses adaptive glass (useAdaptiveGlass hook)
 *    borderRadius: R.lg (24px)
 *    backdrop-filter: blur(64px) saturate(120%) brightness(0.92)
 *    base background: tintedBg(glassTint) → rgba(10,12,22, 0.48-0.66)
 *    border: 1px solid rgba(255,255,255,0.11)
 *    box-shadow: multi-layered neumorphic (see section 18)
 *
 *  ENTRY/EXIT ANIMATION:
 *    initial: { opacity: 0, scale: 0.96 }
 *    animate: { opacity: 1, scale: 1 }
 *    exit: { opacity: 0, scale: 0.96 }
 *    transition: spring, damping 28, stiffness 200
 *
 *  POSITION ANIMATION:
 *    Motion's useMotionValue for x, y
 *    When targetRect changes, animated with spring (damping 28, stiffness 200)
 *
 *  PANEL CONTENT COMPONENTS:
 *
 *    PersonaContent: Participant profile card
 *      - Avatar, name, role, session count
 *      - Screener criteria with check marks
 *      - Quota group badge
 *
 *    CheckListContent: Interview question guide
 *      - Ordered questions with status indicators (done/active/pending)
 *      - Engagement scores with colored bars
 *      - Signal badges (agreement, hesitation, speech rate, etc.)
 *      - Suggested follow-up with "Ask" and "Skip" actions
 *      - Expandable question details with summary + signals
 *
 *    InsightsContent: Live analysis dashboard
 *      - Sentiment breakdown (positive/neutral/negative bars)
 *      - Keyword tags with frequency counts
 *      - Highlight cards with intensity indicators
 *
 *    TranscriptContent: Full conversation history
 *      - Scrollable turn list with speaker badges
 *      - Detection alerts inline (hesitation, pitch shift, etc.)
 *      - Translation toggle via TranslateButton
 */

/* ============================================================================
 * 12. ANALYSIS PANEL & PILL  (FaceAnalysisView.tsx, AnalysisPill.tsx)
 * ============================================================================
 *
 *  POSITION: Left column, below status bar, overlapping transcript area
 *    x: G + 1
 *    y: G + STATUS_H + STATUS_GAP
 *    width: LEFT_W
 *    height: dynamic (viewport minus status bar, PiP area, control bar)
 *
 *  PANEL CONTENT (AnalysisContent):
 *    1. Face mesh wireframe overlay on interviewee image
 *       - SVG triangulated mesh with animated vertex highlights
 *       - MotionCircle for pulsing key facial landmarks
 *    2. Emotion classification card
 *       - Current emotion label (cycles through: neutral, engaged, frustrated, etc.)
 *       - Confidence bar (0-100%)
 *       - Color-coded: each emotion has a unique hue
 *    3. Emotion history timeline
 *       - Last N readings displayed as small colored dots
 *       - Scrollable horizontal strip
 *    4. Micro-expression alerts
 *       - Cards highlighting detected micro-expressions
 *       - Timing, classification, confidence
 *
 *  EMOTION CYCLE (useEmotionCycle hook):
 *    Rotates through pre-defined emotions every 3-5 seconds
 *    Returns { emotion: string, confidence: number, history: EmotionEntry[] }
 *
 *  MINIMIZED STATE (AnalysisPill):
 *    Collapses to a small pill showing current emotion + restore button
 *    Position: top-left, below status bar
 *    Height: ~36px
 *    Click → restore to full panel
 *
 *  ANIMATIONS:
 *    Full panel: DraggablePanel wrapper (see section 11)
 *    Pill: AnimatePresence with slide-down entry
 */

/* ============================================================================
 * 13. CONTROL BAR — BOTTOM  (ControlBar.tsx)
 * ============================================================================
 *
 *  POSITION: Bottom center, z-20
 *    bottom: G
 *    left/right: dynamic based on whether docked panels exist
 *    Centered horizontally within available space
 *    transition: left/right 0.32s cubic-bezier(0.32,0.72,0,1)
 *
 *  CONTAINER: <Surface> (adaptive glass)
 *    flex items-center gap-1 px-2 py-1.5
 *    borderRadius: R.lg (24px)
 *
 *  BUTTONS (left to right):
 *
 *    1. Mic toggle (DISABLED — "AI Moderator controls the microphone")
 *       size 17px, opacity 0.35, cursor: not-allowed
 *       When on: Mic icon; off: MicOff icon
 *
 *    2. Camera toggle (DISABLED)
 *       Same disabled treatment
 *
 *    ── Divider: 1px × 24px, bg white/6, mx-0.5 ──
 *
 *    3. Screen Share (DISABLED)
 *       Share icon, same disabled treatment
 *
 *    4. Volume Control (ACTIVE)
 *       Volume2 / VolumeOff icon, size 17px
 *       Click: toggle mute
 *       Hover: popup with vertical slider
 *
 *       Popup:
 *         width: 48px, borderRadius: R.lg (24px)
 *         background: rgba(18,20,28,0.85) with glass blur
 *         border: 1px solid rgba(255,255,255,0.14)
 *         Vertical slider: 120px tall, 4px track
 *           Track: rgba(255,255,255,0.06)
 *           Fill: C.accent (#615FFF)
 *           Knob: 12px circle, C.accent, with 2px dark ring
 *         Number display: T.micro, white/50, monospace
 *         Entry: { opacity: 0, y: 6, scale: 0.95 } → { opacity: 1, y: 0, scale: 1 }
 *         duration: 0.18s
 *
 *    5. Brightness Control (ACTIVE)
 *       Sun icon, color shifts warm-to-cold based on value
 *       Same popup style as volume but with warm yellow fill
 *       Fill color: rgba(255,209,102, 0.35 + value/100 * 0.55)
 *       Knob color: rgba(255,209,102, 0.5 + value/100 * 0.45)
 *
 *    ── Divider ──
 *
 *    6. Notifications Toggle (ACTIVE)
 *       Bell / BellOff icon, size 17px
 *       When off: background rgba(255,128,128,0.08), color C.negative
 *       When on: background rgba(255,255,255,0.04), color white/50
 *       Animated strike-through line on mute (MotionDiv scaleX 0→1)
 *
 *    ── Divider ──
 *
 *    7. Leave Room Button
 *       LogOut icon + "Leave Room" label
 *       background: rgba(255,128,128,0.08)
 *       border: 0.5px solid rgba(255,128,128,0.12)
 *       color: C.negative (#FF8080)
 *       borderRadius: R.md (16px)
 *
 *  BUTTON STYLES (CtrlBtn):
 *    padding: 12px (p-3)
 *    borderRadius: R.md (16px)
 *    Default bg: rgba(255,255,255,0.04)
 *    Disabled bg: rgba(255,255,255,0.02), opacity 0.35
 *    Default color: white/50
 *    Active/highlight: C.accent bg + white text
 *    Danger: C.negative bg + white text
 *    Hover: brightness-110
 *
 *  TOOLTIPS:
 *    Each button has tooltip appearing 300ms after hover
 *    Style: tipStyle (glass, borderRadius: R.sm, background rgba(8,10,20,0.78))
 */

/* ============================================================================
 * 14. DISCARD MODAL  (DiscardModal.tsx)
 * ============================================================================
 *
 *  TRIGGER: "Discard" button, bottom-right of viewport
 *    Positioned at: bottom G, right: centreRight
 *    AlertTriangle icon + "Discard" label
 *    background: rgba(255,255,255,0.02) → rgba(255,128,128,0.08) when discarded
 *
 *  MODAL:
 *    Full-screen backdrop: rgba(0,0,0,0.60) with backdrop-blur
 *    Centered card: Surface, max-width ~420px
 *    Content: Warning icon, "Discard this session?" heading
 *    Reason selector: Radio-like options for discard reason
 *    Confirm button: C.negative background
 *    Cancel button: ghost style
 *
 *    After confirm: "discarded" state shows success feedback
 *    Auto-closes after 600ms
 */

/* ============================================================================
 * 15. TASK VIEW & FACE STAGE
 * ============================================================================
 *
 *  TASK VIEW (ParticipantTaskView.tsx):
 *    Shows when observer toggles screen share view
 *    Position: fills center stage area
 *      top: G, left: G + LEFT_W + G, right: rightOffset, bottom: G + CTRL_BAR_H + G
 *    Contains: mock shared screen content, close button
 *    Entry: { opacity: 0, scale: 0.985 } → { opacity: 1, scale: 1 }
 *    duration: 0.35, ease: [0.32,0.72,0,1]
 *
 *  FACE STAGE (FaceStageView.tsx):
 *    When pipSwapped is true AND taskView is open, the face takes center stage
 *    Same position as task view (AnimatePresence mode="wait" toggles between them)
 *    Shows the interviewee's face at full center-stage size
 *
 *  PiP SWAP LOGIC:
 *    Normal: Background = interviewee, PiP = not shown
 *    Task view open: Background hidden, center = task, PiP = interviewee thumbnail
 *    Task + swap: center = face, PiP = task thumbnail
 */

/* ============================================================================
 * 16. SNAP ENGINE  (SnapEngine.tsx)
 * ============================================================================
 *
 *  PURPOSE: Panel-to-panel edge snapping during drag.
 *
 *  TYPES:
 *    PRect: { x, y, w, h } — panel bounding rectangle
 *    SnapLine: { axis: "h"|"v", pos: number, from: number, to: number }
 *
 *  ALGORITHM (computeSnap):
 *    For each dragged panel edge (left, right, center-x, top, bottom, center-y):
 *      For each target panel edge:
 *        If distance < SNAP_DIST (10px):
 *          Record as potential snap
 *    Choose smallest dx and dy snap distances
 *    Return { dx, dy, lines[] } — offset corrections and visual guides
 *
 *    Also snaps to gap-aligned edges:
 *      target.right + G → dragged.left (gap-aware stacking)
 *      target.bottom + G → dragged.top
 *
 *  VISUAL GUIDES (SnapGuides component):
 *    Cyan lines (C.accent) rendered as absolutely-positioned divs
 *    Horizontal: height 1px, positioned at snap.pos
 *    Vertical: width 1px, positioned at snap.pos
 *    opacity: 0.45, pointerEvents: none
 *    Fade in with requestAnimationFrame, disappear on drag end
 */

/* ============================================================================
 * 17. LIVE SIMULATION ENGINE  (useLiveSimulation.ts)
 * ============================================================================
 *
 *  PURPOSE: Simulates a real-time interview conversation for demo purposes.
 *
 *  SPEAKER META:
 *    mod (Cookiy AI):
 *      color: rgba(97,95,255,0.90)   — purple
 *      bg: rgba(97,95,255,0.10)
 *      border: rgba(97,95,255,0.22)
 *      icon: Sparkles
 *    int (#9527):
 *      color: rgba(109,212,160,0.90) — green
 *      bg: rgba(109,212,160,0.08)
 *      border: rgba(109,212,160,0.18)
 *      icon: User
 *
 *  STREAMING BEHAVIOR:
 *    Characters appear at CHARS_PER_TICK (2) every TICK_MS (28ms)
 *    ≈ 71 chars/second = natural speech-to-text pace
 *
 *  SCENE SCRIPT:
 *    14 scenes covering interview Q&A about design workflows
 *    Some scenes have both mod + int text (overlap mode)
 *    Each scene has a pause duration before advancing (200-600ms)
 *    Script loops after exhausting all scenes
 *
 *  HISTORY MANAGEMENT:
 *    Keeps last 12 turns in state (sliding window)
 *    Each turn: { id, speaker, name, text, time }
 *    time = current clock value when turn completes
 *
 *  OUTPUT (LiveSimulationState):
 *    modBubble: current moderator streaming bubble (or null)
 *    intBubble: current interviewee streaming bubble (or null)
 *    history: HistoryTurn[] — completed turns
 *    isOverlap: both bubbles active simultaneously
 *    hasLive: any bubble active
 *    isStreaming: any bubble still mid-stream (not done)
 *    activeSpeaker: "mod" | "int" | null
 *    lastTurn: most recent completed turn
 */

/* ============================================================================
 * 18. DESIGN TOKENS  (constants.ts)
 * ============================================================================
 *
 *  TYPOGRAPHY SCALE:
 *    T.display = 20px
 *    T.title   = 15px
 *    T.body    = 13px
 *    T.caption = 11px
 *    T.micro   = 9px
 *
 *  BORDER RADIUS:
 *    R.pill = 9999px
 *    R.lg   = 24px
 *    R.md   = 16px
 *    R.sm   = 10px
 *
 *  COLORS:
 *    C.accent       = "#615FFF"            (primary purple)
 *    C.accentMuted  = "rgba(97,95,255,0.10)"
 *    C.accentBorder = "rgba(97,95,255,0.18)"
 *    C.negative     = "#FF8080"            (red/danger)
 *    C.positive     = "#6DD4A0"            (green/success)
 *    C.warning      = "#FFD166"            (yellow/caution)
 *
 *  GLASS STYLES:
 *
 *    glass (base filter):
 *      backdropFilter: "blur(64px) saturate(120%) brightness(0.92)"
 *
 *    surfaceStyle (panels, nav, control bar):
 *      glass +
 *      borderRadius: R.lg (24px)
 *      background: "rgba(10,12,22,0.48)"
 *      border: 1px solid rgba(255,255,255,0.11)
 *      box-shadow:
 *        inset 0  1px  0   rgba(255,255,255,0.16)    ← top highlight
 *        inset 1px  1px  2px rgba(255,255,255,0.06)   ← inner light
 *        inset -1px -1px  2px rgba(0,0,0,0.20)        ← inner shadow
 *        inset 0 0 0 0.5px rgba(255,255,255,0.04)     ← rim glow
 *        0  8px 32px rgba(0,0,0,0.45)                 ← outer depth
 *        0  2px  8px rgba(0,0,0,0.20)                 ← close shadow
 *
 *    cardStyle (inner cards):
 *      background: "rgba(255,255,255,0.055)"
 *      border: 0.5px solid rgba(255,255,255,0.09)
 *      borderRadius: R.md (16px)
 *      box-shadow:
 *        inset  0.5px  0.5px 1.5px rgba(255,255,255,0.09)
 *        inset -0.5px -0.5px 1.5px rgba(0,0,0,0.12)
 *
 *    cardGlowStyle (active/highlighted cards):
 *      cardStyle + purple accent glow:
 *        0 6px 18px -4px rgba(97,95,255,0.10)
 *
 *    tipStyle (tooltips):
 *      glass + borderRadius: R.sm (10px)
 *      background: "rgba(8,10,20,0.78)"
 *      border: 0.5px solid rgba(255,255,255,0.12)
 *      box-shadow: inset 0 1px 0 rgba(255,255,255,0.10), 0 4px 16px rgba(0,0,0,0.40)
 *
 *  SPRING ANIMATION PRESET:
 *    spring = { type: "spring", damping: 28, stiffness: 200 }
 *    Used for panel position animations, PiP entry, layout transitions.
 *
 *  CUSTOM SCROLLBAR:
 *    .scroll-area::-webkit-scrollbar { width: 3px }
 *    .scroll-area::-webkit-scrollbar-track { background: transparent }
 *    .scroll-area::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.04); border-radius: 8px }
 *    .scroll-area::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.08) }
 */

/* ============================================================================
 * 19. ADAPTIVE GLASS SYSTEM  (hooks.ts)
 * ============================================================================
 *
 *  PURPOSE: Panel glass darkness adapts to background video brightness
 *  so text remains readable on both dark interview scenes and bright ones.
 *
 *  PIPELINE:
 *    1. BackgroundLayer renders a hidden <img> with crossOrigin="anonymous"
 *    2. On load, sampleBrightness() draws it to a 64×64 canvas
 *    3. Computes average luminance (0-1) using ITU-R BT.601:
 *       L = (0.299*R + 0.587*G + 0.114*B) / 255
 *    4. Maps to glassTint (0-1):
 *       glassTint = clamp((L - 0.35) / 0.30, 0, 1)
 *       0 = dark scene, 1 = very bright scene
 *    5. GlassTintCtx provides value to all children
 *
 *  tintedBg(t, baseAlpha):
 *    base = 0.48 (minimum scrim opacity)
 *    bonus = t > 0.25 ? min(0.18, (t - 0.25) * 0.28) : 0
 *    returns: rgba(10,12,22, base + bonus)
 *    Range: rgba(10,12,22, 0.48) → rgba(10,12,22, 0.66)
 *
 *  useAdaptiveGlass() hook:
 *    Returns { surface, card, cardGlow } CSSProperties objects
 *    All with tintedBg-adjusted backgrounds
 *    Memoized on glassTint value
 *
 *  EFFECT: On dark scenes (interview in dim room), panels are more
 *  transparent showing background blur. On bright scenes, panels darken
 *  to maintain text contrast.
 */

/* ============================================================================
 * 20. ORCHESTRATOR STATE MACHINE  (ResearcherView.tsx)
 * ============================================================================
 *
 *  The root component manages all state and passes callbacks down.
 *  No global state library — pure React useState + useCallback + useRef.
 *
 *  STATE GROUPS:
 *
 *  A) PANEL MANAGEMENT:
 *     openPanels: Set<string>   — which panels are visible
 *     detached: Record<string, {x,y,h}> — free-floating panel positions
 *     draggingId: string|null   — currently dragging panel ID
 *     panelsMoved: boolean      — has user moved any panel (shows reset button)
 *     resetKey: number          — incremented to force panel re-mount on reset
 *     snapLines: SnapLine[]     — active alignment guides
 *
 *  B) MEDIA CONTROLS:
 *     isMicOn, isVideoOn, isScreenSharing — booleans (mic/cam disabled for observer)
 *     isSpeakerOn: boolean, volume: number (0-100) — audio monitoring
 *     translateLang: LangCode | null
 *
 *  C) ANALYSIS:
 *     analysisMinimized: boolean — panel vs pill state
 *     emotion/history from useEmotionCycle()
 *
 *  D) SESSION STATE:
 *     sessionPaused: boolean — toggles starry background
 *     Keyboard: P or Space to toggle
 *
 *  E) PiP & TASK VIEW:
 *     pipSwapped: boolean — which feed is center vs PiP
 *     taskViewOpen: boolean — screen share view active
 *     faceVideoRef, screenVideoRef — for WebRTC
 *
 *  F) FOLLOW-UPS:
 *     followUps: FollowUpQuestion[] — queue of observer questions
 *     handleSendFollowUp: adds to queue, simulates AI asking after 2-5s
 *     handleSkipQuestion: fires ActionToast notification
 *
 *  G) DISCARD:
 *     discardOpen, discardReason, discarded — modal state
 *
 *  H) NOTIFICATIONS:
 *     notificationsOn: boolean — suppresses ActionToast when false
 *
 *  KEY CALLBACKS:
 *
 *    togglePanel(id): Add/remove from openPanels, clear detached position
 *    closePanel(id): Remove from openPanels + detached
 *    resetLayout(): Reset all panels to default positions
 *    handleDragStart(id): Set draggingId, mark panelsMoved
 *    handleDragEnd(id, x, y, h): Auto-redock if near dock zone, else detach
 *    handleRedock(id): Clear detached position
 *    handleToggleTaskView(): Toggle task view, clear right panels
 *
 *  LAYOUT COMPUTATION:
 *
 *    dockedIds: RIGHT_IDS filtered by openPanels, not detached, not dragging
 *    centreRight: computed from dockedIds.length (see section 1)
 *    getDockedRect(id): computes {x,y,w,h} for docked panel at given index
 *    getTargetRect(id): returns detached position if exists, else docked position
 *
 *  RENDER STRUCTURE (simplified):
 *
 *    <GlassTintCtx.Provider>
 *      <div h-screen w-screen overflow-hidden bg-#0a0b0f>
 *        <BackgroundLayer />
 *        <StarryBackground visible={sessionPaused} />
 *        <FollowUpBar />                    // z-10, top center
 *        <ActionToastStack />               // z-35, right of center
 *        <TaskView or FaceStage />          // z-18, center stage (conditional)
 *        <LeftDock>                         // z-10, left column
 *          <StatusBar />
 *          <LeftDockModule />               // transcript, expand/collapse
 *          <LeftDockPiP />                  // only when taskView open
 *        </LeftDock>
 *        <RightNav />                       // z-30, right edge
 *        <SnapGuides />                     // alignment lines
 *        <DraggablePanel /> ×N              // z-50, right column / floating
 *        <AnalysisPanel or AnalysisPill />  // z-50 or inline
 *        <ControlBar />                     // z-20, bottom center
 *        <DiscardButton + DiscardModal />   // z-25
 *      </div>
 *    </GlassTintCtx.Provider>
 *
 * ============================================================================
 *  END OF SPECIFICATION
 * ============================================================================
 */
