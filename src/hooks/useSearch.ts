"use client";

import { useEffect, useState } from "react";
import { searchItunes, searchSnapshot } from "../data/itunes";
import type { Track } from "../data/catalog";
import type { D } from "../state/types";

export type SearchResult =
  | { status: "idle"; tracks: Track[] }
  | { status: "loading"; tracks: Track[] }
  | { status: "done"; tracks: Track[]; source: "live" }
  | { status: "fallback"; tracks: Track[]; source: "snapshot"; reason: string };

/**
 * Live search against the iTunes Search API, 350 ms after the last keystroke. A newer query aborts the older
 * request. Results are registered with the reducer (ADD_TRACKS) so they can be played, liked and added to
 * playlists. If the request fails, it falls back to matches inside the captured snapshot and says so.
 */
export function useSearch(query: string, d: D): SearchResult {
  const term = query.trim();
  // The last settled answer and the query it answers; anything newer is still loading.
  const [settled, setSettled] = useState<{ term: string; result: SearchResult }>({ term: "", result: { status: "idle", tracks: [] } });

  useEffect(() => {
    if (term.length < 2) return;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      searchItunes(term, ctrl.signal)
        .then((tracks) => {
          d({ type: "ADD_TRACKS", tracks });
          setSettled({ term, result: { status: "done", tracks, source: "live" } });
        })
        .catch((err: Error) => {
          if (ctrl.signal.aborted) return;
          setSettled({ term, result: { status: "fallback", tracks: searchSnapshot(term), source: "snapshot", reason: err.message || "network error" } });
        });
    }, 350);
    return () => { window.clearTimeout(timer); ctrl.abort(); };
  }, [term, d]);

  if (term.length < 2) return { status: "idle", tracks: [] };
  return settled.term === term ? settled.result : { status: "loading", tracks: settled.result.tracks };
}
