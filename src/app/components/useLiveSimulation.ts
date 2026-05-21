/**
 * useLiveSimulation — Shared live caption simulation engine.
 *
 * Single source of truth for both LiveTranscript (floating bubble) and
 * LeftDockModule (left-dock live bar). Both components consume this hook's
 * output; neither runs its own independent simulation.
 *
 * Exported types are shared between LiveTranscript and LeftDockModule so
 * SPEAKER_META, HistoryTurn, LiveBubble, Speaker all live here.
 */
import { useState, useEffect, useRef, useCallback } from "react";
import { Sparkles, User } from "lucide-react";
import type { ElementType } from "react";
import { C } from "./constants";

/* ── Types ─────────────────────────────────────────────────── */
export type Speaker = "mod" | "int";

export interface HistoryTurn {
  id: number;
  speaker: Speaker;
  name: string;
  text: string;
  time: string;
}

export interface LiveBubble {
  speaker: Speaker;
  name: string;
  fullText: string;
  displayed: string;
  done: boolean;
}

/* ── Speaker identity tokens (shared) ─────────────────────── */
export const SPEAKER_META: Record<
  Speaker,
  { name: string; color: string; bg: string; border: string; Icon: ElementType }
> = {
  mod: {
    name: "Cookiy AI",
    color: "rgba(97,95,255,0.90)",
    bg: "rgba(97,95,255,0.10)",
    border: "rgba(97,95,255,0.22)",
    Icon: Sparkles,
  },
  int: {
    name: "#9527",
    color: "rgba(109,212,160,0.90)",
    bg: "rgba(109,212,160,0.08)",
    border: "rgba(109,212,160,0.18)",
    Icon: User,
  },
};

/* ── Simulation script ─────────────────────────────────────── */
interface Scene {
  mod?: string;
  int?: string;
  /** ms to linger after streaming finishes before advancing */
  pause?: number;
}

const SCENES: Scene[] = [
  { mod: "Walk me through what happens right after you finish a design in Figma.", pause: 600 },
  { int: "I export assets, drop them into Notion, then ping the dev channel. It's very manual.", pause: 400 },
  { mod: "And who's responsible for keeping that Notion page up to date?", pause: 300 },
  { int: "Technically me, but in practice nobody really—", pause: 200 },
  /* overlap */
  { mod: "—nobody owns it?", int: "—nobody owns it, yeah. Exactly.", pause: 600 },
  { int: "That's where version conflicts come from. It's the single biggest pain point.", pause: 500 },
  { mod: "If you could automate just one part of that handoff, what would it be?", pause: 400 },
  { int: "Asset sync. Hands down. If Figma just pushed the right files automatically I'd save—", pause: 200 },
  /* overlap */
  { mod: "—hours a week?", int: "—at least two hours. Maybe more.", pause: 600 },
  { int: "It's death by a thousand cuts. Each export is two minutes but it adds up.", pause: 600 },
  { mod: "Has your team explored any automation tools for this?", pause: 400 },
  { int: "We tried Zapier once but it broke every time Figma updated their API.", pause: 500 },
  /* overlap */
  { mod: "—so you gave up on it?", int: "—we just gave up. Too fragile.", pause: 600 },
  { int: "Figma, Jira, Notion, Slack — one place where everything stays in sync automatically.", pause: 600 },
];

const INITIAL_HISTORY: HistoryTurn[] = [
  { id: 1, speaker: "mod", name: "Cookiy AI", time: "06:12", text: "Thanks for joining. Could you start with your current role?" },
  { id: 2, speaker: "int", name: "#9527",     time: "06:24", text: "I'm a product designer at a mid-size SaaS company. I lead the design system." },
  { id: 3, speaker: "mod", name: "Cookiy AI", time: "06:58", text: "Describe your day-to-day design handoff process." },
  { id: 4, speaker: "int", name: "#9527",     time: "07:08", text: "Mostly Figma specs and Notion. We annotate frames, export assets, leave comments." },
];

const CHARS_PER_TICK = 2;
const TICK_MS = 28;

/* ── Hook return type ─────────────────────────────────────── */
export interface LiveSimulationState {
  modBubble: LiveBubble | null;
  intBubble: LiveBubble | null;
  history: HistoryTurn[];
  isOverlap: boolean;
  hasLive: boolean;
  /** Most recent completed turn — for LeftDockModule live bar */
  lastTurn: HistoryTurn | null;
  /** Whether either speaker is currently mid-stream */
  isStreaming: boolean;
  /** Primary active speaker (mod takes priority in overlap) */
  activeSpeaker: Speaker | null;
}

