import { SHELVES, seedTracks } from "../data/catalog";
import type { State } from "./types";

const all = [...new Set(SHELVES.flatMap((s) => s.ids))];
const shelf = (id: string) => SHELVES.find((s) => s.id === id)?.ids ?? all;

/** Takes `count` ids round-robin from several lists, without repeats, so the library mixes the shelves. */
function mix(lists: string[][], count: number) {
  const out: string[] = [];
  for (let i = 0; out.length < count && lists.some((l) => i < l.length); i++) {
    for (const list of lists) {
      const id = list[i];
      if (id && !out.includes(id) && out.length < count) out.push(id);
    }
  }
  return out;
}

/**
 * The demo's starting library, built from this week's shelves (data/tracks.ts is regenerated from the charts),
 * so every id exists and the library always shows current music.
 */
export function initialState(): State {
  const top = shelf("top"), fresh = shelf("new"), world = shelf("world"), ph = shelf("ph"), kr = shelf("kr");
  return {
    tab: "home",
    stacks: { home: [], search: [], library: [], settings: [] },
    tracks: seedTracks,
    query: "",
    scope: "songs",
    current: top[0],
    playing: false,
    buffering: false,
    pos: 0,
    mediaDur: null,
    loadSeq: 0,
    seekSeq: 0,
    volume: 0.8,
    muted: false,
    sleep: { mode: "off" },
    autoplay: true,
    queue: top.slice(1, 4),
    history: [],
    recent: mix([top, world, fresh, ph, kr], 6),
    liked: mix([fresh, world.slice(1), ph.slice(2), kr.slice(2)], 6),
    playlists: [
      { id: "pl-repeat", name: "On repeat", tracks: top.slice(0, 6) },
      { id: "pl-world", name: "World tour", tracks: world.slice(0, 6) },
      { id: "pl-fresh", name: "Fresh finds", tracks: fresh.slice(0, 6) },
    ],
    playlistSeq: 0,
    shuffleSeq: 0,
    services: { spotify: false, youtube: false, apple: false },
    playerOpen: false,
    playerView: "art",
    sheet: null,
    toast: null,
    toastSeq: 0,
  };
}
