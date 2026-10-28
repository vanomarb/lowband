"use client";

import { songs, SOURCE_NAME } from "../data/catalog";
import { loadAlbum } from "../data/itunes";
import { Art } from "../components/Art";
import { Empty, SkeletonRows } from "../components/Bits";
import { Icon } from "../components/Icon";
import { Page } from "../components/Page";
import { TrackList } from "../components/TrackRow";
import { useLookup } from "../hooks/useLookup";
import type { Route, ScreenProps } from "../state/types";

type Props = ScreenProps & { route: Extract<Route, { kind: "album" }>; back: string };

const same = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" }) === 0;

/** An album: cover, artist link, Play and Shuffle, then the tracklist in disc order, live from iTunes. */
export function AlbumScreen({ s, d, route, back }: Props) {
  const r = useLookup(`album:${route.id ?? ""}:${route.artist}:${route.title}`, async (signal) => {
    const res = await loadAlbum(route.title, route.artist, route.id, signal);
    d({ type: "ADD_TRACKS", tracks: res.tracks });
    return res;
  });
  // Offline: whatever the app already knows from this album.
  const known = Object.values(s.tracks).filter((t) => same(t.album, route.title) && same(t.artist, route.artist));
  const tracks = r?.status === "done" ? r.data.tracks : r?.status === "error" ? known : [];
  const ids = tracks.map((t) => t.id);
  const album = r?.status === "done" ? r.data.album : undefined;
  const cover = album ?? tracks[0] ?? known[0];
  const meta = [album?.genre ?? known[0]?.genre, album?.year || known[0]?.year || null, tracks.length ? songs(tracks.length) : null].filter(Boolean).join(" · ");

  return (
    <Page title={route.title} large={false} back={back} onBack={() => d({ type: "POP" })}>
      <div className="lb-coll-head">
        {cover ? <Art track={cover} px={600} className="lb-coll-art" alt={`Album artwork: ${route.title}`} priority />
          : <span className="lb-coll-art lb-coll-icon" aria-hidden="true"><Icon name="album" size={72} weight="duotone" /></span>}
        <h2>{route.title}</h2>
        <button type="button" className="lb-link-btn" onClick={() => d({ type: "PUSH", route: { kind: "artist", name: route.artist, id: album?.artistId ?? tracks[0]?.artistId } })}>{route.artist}</button>
        {meta && <p>{meta}</p>}
        {tracks.length > 0 && (
          <div className="lb-coll-btns">
            <button type="button" className="lb-btn" onClick={() => d({ type: "PLAY_LIST", ids })}><Icon name="play" size={20} weight="fill" />Play</button>
            <button type="button" className="lb-btn is-soft" onClick={() => d({ type: "PLAY_LIST", ids, shuffle: true })}><Icon name="shuffle" size={20} weight="bold" />Shuffle</button>
          </div>
        )}
      </div>
      {r?.status === "error" && (
        <p className="lb-banner" role="alert"><Icon name="warn" size={18} weight="fill" />Couldn’t load the tracklist from the {SOURCE_NAME} ({r.reason}). {known.length ? "Showing the songs already saved." : ""}</p>
      )}
      {r?.status === "loading" ? <SkeletonRows rows={8} /> : tracks.length ? <TrackList s={s} d={d} ids={ids} numbered albumArtist={route.artist} /> : (
        <Empty icon="album" title="No tracks to show" text="This album has no previews in the iTunes Search API, or the connection dropped. Try again from Search." />
      )}
      {tracks.length > 0 && <p className="lb-footnote">Tracklist and previews from the {SOURCE_NAME}. Each song plays a 30-second preview.</p>}
    </Page>
  );
}
