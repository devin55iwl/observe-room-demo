/**
 * shared/ — Cross-cutting modules used by BOTH Observe Room and Participant views.
 *
 * Design tokens, types, mock data, hooks, primitives, and UI components.
 * Nothing in this folder should depend on observe-room/ or participant/.
 *
 * Canonical source files live in the parent `components/` directory.
 * These re-exports provide a cleaner import path and serve as a manifest.
 */

// Design tokens, layout constants, style presets
export * from "../constants";

// TypeScript domain types (Session, Question, Transcript, etc.)
export * from "../types";

// Mock data for demo/prototype
export * from "../data";

// Shared React hooks (useClock, GlassTintCtx, useAdaptiveGlass, useSnapDrag)
export * from "../hooks";

// Low-level UI primitives (Surface, Card, SectionLabel, PanelContentArea)
export * from "../primitives";

// Portal-based tooltip
export { Tip } from "../Tip";
