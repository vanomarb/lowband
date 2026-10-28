"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { FIXTURE_DATE, paletteOf } from "../data/catalog";
import { LayoutContext } from "../components/Page";
import { QueueList } from "../components/QueueList";
import { Sheets } from "../components/Sheets";
import { Toast } from "../components/Toast";
import { Icon } from "../components/Icon";
import { handleShortcut, useLowband } from "../hooks/useLowband";
import { Screen, viewKeyOf } from "../screens/Router";
import { PlayerBar } from "./PlayerBar";
import { Rail } from "./Rail";

const WIDE = "(min-width: 1280px)";

function subscribeWide(onChange: () => void) {
  const media = window.matchMedia(WIDE);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
const isWide = () => window.matchMedia(WIDE).matches;

/**
 * Lowband on the desktop web: rail, main column, an Up next panel and a persistent player bar.
 * Same reducer, screens, catalogue and audio engine as the phone app (hooks/useLowband.ts).
 */
export default function WebPlayer({ appHref }: { appHref: string }) {
  const [s, d] = useLowband();
  // null until the listener toggles it: CSS docks the panel at 1280+ and hides it below, so the first paint never jumps.
  const [side, setSide] = useState<boolean | null>(null);
  const wide = useSyncExternalStore(subscribeWide, isWide, () => false);
  const mainRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const lastView = useRef("");
  const viewKey = viewKeyOf(s);
  const sideOpen = side ?? wide;

  useEffect(() => {
    if (lastView.current && lastView.current !== viewKey) {
      mainRef.current?.scrollTo({ top: 0 });
      mainRef.current?.querySelector<HTMLElement>("[data-view-focus]")?.focus({ preventScroll: true });
    }
    lastView.current = viewKey;
  }, [viewKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (s.sheet) return;
      if (e.key === "Escape" && sideOpen && !window.matchMedia(WIDE).matches) { setSide(false); return; }
      handleShortcut(e, d, () => {
        if (s.tab !== "search") d({ type: "OPEN", tab: "search" });
        window.setTimeout(() => searchRef.current?.focus(), 0);
        return true;
      });
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [s.sheet, s.tab, sideOpen, d]);

  return (
    <LayoutContext.Provider value="web">
      <div className={`lowband-demo lowband-web lb-pal--${s.current ? paletteOf(s.current) : "magenta"}`} data-side={side === null ? "auto" : side ? "open" : "closed"}>
        <Rail s={s} d={d} appHref={appHref} />
        <main ref={mainRef} className="lbw-main">
          <Screen s={s} d={d} today={FIXTURE_DATE} searchRef={searchRef} />
          <footer className="lbw-footer">
            <p>Lowband is a concept: one player for the music people already stream. Songs and 30-second previews come from the public iTunes Search API; no Spotify, YouTube Music or Apple Music account is connected.</p>
            <p>Shortcuts: Space or K play/pause · J/L 5 seconds · N/P next/previous · / search.</p>
          </footer>
        </main>
        <aside id="lbw-side" className="lbw-side" aria-labelledby="lbw-side-h" data-open={sideOpen || undefined}>
          <div className="lbw-side-head">
            <h2 id="lbw-side-h">Up next</h2>
            <button type="button" className="lb-icon-btn" aria-label="Close Up next" onClick={() => setSide(false)}><Icon name="close" size={20} /></button>
          </div>
          <QueueList s={s} d={d} />
        </aside>
        <PlayerBar s={s} d={d} sideOpen={sideOpen} onSide={() => setSide(!sideOpen)} />
        <Sheets s={s} d={d} />
        <Toast toast={s.toast} d={d} />
      </div>
    </LayoutContext.Provider>
  );
}
