/**
 * Refreshes the catalogue in data/tracks.ts from Apple Music's current most-played charts.
 *
 *   node scripts/refresh-catalog.mjs
 *
 * For each country it reads the top 50 songs (rss.marketingtools.apple.com, which a browser can't read
 * because it sends no CORS header), looks them up in the iTunes Search API for the 30-second preview,
 * artwork, length and release date, and keeps clean songs that have a preview. It then writes the songs, the
 * Home shelves and the capture date to data/tracks.ts. The deploy workflow runs it before every build and
 * once a week, so the demo always shows this week's music. If too few songs come back, it changes nothing.
 */
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const COUNTRIES = ["us", "gb", "ph", "kr", "jp", "ng", "br", "mx", "fr", "in", "za", "de"];
const SHELF_SIZE = 10;
const NEW_WITHIN_DAYS = 45;
const OUT = fileURLToPath(new URL("../data/tracks.ts", import.meta.url));
const regionName = new Intl.DisplayNames(["en"], { type: "region" });
// "in the United States", "in Japan".
const inCountry = (cc) => `${["us", "gb", "ph"].includes(cc) ? "the " : ""}${regionName.of(cc.toUpperCase())}`;

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// Apple's feed and lookup endpoints answer with an occasional 504 or hang; give each request 15 seconds and
// retry failures with a growing pause.
async function getJson(url, tries = 4) {
  for (let i = 1; ; i++) {
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15_000) });
      if (res.ok) return await res.json();
      if (i >= tries) throw new Error(`${res.status} for ${url}`);
    } catch (error) {
      if (i >= tries) throw error;
    }
    await sleep(1500 * i);
  }
}

function toTrack(r, origin) {
  return {
    id: String(r.trackId),
    title: r.trackName,
    artist: r.artistName,
    album: r.collectionName,
    genre: r.primaryGenreName,
    origin,
    year: new Date(r.releaseDate).getUTCFullYear(),
    seconds: Math.round((r.trackTimeMillis ?? 0) / 1000),
    artwork: r.artworkUrl100.replace(/\/\d+x\d+bb\.\w+$/, ""),
    preview: r.previewUrl,
    artistId: r.artistId ? String(r.artistId) : undefined,
    albumId: r.collectionId ? String(r.collectionId) : undefined,
    trackNo: r.trackNumber,
  };
}

// The clean songs with a preview from one country's chart, in chart order.
async function chart(cc) {
  const feed = await getJson(`https://rss.marketingtools.apple.com/api/v2/${cc}/music/most-played/50/songs.json`);
  const ids = feed.feed.results.map((r) => r.id);
  const lookup = await getJson(`https://itunes.apple.com/lookup?id=${ids.join(",")}&country=${cc}`);
  const byId = new Map(lookup.results.map((r) => [String(r.trackId), r]));
  return ids
    .map((id) => byId.get(id))
    .filter((r) => r && r.kind === "song" && r.previewUrl && r.trackExplicitness !== "explicit")
    .map((r) => ({ track: toTrack(r, regionName.of(cc.toUpperCase())), released: r.releaseDate }));
}

const charts = new Map();
for (const cc of COUNTRIES) {
  try {
    charts.set(cc, await chart(cc));
  } catch (error) {
    console.warn(`Skipping ${cc}: ${error.message}`);
  }
}

const tracks = new Map();
const released = new Map();
for (const entries of charts.values()) {
  for (const { track, released: date } of entries) {
    if (!tracks.has(track.id)) tracks.set(track.id, track);
    if (!released.has(track.id)) released.set(track.id, date);
  }
}

const today = new Date();
const captured = today.toISOString().slice(0, 10);
const top = (cc) => (charts.get(cc) ?? []).slice(0, SHELF_SIZE).map((e) => e.track.id);
const home = charts.has("us") ? "us" : "gb";

const firstPerCountry = [];
for (const entries of charts.values()) {
  const pick = entries.find((e) => !firstPerCountry.includes(e.track.id));
  if (pick) firstPerCountry.push(pick.track.id);
}

const cutoff = today.getTime() - NEW_WITHIN_DAYS * 86_400_000;
// One song per album, so a big album drop doesn't fill the whole shelf.
const albums = new Set();
const newest = [...released]
  .filter(([, date]) => new Date(date).getTime() >= cutoff)
  .sort((a, b) => b[1].localeCompare(a[1]))
  .filter(([id]) => {
    const album = tracks.get(id).albumId ?? id;
    if (albums.has(album)) return false;
    albums.add(album);
    return true;
  })
  .slice(0, SHELF_SIZE)
  .map(([id]) => id);

const shelves = [
  { id: "top", title: "Top songs right now", note: `The most played on Apple Music in ${inCountry(home)} this week`, ids: top(home) },
  { id: "new", title: "New this month", note: "The newest releases on this week's charts", ids: newest },
  { id: "world", title: "Around the world", note: `The most-played song in ${firstPerCountry.length} countries`, ids: firstPerCountry },
  { id: "ph", title: "Top in the Philippines", note: "This week's most played in the Philippines", ids: top("ph") },
  { id: "kr", title: "Top in South Korea", note: "This week's most played in South Korea", ids: top("kr") },
].filter((s) => s.ids.length >= 4);

if (shelves.length < 3 || shelves[0].id !== "top" || firstPerCountry.length < 5) {
  console.error(`Only ${shelves.length} shelves and ${firstPerCountry.length} countries came back; keeping the current catalogue.`);
  process.exit(1);
}

// Only songs that appear on a shelf go into the snapshot, in shelf order.
const used = [...new Set(shelves.flatMap((s) => s.ids))].map((id) => tracks.get(id));

const line = (value) => JSON.stringify(value, (_, v) => (v === undefined ? undefined : v));
const source = `// Generated by scripts/refresh-catalog.mjs from Apple Music's most-played charts. Do not edit by hand:
// run \`node scripts/refresh-catalog.mjs\` (the deploy workflow does, before every build and once a week).
import type { Shelf, Track } from "./types";

/** The date the charts were read, used as the demo's "today". */
export const CAPTURED = "${captured}";

/**
 * This week's songs: clean tracks with a 30-second preview from the most-played charts of
 * ${charts.size} countries, looked up in the iTunes Search API. \`origin\` is the chart's country.
 */
export const SNAPSHOT: Track[] = [
${used.map((t) => `  ${line(t)},`).join("\n")}
];

/** Home's shelves. The first is "Today's pick". Every id is in SNAPSHOT. */
export const SHELVES: Shelf[] = [
${shelves.map((s) => `  ${line(s)},`).join("\n")}
];
`;

writeFileSync(OUT, source);
console.log(`Wrote ${used.length} songs and ${shelves.length} shelves from ${charts.size} charts (${captured}).`);
