/** One song. Seed tracks come from the captured snapshot (tracks.ts); live search adds more at runtime. */
export type Track = {
  /** The iTunes trackId. */
  id: string;
  title: string;
  artist: string;
  album: string;
  genre: string;
  /** Where the artist is from. Only the hand-checked snapshot has it. */
  origin?: string;
  year: number;
  /** Length of the full track in seconds. Lowband only ever plays the 30-second preview. */
  seconds: number;
  /** artworkUrl100 without its "/100x100bb.jpg" suffix. */
  artwork: string;
  /** The 30-second previewUrl (AAC in an .m4a). */
  preview: string;
  explicit?: boolean;
  /** iTunes artistId / collectionId. Live results carry them; snapshot tracks are looked up by name. */
  artistId?: string;
  albumId?: string;
  /** Position on its album, for album tracklists. */
  trackNo?: number;
};

/** An album from the iTunes Search API. */
export type Album = { id: string; title: string; artist: string; artistId?: string; year: number; artwork: string; count: number; genre: string; explicit?: boolean };

/** An artist. The iTunes Search API has no artist photos, so pages borrow an album cover. */
export type Artist = { id: string; name: string; genre: string };

export type Palette = "magenta" | "coral" | "orchid" | "amber" | "aqua";
export type Service = "spotify" | "youtube" | "apple";
