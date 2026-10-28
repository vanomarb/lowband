import { useEffect, useRef, type RefObject } from "react";

/**
 * Drag a bottom sheet or the full player down to close it, like iOS. Touch only: a mouse has the close
 * button, the backdrop and Escape.
 *
 * A downward drag starts only when nothing under the finger is scrolled down (otherwise the touch scrolls the
 * content as usual) and is not on a slider. The panel follows the finger; letting go past a quarter of its
 * height, or with a quick flick, closes it, otherwise it springs back.
 */
export function useDragToClose<T extends HTMLElement>(ref: RefObject<T | null>, onClose: () => void, enabled = true) {
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; });

  useEffect(() => {
    const panel = ref.current;
    if (!panel || !enabled) return;
    let startX = 0, startY = 0, startT = 0, dy = 0;
    let state: "idle" | "maybe" | "drag" = "idle";

    // "Desktop site" mode zooms the page (see phone.ts); touch coordinates are unzoomed screen pixels.
    const zoom = () => parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--lb-zoom")) || 1;
    const scrolledAbove = (el: EventTarget | null) => {
      for (let n = el as HTMLElement | null; n && n !== panel.parentElement; n = n.parentElement) {
        if (n.scrollTop > 0) return true;
      }
      return false;
    };
    const reset = () => { panel.style.transition = ""; panel.style.transform = ""; };

    const onStart = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (e.touches.length !== 1 || target.closest('input[type="range"]') || scrolledAbove(target)) { state = "idle"; return; }
      state = "maybe";
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startT = e.timeStamp;
      dy = 0;
    };
    const onMove = (e: TouchEvent) => {
      if (state === "idle") return;
      const x = e.touches[0].clientX - startX, y = e.touches[0].clientY - startY;
      if (state === "maybe") {
        // Decide on the first clear movement: down and mostly vertical drags the panel, anything else scrolls.
        if (Math.abs(x) < 8 && Math.abs(y) < 8) return;
        if (y <= 0 || Math.abs(x) > Math.abs(y)) { state = "idle"; return; }
        state = "drag";
        panel.style.transition = "none";
      }
      e.preventDefault();
      dy = Math.max(0, y) / zoom();
      panel.style.transform = `translateY(${dy}px)`;
    };
    const onEnd = (e: TouchEvent) => {
      if (state !== "drag") { state = "idle"; return; }
      state = "idle";
      const speed = dy / Math.max(1, e.timeStamp - startT);
      if (dy > panel.offsetHeight / 4 || (speed > 0.5 && dy > 24)) {
        panel.style.transition = "transform 0.2s ease-out";
        panel.style.transform = "translateY(100%)";
        // Clear the inline transform only after React has applied the closed state, so nothing flashes.
        window.setTimeout(() => { close.current(); requestAnimationFrame(() => requestAnimationFrame(reset)); }, 200);
      } else {
        panel.style.transition = "transform 0.25s ease-out";
        panel.style.transform = "";
        window.setTimeout(reset, 250);
      }
    };

    panel.addEventListener("touchstart", onStart, { passive: true });
    panel.addEventListener("touchmove", onMove, { passive: false });
    panel.addEventListener("touchend", onEnd);
    panel.addEventListener("touchcancel", onEnd);
    return () => {
      panel.removeEventListener("touchstart", onStart);
      panel.removeEventListener("touchmove", onMove);
      panel.removeEventListener("touchend", onEnd);
      panel.removeEventListener("touchcancel", onEnd);
      reset();
    };
  }, [ref, enabled]);
}
