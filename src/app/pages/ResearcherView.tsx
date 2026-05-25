/**
 * ResearcherView — The researcher/observer interface.
 * Previously App.tsx; extracted to enable routing.
 * Route: /
 */

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { ReactNode, CSSProperties } from "react";
import { AnimatePresence, motion } from "motion/react";

import { ScanFace, AlertTriangle, SkipForward } from "lucide-react";
import defaultIntervieweeImage from "figma:asset/fa0d16c39081a2c44765b4fd4bdd1d40747ed8e5.png";
import imgCookiyAI from "figma:asset/e38038c542ec13feb27b209f2d8ba9f865436b98.png";

/* ── Shared modules ── */
import {
  T, R, G, C, NAV_W, LEFT_W, CTRL_BAR_H, STATUS_H, STATUS_GAP,
  PANEL_DEFAULT_H, PANEL_W, PANEL_MIN_H,
  surfaceStyle, sampleBrightness, tintedBg,
} from "../components/constants";
import { ObserveThemeProvider, useObserveTheme } from "../components/observe-room/ObserveThemeContext";
import { TABS, RIGHT_IDS, TRANSCRIPT } from "../components/data";
import type { FollowUpQuestion } from "../components/data";
import { useClock, GlassTintCtx } from "../components/hooks";
import { useLiveSimulation } from "../components/useLiveSimulation";
import { SnapGuides } from "../components/SnapEngine";
import type { PRect, SnapLine } from "../components/SnapEngine";

/* ── Feature components ── */
import { DraggablePanel } from "../components/DraggablePanel";
import { ControlBar } from "../components/ControlBar";
import { Tip } from "../components/Tip";
import { AnalysisContent, useEmotionCycle } from "../components/FaceAnalysisView";
import { AnalysisPill } from "../components/AnalysisPill";
import { PersonaContent } from "../components/panels/PersonaContent";
import { CheckListContent } from "../components/panels/CheckListContent";
import { InsightsContent } from "../components/panels/InsightsContent";
import { TranscriptContent } from "../components/panels/TranscriptContent";
import { FollowUpBar } from "../components/FollowUpBar";
import { ActionToastStack, useActionEvents } from "../components/ActionToast";
import type { LangCode } from "../components/TranslateButton";
import { ParticipantTaskView } from "../components/ParticipantTaskView";
import { FaceStageView } from "../components/FaceStageView";

/* ── Extracted UI sections ── */
import { BackgroundLayer } from "../components/BackgroundLayer";
import { CancerStarryNight } from "../components/CancerStarryNight";
import { StatusBar } from "../components/StatusBar";
import { LeftDockModule } from "../components/LeftDockModule";
import { LeftDockPiP } from "../components/LeftDockPiP";
import { RightNav } from "../components/RightNav";
import { DiscardModal } from "../components/DiscardModal";

/* pre-destructure for sandbox compatibility */
const MotionDiv = motion.div;
const DEMO_OPEN_PANELS = ["Check List", "Insights"];

/* ═════════════════════════════════════════════════
   ResearcherView — Root Orchestrator (route: /)
   ═════════════════════════════════════════════════ */
export function ResearcherView() {
  return (
    <ObserveThemeProvider>
      <ResearcherViewInner />
    </ObserveThemeProvider>
  );
}

