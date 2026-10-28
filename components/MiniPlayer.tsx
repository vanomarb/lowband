import { currentDur } from "../state/playback";
import { useSwipe } from "../hooks/useSwipe";
import type { D, State } from "../state/types";
import { paletteOf } from "../data/catalog";
import { Art } from "./Art";
import { Icon } from "./Icon";

/** Floats above the tab bar on every tab. Tap (or swipe up) to open the full player. */
export function MiniPlayer({ s, d }: { s: State; d: D }) {
  const t = s.current ? s.tracks[s.current] : undefined;
  const swipe = useSwipe(() => d({ type: "PLAYER", open: true }));
  if (!t) return null;
  const buffering = s.playing && s.buffering;
  const p = Math.min(1, s.pos / (currentDur(s) || 1));
  return (
    <div className={`lb-mini lb-pal--${paletteOf(t.id)}`} role="region" aria-label="Now playing">
      <button type="button" className="lb-mini-open" {...swipe} aria-label={`Open player: ${t.title} by ${t.artist}`} onClick={() => d({ type: "PLAYER", open: true })}>
        <Art track={t} px={100} className="lb-mini-art" />
        <span className="lb-mini-text"><strong>{t.title}</strong><small>{t.artist}</small></span>
      </button>
      <button type="button" className="lb-icon-btn lb-mini-btn" aria-label={s.playing ? "Pause" : "Play"} onClick={() => d({ type: "TOGGLE" })}>
        {buffering ? <Icon name="spinner" size={24} className="lb-spin" /> : <Icon name={s.playing ? "pause" : "play"} size={24} weight="fill" />}
      </button>
      <button type="button" className="lb-icon-btn lb-mini-btn" aria-label="Next song" disabled={!s.queue.length} onClick={() => d({ type: "NEXT" })}><Icon name="next" size={24} weight="fill" /></button>
      <span className="lb-mini-prog" aria-hidden="true"><i style={{ transform: `scaleX(${p})` }} /></span>
    </div>
  );
}
