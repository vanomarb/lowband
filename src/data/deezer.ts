import type { Track } from "./types";

/**
 * "Where it plays", against a second real catalogue: the public Deezer API (no key). Deezer sends no CORS
 * header, so requests go through its JSONP output. Spotify and YouTube Music can't be checked without an
 * account, so the sheet only hands off to their search for those.
 */

export type VersionKind = "same" | "other" | "live" | "remix" | "speed" | "cover";

/** One word each, so the tag never wraps. "Cover" includes instrumentals, karaoke and beats. */
export const KIND_LABEL: Record<VersionKind, string> = {
  same: "Same",
  other: "Other take",
  live: "Live",
  remix: "Remix",
  speed: "Sped up",
  cover: "Cover",
};

export type Candidate = { id: string; title: string; artist: string; album: string; seconds: number; link: string; kind: VersionKind };
export type Availability = { same?: Candidate; others: Candidate[] };

type DeezerTrack = { id: number; title: string; title_version?: string; duration: number; link: string; artist: { name: string }; album: { title: string } };

let seq = 0;

function jsonp<T>(url: string, signal: AbortSignal, timeoutMs = 8000): Promise<T> {
  return new Promise((resolve, reject) => {
    const name = `__lowbandDeezer${++seq}`;
    const holder = window as unknown as Record<string, unknown>;
    const el = document.createElement("script");
    const done = () => { delete holder[name]; el.remove(); window.clearTimeout(timer); signal.removeEventListener("abort", onAbort); };
    const onAbort = () => { done(); reject(new Error("aborted")); };
    const timer = window.setTimeout(() => { done(); reject(new Error("timed out")); }, timeoutMs);
    holder[name] = (data: T & { error?: { message?: string } }) => {
      done();
      if (data?.error) reject(new Error(data.error.message ?? "Deezer error"));
      else resolve(data);
    };
    el.onerror = () => { done(); reject(new Error("network error")); };
    signal.addEventListener("abort", onAbort);
    el.src = `${url}&output=jsonp&callback=${name}`;
    document.head.appendChild(el);
  });
}

/** Lowercase, no accents, no "(feat. …)" or bracketed version notes, letters and digits only. */
const core = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "")
    .replace(/[([][^)\]]*[)\]]/g, " ").replace(/\bfeat\..*$/, " ").replace(/[^a-z0-9]+/g, " ").trim();

const sameArtist = (candidate: string, track: string) => {
  const a = core(candidate), b = core(track);
  return a.length > 0 && (a === b || b.includes(a) || a.includes(b));
};

function kindOf(c: DeezerTrack, t: Track): VersionKind {
  const text = `${c.title} ${c.title_version ?? ""} ${c.album.title}`.toLowerCase();
  if (/sped up|speed up|nightcore|slowed/.test(text)) return "speed";
  if (/\blive\b|concert|unplugged|session/.test(text)) return "live";
  if (/remix|reimagined|rework|\bvip\b|\bmix\)/.test(text)) return "remix";
  if (!sameArtist(c.artist.name, t.artist) || /karaoke|instrumental|cover|tribute|\bbeat\b|lo-?fi/.test(text)) return "cover";
  return Math.abs(c.duration - t.seconds) <= 3 ? "same" : "other";
}

/**
 * Searches Deezer for the song and sorts what comes back: the same recording (artist, title and length within
 * three seconds) and every other version of it. A real build would match by ISRC first; this is the fallback
 * the research describes, so it says so in the UI.
 */
export async function findOnDeezer(t: Track, signal: AbortSignal): Promise<Availability> {
  const q = encodeURIComponent(`${t.artist.split(/,|&| feat\./i)[0]} ${t.title.replace(/[([].*$/, "")}`);
  const res = await jsonp<{ data?: DeezerTrack[] }>(`https://api.deezer.com/search?q=${q}&limit=25`, signal);
  const title = core(t.title);
  const seen = new Set<string>();
  const related = (res.data ?? [])
    .filter((c) => { const x = core(c.title); return x.length > 0 && (x.includes(title) || title.includes(x)); })
    .map((c): Candidate => ({ id: String(c.id), title: c.title, artist: c.artist.name, album: c.album.title, seconds: c.duration, link: c.link, kind: kindOf(c, t) }))
    .filter((c) => !seen.has(c.id) && Boolean(seen.add(c.id)));
  const same = related.find((c) => c.kind === "same");
  return { same, others: related.filter((c) => c !== same).slice(0, 8) };
}

/** Hand-off links. Apple's catalogue is the one the demo plays, so that link goes to the exact song. */
export const appleMusicUrl = (t: Track) => `https://music.apple.com/song/${t.id}`;
const query = (t: Track) => encodeURIComponent(`${t.artist} ${t.title}`);
export const spotifySearchUrl = (t: Track) => `https://open.spotify.com/search/${query(t)}`;
export const youtubeMusicSearchUrl = (t: Track) => `https://music.youtube.com/search?q=${query(t)}`;
