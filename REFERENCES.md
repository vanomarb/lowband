# Lowband: references

Patterns and ideas only. No code, image or brand asset is copied, and no service logo appears anywhere in the app. Lowband started as a community-radio concept; the radio-era research is in git history (before 2026-10-28) and no longer applies.

## Why people would use it

The use cases and key decisions in `meta.ts` come from [docs/lowband-use-cases.md](docs/lowband-use-cases.md): catalogue gaps between services, greyed-out tracks, multi-service households, playlist-transfer tools (Soundiiz, TuneMyMusic, SongShift, FreeYourMusic), and the Spotify, YouTube and Apple developer terms.

## Data source

| Source | Terms | How Lowband uses it |
|---|---|---|
| [Deezer API](https://developers.deezer.com/api) | Deezer's API terms: public search, no key; JSONP output | "Where it plays": checks whether the same recording is on Deezer and lists its other versions, each linking to Deezer |
| [iTunes Search API](https://performance-partners.apple.com/search-api) | Apple's Search API terms: public, no key; previews and artwork are served from Apple's CDN | Search (songs, albums, artists), lookups (an artist's songs and albums, an album's tracklist), artwork and 30-second previews. Every playing song is labelled "30-sec preview · iTunes Search API" |

## Patterns

| Product | Licence | Pattern | Where Lowband uses it |
|---|---|---|---|
| Apple Music (iOS) | Proprietary | Large titles that collapse into the nav bar; album page with centred cover, artist link, Play and Shuffle, then a number-and-title tracklist | `components/Page.tsx`, `screens/Album.tsx`, `TrackList` with `albumArtist` |
| Apple Music (iOS) | Proprietary | Mini-player docked above the tab bar, opening a full player with a grabber; going to an artist from the full player closes it | `MiniPlayer.tsx`, `FullPlayer.tsx`, the `PUSH` reducer case |
| Spotify (iOS and web) | Proprietary | Genre tiles on the Search start screen; Songs / Albums / Artists filter on results; artist page with five top songs and "See all", then an albums shelf | `screens/Search.tsx`, `screens/Artist.tsx` |
| Spotify web player | Proprietary | Left library rail, persistent player bar, queue panel on the right | `web/` |
| [team-spotube/spotube](https://github.com/team-spotube/spotube) | AGPL-3.0 (patterns only) | A client that plays from other services' catalogues rather than hosting music: the "wrapper" idea behind Connected services | `screens/Settings.tsx` (concept toggles) |
| iOS Human Interface Guidelines | Apple docs | Type scale, 44pt targets, segmented controls, inset-grouped lists, action sheets | `native.css` |

## Deliberately not copied

- Service logos, brand colours and names used as buttons: Spotify, YouTube Music and Apple Music appear as plain text in a labelled concept screen only.
- Artist photos: the iTunes Search API has none, so artist pages borrow an album cover and say so.
- Full-length playback: Lowband never implies it plays more than the 30-second preview.
