"use client";

import { useEffect, useRef, useState } from "react";

export type Lookup<T> =
  | { status: "loading"; data?: undefined }
  | { status: "done"; data: T }
  | { status: "error"; data?: undefined; reason: string };

/**
 * Loads `key` once (and again whenever it changes), aborting the older request. `key: null` means "nothing to
 * load". The answer is stored with the key it answers, so a newer key reads as loading without setting state
 * inside the effect.
 */
export function useLookup<T>(key: string | null, load: (signal: AbortSignal) => Promise<T>, delayMs = 0): Lookup<T> | null {
  const loader = useRef(load);
  useEffect(() => { loader.current = load; });
  const [settled, setSettled] = useState<{ key: string; result: Lookup<T> } | null>(null);

  useEffect(() => {
    if (key === null) return;
    const ctrl = new AbortController();
    const timer = window.setTimeout(() => {
      loader.current(ctrl.signal)
        .then((data) => setSettled({ key, result: { status: "done", data } }))
        .catch((err: Error) => {
          if (!ctrl.signal.aborted) setSettled({ key, result: { status: "error", reason: err.message || "network error" } });
        });
    }, delayMs);
    return () => { window.clearTimeout(timer); ctrl.abort(); };
  }, [key, delayMs]);

  if (key === null) return null;
  return settled?.key === key ? settled.result : { status: "loading" };
}
