/**
 * LeftNav — Left edge placeholder.
 *
 * The Surface with nav buttons has been removed.
 * PiP Camera is always visible in the left dock area (controlled by App).
 * Transcript is controlled from the right nav.
 */
import React from "react";
import type { CSSProperties } from "react";

interface LeftNavProps {
  surfaceStyle: CSSProperties;
}

export function LeftNav({ surfaceStyle }: LeftNavProps) {
  return (
    <div />
  );
}
