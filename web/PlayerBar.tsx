import type { CSSProperties } from "react";
import { clock, PREVIEW_LABEL, SOURCE_NAME } from "../data/catalog";
import { Art } from "../components/Art";
import { Icon } from "../components/Icon";
import { currentDur } from "../state/playback";
import type { D, State } from "../state/types";

type Props = { s: State; d: D; sideOpen: boolean; onSide: () => void };

/** Persistent bottom bar: what is playing and where it comes from, transport, scrubber, volume, sleep and Up next. */
export function PlayerBar({ s, d, sideOpen, onSide }: Props) {
  const t = s.current ? s.tracks[s.current] : undefined;
  const dur = currentDur(s);
  const buffering = s.playing && s.buffering;
  const vol = s.muted ? 0 : s.volume;
  const liked = t ? s.liked.includes(t.id) : false;
  return (
    <section className="lbw-bar" aria-label="Player">
      <div className="lbw-bar-now">
        {t ? <Art track={t} px={120} className="lbw-bar-art" /> : <span className="lbw-bar-art lb-art lb-art--empty" />}
        <span className="lbw-bar-text">
          <strong>{t?.title ?? "Nothing playing"}</strong>
          <small>{t ? t.artist : "Pick a song to start"}</small>
          {t && <small className="lbw-bar-src">{PREVIEW_LABEL} · {SOURCE_NAME}</small>}
        </span>
        {t && (
          <button type="button" className={`lb-icon-btn ${liked ? "is-on" : ""}`} aria-pressed={liked} aria-label={liked ? "Remove from Liked songs" : "Add to Liked songs"} onClick={() => d({ type: "LIKE", id: t.id })}>
            <Icon name="heart" size={22} weight={liked ? "fill" : "regular"} />
          </button>
        )}
      </div>
      <div className="lbw-bar-mid">
        <div className="lbw-bar-ctrl">
          <button type="button" className="lb-icon-btn" aria-label="Previous, or restart this song" disabled={!t} onClick={() => d({ type: "PREV" })}><Icon name="prev" size={22} weight="fill" /></button>
          <button type="button" className="lbw-play" aria-label={s.playing ? "Pause" : "Play"} disabled={!t} onClick={() => d({ type: "TOGGLE" })}>
            {buffering ? <Icon name="spinner" size={22} className="lb-spin" /> : <Icon name={s.playing ? "pause" : "play"} size={22} weight="fill" />}
          </button>
          <button type="button" className="lb-icon-btn" aria-label="Next song" disabled={!s.queue.length} onClick={() => d({ type: "NEXT" })}><Icon name="next" size={22} weight="fill" /></button>
        </div>
        <div className="lbw-scrub lb-scrub" style={{ "--p": `${dur ? Math.min(100, (s.pos / dur) * 100) : 0}%` } as CSSProperties}>
          <span>{clock(s.pos)}</span>
          <input type="range" min={0} max={Math.floor(dur * 10) / 10 || 30} step={0.1} value={Math.min(s.pos, dur)} disabled={!t} aria-label="Seek" aria-valuetext={`${clock(s.pos)} of ${clock(dur)}`} onChange={(e) => d({ type: "SEEK", pos: Number(e.target.value) })} />
          <span>{buffering ? "…" : clock(dur)}</span>
        </div>
      </div>
      <div className="lbw-bar-tools">
        <button type="button" className={`lb-icon-btn ${s.sleep.mode !== "off" ? "is-on" : ""}`} aria-label="Sleep timer" onClick={() => d({ type: "SHEET", sheet: { kind: "sleep" } })}><Icon name="sleep" size={20} weight={s.sleep.mode !== "off" ? "fill" : "regular"} /></button>
        <button type="button" className={`lb-icon-btn ${sideOpen ? "is-on" : ""}`} aria-expanded={sideOpen} aria-controls="lbw-side" aria-label={`Up next, ${s.queue.length} songs`} onClick={onSide}><Icon name="queue" size={20} weight={sideOpen ? "fill" : "regular"} /></button>
        <button type="button" className="lb-icon-btn lbw-wide" aria-pressed={s.muted} aria-label={s.muted ? "Unmute" : "Mute"} onClick={() => d({ type: "MUTE" })}><Icon name={vol === 0 ? "mute" : "volume"} size={20} /></button>
        <span className="lbw-vol lb-volume lbw-wide" style={{ "--p": `${vol * 100}%` } as CSSProperties}>
          <input type="range" min={0} max={100} step={5} value={Math.round(vol * 100)} aria-label="Volume" aria-valuetext={`${Math.round(vol * 100)} percent`} onChange={(e) => d({ type: "VOLUME", volume: Number(e.target.value) / 100 })} />
        </span>
      </div>
    </section>
  );
}
