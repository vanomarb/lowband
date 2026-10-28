"use client";

import type { RefObject } from "react";
import { CATEGORIES } from "../data/catalog";
import { searchAlbums, searchArtists } from "../data/itunes";
import { Empty, SkeletonRows } from "../components/Bits";
import { Icon } from "../components/Icon";
import { AlbumRow, ArtistRow } from "../components/Music";
import { Page } from "../components/Page";
import { TrackList } from "../components/TrackRow";
import { useLookup } from "../hooks/useLookup";
import { useSearch } from "../hooks/useSearch";
import type { D, ScreenProps, SearchScope } from "../state/types";

const SCOPES: { id: SearchScope; label: string }[] = [
  { id: "songs", label: "Songs" },
  { id: "albums", label: "Albums" },
  { id: "artists", label: "Artists" },
];

/** iOS segmented control: one choice, the selected segment raised. */
function Segmented({ scope, d }: { scope: SearchScope; d: D }) {
  return (
    <div className="lb-seg" role="tablist" aria-label="Search in">
      {SCOPES.map((o) => (
        <button key={o.id} type="button" role="tab" aria-selected={scope === o.id} className={scope === o.id ? "is-on" : ""} onClick={() => d({ type: "SCOPE", scope: o.id })}>
          {o.label}
        </button>
      ))}
    </div>
  );
}

/** Album or artist results for a term, live from the iTunes Search API. */
function ScopeResults({ scope, term, d }: { scope: Exclude<SearchScope, "songs">; term: string; d: D }) {
  const albums = useLookup(scope === "albums" ? `albums:${term}` : null, (signal) => searchAlbums(term, signal), 350);
  const artists = useLookup(scope === "artists" ? `artists:${term}` : null, (signal) => searchArtists(term, signal), 350);
  const r = scope === "albums" ? albums : artists;
  const noun = scope === "albums" ? "album" : "artist";
  if (!r || r.status === "loading") return <SkeletonRows />;
  if (r.status === "error") {
    return <p className="lb-banner" role="alert"><Icon name="warn" size={18} weight="fill" />Couldn’t reach the iTunes Search API ({r.reason}). Album and artist search needs a connection.</p>;
  }
  if (!r.data.length) return <Empty icon={scope === "albums" ? "album" : "artist"} title={`No ${noun}s for “${term}”`} text="Check the spelling, or try Songs instead." />;
  return (
    <>
      <div className="lb-section-head"><h2>{`${r.data.length} ${noun}${r.data.length === 1 ? "" : "s"}`}</h2><span className="lb-section-src">iTunes Search API</span></div>
      <ul className="lb-list">
        {scope === "albums" && albums?.status === "done" && albums.data.map((a) => <AlbumRow key={a.id} d={d} album={a} />)}
        {scope === "artists" && artists?.status === "done" && artists.data.map((a) => <ArtistRow key={a.id} d={d} artist={a} />)}
      </ul>
    </>
  );
}

export function SearchScreen({ s, d, inputRef }: ScreenProps & { inputRef?: RefObject<HTMLInputElement | null> }) {
  const r = useSearch(s.scope === "songs" ? s.query : "", d);
  const ids = r.tracks.map((t) => t.id);
  const term = s.query.trim();
  return (
    <Page title="Search">
      <form className="lb-search" role="search" onSubmit={(e) => { e.preventDefault(); inputRef?.current?.blur(); }}>
        <Icon name="search" size={18} />
        <label className="sr-only" htmlFor="lb-q">Search songs and artists</label>
        <input ref={inputRef} id="lb-q" type="search" value={s.query} placeholder="Artists, songs, albums" autoComplete="off" enterKeyHint="search"
          onChange={(e) => d({ type: "QUERY", query: e.target.value })} />
        {s.query && <button type="button" className="lb-search-clear" aria-label="Clear search" onClick={() => { d({ type: "QUERY", query: "" }); inputRef?.current?.focus(); }}><Icon name="close" size={14} weight="bold" /></button>}
      </form>

      {s.query.trim().length >= 2 && <Segmented scope={s.scope} d={d} />}

      {s.query.trim().length >= 2 && s.scope !== "songs" ? (
        <section className="lb-section" aria-label={`${s.scope} results`}>
          <ScopeResults scope={s.scope} term={term} d={d} />
        </section>
      ) : r.status === "idle" ? (
        <section className="lb-section" aria-labelledby="s-browse">
          <div className="lb-section-head"><h2 id="s-browse">Browse categories</h2></div>
          <ul className="lb-cats">
            {CATEGORIES.map((c) => (
              <li key={c.label}>
                <button type="button" className={`lb-cat lb-pal--${c.palette}`} onClick={() => d({ type: "QUERY", query: c.term })}>
                  <span>{c.label}</span><Icon name={c.icon} size={40} weight="duotone" />
                </button>
              </li>
            ))}
          </ul>
          <p className="lb-footnote">Search asks the iTunes Search API live. Each result plays a 30-second preview.</p>
        </section>
      ) : (
        <section className="lb-section" aria-labelledby="s-results" aria-busy={r.status === "loading"}>
          <div className="lb-section-head">
            <h2 id="s-results">{r.status === "loading" ? "Searching…" : `${r.tracks.length} ${r.tracks.length === 1 ? "song" : "songs"}`}</h2>
            <span className="lb-section-src">{r.status === "fallback" ? "Saved snapshot" : "iTunes Search API"}</span>
          </div>
          {r.status === "fallback" && (
            <p className="lb-banner" role="alert"><Icon name="warn" size={18} weight="fill" />Couldn’t reach the iTunes Search API ({r.reason}). Showing matches from the saved snapshot instead.</p>
          )}
          {r.status === "loading" && r.tracks.length === 0 ? <SkeletonRows /> : r.tracks.length ? (
            <div className={r.status === "loading" ? "is-stale" : ""}><TrackList s={s} d={d} ids={ids} /></div>
          ) : (
            <Empty icon="search" title={`No songs for “${term}”`} text="Check the spelling, or try an artist’s name instead of a song title." />
          )}
        </section>
      )}
    </Page>
  );
}
