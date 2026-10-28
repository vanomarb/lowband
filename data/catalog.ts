import { SNAPSHOT } from "./tracks";
import type { Palette, Service, Track } from "./types";

export * from "./types";
export * from "./format";
export { SNAPSHOT } from "./tracks";

export const seedTracks: Record<string, Track> = Object.fromEntries(SNAPSHOT.map((t) => [t.id, t]));
export const COUNTRIES = new Set(SNAPSHOT.map((t) => t.origin)).size;

/** Curated rows on Home. Every id is in the snapshot. */
export type Shelf = { id: string; title: string; note: string; ids: string[] };
export const SHELVES: Shelf[] = [
  { id: "world", title: "Around the world", note: "One song from each corner of the snapshot",
    ids: ["1623677811", "1657231962", "1386337708", "1073359419", "1593185593", "1444872841", "1421088814", "1594982922", "1542294553", "1787022572"] },
  { id: "focus", title: "Quiet focus", note: "Piano, cello and slow electronics",
    ids: ["1453571333", "1440718584", "381515553", "1447486980", "1169246072", "1714304939", "1640380713"] },
  { id: "late", title: "Late-night jazz and soul", note: "From 1959 to now",
    ids: ["268443097", "1625058461", "1469581442", "730971581", "1658650499", "78928215", "1299241645"] },
  { id: "desert", title: "West African guitars", note: "Desert blues, Afrobeat and morna",
    ids: ["1485064658", "1716601799", "56371635", "1716598208", "739004068", "573377330", "1532252603"] },
  { id: "dance", title: "Kitchen dance floor", note: "Loud enough to cook to",
    ids: ["1422648513", "617154366", "1538003843", "1817217063", "1843520044", "1440838060", "1505498792", "1469575900"] },
];

/** Search categories. Each runs a live search for its term. */
export type Category = { label: string; term: string; palette: Palette; icon: "afro" | "kpop" | "latin" | "jazz" | "classical" | "electronic" | "bossa" | "reggae" };
export const CATEGORIES: Category[] = [
  { label: "Afrobeats", term: "afrobeats", palette: "amber", icon: "afro" },
  { label: "K-pop", term: "k-pop", palette: "magenta", icon: "kpop" },
  { label: "Latin", term: "reggaeton", palette: "coral", icon: "latin" },
  { label: "Jazz", term: "jazz standards", palette: "aqua", icon: "jazz" },
  { label: "Classical", term: "piano sonata", palette: "orchid", icon: "classical" },
  { label: "Electronic", term: "deep house", palette: "aqua", icon: "electronic" },
  { label: "Bossa nova", term: "bossa nova", palette: "amber", icon: "bossa" },
  { label: "Reggae", term: "roots reggae", palette: "coral", icon: "reggae" },
];

export const SERVICES: { id: Service; name: string; note: string }[] = [
  { id: "spotify", name: "Spotify", note: "Would hand full-length playback to your Spotify account." },
  { id: "youtube", name: "YouTube Music", note: "Would play the full track from YouTube Music." },
  { id: "apple", name: "Apple Music", note: "Would play the full track for subscribers." },
];

export const CONCEPT_LINE = "Concept: no account is connected; previews via the iTunes Search API";
