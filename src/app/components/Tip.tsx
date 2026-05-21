/**
 * Tip — Portal-based tooltip that renders above all other content.
 *
 * Uses a ResizeObserver + getBoundingClientRect to position the tooltip
 * relative to the anchor element. Supports left/center/right alignment
 * and automatically flips when near viewport edges.
 */
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import type { ReactNode, CSSProperties } from "react";

/* ═══════════════════════════════════════════════
   TOOLTIP — Portal-based, escapes overflow:hidden.
   Rams #4: "Good design makes a product
   understandable." Pure information delivery.
   ═══════════════════════════════════════════════ */

const BASE: CSSProperties = {
  backdropFilter: "blur(60px) saturate(150%)",
  WebkitBackdropFilter: "blur(60px) saturate(150%)",
  borderRadius: 10,
  background: "rgba(10,12,18,0.92)",
  border: "0.5px solid rgba(255,255,255,0.10)",
  boxShadow: "0 4px 20px rgba(0,0,0,0.50)",
  color: "rgba(255,255,255,0.72)",
  fontSize: 11,
  lineHeight: 1.5,
  padding: "6px 12px",
  maxWidth: 240,
  pointerEvents: "none" as const,
  zIndex: 9999,
  position: "fixed" as const,
};

export function Tip({
  children,
  text,
  align = "center",
  above = true,
  className = "",
}: {
  children: ReactNode;
  text: string;
  align?: "left" | "center" | "right";
  above?: boolean;
  className?: string;
}) {
  const [phase, setPhase] = useState<"hidden" | "measuring" | "visible">("hidden");
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tipRef = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>();

  const show = useCallback(() => {
    timer.current = setTimeout(() => {
      if (!triggerRef.current) return;
      const r = triggerRef.current.getBoundingClientRect();
      // Initial estimate — will refine after measuring tip
      setPos({
        top: above ? r.top - 10 : r.bottom + 10,
        left: align === "left" ? r.left : align === "right" ? r.right : r.left + r.width / 2,
      });
      setPhase("measuring");
    }, 300);
  }, [above, align]);

  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setPhase("hidden");
  }, []);

  // After first invisible render, measure tip and finalize position
  useEffect(() => {
    if (phase !== "measuring") return;
    const tip = tipRef.current;
    const trigger = triggerRef.current;
    if (!tip || !trigger) return;

    const tr = trigger.getBoundingClientRect();
    const tt = tip.getBoundingClientRect();
    const gap = 10;

    let top: number;
    if (above) {
      top = tr.top - tt.height - gap;
      if (top < 8) top = tr.bottom + gap; // flip below if clipped
    } else {
      top = tr.bottom + gap;
      if (top + tt.height > window.innerHeight - 8) top = tr.top - tt.height - gap;
    }

    let left: number;
    if (align === "left") left = tr.left;
    else if (align === "right") left = tr.right - tt.width;
    else left = tr.left + tr.width / 2 - tt.width / 2;

    // Clamp to viewport
    left = Math.max(8, Math.min(left, window.innerWidth - tt.width - 8));
    top = Math.max(8, top);

    setPos({ top, left });
    setPhase("visible");
  }, [phase, above, align]);

  return (
    <div
      ref={triggerRef}
      className={className}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {children}
      {phase !== "hidden" &&
        createPortal(
          <div
            ref={tipRef}
            style={{
              ...BASE,
              top: pos.top,
              left: pos.left,
              opacity: phase === "visible" ? 1 : 0,
              transform: phase === "visible" ? "translateY(0) scale(1)" : "translateY(2px) scale(0.97)",
              transition: "opacity 0.15s ease, transform 0.15s ease",
            }}
          >
            {text}
          </div>,
          document.body
        )}
    </div>
  );
}