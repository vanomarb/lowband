import { songs } from "../data/catalog";
import { Mosaic } from "../components/Art";
import { Empty } from "../components/Bits";
import { Icon } from "../components/Icon";
import { Page } from "../components/Page";
import { TrackList } from "../components/TrackRow";
import { playlistOf } from "../state/library";
import type { Route, ScreenProps } from "../state/types";

type Props = ScreenProps & { route: Extract<Route, { kind: "playlist" | "liked" | "recent" }>; back: string };

/** A playlist, Liked songs or Recently played: header art, Play and Shuffle, then the songs. */
export function CollectionScreen({ s, d, route, back }: Props) {
  const pl = route.kind === "playlist" ? playlistOf(s, route.id) : undefined;
  const title = pl?.name ?? (route.kind === "liked" ? "Liked songs" : route.kind === "recent" ? "Recently played" : "Playlist");
  const ids = pl?.tracks ?? (route.kind === "liked" ? s.liked : route.kind === "recent" ? s.recent : []);
  const tracks = ids.map((id) => s.tracks[id]).filter(Boolean);
  const actions = pl ? (
    <button type="button" className="lb-icon-btn" aria-label={`Options for ${pl.name}`} onClick={() => d({ type: "SHEET", sheet: { kind: "playlistMenu", id: pl.id } })}><Icon name="more" size={26} weight="bold" /></button>
  ) : route.kind === "recent" && ids.length ? (
    <button type="button" className="lb-text-btn" onClick={() => d({ type: "RECENT_CLEAR" })}>Clear</button>
  ) : null;

  return (
    <Page title={title} large={false} back={back} onBack={() => d({ type: "POP" })} actions={actions}>
      <div className="lb-coll-head">
        {route.kind === "playlist" ? <Mosaic tracks={tracks} px={480} className="lb-coll-art" />
          : <span className={`lb-coll-art lb-coll-icon is-${route.kind}`}><Icon name={route.kind === "liked" ? "heart" : "recent"} size={72} weight="fill" /></span>}
        <h2>{title}</h2>
        <p>{songs(tracks.length)} · 30-sec previews</p>
        {tracks.length > 0 && (
          <div className="lb-coll-btns">
            <button type="button" className="lb-btn" onClick={() => d({ type: "PLAY_LIST", ids })}><Icon name="play" size={20} weight="fill" />Play</button>
            <button type="button" className="lb-btn is-soft" onClick={() => d({ type: "PLAY_LIST", ids, shuffle: true })}><Icon name="shuffle" size={20} weight="bold" />Shuffle</button>
          </div>
        )}
      </div>
      {tracks.length ? <TrackList s={s} d={d} ids={ids} playlistId={pl?.id} numbered={Boolean(pl)} /> : (
        <Empty icon={route.kind === "liked" ? "heart" : route.kind === "recent" ? "recent" : "notes"}
          title={route.kind === "liked" ? "No liked songs yet" : route.kind === "recent" ? "Nothing played yet" : "This playlist is empty"}
          text={route.kind === "playlist" ? "Find a song in Search or Home, open More and choose Add to a playlist." : "Songs show up here as you listen and tap the heart."}
          action={<button type="button" className="lb-btn is-soft" onClick={() => d({ type: "TAB", tab: "search" })}><Icon name="search" size={18} />Find music</button>} />
      )}
    </Page>
  );
}
