import { seedTracks } from "../data/catalog";
import type { State } from "./types";

/** The demo's starting library on 27 October 2026. Every id is in the captured snapshot. */
export function initialState(): State {
  return {
    tab: "home",
    stacks: { home: [], search: [], library: [], settings: [] },
    tracks: seedTracks,
    query: "",
    scope: "songs",
    current: "1623677811",
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
    queue: ["1657231962", "1386337708", "1593185593"],
    history: [],
    recent: ["1623677811", "1453571333", "268443097", "1469575900", "1505498792", "573377330"],
    liked: ["1440718584", "1625058461", "1485064658", "1422648513", "1714304939", "1532252603"],
    playlists: [
      { id: "pl-sunday", name: "Sunday morning", tracks: ["1625058461", "1469581442", "1299241645", "573377330", "1542294553", "1469575900"] },
      { id: "pl-focus", name: "Deep focus", tracks: ["1453571333", "1440718584", "381515553", "1169246072", "1447486980", "1714304939"] },
      { id: "pl-kitchen", name: "Kitchen dance party", tracks: ["1422648513", "617154366", "1538003843", "1817217063", "1593185593", "1444872841", "1623677811"] },
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
