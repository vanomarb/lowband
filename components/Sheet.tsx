"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useDragToClose } from "../hooks/useDragToClose";
import { useLayout } from "./Page";

type Props = { label: string; onClose: () => void; children: ReactNode; /** "action" is the compact iOS action sheet. */ variant?: "sheet" | "action" };

const FOCUSABLE = 'button:not(:disabled), a[href], input:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * A bottom sheet with a grabber and a dimmed backdrop (a centred dialog in the web player). Traps focus,
 * closes on Escape, a backdrop tap or a downward drag on phones, and gives focus back to whatever opened it.
 */
export function Sheet({ label, onClose, children, variant = "sheet" }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const close = useRef(onClose);
  useEffect(() => { close.current = onClose; });
  useDragToClose(ref, onClose, useLayout() === "phone");

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const panel = ref.current;
    const first = panel?.querySelector<HTMLElement>("[data-autofocus]") ?? panel?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") { e.stopPropagation(); close.current(); return; }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      const a = items[0], z = items[items.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z?.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a?.focus(); }
    };
    document.addEventListener("keydown", onKey, true);
    return () => {
      document.removeEventListener("keydown", onKey, true);
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return (
    <div className="lb-sheet-wrap">
      <div className="lb-sheet-backdrop" onClick={onClose} aria-hidden="true" />
      <div ref={ref} className={`lb-sheet lb-sheet--${variant}`} role="dialog" aria-modal="true" aria-label={label}>
        <span className="lb-grabber" aria-hidden="true" />
        {children}
      </div>
    </div>
  );
}
