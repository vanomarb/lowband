import type { ShowcaseMeta } from "./types";
import { COUNTRIES, SNAPSHOT, seedTracks } from "./data/catalog";
import { initialState } from "./state/seed";

const seed = initialState();
const row = (id: string) => seedTracks[id];

export const lowband: ShowcaseMeta = {
  slug: "lowband",
  name: "Lowband",
  industry: "Music player",
  tagline: "One library for music that lives on different services.",
  summary:
    "A concept for a music library that sits above Spotify, YouTube Music and Apple Music: search once, see which service has which version of a song, keep playlists that survive when tracks go grey, and hand playback to the service that has it. This demo has a phone app and a desktop web player; it searches and plays 30-second previews from the public iTunes Search API as a stand-in, and connecting services is a labelled concept.",
  status: "Concept",
  year: 2026,
  problem:
    "The song you want is often on a different service from the one you pay for: covers, live sessions, remixes and fan uploads live on YouTube Music, official releases on Spotify, and tracks go grey when licences or region locks change. Every app treats its own catalogue as the whole world, and the platforms' terms forbid one player that streams them all.",
  useCases: [
    {
      who: "Someone whose song is on YouTube Music but not on Spotify",
      need: "Covers, live sessions, remixes, sped-up edits and regional releases are on YouTube Music but missing from Spotify, and sometimes it's the other way round. Today that means searching two apps.",
      how: "One search across every connected service, grouped by song, with each version labelled by kind and source: official, live, cover, remix or upload. Nothing gets silently swapped for a different version.",
      tryIt: "Open any song's ⋯ menu and choose Where it plays: Deezer is checked live, and its other versions are tagged as covers, remixes, sped-up edits or live takes.",
    },
    {
      who: "Someone whose old playlists keep going grey",
      need: "Songs disappear from saved playlists when licences expire, a region lock applies or an artist leaves. Neil Young and Joni Mitchell pulled their music from Spotify in 2022, and Young was gone for two years.",
      how: "A Lowband playlist keeps each song as a recording, with its matches on every service. When one goes grey, it finds the same recording elsewhere and asks before using a different version.",
    },
    {
      who: "Someone who pays for one service and gets another in a bundle",
      need: "YouTube Premium includes YouTube Music, so plenty of people have it while still preferring Spotify. Edison Research put the share of Americans paying for more than one audio subscription at 16% in early 2025.",
      how: "Pick a default service. Lowband plays from it and only goes elsewhere when the default doesn't have the recording. Liked songs and playlists belong to Lowband, not to any one service, so switching later loses nothing.",
      tryIt: "Playlists you make in Library are Lowband's own; Settings → Connected services shows the default-service idea as a concept.",
    },
    {
      who: "Someone sharing music with a person on another service",
      need: "A Spotify user making a birthday playlist for a partner on Apple Music has no simple way to send it.",
      how: "Share a Lowband link that opens on the recipient's own service, and list the songs that didn't match instead of dropping them quietly.",
    },
  ],
  decisions: [
    {
      title: "A library and a router, not one audio engine",
      body: "Spotify's Developer Policy says \u201cdo not create any product or service which is integrated with streams or content from another service\u201d; YouTube forbids extracting audio or playing from a hidden background player; Apple Music only plays through MusicKit. So each service plays in its own official player, and Lowband owns search, the library and the routing.",
    },
    {
      title: "Match recordings by ISRC first, then carefully",
      body: "The ISRC code identifies an exact recording, so it comes first, then title, artist, duration and version markers. A live take, remix, remaster or sped-up edit is never treated as the same song; uncertain matches ask the listener.",
    },
    {
      title: "Playlists don't belong to any service",
      body: "Each entry stores the recording, its candidates on every service and its old ids. Integrations end: when TIDAL left Plex in October 2024, library entries stayed but stopped playing. A Lowband playlist outlives any one service.",
    },
    {
      title: "Show where it plays, and say what's real",
      body: "Availability comes before the play button: which service has this exact version. In the demo, every song is labelled as a 30-second iTunes preview and connected services are a text-only concept, so nothing claims an account link that isn't there.",
    },
  ],
  features: [
    "Real audio: every song plays its 30-second preview from the iTunes Search API, labelled as a preview everywhere",
    "Where it plays: the same recording checked live on Deezer, every other version tagged (cover, remix, sped up, live), and hand-off links to Spotify and YouTube Music",
    "Search songs, albums or artists live, with loading, empty and error states; songs fall back to the saved snapshot offline",
    "Album pages with the real tracklist, and artist pages with top songs and albums, from search, the track menu or the full player",
    "Liked songs, recently played and playlists you can create, rename, delete and edit, with undo",
    "Mini-player that opens a Now Playing sheet with Up next, volume and a sleep timer that fades out",
    "A desktop web player with a sidebar library, persistent player bar and Up next panel",
    "Settings with Connected services as concept toggles: nothing is signed in",
  ],
  stack: ["React", "TypeScript", "Next.js", "HTML audio + Media Session API", "iTunes Search API", "Spotify Web API (planned)", "YouTube Data API (planned)"],
  preview: {
    stats: [
      { label: "Songs", value: String(SNAPSHOT.length) },
      { label: "Countries", value: String(COUNTRIES) },
      { label: "Playlists", value: String(seed.playlists.length) },
    ],
    rows: [
      { primary: row(seed.current!).title, secondary: `${row(seed.current!).artist} · 30-sec preview`, badge: { label: "Playing", tone: "positive" } },
      { primary: row(seed.liked[0]).title, secondary: `${row(seed.liked[0]).artist} · Liked` },
      { primary: "Connected services", secondary: "Spotify, YouTube Music, Apple Music", badge: { label: "Concept", tone: "accent" } },
    ],
  },
};
