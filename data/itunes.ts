import { SNAPSHOT } from "./tracks";
import type { Album, Artist, Track } from "./types";

const API = "https://itunes.apple.com";

/** The fields Lowband reads from an iTunes Search API result. */
type ApiResult = {
  kind?: string; wrapperType?: string; trackId?: number; trackName?: string; artistName?: string; collectionName?: string; primaryGenreName?: string;
  releaseDate?: string; trackTimeMillis?: number; artworkUrl100?: string; previewUrl?: string; trackExplicitness?: string;
  artistId?: number; collectionId?: number; trackNumber?: number; trackCount?: number; collectionExplicitness?: string;
};

const stripSize = (url: string) => url.replace(/\/\d+x\d+bb\.(jpg|png)$/, "");

export function fromApi(r: ApiResult): Track | null {
  if (r.kind !== "song" || !r.trackId || !r.previewUrl || !r.artworkUrl100 || !r.trackName || !r.artistName) return null;
  return {
    id: String(r.trackId), title: r.trackName, artist: r.artistName, album: r.collectionName ?? "Single", genre: r.primaryGenreName ?? "Music",
    year: Number(r.releaseDate?.slice(0, 4)) || 0, seconds: Math.round((r.trackTimeMillis ?? 30000) / 1000),
    artwork: stripSize(r.artworkUrl100), preview: r.previewUrl, explicit: r.trackExplicitness === "explicit",
    artistId: r.artistId ? String(r.artistId) : undefined, albumId: r.collectionId ? String(r.collectionId) : undefined, trackNo: r.trackNumber,
  };
}

function albumFromApi(r: ApiResult): Album | null {
  if (r.wrapperType !== "collection" || !r.collectionId || !r.collectionName || !r.artistName || !r.artworkUrl100) return null;
  return {
    id: String(r.collectionId), title: r.collectionName, artist: r.artistName, artistId: r.artistId ? String(r.artistId) : undefined,
    year: Number(r.releaseDate?.slice(0, 4)) || 0, artwork: stripSize(r.artworkUrl100), count: r.trackCount ?? 0,
    genre: r.primaryGenreName ?? "Music", explicit: r.collectionExplicitness === "explicit",
  };
}

async function get(path: string, signal: AbortSignal): Promise<ApiResult[]> {
  const res = await fetch(`${API}/${path}`, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return ((await res.json()) as { results?: ApiResult[] }).results ?? [];
}

function unique<T extends { id: string }>(items: (T | null)[]): T[] {
  const seen = new Set<string>();
  return items.filter((x): x is T => Boolean(x) && !seen.has(x!.id) && Boolean(seen.add(x!.id)));
}

const same = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" }) === 0;

export async function searchAlbums(term: string, signal: AbortSignal): Promise<Album[]> {
  return unique((await get(`search?term=${encodeURIComponent(term)}&media=music&entity=album&limit=25`, signal)).map(albumFromApi));
}

export async function searchArtists(term: string, signal: AbortSignal): Promise<Artist[]> {
  const rows = await get(`search?term=${encodeURIComponent(term)}&media=music&entity=musicArtist&limit=15`, signal);
  return unique(rows.map((r) => (r.artistId && r.artistName ? { id: String(r.artistId), name: r.artistName, genre: r.primaryGenreName ?? "Music" } : null)));
}

/** An artist's songs and albums. Snapshot tracks have no artistId, so they search by name and keep exact matches. */
export async function loadArtist(name: string, id: string | undefined, signal: AbortSignal): Promise<{ tracks: Track[]; albums: Album[] }> {
  if (id) {
    const [songs, albums] = await Promise.all([get(`lookup?id=${id}&entity=song&limit=25`, signal), get(`lookup?id=${id}&entity=album&limit=20`, signal)]);
    return { tracks: unique(songs.map(fromApi)), albums: unique(albums.map(albumFromApi)) };
  }
  const q = encodeURIComponent(name);
  const [songs, albums] = await Promise.all([
    get(`search?term=${q}&media=music&entity=song&attribute=artistTerm&limit=50`, signal),
    get(`search?term=${q}&media=music&entity=album&attribute=artistTerm&limit=25`, signal),
  ]);
  return {
    tracks: unique(songs.map(fromApi)).filter((t) => same(t.artist, name)).slice(0, 25),
    albums: unique(albums.map(albumFromApi)).filter((a) => same(a.artist, name)),
  };
}

/** An album's tracklist in disc order. Without a collectionId it searches artist and title and keeps exact matches. */
export async function loadAlbum(title: string, artist: string, id: string | undefined, signal: AbortSignal): Promise<{ album?: Album; tracks: Track[] }> {
  const rows = id
    ? await get(`lookup?id=${id}&entity=song`, signal)
    : await get(`search?term=${encodeURIComponent(`${artist} ${title}`)}&media=music&entity=song&limit=50`, signal);
  const album = rows.map(albumFromApi).find(Boolean) ?? undefined;
  const tracks = unique(rows.map(fromApi)).filter((t) => id || (same(t.album, title) && same(t.artist, artist)));
  return { album, tracks: tracks.sort((a, b) => (a.trackNo ?? 0) - (b.trackNo ?? 0)) };
}

/** Live search: no key, CORS-enabled. Throws on a network or HTTP error so the caller can fall back. */
export async function searchItunes(term: string, signal: AbortSignal): Promise<Track[]> {
  const url = `${API}/search?term=${encodeURIComponent(term)}&media=music&entity=song&limit=25`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const body = (await res.json()) as { results?: ApiResult[] };
  const seen = new Set<string>();
  return (body.results ?? []).map(fromApi).filter((t): t is Track => {
    if (!t || seen.has(t.id)) return false;
    seen.add(t.id);
    return true;
  });
}

/** Offline fallback: matches inside the captured snapshot. */
export function searchSnapshot(term: string): Track[] {
  const words = term.toLowerCase().split(/\s+/).filter(Boolean);
  return SNAPSHOT.filter((t) => {
    const hay = `${t.title} ${t.artist} ${t.album} ${t.genre} ${t.origin ?? ""}`.toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
