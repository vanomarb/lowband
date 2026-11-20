import { SNAPSHOT } from "./tracks";
import type { Palette, Service, Track } from "./types";

export * from "./types";
export * from "./format";
export { CAPTURED, SHELVES, SNAPSHOT } from "./tracks";

export const seedTracks: Record<string, Track> = Object.fromEntries(SNAPSHOT.map((t) => [t.id, t]));
export const COUNTRIES = new Set(SNAPSHOT.map((t) => t.origin)).size;

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