/* ── Simulation hook ──────────────────────────────────────── */
export function useLiveSimulation(clock: string): LiveSimulationState {
  const [history, setHistory] = useState<HistoryTurn[]>(INITIAL_HISTORY);
  const [modBubble, setModBubble] = useState<LiveBubble | null>(null);
  const [intBubble, setIntBubble] = useState<LiveBubble | null>(null);

  const sceneIdxRef  = useRef(0);
  const historyIdRef = useRef(INITIAL_HISTORY.length + 1);
  const simRunning   = useRef(false);
  const clockRef     = useRef(clock);

  /* keep clockRef in sync without adding it to runScene deps */
  useEffect(() => { clockRef.current = clock; }, [clock]);

  const streamBubble = useCallback((
    setter: React.Dispatch<React.SetStateAction<LiveBubble | null>>,
    bubble: LiveBubble,
    onDone: () => void,
  ) => {
    let pos = 0;
    const full = bubble.fullText;
    const tick = setInterval(() => {
      pos = Math.min(pos + CHARS_PER_TICK, full.length);
      setter(prev => prev ? { ...prev, displayed: full.slice(0, pos) } : null);
      if (pos >= full.length) {
        clearInterval(tick);
        setter(prev => prev ? { ...prev, done: true } : null);
        onDone();
      }
    }, TICK_MS);
    return () => clearInterval(tick);
  }, []);

  const runScene = useCallback(() => {
    if (!simRunning.current) return;
    const scene = SCENES[sceneIdxRef.current % SCENES.length];
    sceneIdxRef.current++;
    const pause = scene.pause ?? 500;

    const makeBubble = (speaker: Speaker, text: string): LiveBubble => ({
      speaker,
      name: SPEAKER_META[speaker].name,
      fullText: text,
      displayed: "",
      done: false,
    });

    const modB = scene.mod ? makeBubble("mod", scene.mod) : null;
    const intB = scene.int ? makeBubble("int", scene.int) : null;
    setModBubble(modB);
    setIntBubble(intB);

    const modTime = scene.mod ? Math.ceil(scene.mod.length / CHARS_PER_TICK) * TICK_MS : 0;
    const intTime = scene.int ? Math.ceil(scene.int.length / CHARS_PER_TICK) * TICK_MS : 0;
    const totalStream = Math.max(modTime, intTime);

    let cleanMod: (() => void) | null = null;
    let cleanInt: (() => void) | null = null;
    if (modB) cleanMod = streamBubble(setModBubble, modB, () => {});
    if (intB) cleanInt = streamBubble(setIntBubble, intB, () => {});

    const timer = setTimeout(() => {
      const t = clockRef.current;
      setHistory(prev => {
        const next = [...prev];
        if (modB) next.push({ id: historyIdRef.current++, speaker: "mod", name: SPEAKER_META.mod.name, text: modB.fullText, time: t });
        if (intB) next.push({ id: historyIdRef.current++, speaker: "int", name: SPEAKER_META.int.name, text: intB.fullText, time: t });
        return next.slice(-12); // keep last 12 turns
      });
      setModBubble(null);
      setIntBubble(null);
      setTimeout(runScene, 280);
    }, totalStream + pause);

    return () => {
      clearTimeout(timer);
      cleanMod?.();
      cleanInt?.();
    };
  }, [streamBubble]);

  useEffect(() => {
    simRunning.current = true;
    const t = setTimeout(runScene, 900);
    return () => { simRunning.current = false; clearTimeout(t); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isOverlap      = !!modBubble && !!intBubble;
  const hasLive        = !!modBubble || !!intBubble;
  const isStreaming    = hasLive && (!(modBubble?.done ?? true) || !(intBubble?.done ?? true));
  const activeSpeaker  = modBubble ? "mod" : intBubble ? "int" : null;

  const [lastTurn, setLastTurn] = useState<HistoryTurn | null>(null);
  useEffect(() => {
    if (history.length > 0) setLastTurn(history[history.length - 1]);
  }, [history]);

  return { modBubble, intBubble, history, isOverlap, hasLive, lastTurn, isStreaming, activeSpeaker };
}
