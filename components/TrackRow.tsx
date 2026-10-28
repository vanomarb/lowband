import { paletteOf, type Track } from "../data/catalog";
import type { D, State } from "../state/types";
import { Art } from "./Art";
import { SourceTag } from "./Bits";
import { Icon } from "./Icon";

type Props = { s: State; d: D; track: Track; list: string[]; playlistId?: string; index?: number; albumArtist?: string };

/**
 * A song row: tap to play (the rest of the list becomes Up next), More for the action sheet. Inside an album
 * (albumArtist set) it drops the cover and names the artist only when it differs, like a real tracklist.
 */
export function TrackRow({ s, d, track, list, playlistId, index, albumArtist }: Props) {
  const showArtist = !albumArtist || track.artist !== albumArtist;
  const isCurrent = s.current === track.id;
  const liked = s.liked.includes(track.id);
  return (
    <li className={`lb-row lb-pal--${paletteOf(track.id)} ${isCurrent ? "is-current" : ""}`}>
      <button type="button" className="lb-row-main" aria-current={isCurrent ? "true" : undefined}
        onClick={() => (isCurrent ? d({ type: "TOGGLE" }) : d({ type: "PLAY", id: track.id, list }))}
        onContextMenu={(e) => { e.preventDefault(); d({ type: "SHEET", sheet: { kind: "track", id: track.id, playlistId } }); }}>
        {index !== undefined && <span className="lb-row-num" aria-hidden="true">{index + 1}</span>}
        {!albumArtist && <Art track={track} px={100} className="lb-row-art" />}
        <span className="lb-row-text">
          <strong>{track.title}</strong>
          {showArtist && <small>{track.artist}</small>}
        </span>
        <span className="lb-row-meta">
          {isCurrent && s.playing ? <span className="lb-eq" aria-label="Playing"><i /><i /><i /></span> : <SourceTag explicit={track.explicit} />}
          {liked && <Icon name="heart" size={14} weight="fill" className="lb-row-liked" label="Liked" />}
        </span>
      </button>
      <button type="button" className="lb-icon-btn lb-row-more" aria-label={`More options for ${track.title}`} onClick={() => d({ type: "SHEET", sheet: { kind: "track", id: track.id, playlistId } })}>
        <Icon name="more" size={22} weight="bold" />
      </button>
    </li>
  );
}

/** A list of song rows. */
export function TrackList({ s, d, ids, playlistId, numbered, albumArtist }: { s: State; d: D; ids: string[]; playlistId?: string; numbered?: boolean; albumArtist?: string }) {
  const tracks = ids.map((id) => s.tracks[id]).filter(Boolean);
  return (
    <ul className={`lb-list ${albumArtist ? "is-album" : ""}`}>
      {tracks.map((t, i) => <TrackRow key={t.id} s={s} d={d} track={t} list={ids} playlistId={playlistId} index={numbered ? (albumArtist ? (t.trackNo ?? i + 1) - 1 : i) : undefined} albumArtist={albumArtist} />)}
    </ul>
  );
}
