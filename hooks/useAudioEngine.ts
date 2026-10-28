"use client";

import { useEffect, useRef } from "react";
import { artUrl, PREVIEW_LABEL, SOURCE_NAME } from "../data/catalog";
import { FADE_SECONDS } from "../state/playback";
import type { D, State } from "../state/types";

/**
 * One HTMLAudioElement for the whole app, and it is the source of truth: timeupdate drives `pos`, loadedmetadata
 * drives the duration, waiting/playing drive buffering, ended advances the queue, error stops with a toast.
 * The reducer only records intent (play, pause, seek); effects below push that intent into the element.
 * The element is exposed as window.__lowbandAudio so the demo's playback can be inspected from devtools.
 */
export function useAudioEngine(s: State, d: D) {
  const ref = useRef<HTMLAudioElement | null>(null);
  const latest = useRef(s);
  useEffect(() => { latest.current = s; });
  /** Where to jump once the new source has metadata. While set, timeupdate is ignored. */
  const pending = useRef<number | null>(null);
  const track = s.current ? s.tracks[s.current] : undefined;
  const src = track?.preview ?? null;

  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    ref.current = a;
    (window as unknown as { __lowbandAudio?: HTMLAudioElement }).__lowbandAudio = a;
    const handlers: Record<string, () => void> = {
      timeupdate: () => {
        if (pending.current !== null) return;
        if (Math.abs(a.currentTime - latest.current.pos) >= 0.25) d({ type: "MEDIA_TIME", pos: a.currentTime });
      },
      loadedmetadata: () => {
        if (Number.isFinite(a.duration)) {
          if (pending.current) a.currentTime = Math.max(0, Math.min(pending.current, a.duration - 0.5));
          d({ type: "MEDIA_DUR", dur: a.duration });
        }
        pending.current = null;
      },
      waiting: () => { if (latest.current.playing) d({ type: "MEDIA_WAITING" }); },
      playing: () => d({ type: "MEDIA_PLAYING" }),
      // A pause we did not ask for (OS controls, a headset). Ignore the ones a reload or the end of a track causes.
      pause: () => { if (latest.current.playing && !a.ended && a.readyState >= 2) d({ type: "MEDIA_PAUSED" }); },
      ended: () => d({ type: "MEDIA_ENDED" }),
      error: () => { if (a.getAttribute("src")) d({ type: "MEDIA_ERROR" }); },
    };
    for (const [type, fn] of Object.entries(handlers)) a.addEventListener(type, fn);

    const ms = "mediaSession" in navigator ? navigator.mediaSession : null;
    const actions: [MediaSessionAction, MediaSessionActionHandler][] = [
      ["play", () => { if (!latest.current.playing) d({ type: "TOGGLE" }); }],
      ["pause", () => { if (latest.current.playing) d({ type: "TOGGLE" }); }],
      ["stop", () => { if (latest.current.playing) d({ type: "TOGGLE" }); }],
      ["seekbackward", (e) => d({ type: "SKIP", by: -(e.seekOffset ?? 5) })],
      ["seekforward", (e) => d({ type: "SKIP", by: e.seekOffset ?? 5 })],
      ["seekto", (e) => { if (e.seekTime !== undefined) d({ type: "SEEK", pos: e.seekTime }); }],
      ["previoustrack", () => d({ type: "PREV" })],
      ["nexttrack", () => d({ type: "NEXT" })],
    ];
    for (const [action, fn] of actions) {
      try { ms?.setActionHandler(action, fn); } catch { /* action not supported by this browser */ }
    }
    return () => {
      for (const [type, fn] of Object.entries(handlers)) a.removeEventListener(type, fn);
      for (const [action] of actions) {
        try { ms?.setActionHandler(action, null); } catch { /* not supported */ }
      }
      a.pause();
      a.removeAttribute("src");
      a.load();
      ref.current = null;
    };
  }, [d]);

  // Load the source for a new track, or re-load the same one (loadSeq).
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    if (!src) {
      a.pause();
      a.removeAttribute("src");
      a.load();
      return;
    }
    pending.current = latest.current.pos;
    a.src = src;
  }, [src, s.loadSeq]);

  // A user seek: move the element now, or as soon as it has metadata.
  useEffect(() => {
    const a = ref.current;
    if (!a || !latest.current.current) return;
    if (a.readyState >= 1 && pending.current === null) a.currentTime = latest.current.pos;
    else pending.current = latest.current.pos;
  }, [s.seekSeq]);

  // Play or pause to match intent. play() returns a promise that rejects when autoplay is blocked.
  useEffect(() => {
    const a = ref.current;
    if (!a || !src) return;
    if (s.playing && a.paused) {
      a.play().catch((err: DOMException) => {
        if (err.name === "NotAllowedError") d({ type: "MEDIA_BLOCKED" });
        // AbortError: a newer load or a pause interrupted this play; the "error" event reports real failures.
      });
    } else if (!s.playing && !a.paused) {
      a.pause();
    }
  }, [s.playing, src, s.loadSeq, d]);

  // Volume, mute, and the sleep timer's fade over its last seconds.
  const fade = s.sleep.mode === "timer" ? Math.min(1, s.sleep.left / FADE_SECONDS) : 1;
  useEffect(() => {
    const a = ref.current;
    if (!a) return;
    a.volume = Math.max(0, Math.min(1, s.volume * fade));
    a.muted = s.muted;
  }, [s.volume, s.muted, fade]);

  // Media Session: lock screen, headset and keyboard media keys.
  const title = track?.title, artist = track?.artist, album = track ? `${track.album} · ${PREVIEW_LABEL} via ${SOURCE_NAME}` : "";
  const art = track ? artUrl(track, 600) : "";
  useEffect(() => {
    if (!("mediaSession" in navigator) || typeof MediaMetadata === "undefined") return;
    navigator.mediaSession.metadata = title ? new MediaMetadata({ title, artist, album, artwork: [{ src: art, sizes: "600x600", type: "image/jpeg" }] }) : null;
  }, [title, artist, album, art]);
  const hasCurrent = Boolean(track);
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    navigator.mediaSession.playbackState = hasCurrent ? (s.playing ? "playing" : "paused") : "none";
  }, [s.playing, hasCurrent]);
  const dur = s.mediaDur ?? 0;
  const second = Math.floor(s.pos);
  useEffect(() => {
    if (!("mediaSession" in navigator) || !navigator.mediaSession.setPositionState) return;
    try {
      navigator.mediaSession.setPositionState(dur > 0 ? { duration: dur, position: Math.min(second, dur), playbackRate: 1 } : undefined);
    } catch { /* position outside duration while a new track loads */ }
  }, [dur, second]);
}
