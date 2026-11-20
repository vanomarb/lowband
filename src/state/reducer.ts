import { SERVICES } from "../data/catalog";
import * as lib from "./library";
import * as pb from "./playback";
import { initialState } from "./seed";
import type { Action, State } from "./types";

export { initialState } from "./seed";

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    // Reset keeps tracks live search found, so nothing on screen loses its artwork mid-reset.
    case "RESET": return { ...initialState(), tracks: s.tracks, loadSeq: s.loadSeq + 1 };
    case "TAB": return a.tab === s.tab ? { ...s, stacks: { ...s.stacks, [a.tab]: [] } } : { ...s, tab: a.tab };
    // Going to an artist or album from the full player closes it, like Apple Music.
    case "PUSH": return { ...s, stacks: { ...s.stacks, [s.tab]: [...s.stacks[s.tab], a.route] }, sheet: null, playerOpen: false };
    case "OPEN": return { ...s, tab: a.tab, stacks: { ...s.stacks, [a.tab]: a.route ? [a.route] : [] }, sheet: null };
    case "POP": return { ...s, stacks: { ...s.stacks, [s.tab]: s.stacks[s.tab].slice(0, -1) } };
    case "QUERY": return { ...s, query: a.query };
    case "SCOPE": return { ...s, scope: a.scope };
    case "ADD_TRACKS": {
      const fresh = a.tracks.filter((t) => !s.tracks[t.id]);
      return fresh.length ? { ...s, tracks: { ...s.tracks, ...Object.fromEntries(fresh.map((t) => [t.id, t])) } } : s;
    }
    case "PLAY": return pb.play({ ...s, sheet: null }, a.id, a.list);
    case "PLAY_LIST": return pb.playList(s, a.ids, a.shuffle);
    case "TOGGLE": return pb.toggle(s);
    case "SEEK": return pb.seek(s, a.pos);
    case "SKIP": return pb.seek(s, s.pos + a.by);
    case "NEXT": return pb.next(s);
    case "PREV": return pb.previous(s);
    case "TICK": return pb.tick(s);
    case "MEDIA_TIME": return Number.isFinite(a.pos) && s.current ? { ...s, pos: a.pos } : s;
    case "MEDIA_DUR": return Number.isFinite(a.dur) && a.dur > 0 ? { ...s, mediaDur: a.dur } : s;
    case "MEDIA_WAITING": return s.playing && !s.buffering ? { ...s, buffering: true } : s;
    case "MEDIA_PLAYING": return s.buffering ? { ...s, buffering: false } : s;
    case "MEDIA_PAUSED": return s.playing ? { ...s, playing: false, buffering: false } : s;
    case "MEDIA_ENDED": return pb.ended(s);
    case "MEDIA_ERROR": return pb.mediaError(s);
    case "MEDIA_BLOCKED": return s.playing ? pb.withToast({ ...s, playing: false, buffering: false }, "Your browser blocked autoplay. Press Play to start listening.") : s;
    case "VOLUME": return { ...s, volume: Math.max(0, Math.min(1, a.volume)), muted: a.volume > 0 ? false : s.muted };
    case "MUTE": return { ...s, muted: !s.muted };
    case "SLEEP": {
      const sleep = a.minutes === "off" ? { mode: "off" as const } : a.minutes === "end" ? { mode: "end" as const } : { mode: "timer" as const, left: a.minutes * 60, total: a.minutes * 60 };
      const label = a.minutes === "off" ? "Sleep timer off." : a.minutes === "end" ? "Playback will stop at the end of this song." : `Sleep timer set for ${a.minutes} minutes.`;
      return pb.withToast({ ...s, sleep, sheet: null }, label);
    }
    case "AUTOPLAY": return { ...s, autoplay: !s.autoplay };
    case "LIKE": return lib.toggleLike(s, a.id);
    case "QUEUE_ADD": return lib.queueAdd(s, a.id, a.next);
    case "QUEUE_REMOVE": return lib.queueRemove(s, a.id);
    case "QUEUE_CLEAR": return lib.queueClear(s);
    case "PL_CREATE": return lib.createPlaylist(s, a.name, a.addId);
    case "PL_RENAME": return lib.renamePlaylist(s, a.id, a.name);
    case "PL_DELETE": return lib.deletePlaylist(s, a.id);
    case "PL_ADD": return lib.addToPlaylist(s, a.playlistId, a.id);
    case "PL_REMOVE": return lib.removeFromPlaylist(s, a.playlistId, a.id);
    case "RECENT_CLEAR": return lib.clearRecent(s);
    case "SERVICE": {
      const on = !s.services[a.id];
      const name = SERVICES.find((x) => x.id === a.id)?.name ?? "Service";
      return pb.withToast({ ...s, services: { ...s.services, [a.id]: on } }, on ? `${name} marked as preferred. Concept only: nothing was connected.` : `${name} preference cleared.`);
    }
    case "PLAYER": return { ...s, playerOpen: a.open && Boolean(s.current), playerView: a.open ? s.playerView : "art" };
    case "PLAYER_VIEW": return { ...s, playerView: a.view };
    case "SHEET": return { ...s, sheet: a.sheet };
    case "UNDO": return s.toast?.undo ? { ...s, ...s.toast.undo, toast: null } : s;
    case "DISMISS": return s.toast?.id === a.id ? { ...s, toast: null } : s;
    default: return s;
  }
}
