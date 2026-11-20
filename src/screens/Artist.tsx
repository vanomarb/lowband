"use client";

import { useState } from "react";
import { SOURCE_NAME } from "../data/catalog";
import { loadArtist } from "../data/itunes";
import { Art } from "../components/Art";
import { Empty, SkeletonRows } from "../components/Bits";
import { Icon } from "../components/Icon";
import { AlbumCard } from "../components/Music";
import { Page, Section } from "../components/Page";
import { TrackList } from "../components/TrackRow";
import { useLookup } from "../hooks/useLookup";
import type { Route, ScreenProps } from "../state/types";

type Props = ScreenProps & { route: Extract<Route, { kind: "artist" }>; back: string };

const TOP = 5;
const same = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: "base" }) === 0;

/** An artist: portrait (borrowed from a cover), Play and Shuffle, top songs, then albums, live from iTunes. */
export function ArtistScreen({ s, d, route, back }: Props) {
  const [all, setAll] = useState(false);
  const r = useLookup(`artist:${route.id ?? ""}:${route.name}`, async (signal) => {
    const res = await loadArtist(route.name, route.id, signal);
    d({ type: "ADD_TRACKS", tracks: res.tracks });
    return res;
  });
  const known = Object.values(s.tracks).filter((t) => same(t.artist, route.name));
  const tracks = r?.status === "done" ? r.data.tracks : r?.status === "error" ? known : [];
  const albums = r?.status === "done" ? r.data.albums : [];
  const ids = tracks.map((t) => t.id);
  const shown = all ? ids : ids.slice(0, TOP);
  const portrait = albums[0] ?? tracks[0] ?? known[0];
  const genre = albums[0]?.genre ?? tracks[0]?.genre ?? known[0]?.genre;

  return (
    <Page title={route.name} large={false} back={back} onBack={() => d({ type: "POP" })}>
      <div className="lb-coll-head">
        {portrait ? <Art track={portrait} px={600} className="lb-coll-art is-round" priority />
          : <span className="lb-coll-art is-round lb-monogram" aria-hidden="true">{route.name.charAt(0)}</span>}
        <h2>{route.name}</h2>
        {genre && <p>{genre}</p>}
        {tracks.length > 0 && (
          <div className="lb-coll-btns">
            <button type="button" className="lb-btn" onClick={() => d({ type: "PLAY_LIST", ids })}><Icon name="play" size={20} weight="fill" />Play</button>
            <button type="button" className="lb-btn is-soft" onClick={() => d({ type: "PLAY_LIST", ids, shuffle: true })}><Icon name="shuffle" size={20} weight="bold" />Shuffle</button>
          </div>
        )}
      </div>
      {r?.status === "error" && (
        <p className="lb-banner" role="alert"><Icon name="warn" size={18} weight="fill" />Couldn’t reach the {SOURCE_NAME} ({r.reason}). {known.length ? "Showing the songs already saved." : ""}</p>
      )}
      {r?.status === "loading" ? <SkeletonRows rows={TOP} /> : tracks.length ? (
        <Section id="a-top" title="Top songs" action={ids.length > TOP ? <button type="button" className="lb-text-btn" onClick={() => setAll(!all)}>{all ? "Show less" : "See all"}</button> : undefined}>
          <TrackList s={s} d={d} ids={shown} />
        </Section>
      ) : (
        <Empty icon="artist" title={`No songs for ${route.name}`} text="The iTunes Search API has no previews for this artist right now." />
      )}
      {albums.length > 0 && (
        <Section id="a-albums" title="Albums">
          <ul className="lb-shelf">{albums.map((a) => <AlbumCard key={a.id} d={d} album={a} />)}</ul>
        </Section>
      )}
      {tracks.length > 0 && <p className="lb-footnote">Songs and albums from the {SOURCE_NAME}. The iTunes Search API has no artist photos, so the portrait is an album cover.</p>}
    </Page>
  );
}
