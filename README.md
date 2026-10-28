# Lowband · Music player

> **Concept project** by [Van Omar Benaires](https://github.com/vanomarb): real catalogue data, not a real service.

One library for music that lives on different services.

Lowband is a concept for a music library that sits above Spotify, YouTube Music and Apple Music: search once, see which service has which version of a song, keep playlists that survive when tracks go grey, and hand playback to the service that has it. Why it's shaped this way (catalogue gaps, greyed-out tracks, and platform terms that forbid one player streaming every service) is in [docs/lowband-use-cases.md](docs/lowband-use-cases.md).

This demo is a phone app and a desktop web player. It searches and plays 30-second previews from the public [iTunes Search API](https://performance-partners.apple.com/search-api) as a stand-in for the connected services. Connecting Spotify, YouTube Music or Apple Music is shown as a labelled concept, and no account is ever connected.

## What it ships with

- **Web player** at `/`: `Landing.tsx` renders `web/WebPlayer.tsx`, a desktop app with a library rail, a persistent player bar and an Up next panel. At phone width it links to the phone app.
- **Phone app** at `/app`: `Demo.tsx`, built to feel like a native mobile app, with a fixed nav bar and large titles, a translucent tab bar, sheets, an iOS-like type scale and safe areas.

Both use the same data, reducer, screens and audio engine (`hooks/useLowband.ts`).

## What you can try

- Real audio: every song plays its 30-second preview, labelled as a preview wherever the source is shown
- Search with a Songs / Albums / Artists switch, live against the iTunes Search API, with loading, empty and error states (songs fall back to the saved snapshot offline)
- Where it plays, from any song's ⋯ menu: Apple Music (this catalogue), Deezer checked live through its public API with the same recording separated from covers, remixes, sped-up edits and live takes, and search hand-offs to Spotify and YouTube Music, which can't be checked without an account
- Album pages with the tracklist in disc order, and artist pages with top songs and albums; reach them from search, the track menu ("Go to album", "Go to artist") or the artist name in the full player
- Liked songs, recently played, and playlists you can create, rename, delete and edit, with undo
- Mini-player that opens a full player with Up next, volume and a sleep timer that fades out
- Settings with Connected services as concept toggles: nothing is signed in

State lives in memory and resets when you reload.

## Data: what is real

- **Catalogue**: `data/itunes.ts` calls `search` (songs, albums, artists) and `lookup` (an artist's songs and albums, an album's tracklist). No key, CORS-enabled. Snapshot tracks have no iTunes ids, so their artist and album pages search by name and keep exact matches.
- **Snapshot**: `data/tracks.ts` holds 44 real tracks by artists from 26 countries, captured from the API, so Home and the seed playlists render the same way every time.
- **Engine**: `hooks/useAudioEngine.ts` owns one `HTMLAudioElement` and treats it as the source of truth: `timeupdate` drives position, `loadedmetadata` the duration, `waiting`/`playing` buffering, `ended` advances Up next, `error` stops with a toast. A blocked autoplay shows a toast. Media Session metadata and actions are set. The element is exposed as `window.__lowbandAudio` for inspection.
- **Where it plays**: `data/deezer.ts` searches the public Deezer API (no key; JSONP, because Deezer sends no CORS header) and sorts results by artist, title and length within three seconds. Version kinds are a keyword heuristic, labelled as such; a real build would match the ISRC first.

## What is not real

- **Connected services**: Spotify, YouTube Music and Apple Music appear as text-only concept toggles. Nothing signs in.
- **Full-length playback**: the iTunes Search API only serves 30-second previews, and Lowband never implies otherwise.

## Getting started

Requires Node.js 20.9 or later.

```bash
npm install
npm run dev      # http://localhost:3111
```

Open [http://localhost:3111](http://localhost:3111) for the web player and [http://localhost:3111/app](http://localhost:3111/app) for the phone app.

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build on port 3111
npm run lint       # ESLint
npm run typecheck  # TypeScript, no emit
```

`npm run dev` goes through `scripts/next-dev.mjs`, which forces `NODE_ENV=development` so the dev server still runs PostCSS when the shell exports `NODE_ENV=production`. For the same reason, `.npmrc` sets `include=dev` so devDependencies always install.

No API keys or environment variables are needed: the iTunes Search API and the Deezer API are both public.

## Structure

```text
lowband/
  app/           Next.js routes: / (web player) and /app (phone app)
  Demo.tsx       the phone app
  Landing.tsx    the web player entry (renders web/)
  meta.ts        product copy: summary, use cases, key decisions; also feeds the page title
  types.ts       shared prop and metadata types
  data/          types, the iTunes and Deezer clients, the 44-track snapshot, shelves and categories
  state/         reducer split into playback.ts and library.ts; seed.ts is the first state
  hooks/         useLowband (shared core), useAudioEngine, useSearch, useLookup, useSwipe
  screens/       Home, Search, Library, Settings, Collection, Album, Artist, Router
  components/    Page (nav bar + scroll region), Art, TrackRow, Music (album/artist rows), players, sheets
  web/           WebPlayer, Rail, PlayerBar
  docs/          research behind the use cases
  scripts/       next-dev.mjs
  theme.css native.css player.css screens.css web.css
```

## References

Patterns, data sources and what was deliberately not copied are listed in [REFERENCES.md](REFERENCES.md). No service logo or brand asset appears in the app.

## Disclaimer

Lowband is a concept, not a real service. Song data, artwork and previews come from the public iTunes Search API and belong to their owners. Spotify, YouTube Music, Apple Music and Deezer are trademarks of their respective owners, and this project is not affiliated with any of them.
