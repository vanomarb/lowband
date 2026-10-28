import type { Palette, Track } from "./types";

/** Said the same way everywhere: what plays, and where it comes from. */
export const PREVIEW_LABEL = "30-sec preview";
export const SOURCE_NAME = "iTunes Search API";
export const PREVIEW_SECONDS = 30;
export const FIXTURE_DATE = "2026-10-27";

/** Square artwork at any size the CDN serves, e.g. 600 gives ".../600x600bb.jpg". */
export const artUrl = (t: Pick<Track, "artwork">, px: number) => `${t.artwork}/${px}x${px}bb.jpg`;

const PALETTES: Palette[] = ["magenta", "coral", "orchid", "amber", "aqua"];
/** A stable accent per track, so the player tint never depends on the clock or on chance. */
export function paletteOf(id: string): Palette {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return PALETTES[h % PALETTES.length];
}

/** m:ss */
export function clock(total: number): string {
  const t = Math.max(0, Math.floor(total));
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

/** "Tuesday 27 October", from an ISO date, without reading the clock. */
export function longDate(iso: string): string {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const d = new Date(Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10)));
  return `${days[d.getUTCDay()]} ${d.getUTCDate()} ${months[d.getUTCMonth()]}`;
}

export const songs = (n: number) => `${n} ${n === 1 ? "song" : "songs"}`;

/** A deterministic shuffle: the same seed always gives the same order. */
export function shuffled<T>(list: T[], seed: number): T[] {
  const out = [...list];
  let x = (seed * 2654435761) >>> 0 || 1;
  for (let i = out.length - 1; i > 0; i--) {
    x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0;
    const j = x % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
