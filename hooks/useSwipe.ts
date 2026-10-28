import { useRef, type PointerEvent } from "react";

/** Pointer swipe detection: calls `onUp` / `onDown` when a drag moves at least 36px mostly vertically. */
export function useSwipe(onUp?: () => void, onDown?: () => void) {
  const start = useRef<{ x: number; y: number } | null>(null);
  return {
    onPointerDown: (e: PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; },
    onPointerUp: (e: PointerEvent) => {
      const from = start.current;
      start.current = null;
      if (!from) return;
      const dy = e.clientY - from.y, dx = e.clientX - from.x;
      if (Math.abs(dy) < 36 || Math.abs(dy) < Math.abs(dx) * 1.5) return;
      if (dy < 0) onUp?.(); else onDown?.();
    },
    onPointerCancel: () => { start.current = null; },
  };
}
