import { PREVIEW_SECONDS, shuffled } from "../data/catalog";
import type { Snapshot, State } from "./types";

/**
 * Playback intent. The reducer records what the listener wants (play this, pause, seek there); the audio engine
 * (hooks/useAudioEngine.ts) makes one HTMLAudioElement follow it and reports back what really happened through the
 * MEDIA_* actions. Position, duration, buffering and "ended" all come from the media element.
 */
export const SLEEP_MINUTES = [5, 15, 30, 60];
/** The sleep timer fades the volume out over its last seconds. */
export const FADE_SECONDS = 10;

export function withToast(s: State, message: string, undo?: Snapshot, tone?: "error"): State {
  const id = s.toastSeq + 1;
  return { ...s, toastSeq: id, toast: { id, message, undo, tone } };
}

export const titleOf = (s: State, id: string) => s.tracks[id]?.title ?? "Song";
/** Length of what is loaded: the media element's duration when known, else the 30-second preview length. */
export const currentDur = (s: State) => (s.current ? s.mediaDur ?? PREVIEW_SECONDS : 0);

/** Start a track. With `list`, the songs after it in that list become Up next (like tapping a row in an album). */
export function play(s: State, id: string, list?: string[]): State {
  if (!s.tracks[id]) return s;
  const at = list ? list.indexOf(id) : -1;
  const queue = list && at >= 0 ? list.slice(at + 1) : s.queue.filter((q) => q !== id);
  const history = s.current && s.current !== id ? [s.current, ...s.history.filter((h) => h !== s.current)].slice(0, 30) : s.history;
  return {
    ...s, current: id, pos: 0, playing: true, buffering: true, mediaDur: null, loadSeq: s.loadSeq + 1, queue, history,
    recent: [id, ...s.recent.filter((r) => r !== id)].slice(0, 24),
  };
}

export function playList(s: State, ids: string[], shuffle = false): State {
  const valid = ids.filter((id) => s.tracks[id]);
  if (!valid.length) return withToast(s, "Nothing to play here yet.");
  const order = shuffle ? shuffled(valid, s.shuffleSeq + 7) : valid;
  return { ...play(s, order[0], order), shuffleSeq: s.shuffleSeq + (shuffle ? 1 : 0) };
}

export function toggle(s: State): State {
  if (!s.current) return s;
  if (s.playing) return { ...s, playing: false, buffering: false };
  const atEnd = s.pos >= currentDur(s) - 0.5;
  return atEnd ? { ...s, playing: true, pos: 0, seekSeq: s.seekSeq + 1 } : { ...s, playing: true };
}

export function seek(s: State, pos: number): State {
  if (!s.current) return s;
  return { ...s, pos: Math.max(0, Math.min(currentDur(s) - 0.5, pos)), seekSeq: s.seekSeq + 1 };
}

export function next(s: State): State {
  const id = s.queue[0];
  return id ? play(s, id) : withToast(s, "Nothing is up next. Add songs to your queue.");
}

/** Previous restarts the song unless it has only just begun, like every music app. */
export function previous(s: State): State {
  const last = s.history[0];
  if (!s.current || s.pos > 3 || !last) return seek(s, 0);
  const cur = s.current;
  const started = play(s, last);
  return { ...started, queue: [cur, ...started.queue], history: s.history.slice(1) };
}

/** "ended" from the media element: follow the sleep timer, then the queue. */
export function ended(s: State): State {
  if (!s.current) return s;
  const done: State = { ...s, pos: currentDur(s), buffering: false };
  if (s.sleep.mode === "end") return withToast({ ...done, playing: false, sleep: { mode: "off" } }, "Sleep timer: stopped at the end of the song.");
  if (s.autoplay && s.queue[0]) return play(done, s.queue[0]);
  return withToast({ ...done, playing: false }, s.queue[0] ? "Autoplay is off. Press Next for the next song." : "That was the last song in your queue.");
}

export function mediaError(s: State): State {
  if (!s.current) return s;
  return withToast({ ...s, playing: false, buffering: false }, `Could not load the preview of "${titleOf(s, s.current)}". Check your connection and try again.`, undefined, "error");
}

/** One-second clock for the sleep timer. */
export function tick(s: State): State {
  if (!s.playing || s.buffering || s.sleep.mode !== "timer") return s;
  const left = s.sleep.left - 1;
  if (left <= 0) return withToast({ ...s, playing: false, sleep: { mode: "off" } }, "Sleep timer finished. Playback paused.");
  return { ...s, sleep: { ...s.sleep, left } };
}
