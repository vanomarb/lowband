import type { Dispatch } from "react";
import type { Service, Track } from "../data/catalog";

export type Tab = "home" | "search" | "library" | "settings";
/** A pushed screen inside a tab. */
export type Route =
  | { kind: "playlist"; id: string } | { kind: "liked" } | { kind: "recent" } | { kind: "services" }
  /** id is the iTunes artistId / collectionId when known; snapshot tracks only have names. */
  | { kind: "artist"; name: string; id?: string }
  | { kind: "album"; title: string; artist: string; id?: string };
export type SearchScope = "songs" | "albums" | "artists";
export type Playlist = { id: string; name: string; tracks: string[] };
export type Sleep = { mode: "off" } | { mode: "end" } | { mode: "timer"; left: number; total: number };
export type Sheet =
  | { kind: "track"; id: string; playlistId?: string }
  | { kind: "addTo"; id: string }
  | { kind: "newPlaylist"; addId?: string }
  | { kind: "rename"; id: string }
  | { kind: "playlistMenu"; id: string }
  | { kind: "sleep" }
  | { kind: "where"; id: string };

/** The slices an undo can restore. */
export type Snapshot = Partial<Pick<State, "liked" | "playlists" | "queue" | "recent">>;
export type Toast = { id: number; message: string; undo?: Snapshot; tone?: "error" };

export type State = {
  tab: Tab;
  stacks: Record<Tab, Route[]>;
  /** Every track the app knows: the snapshot plus anything live search returned. */
  tracks: Record<string, Track>;
  query: string;
  scope: SearchScope;
  current: string | null;
  /** What the listener asked for. The audio engine makes the media element follow it. */
  playing: boolean;
  /** The media element is waiting for data (between "waiting" and "playing"). */
  buffering: boolean;
  /** Seconds, reported by the media element's timeupdate. */
  pos: number;
  /** Duration from loadedmetadata; null until it arrives. Previews are about 30 seconds. */
  mediaDur: number | null;
  /** Bumped when the engine must (re)load the current source. */
  loadSeq: number;
  /** Bumped when the engine must move the media element to `pos` (a user seek). */
  seekSeq: number;
  volume: number;
  muted: boolean;
  sleep: Sleep;
  autoplay: boolean;
  queue: string[];
  /** Tracks played before the current one, newest first (for Previous). */
  history: string[];
  /** Recently played, newest first. */
  recent: string[];
  liked: string[];
  playlists: Playlist[];
  playlistSeq: number;
  shuffleSeq: number;
  services: Record<Service, boolean>;
  playerOpen: boolean;
  playerView: "art" | "queue";
  sheet: Sheet | null;
  toast: Toast | null;
  toastSeq: number;
};

export type Action =
  | { type: "RESET" }
  | { type: "TAB"; tab: Tab }
  | { type: "PUSH"; route: Route }
  | { type: "POP" }
  /** Jump straight to a screen in a tab (the web player's sidebar). */
  | { type: "OPEN"; tab: Tab; route?: Route }
  | { type: "QUERY"; query: string }
  | { type: "SCOPE"; scope: SearchScope }
  | { type: "ADD_TRACKS"; tracks: Track[] }
  | { type: "PLAY"; id: string; list?: string[] }
  | { type: "PLAY_LIST"; ids: string[]; shuffle?: boolean }
  | { type: "TOGGLE" }
  | { type: "SEEK"; pos: number }
  | { type: "SKIP"; by: number }
  | { type: "NEXT" }
  | { type: "PREV" }
  | { type: "TICK" }
  | { type: "MEDIA_TIME"; pos: number }
  | { type: "MEDIA_DUR"; dur: number }
  | { type: "MEDIA_WAITING" }
  | { type: "MEDIA_PLAYING" }
  | { type: "MEDIA_PAUSED" }
  | { type: "MEDIA_ENDED" }
  | { type: "MEDIA_ERROR" }
  | { type: "MEDIA_BLOCKED" }
  | { type: "VOLUME"; volume: number }
  | { type: "MUTE" }
  | { type: "SLEEP"; minutes: number | "end" | "off" }
  | { type: "AUTOPLAY" }
  | { type: "LIKE"; id: string }
  | { type: "QUEUE_ADD"; id: string; next?: boolean }
  | { type: "QUEUE_REMOVE"; id: string }
  | { type: "QUEUE_CLEAR" }
  | { type: "PL_CREATE"; name: string; addId?: string }
  | { type: "PL_RENAME"; id: string; name: string }
  | { type: "PL_DELETE"; id: string }
  | { type: "PL_ADD"; playlistId: string; id: string }
  | { type: "PL_REMOVE"; playlistId: string; id: string }
  | { type: "RECENT_CLEAR" }
  | { type: "SERVICE"; id: Service }
  | { type: "PLAYER"; open: boolean }
  | { type: "PLAYER_VIEW"; view: "art" | "queue" }
  | { type: "SHEET"; sheet: Sheet | null }
  | { type: "UNDO" }
  | { type: "DISMISS"; id: number };

export type D = Dispatch<Action>;
/** Props every screen shares. */
export type ScreenProps = { s: State; d: D; today: string };
