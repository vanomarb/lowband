import { useRef, type CSSProperties } from "react";
import { clock, paletteOf, PREVIEW_LABEL, SOURCE_NAME } from "../data/catalog";
import { useDragToClose } from "../hooks/useDragToClose";
import { currentDur } from "../state/playback";
import type { D, State } from "../state/types";
import { Art } from "./Art";
import { inertProps } from "./Bits";
import { Icon } from "./Icon";
import { QueueList } from "./QueueList";

/** The phone's Now Playing sheet: artwork (or Up next), title, scrubber, transport, volume and tools. */
export function FullPlayer({ s, d }: { s: State; d: D }) {
  const t = s.current ? s.tracks[s.current] : undefined;
  const open = s.playerOpen && Boolean(t);
  const panel = useRef<HTMLElement>(null);
  useDragToClose(panel, () => d({ type: "PLAYER", open: false }), open);
  if (!t) return <div className="lb-player" aria-hidden="true" {...inertProps(true)} />;
  const dur = currentDur(s);
  const buffering = s.playing && s.buffering;
  const liked = s.liked.includes(t.id);
  const vol = s.muted ? 0 : s.volume;
  const queue = s.playerView === "queue";
  const sleepOn = s.sleep.mode !== "off";
  return (
    <section ref={panel} className={`lb-player lb-pal--${paletteOf(t.id)} ${open ? "is-open" : ""} ${s.playing ? "is-playing" : ""}`}
      role="dialog" aria-modal="true" aria-label="Now playing" aria-hidden={open ? undefined : true} {...inertProps(!open)}>
      <div className="lb-player-bg" aria-hidden="true"><Art track={t} px={100} /></div>
      <header className="lb-player-top">
        <button type="button" className="lb-icon-btn" aria-label="Close player" onClick={() => d({ type: "PLAYER", open: false })}><Icon name="down" size={26} weight="bold" /></button>
        <span className="lb-grabber" aria-hidden="true" />
        <button type="button" className="lb-icon-btn" aria-label={`More options for ${t.title}`} onClick={() => d({ type: "SHEET", sheet: { kind: "track", id: t.id } })}><Icon name="more" size={26} weight="bold" /></button>
      </header>
      <div className="lb-player-body">
        {queue ? (
          <div className="lb-player-queue"><QueueList s={s} d={d} /></div>
        ) : (
          <div className="lb-player-art"><Art track={t} px={600} alt={`Album artwork: ${t.album}`} /></div>
        )}
        <div className="lb-player-title">
          <div>
            <h2>{t.title}</h2>
            <button type="button" className="lb-player-artist" onClick={() => d({ type: "PUSH", route: { kind: "artist", name: t.artist, id: t.artistId } })}>{t.artist}</button>
          </div>
          <button type="button" className={`lb-icon-btn lb-like ${liked ? "is-on" : ""}`} aria-pressed={liked} aria-label={liked ? "Remove from Liked songs" : "Add to Liked songs"} onClick={() => d({ type: "LIKE", id: t.id })}>
            <Icon name="heart" size={26} weight={liked ? "fill" : "regular"} />
          </button>
        </div>
        <div className="lb-scrub" style={{ "--p": `${Math.min(100, (s.pos / dur) * 100)}%` } as CSSProperties}>
          <input type="range" min={0} max={Math.floor(dur * 10) / 10} step={0.1} value={Math.min(s.pos, dur)} aria-label="Seek" aria-valuetext={`${clock(s.pos)} of ${clock(dur)}`} onChange={(e) => d({ type: "SEEK", pos: Number(e.target.value) })} />
          <div className="lb-scrub-times"><span>{clock(s.pos)}</span><span className="lb-scrub-src">{buffering ? "Loading…" : `${PREVIEW_LABEL} · ${SOURCE_NAME}`}</span><span>−{clock(dur - s.pos)}</span></div>
        </div>
        <div className="lb-transport">
          <button type="button" className="lb-icon-btn lb-tbtn" aria-label="Previous, or restart this song" onClick={() => d({ type: "PREV" })}><Icon name="prev" size={34} weight="fill" /></button>
          <button type="button" className="lb-icon-btn lb-tbtn lb-tplay" aria-label={s.playing ? "Pause" : "Play"} onClick={() => d({ type: "TOGGLE" })}>
            {buffering ? <Icon name="spinner" size={44} className="lb-spin" /> : <Icon name={s.playing ? "pause" : "play"} size={48} weight="fill" />}
          </button>
          <button type="button" className="lb-icon-btn lb-tbtn" aria-label="Next song" disabled={!s.queue.length} onClick={() => d({ type: "NEXT" })}><Icon name="next" size={34} weight="fill" /></button>
        </div>
        <div className="lb-volume" style={{ "--p": `${vol * 100}%` } as CSSProperties}>
          <button type="button" className="lb-icon-btn" aria-label={s.muted ? "Unmute" : "Mute"} aria-pressed={s.muted} onClick={() => d({ type: "MUTE" })}><Icon name={vol === 0 ? "mute" : "volumeLow"} size={18} weight="fill" /></button>
          <input type="range" min={0} max={100} step={5} value={Math.round(vol * 100)} aria-label="Volume" aria-valuetext={`${Math.round(vol * 100)} percent`} onChange={(e) => d({ type: "VOLUME", volume: Number(e.target.value) / 100 })} />
          <Icon name="volume" size={18} weight="fill" />
        </div>
        <div className="lb-player-tools">
          <button type="button" className={`lb-icon-btn ${sleepOn ? "is-on" : ""}`} aria-label={sleepOn ? `Sleep timer on${s.sleep.mode === "timer" ? `, ${clock(s.sleep.left)} left` : ", end of song"}` : "Sleep timer"} onClick={() => d({ type: "SHEET", sheet: { kind: "sleep" } })}>
            <Icon name="sleep" size={22} weight={sleepOn ? "fill" : "regular"} />{s.sleep.mode === "timer" && <small>{clock(s.sleep.left)}</small>}
          </button>
          <button type="button" className={`lb-icon-btn ${queue ? "is-on" : ""}`} aria-pressed={queue} aria-label={`Up next, ${s.queue.length} songs`} onClick={() => d({ type: "PLAYER_VIEW", view: queue ? "art" : "queue" })}>
            <Icon name="queue" size={22} weight={queue ? "fill" : "regular"} />
          </button>
        </div>
      </div>
    </section>
  );
}
