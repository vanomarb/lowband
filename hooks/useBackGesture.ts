import { useEffect, useRef } from "react";
import type { D, State } from "../state/types";

/**
 * Makes the phone's back gesture (or the browser back button) step back inside the app instead of leaving it.
 *
 * Every layer you can go back from gets one browser history entry: each screen pushed in the current tab, the
 * Now Playing sheet, and an open bottom sheet. Going back pops the top layer. When a layer closes inside the
 * app (a Back button, a swipe, the backdrop), the matching history entries are removed, so the history never
 * holds stale steps.
 */
export function useBackGesture(s: State, d: D) {
  const layers = s.stacks[s.tab].length + (s.playerOpen ? 1 : 0) + (s.sheet ? 1 : 0);
  const pushed = useRef(0);
  const ignoredPops = useRef(0);
  const latest = useRef(s);
  useEffect(() => { latest.current = s; });

  useEffect(() => {
    const onPop = () => {
      if (ignoredPops.current > 0) { ignoredPops.current--; return; }
      if (pushed.current === 0) return;
      pushed.current--;
      const cur = latest.current;
      if (cur.sheet) d({ type: "SHEET", sheet: null });
      else if (cur.playerOpen) d({ type: "PLAYER", open: false });
      else if (cur.stacks[cur.tab].length) d({ type: "POP" });
    };
    addEventListener("popstate", onPop);
    return () => removeEventListener("popstate", onPop);
  }, [d]);

  useEffect(() => {
    // Keep the existing state object: Next.js stores its router state in history.state.
    while (pushed.current < layers) {
      pushed.current++;
      history.pushState({ ...history.state, lowband: pushed.current }, "");
    }
    if (pushed.current > layers) {
      const extra = pushed.current - layers;
      pushed.current = layers;
      ignoredPops.current++;
      history.go(-extra);
    }
  }, [layers]);
}
