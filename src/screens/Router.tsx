import type { RefObject } from "react";
import type { Route, ScreenProps, Tab } from "../state/types";
import { AlbumScreen } from "./Album";
import { ArtistScreen } from "./Artist";
import { CollectionScreen } from "./Collection";
import { HomeScreen } from "./Home";
import { LibraryScreen } from "./Library";
import { SearchScreen } from "./Search";
import { ServicesScreen, SettingsScreen } from "./Settings";

const ROOT_TITLE: Record<Tab, string> = { home: "Listen Now", search: "Search", library: "Library", settings: "Settings" };

/** The top of the current tab's stack. Shared by the phone app and the web player. */
export function Screen({ s, d, today, homeHref, searchRef }: ScreenProps & { homeHref?: string; searchRef?: RefObject<HTMLInputElement | null> }) {
  const stack = s.stacks[s.tab];
  const top = stack[stack.length - 1];
  const props = { s, d, today };
  if (!top) {
    if (s.tab === "search") return <SearchScreen {...props} inputRef={searchRef} />;
    if (s.tab === "library") return <LibraryScreen {...props} />;
    if (s.tab === "settings") return <SettingsScreen {...props} homeHref={homeHref} />;
    return <HomeScreen {...props} />;
  }
  const below = stack[stack.length - 2];
  const back = below ? labelOf(s, below) : ROOT_TITLE[s.tab];
  const key = routeKey(top);
  if (top.kind === "services") return <ServicesScreen {...props} />;
  if (top.kind === "artist") return <ArtistScreen key={key} {...props} route={top} back={back} />;
  if (top.kind === "album") return <AlbumScreen key={key} {...props} route={top} back={back} />;
  return <CollectionScreen key={key} {...props} route={top} back={back} />;
}

/** What the back button says when this route is underneath. */
function labelOf(s: ScreenProps["s"], r: Route) {
  if (r.kind === "playlist") return s.playlists.find((p) => p.id === r.id)?.name ?? "Back";
  if (r.kind === "liked") return "Liked";
  if (r.kind === "artist") return r.name;
  if (r.kind === "album") return r.title;
  return "Back";
}

const routeKey = (r: Route) =>
  r.kind === "artist" ? `artist:${r.id ?? r.name}` : r.kind === "album" ? `album:${r.id ?? `${r.artist}/${r.title}`}` : `${r.kind}:${"id" in r ? r.id : ""}`;

export const viewKeyOf = (s: ScreenProps["s"]) => `${s.tab}:${s.stacks[s.tab].map(routeKey).join("/")}`;
