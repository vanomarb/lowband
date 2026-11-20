import { paletteOf, type Album, type Artist } from "../data/catalog";
import type { D } from "../state/types";
import { Art } from "./Art";
import { Icon } from "./Icon";

const year = (a: Album) => (a.year ? ` · ${a.year}` : "");
const openAlbum = (d: D, a: Album) => d({ type: "PUSH", route: { kind: "album", title: a.title, artist: a.artist, id: a.id } });

/** An album in a list: cover, title, artist and year, chevron to its tracklist. */
export function AlbumRow({ d, album }: { d: D; album: Album }) {
  return (
    <li className={`lb-row lb-pal--${paletteOf(album.id)}`}>
      <button type="button" className="lb-row-main lb-row-nav" onClick={() => openAlbum(d, album)}>
        <Art track={album} px={100} className="lb-row-art" />
        <span className="lb-row-text">
          <strong>{album.title}</strong>
          <small>{album.explicit && <b className="lb-explicit" aria-label="Explicit">E</b>}{album.artist}{year(album)}</small>
        </span>
        <Icon name="caret" size={16} className="lb-row-chev" />
      </button>
    </li>
  );
}

/** An album on a horizontal shelf. */
export function AlbumCard({ d, album }: { d: D; album: Album }) {
  return (
    <li>
      <button type="button" className={`lb-card lb-pal--${paletteOf(album.id)}`} onClick={() => openAlbum(d, album)}>
        <span className="lb-card-art"><Art track={album} px={300} /></span>
        <strong>{album.title}</strong>
        <small>{album.year || album.genre}</small>
      </button>
    </li>
  );
}

/** An artist in a list. The iTunes Search API has no artist photos, so it shows a monogram. */
export function ArtistRow({ d, artist }: { d: D; artist: Artist }) {
  return (
    <li className={`lb-row lb-pal--${paletteOf(artist.id)}`}>
      <button type="button" className="lb-row-main lb-row-nav" onClick={() => d({ type: "PUSH", route: { kind: "artist", name: artist.name, id: artist.id } })}>
        <span className="lb-row-art lb-monogram" aria-hidden="true">{artist.name.trim().charAt(0).toUpperCase()}</span>
        <span className="lb-row-text"><strong>{artist.name}</strong><small>Artist · {artist.genre}</small></span>
        <Icon name="caret" size={16} className="lb-row-chev" />
      </button>
    </li>
  );
}