function ResearcherViewInner() {
  const { mode: observeMode, tokens: ot } = useObserveTheme();
  const isLightMode = observeMode === "light";
  const launchContext = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const participant = params.get("participant");
    const photo = params.get("photo");
    return {
      participantId: participant ? `#${participant.replace(/^#/, "")}` : "#9527",
      intervieweeImage: photo || defaultIntervieweeImage,
    };
  }, []);

  /* ─────────────────────────
     1. Core UI state
     ───────────────────────── */
  const [openPanels, setOpenPanels] = useState<Set<string>>(() => new Set(DEMO_OPEN_PANELS));
  const [resetKey, setResetKey] = useState(0);
  const [panelsMoved, setPanelsMoved] = useState(false);
  const [snapLines, setSnapLines] = useState<SnapLine[]>([]);
  const [detached, setDetached] = useState<Record<string, { x: number; y: number; h: number }>>({});
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const panelRectsRef = useRef<Record<string, PRect>>({});
  const viewportRef = useRef<HTMLDivElement>(null);

  /* ── Session paused state — synced from participant side ── */
  /* Toggle with Space or 'P'; background switches to starry sky */
  const [sessionPaused, setSessionPaused] = useState(false);

  /* ── Keyboard shortcut: P or Space to simulate pause sync ── */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target !== document.body && e.target !== document.documentElement) return;
      if (e.code === "KeyP" || e.code === "Space") {
        e.preventDefault();
        setSessionPaused(prev => !prev);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  /* ─────────────────────────
     2. Media controls
     ───────────────────────── */
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [volume, setVolume] = useState(75);
  const [translateLang, setTranslateLang] = useState<LangCode>(null);

  /* ─────────────────────────
     3. Analysis panel (left)
     ───────────────────────── */
  const [analysisMinimized, setAnalysisMinimized] = useState(false);
  const analysisOpen = openPanels.has("Analysis");

  /* ─────────────────────────
     4. PiP (Picture-in-Picture)
     ───────────────────────── */
  const [pipSwapped, setPipSwapped] = useState(false);
  const faceVideoRef   = useRef<HTMLVideoElement>(null);
  const screenVideoRef = useRef<HTMLVideoElement>(null);

  /* ─────────────────────────
     5. Discard session
     ──────────────────────── */
  const [discardOpen, setDiscardOpen] = useState(false);
  const [discardReason, setDiscardReason] = useState<string | null>(null);
  const [discarded, setDiscarded] = useState(false);

  /* ─────────────────────────
     6. Notifications
     ───────────────────────── */
  const [notificationsOn, setNotificationsOn] = useState(true);

  /* ─────────────────────────
     6b. Participant Task View
     ───────────────────────── */
  const [taskViewOpen, setTaskViewOpen] = useState(false);

  const handleToggleTaskView = useCallback(() => {
    setTaskViewOpen(prev => {
      const next = !prev;
      if (next) {
        setOpenPanels(ps => {
          const cleared = new Set(ps);
          RIGHT_IDS.forEach(id => cleared.delete(id));
          return cleared;
        });
      } else {
        setPipSwapped(false);
      }
      return next;
    });
  }, []);

  /* ─────────────────────────
     7. Follow-up questions & derived values
     ───────────────────────── */
  const bgImgRef = useRef<HTMLImageElement>(null);
  const clock = useClock();
  const { emotion, history } = useEmotionCycle();
  const { events: actionEvents, dismiss: dismissAction, addEvent: addActionEvent } = useActionEvents(notificationsOn);
  const rightOffset = G + NAV_W + G;
  const allRightOpen = RIGHT_IDS.filter(id => openPanels.has(id));
  const rightCount = allRightOpen.length;

  const [followUps, setFollowUps] = useState<FollowUpQuestion[]>([
    { id: 1, text: "Dig into version conflict pain", urgent: false, status: "asked", time: "03:22", observer: "AI" },
    { id: 2, text: "Team alignment on design tokens?", urgent: false, status: "pending", time: "04:18", observer: "AI" },
    { id: 3, text: "Manual export frequency?", urgent: true, status: "pending", time: "05:01", observer: "Observer 1" },
  ]);
  const followUpIdRef = useRef(100);
  const pending = useMemo(() => followUps.filter(q => q.status === "pending"), [followUps]);

  const handleSendFollowUp = useCallback((text: string, urgent: boolean) => {
    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
    const newQ: FollowUpQuestion = {
      id: followUpIdRef.current++, text, urgent,
      status: "pending", time: timeStr, observer: "Observer 1",
    };
    setFollowUps(prev => {
      if (urgent) return [newQ, ...prev];
      const urgentPending = prev.filter(q => q.status === "pending" && q.urgent);
      const rest = prev.filter(q => !(q.status === "pending" && q.urgent));
      return [...urgentPending, newQ, ...rest];
    });
    setTimeout(() => {
      setFollowUps(prev => prev.map(q =>
        q.id === newQ.id ? { ...q, status: Math.random() > 0.3 ? "asked" : "failed" } : q
      ));
    }, 2000 + Math.random() * 3000);
  }, []);

  /* ─────────────────────────
     Skip question
     ───────────────────────── */
  const handleSkipQuestion = useCallback((qText: string, qIdx: number) => {
    addActionEvent({
      icon: SkipForward,
      label: `Q${qIdx + 1} Skipped`,
      detail: `AI Moderator notified — will not ask: "${qText.length > 55 ? qText.slice(0, 55) + "…" : qText}"`,
      color: C.warning,
    });
  }, [addActionEvent]);

  /* ─────────────────────────────────────────────
     8. Adaptive glass tint
     ───────────────────────────────────────────── */
  const [glassTint, setGlassTint] = useState(0);
  useEffect(() => {
    const img = bgImgRef.current;
    if (!img) return;
    const measure = () => {
      if (!img.naturalWidth) return;
      const lum = sampleBrightness(img);
      setGlassTint(Math.max(0, Math.min(1, (lum - 0.35) / 0.30)));
    };
    if (img.complete) measure();
    img.addEventListener("load", measure);
    return () => img.removeEventListener("load", measure);
  }, []);

  const appAdaptiveSurface = useMemo<CSSProperties>(() => ({
    ...surfaceStyle, background: tintedBg(glassTint, 0.06),
  }), [glassTint]);

  /* ─────────────────────────────────────────────
     10. Panel management callbacks
     ───────────────────────────────────────────── */
  const togglePanel = useCallback((id: string) => {
    setOpenPanels(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
    setDetached(prev => { if (prev[id]) { const n = { ...prev }; delete n[id]; return n; } return prev; });
    if (id === "Analysis") setAnalysisMinimized(false);
  }, []);

  const closePanel = useCallback((id: string) => {
    setOpenPanels(prev => { const next = new Set(prev); next.delete(id); return next; });
    setDetached(prev => { if (prev[id]) { const n = { ...prev }; delete n[id]; return n; } return prev; });
    if (id === "Analysis") setAnalysisMinimized(false);
  }, []);

  const resetLayout = useCallback(() => {
    setResetKey(k => k + 1);
    setDetached({});
    setDraggingId(null);
    setPanelsMoved(false);
    panelRectsRef.current = {};
  }, []);

  const handleDiscard = useCallback(() => {
    setDiscarded(true);
    setTimeout(() => { setDiscardOpen(false); setDiscardReason(null); }, 600);
  }, []);

  /* ─────────────────────────────────────────────
     11. Dock layout computation
     ───────────────────────────────────────────── */
  const dockedIds = useMemo(() => {
    return RIGHT_IDS.filter(id => openPanels.has(id) && !detached[id] && id !== draggingId);
  }, [openPanels, detached, draggingId]);

  const centreRight = useMemo(() => {
    if (dockedIds.length === 0) return rightOffset;
    const w = dockedIds.length > 2 ? 320 : PANEL_W;
    return rightOffset + w + G;
  }, [dockedIds.length, rightOffset]);

  const getDockedRect = useCallback((id: string): PRect => {
    const idx = dockedIds.indexOf(id);
    if (idx === -1) return { x: 0, y: 0, w: PANEL_W, h: PANEL_DEFAULT_H };
    const count = dockedIds.length;
    const vh = typeof window !== "undefined" ? window.innerHeight : 900;
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const availH = vh - G * 2;
    const panelH = count === 1
      ? availH
      : count === 2
        ? Math.min(PANEL_DEFAULT_H, (availH - G) / 2)
        : Math.min(360, (availH - (count - 1) * G) / count);
    const w = count > 2 ? 320 : PANEL_W;
    return { x: vw - rightOffset - w, y: G + idx * (panelH + G), w, h: panelH };
  }, [dockedIds, rightOffset]);

  const getTargetRect = useCallback((id: string): PRect => {
    if (detached[id]) return { x: detached[id].x, y: detached[id].y, w: PANEL_W, h: detached[id].h };
    return getDockedRect(id);
  }, [detached, getDockedRect]);

  /* ─────────────────────────────────────────────
     12. Drag lifecycle
     ──────────────────────────────────────────── */
  const handleDragStart = useCallback((id: string) => {
    setDraggingId(id);
    setPanelsMoved(true);
  }, []);

  const handleDragEnd = useCallback((id: string, fx: number, fy: number, fh: number) => {
    setDraggingId(null);
    const vw = typeof window !== "undefined" ? window.innerWidth : 1440;
    const dockThreshold = vw - rightOffset - PANEL_W - 80;
    if (fx > dockThreshold) {
      setDetached(prev => { const n = { ...prev }; delete n[id]; return n; });
    } else {
      setDetached(prev => ({ ...prev, [id]: { x: fx, y: fy, h: fh } }));
    }
  }, [rightOffset]);

  const handleRedock = useCallback((id: string) => {
    setDetached(prev => { const n = { ...prev }; delete n[id]; return n; });
    setDraggingId(null);
  }, []);

  /* ─────────────────────────────────────────────
     13. Panel content registry
     ───────────────────────────────────────────── */
  const contentMap: Record<string, ReactNode> = {
    "Participant Profile": <PersonaContent />,
    "Check List": <CheckListContent onSendFollowUp={handleSendFollowUp} onSkip={handleSkipQuestion} />,
    Insights: <InsightsContent />,
    Transcript: <TranscriptContent translateLang={translateLang} onTranslateLangChange={setTranslateLang} />,
  };

  const metaMap: Record<string, string | undefined> = {
    "Participant Profile": "12 sessions",
    Insights: "Live",
    Transcript: `${TRANSCRIPT.length}`,
  };

  /* ─────────────────────────────────────────────
     14. Toast offset calculation
     ───────────────────────────────────────────── */
  const ANALYSIS_PILL_H = 36;
  const toastTop = analysisOpen && analysisMinimized
    ? G + STATUS_H + STATUS_GAP + ANALYSIS_PILL_H + G
    : G + STATUS_H + STATUS_GAP;

  /* ─────────────────────────────────────────────
     15. Live caption simulation
     ───────────────────────────────────────────── */
  const liveEngine = useLiveSimulation(clock);

  /* ═══════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════ */
  return (
    <GlassTintCtx.Provider value={isLightMode ? 0 : glassTint}>
    <div ref={viewportRef} className="relative h-screen w-screen overflow-hidden select-none cursor-default"
      style={{ background: ot.pageBg }}>

      {/* Light mode gradient background */}
      {isLightMode && (
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, #f0f1f3, #f3f3f5, #f0f2f4)" }} />
          <div className="absolute" style={{ width: 600, height: 600, left: "10%", top: "-10%", borderRadius: "50%", background: "radial-gradient(circle, rgba(180,185,195,0.14) 0%, transparent 70%)" }} />
          <div className="absolute" style={{ width: 500, height: 500, right: "5%", top: "20%", borderRadius: "50%", background: "radial-gradient(circle, rgba(175,180,190,0.12) 0%, transparent 70%)" }} />
          <div className="absolute" style={{ width: 700, height: 700, left: "30%", bottom: "-15%", borderRadius: "50%", background: "radial-gradient(circle, rgba(185,190,200,0.10) 0%, transparent 70%)" }} />
          <div className="absolute" style={{ width: 400, height: 400, right: "30%", top: "50%", borderRadius: "50%", background: "radial-gradient(circle, rgba(170,175,185,0.11) 0%, transparent 70%)" }} />
          <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.015 }}>
            <filter id="noise"><feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" /></filter>
            <rect width="100%" height="100%" filter="url(#noise)" />
          </svg>
        </div>
      )}

      {/* Dark mode background */}
      {!isLightMode && !taskViewOpen && !isVideoOn && <CancerStarryNight />}
      {!isLightMode && (!taskViewOpen || isVideoOn) && (
        <BackgroundLayer
          imgInterviewee={launchContext.intervieweeImage}
          imgCookiyAI={imgCookiyAI}
          pipSwapped={pipSwapped}
          bgImgRef={bgImgRef}
          taskViewOpen={taskViewOpen}
        />
      )}

      <div
        className="absolute z-10 flex flex-col items-stretch gap-2"
        style={{
          top: G, left: G + LEFT_W + G, right: centreRight, maxWidth: "100%",
          transition: "right 0.32s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <AnimatePresence>
          {followUps.length > 0 && (
            <FollowUpBar followUps={followUps} onDismiss={(id) => setFollowUps(prev => prev.filter(q => q.id !== id))} />
          )}
        </AnimatePresence>
      </div>

      <div
        className="absolute z-[35]"
        style={{
          bottom: G + CTRL_BAR_H + G, right: centreRight, width: 300,
          transition: "right 0.32s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <ActionToastStack
          events={actionEvents} onDismiss={dismissAction}
          panelRectsRef={panelRectsRef} onSnapLines={setSnapLines}
          notificationsOn={notificationsOn}
          onToggleNotifications={() => setNotificationsOn(prev => !prev)}
        />
      </div>

      <AnimatePresence>
        {taskViewOpen && (
          <MotionDiv
            key="stage-frame"
            className="absolute z-[18]"
            initial={{ opacity: 0, scale: 0.985 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.985 }}
            transition={{ duration: 0.35, ease: [0.32, 0.72, 0, 1] }}
            style={{ top: G, left: G + LEFT_W + G, right: rightOffset, bottom: G + CTRL_BAR_H + G }}
          >
            <AnimatePresence mode="wait">
              {!pipSwapped ? (
                <ParticipantTaskView
                  key="task-view"
                  onClose={() => { setTaskViewOpen(false); setPipSwapped(false); }}
                  screenVideoRef={screenVideoRef}
                />
              ) : (
                <FaceStageView key="face-view" faceVideoRef={faceVideoRef} imgInterviewee={launchContext.intervieweeImage} />
              )}
            </AnimatePresence>
          </MotionDiv>
        )}
      </AnimatePresence>

      <div
        className="absolute z-10 flex flex-col"
        style={{ top: G, left: G, width: LEFT_W, bottom: G + CTRL_BAR_H + G, gap: G }}
      >
        <div style={{ flexShrink: 0 }}>
          <StatusBar clock={clock} participantId={launchContext.participantId} />
        </div>

        <div style={{ flex: "1 1 0", minHeight: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
          <MotionDiv
            layout
            transition={{ duration: 0.32, ease: [0.32, 0.72, 0, 1] }}
            style={
              openPanels.has("Transcript")
                ? { flex: "1 1 0", minHeight: 0, display: "flex", flexDirection: "column" }
                : { flexShrink: 0 }
            }
          >
            <LeftDockModule
              isExpanded={openPanels.has("Transcript")}
              onToggle={() => togglePanel("Transcript")}
              translateLang={translateLang}
              onTranslateLangChange={setTranslateLang}
              liveData={liveEngine}
            />
          </MotionDiv>
        </div>

        <AnimatePresence>
          {taskViewOpen && (
            <MotionDiv
              key="pip-slot"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.97 }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              style={{ flexShrink: 0 }}
            >
              <LeftDockPiP
                imgInterviewee={launchContext.intervieweeImage}
                imgCookiyAI={imgCookiyAI}
                participantId={launchContext.participantId}
                pipSwapped={pipSwapped}
                setPipSwapped={setPipSwapped}
                taskViewOpen={taskViewOpen}
                faceVideoRef={faceVideoRef}
                screenVideoRef={screenVideoRef}
              />
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      <div className="absolute top-1/2 -translate-y-1/2 z-30" style={{ right: G }}>
        <RightNav
          openPanels={openPanels} togglePanel={togglePanel} resetLayout={resetLayout}
          pendingCount={pending.length} rightCount={rightCount}
          analysisOpen={analysisOpen} panelsMoved={panelsMoved}
          detachedCount={Object.keys(detached).length}
          surfaceStyle={appAdaptiveSurface}
          taskViewOpen={taskViewOpen}
          onToggleTaskView={handleToggleTaskView}
        />
      </div>

      <SnapGuides lines={snapLines} />

      <AnimatePresence>
        {allRightOpen.map((id) => {
          const tab = TABS.find(t => t.id === id)!;
          const Icon = tab.icon;
          return (
            <DraggablePanel
              key={`${id}-${resetKey}`} id={id} title={id}
              meta={metaMap[id]} icon={<Icon size={14} />}
              onClose={() => closePanel(id)}
              targetRect={getTargetRect(id)}
              panelRectsRef={panelRectsRef} onSnapLines={setSnapLines}
              onDragStartNotify={() => handleDragStart(id)}
              onDragEndNotify={(fx, fy, fh) => handleDragEnd(id, fx, fy, fh)}
              onRedock={() => handleRedock(id)}
            >
              {contentMap[id]}
            </DraggablePanel>
          );
        })}
      </AnimatePresence>

      <AnimatePresence>
        {analysisOpen && !analysisMinimized && (() => {
          const vh = typeof window !== "undefined" ? window.innerHeight : 900;
          const analysisH = vh - (G + STATUS_H + STATUS_GAP) - (208 + G * 2 + CTRL_BAR_H) - G;
          const analysisRect: PRect = { x: G + 1, y: G + STATUS_H + STATUS_GAP, w: LEFT_W, h: Math.max(PANEL_MIN_H, analysisH) };
          return (
            <DraggablePanel
              key={`analysis-${resetKey}`} id="Analysis"
              title="Analysis" meta="Live" icon={<ScanFace size={14} />}
              onClose={() => { closePanel("Analysis"); setAnalysisMinimized(false); }}
              onMinimize={() => setAnalysisMinimized(true)}
              targetRect={analysisRect}
              panelRectsRef={panelRectsRef} onSnapLines={setSnapLines}
              onDragStartNotify={() => setPanelsMoved(true)}
              onDragEndNotify={() => {}} onRedock={() => {}}
            >
              <AnalysisContent emotion={emotion} history={history} />
            </DraggablePanel>
          );
        })()}
      </AnimatePresence>

      <AnimatePresence>
        {analysisOpen && analysisMinimized && (
          <AnalysisPill key="analysis-pill" emotion={emotion} onRestore={() => setAnalysisMinimized(false)} />
        )}
      </AnimatePresence>

      <div
        className="absolute z-20 flex items-end justify-center"
        style={{
          bottom: G,
          left: dockedIds.length > 0 ? G + LEFT_W + G : 0,
          right: dockedIds.length > 0 ? centreRight : 0,
          transition: "left 0.32s cubic-bezier(0.32,0.72,0,1), right 0.32s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        <ControlBar
          isMicOn={isMicOn} setIsMicOn={setIsMicOn}
          isVideoOn={isVideoOn} setIsVideoOn={setIsVideoOn}
          isScreenSharing={isScreenSharing} setIsScreenSharing={setIsScreenSharing}
          isSpeakerOn={isSpeakerOn} setIsSpeakerOn={setIsSpeakerOn}
          volume={volume} setVolume={setVolume}
          analysisOpen={analysisOpen} toggleAnalysis={() => togglePanel("Analysis")}
          notificationsOn={notificationsOn}
          onToggleNotifications={() => setNotificationsOn(prev => !prev)}
        />
      </div>

      <div
        className="absolute z-25 flex items-end justify-end"
        style={{ bottom: G, right: centreRight, transition: "right 0.32s cubic-bezier(0.32,0.72,0,1)", pointerEvents: "none" }}
      >
        <div style={{ pointerEvents: "auto" }}>
          <Tip text="Quality Termination" align="right">
            <button
              onClick={() => { setDiscardOpen(true); setDiscardReason(null); setDiscarded(false); }}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer"
              style={{
                ...surfaceStyle,
                background: discarded ? "rgba(255,128,128,0.08)" : "rgba(255,255,255,0.02)",
                borderRadius: R.md,
                color: discarded ? C.negative : "rgba(255,255,255,0.22)",
                borderWidth: 1, borderStyle: "solid",
                borderColor: discarded ? "rgba(255,128,128,0.14)" : "rgba(255,255,255,0.08)",
              }}>
              <AlertTriangle size={13} />
              <span style={{ fontSize: T.micro }}>Discard</span>
            </button>
          </Tip>
        </div>
      </div>

      <DiscardModal
        open={discardOpen} onClose={() => setDiscardOpen(false)}
        reason={discardReason} onReasonChange={setDiscardReason}
        onConfirm={handleDiscard} discarded={discarded}
      />

      <style dangerouslySetInnerHTML={{ __html: `
        .scroll-area::-webkit-scrollbar{width:3px}
        .scroll-area::-webkit-scrollbar-track{background:transparent}
        .scroll-area::-webkit-scrollbar-thumb{background:${isLightMode ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.04)"};border-radius:8px}
        .scroll-area::-webkit-scrollbar-thumb:hover{background:${isLightMode ? "rgba(0,0,0,0.14)" : "rgba(255,255,255,0.08)"}}
      ` }} />
    </div>
    </GlassTintCtx.Provider>
  );
}
