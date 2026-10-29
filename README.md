# Lowband

Lowband is a music library and preview player for listeners who want to explore songs and see where recordings are available. It has a desktop web player and a phone app layout.

[Open Lowband](https://vanomarb.github.io/lowband/) on any device, or [open the phone layout](https://vanomarb.github.io/lowband/app/) on any screen.

![The desktop web player: library rail, Listen Now with today's pick and recently played, the Up next panel and the player bar](docs/screenshots/web-player.png)

| Listen Now | Full player | Where it plays |
| :---: | :---: | :---: |
| <img src="docs/screenshots/phone-home.png" width="250" alt="Phone app home screen with today's pick and recently played"> | <img src="docs/screenshots/phone-player.png" width="250" alt="Full player for Last Last by Burna Boy, labelled as a 30-second iTunes preview"> | <img src="docs/screenshots/phone-where-it-plays.png" width="250" alt="Where it plays sheet: the same recording on Apple Music and Deezer, search hand-offs to Spotify and YouTube Music, and other versions tagged as sped up or cover"> |

Screenshots from the live site. Album artwork belongs to its owners.

## What you can do

- Search songs, albums and artists, then listen to labelled 30-second previews.
- Browse album tracklists, artist pages with top songs and albums, and chart-based music shelves.
- Open “Where it plays” to find Apple Music links, live Deezer matches and other versions, or search Spotify and YouTube Music.
- Like songs, view recently played, and create, rename, delete and edit playlists, with undo.
- Manage Up next, adjust volume, and set a sleep timer that fades out playback.
- On phones, drag the full player or sheets down to close them and use the system back gesture to return through screens.

Your library, playlists and settings live in memory and reset when you reload.

## Where the data comes from

- Search, album and artist lookups, song details, artwork and real audio previews come from the public [iTunes Search API](https://performance-partners.apple.com/search-api). Song search falls back to a saved catalogue snapshot if the API cannot be reached; this does not make audio available offline.
- The snapshot uses Apple Music’s most-played charts from 12 countries. Songs are looked up in iTunes for previews, artwork and length; only clean songs with previews are kept. It supplies the starting library, Home’s date and shelves for top songs, new releases, country picks, the Philippines and South Korea. Deployment attempts to refresh it before each build and every Monday, keeping the saved copy if Apple cannot be reached.
- “Where it plays” uses this catalogue for Apple Music and checks the public [Deezer API](https://developers.deezer.com/api) live. Deezer matches use artist, title and length within three seconds. Labels for covers, remixes, sped-up edits and live versions use keyword guesses, not recording identifiers (ISRCs). Spotify and YouTube Music links open searches; their availability cannot be checked without an account.
- Connected-service switches for Spotify, YouTube Music and Apple Music are simulated preferences. No account is connected. All playback uses iTunes previews as a stand-in; Lowband does not stream full songs from these services.

Both APIs are public and require no key. Song data, artwork and previews belong to their owners. See [REFERENCES.md](REFERENCES.md) for source terms and design attributions.

## Disclaimer

Lowband provides preview playback, not a connected streaming service. Spotify, YouTube Music, Apple Music and Deezer are trademarks of their respective owners. Lowband is not affiliated with any of them.

Running it locally or contributing? See [DEVELOPMENT.md](DEVELOPMENT.md).
