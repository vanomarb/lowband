"use client";

import { useEffect, useReducer } from "react";
import { initialState, reducer } from "../state/reducer";
import type { D, State } from "../state/types";
import { useAudioEngine } from "./useAudioEngine";

/** Everything the phone app and the web player share: one reducer, one audio engine, the sleep-timer clock and toast expiry. */
export function useLowband(): [State, D] {
  const [s, d] = useReducer(reducer, undefined, initialState);
  useAudioEngine(s, d);

  const clock = s.playing && s.sleep.mode === "timer";
  useEffect(() => {
    if (!clock) return;
    const timer = window.setInterval(() => d({ type: "TICK" }), 1000);
    return () => window.clearInterval(timer);
  }, [clock]);

  useEffect(() => {
    if (!s.toast) return;
    const id = s.toast.id;
    const timer = window.setTimeout(() => d({ type: "DISMISS", id }), s.toast.tone === "error" ? 9000 : 5000);
    return () => window.clearTimeout(timer);
  }, [s.toast]);

  return [s, d];
}

/**
 * Shared listening shortcuts: Space/K play-pause, J/L 5 seconds, N/P next/previous, / focuses search.
 * Returns true when it handled the key.
 */
export function handleShortcut(e: KeyboardEvent, d: D, onSlash?: () => boolean): boolean {
  if (e.metaKey || e.ctrlKey || e.altKey) return false;
  const el = e.target as HTMLElement;
  if (el.closest("input, textarea, select, [contenteditable], [role=dialog]")) return false;
  const key = e.key.toLowerCase();
  if (e.key === " " && !el.closest("button, a, [role=tab], [role=switch]")) { e.preventDefault(); d({ type: "TOGGLE" }); }
  else if (key === "k") d({ type: "TOGGLE" });
  else if (key === "j") d({ type: "SKIP", by: -5 });
  else if (key === "l") d({ type: "SKIP", by: 5 });
  else if (key === "n") d({ type: "NEXT" });
  else if (key === "p") d({ type: "PREV" });
  else if (e.key === "/" && onSlash?.()) e.preventDefault();
  else return false;
  return true;
}
