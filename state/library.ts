import { songs } from "../data/catalog";
import { titleOf, withToast } from "./playback";
import type { Playlist, State } from "./types";

const quote = (s: string) => `“${s}”`;
const cleanName = (name: string) => name.trim().replace(/\s+/g, " ").slice(0, 40);
export const playlistOf = (s: State, id: string): Playlist | undefined => s.playlists.find((p) => p.id === id);

export function toggleLike(s: State, id: string): State {
  const has = s.liked.includes(id);
  const liked = has ? s.liked.filter((x) => x !== id) : [id, ...s.liked];
  return withToast({ ...s, liked }, has ? `Removed from Liked songs: ${titleOf(s, id)}` : `Added to Liked songs: ${titleOf(s, id)}`, { liked: s.liked });
}

export function queueAdd(s: State, id: string, next = false): State {
  if (s.current === id) return withToast(s, "That song is playing now.");
  const rest = s.queue.filter((q) => q !== id);
  const queue = next ? [id, ...rest] : [...rest, id];
  return withToast({ ...s, queue, sheet: null }, next ? `Playing next: ${titleOf(s, id)}` : `Added to queue: ${titleOf(s, id)}`, { queue: s.queue });
}

export function queueRemove(s: State, id: string): State {
  return withToast({ ...s, queue: s.queue.filter((q) => q !== id) }, `Removed from Up next: ${titleOf(s, id)}`, { queue: s.queue });
}

export function queueClear(s: State): State {
  return s.queue.length ? withToast({ ...s, queue: [] }, "Up next cleared.", { queue: s.queue }) : s;
}

export function createPlaylist(s: State, name: string, addId?: string): State {
  const clean = cleanName(name);
  if (!clean) return withToast(s, "Give the playlist a name first.", undefined, "error");
  const id = `pl-new-${s.playlistSeq + 1}`;
  const pl: Playlist = { id, name: clean, tracks: addId ? [addId] : [] };
  const msg = addId ? `Created ${quote(clean)} with ${titleOf(s, addId)}` : `Created ${quote(clean)}`;
  return withToast({ ...s, playlists: [pl, ...s.playlists], playlistSeq: s.playlistSeq + 1, sheet: null }, msg, { playlists: s.playlists });
}

export function renamePlaylist(s: State, id: string, name: string): State {
  const clean = cleanName(name);
  const pl = playlistOf(s, id);
  if (!pl || !clean) return withToast(s, "A playlist needs a name.", undefined, "error");
  if (clean === pl.name) return { ...s, sheet: null };
  const playlists = s.playlists.map((p) => (p.id === id ? { ...p, name: clean } : p));
  return withToast({ ...s, playlists, sheet: null }, `Renamed to ${quote(clean)}`, { playlists: s.playlists });
}

export function deletePlaylist(s: State, id: string): State {
  const pl = playlistOf(s, id);
  if (!pl) return s;
  // Leave the deleted playlist's screen if it is open in any tab.
  const stacks = Object.fromEntries(
    Object.entries(s.stacks).map(([tab, stack]) => [tab, stack.filter((r) => !(r.kind === "playlist" && r.id === id))]),
  ) as State["stacks"];
  return withToast({ ...s, playlists: s.playlists.filter((p) => p.id !== id), stacks, sheet: null }, `Deleted ${quote(pl.name)}`, { playlists: s.playlists });
}

export function addToPlaylist(s: State, playlistId: string, id: string): State {
  const pl = playlistOf(s, playlistId);
  if (!pl) return s;
  if (pl.tracks.includes(id)) return withToast({ ...s, sheet: null }, `${titleOf(s, id)} is already in ${quote(pl.name)}.`);
  const playlists = s.playlists.map((p) => (p.id === playlistId ? { ...p, tracks: [...p.tracks, id] } : p));
  return withToast({ ...s, playlists, sheet: null }, `Added to ${quote(pl.name)} (${songs(pl.tracks.length + 1)})`, { playlists: s.playlists });
}

export function removeFromPlaylist(s: State, playlistId: string, id: string): State {
  const pl = playlistOf(s, playlistId);
  if (!pl) return s;
  const playlists = s.playlists.map((p) => (p.id === playlistId ? { ...p, tracks: p.tracks.filter((t) => t !== id) } : p));
  return withToast({ ...s, playlists, sheet: null }, `Removed ${titleOf(s, id)} from ${quote(pl.name)}`, { playlists: s.playlists });
}

export function clearRecent(s: State): State {
  return s.recent.length ? withToast({ ...s, recent: [] }, "Recently played cleared.", { recent: s.recent }) : s;
}
