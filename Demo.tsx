"use client";

import "./theme.css";
import "./native.css";
import "./player.css";
import "./screens.css";
import { useEffect, useRef } from "react";
import type { DemoProps } from "./types";
import { inertProps } from "./components/Bits";
import { FullPlayer } from "./components/FullPlayer";
import { MiniPlayer } from "./components/MiniPlayer";
import { LayoutContext } from "./components/Page";
import { Sheets } from "./components/Sheets";
import { TabBar } from "./components/TabBar";
import { Toast } from "./components/Toast";
import { paletteOf } from "./data/catalog";
import { handleShortcut, useLowband } from "./hooks/useLowband";
import { Screen, viewKeyOf } from "./screens/Router";

/**
 * The phone app: a fixed-height shell where only each screen's content scrolls, a floating mini-player over a
 * translucent tab bar, a Now Playing sheet and bottom sheets for every choice. Safe areas come from the host
 * frame (--safe-top / --safe-bottom) or the device (env()).
 */
function App({ today, homeHref }: { today: string; homeHref: string }) {
  const [s, d] = useLowband();
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const last = useRef({ open: false, key: "" });
  const viewKey = viewKeyOf(s);
  const tint = s.current ? paletteOf(s.current) : "magenta";

  // Focus: the new screen's title after navigation, the close button when the player opens, the mini-player when it closes.
  useEffect(() => {
    const prev = last.current;
    const root = rootRef.current;
    if (s.playerOpen && !prev.open) root?.querySelector<HTMLElement>(".lb-player-top button")?.focus();
    else if (!s.playerOpen && prev.open) root?.querySelector<HTMLElement>(".lb-mini-open")?.focus();
    else if (prev.key && prev.key !== viewKey) root?.querySelector<HTMLElement>(".lb-main [data-view-focus]")?.focus({ preventScroll: true });
    last.current = { open: s.playerOpen, key: viewKey };
  }, [s.playerOpen, viewKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (s.sheet) return;
      if (s.playerOpen && e.key === "Escape") { d({ type: "PLAYER", open: false }); return; }
      if (s.playerOpen && e.key === "Tab") {
        const items = Array.from(rootRef.current?.querySelectorAll<HTMLElement>(".lb-player button:not(:disabled), .lb-player input") ?? []);
        const first = items[0], end = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); end?.focus(); }
        else if (!e.shiftKey && document.activeElement === end) { e.preventDefault(); first?.focus(); }
        return;
      }
      handleShortcut(e, d, () => {
        if (s.tab !== "search" || s.playerOpen) return false;
        searchRef.current?.focus();
        return true;
      });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [s.playerOpen, s.tab, s.sheet, d]);

  const behind = inertProps(s.playerOpen || Boolean(s.sheet));
  return (
    <LayoutContext.Provider value="phone">
      <div ref={rootRef} className={`lowband-demo lb-app lb-pal--${tint} ${s.current ? "has-mini" : ""}`}>
        <main className="lb-main" {...behind}>
          <Screen s={s} d={d} today={today} homeHref={homeHref} searchRef={searchRef} />
        </main>
        <div className="lb-dock" {...behind}>
          <MiniPlayer s={s} d={d} />
          <TabBar s={s} d={d} />
        </div>
        <div {...inertProps(Boolean(s.sheet))}><FullPlayer s={s} d={d} /></div>
        <Sheets s={s} d={d} />
        <Toast toast={s.toast} d={d} />
      </div>
    </LayoutContext.Provider>
  );
}

export default function Demo({ today = "2026-10-27", resetKey = 0, homeHref = "/" }: DemoProps) {
  return <App key={resetKey} today={today} homeHref={homeHref} />;
}
