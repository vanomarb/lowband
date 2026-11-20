"use client";

import { useState, type FormEvent } from "react";
import { clock, PREVIEW_SECONDS, songs } from "../data/catalog";
import { playlistOf } from "../state/library";
import { SLEEP_MINUTES } from "../state/playback";
import type { D, Sheet as SheetData, State } from "../state/types";
import { Art, Mosaic } from "./Art";
import { Icon, type IconName } from "./Icon";
import { Sheet } from "./Sheet";
import { WhereSheet } from "./WhereSheet";

type P = { s: State; d: D };
const close = (d: D) => () => d({ type: "SHEET", sheet: null });

function Action({ icon, label, onClick, danger, detail }: { icon: IconName; label: string; onClick: () => void; danger?: boolean; detail?: string }) {
  return (
    <li>
      <button type="button" className={`lb-action ${danger ? "is-danger" : ""}`} onClick={onClick}>
        <span>{label}</span>{detail && <small>{detail}</small>}<Icon name={icon} size={22} />
      </button>
    </li>
  );
}

function TrackSheet({ s, d, id, playlistId }: P & { id: string; playlistId?: string }) {
  const t = s.tracks[id];
  if (!t) return null;
  const liked = s.liked.includes(id);
  const pl = playlistId ? playlistOf(s, playlistId) : undefined;
  const meta = [t.album, t.year || null, t.origin].filter(Boolean).join(" · ");
  return (
    <Sheet label={`Options for ${t.title}`} onClose={close(d)}>
      <div className="lb-sheet-track">
        <Art track={t} px={120} className="lb-sheet-art" />
        <div><strong>{t.title}</strong><span>{t.artist}</span><small>{meta}</small></div>
      </div>
      <p className="lb-sheet-note"><Icon name="info" size={16} />Plays a {PREVIEW_SECONDS}-second preview from the iTunes Search API. Full track {clock(t.seconds)} would play through a connected service (concept).</p>
      <ul className="lb-actions">
        <Action icon="globe" label="Where it plays…" onClick={() => d({ type: "SHEET", sheet: { kind: "where", id } })} />
        <Action icon="play" label={s.current === id ? "Playing now" : "Play"} onClick={() => d({ type: "PLAY", id })} />
        <Action icon="playNext" label="Play next" onClick={() => d({ type: "QUEUE_ADD", id, next: true })} />
        <Action icon="queueAdd" label="Add to Up next" onClick={() => d({ type: "QUEUE_ADD", id })} />
        <Action icon="heart" label={liked ? "Remove from Liked songs" : "Add to Liked songs"} onClick={() => { d({ type: "LIKE", id }); d({ type: "SHEET", sheet: null }); }} />
        <Action icon="plus" label="Add to a playlist…" onClick={() => d({ type: "SHEET", sheet: { kind: "addTo", id } })} />
        <Action icon="album" label="Go to album" onClick={() => d({ type: "PUSH", route: { kind: "album", title: t.album, artist: t.artist, id: t.albumId } })} />
        <Action icon="artist" label="Go to artist" onClick={() => d({ type: "PUSH", route: { kind: "artist", name: t.artist, id: t.artistId } })} />
        {pl && <Action icon="trash" danger label={`Remove from “${pl.name}”`} onClick={() => d({ type: "PL_REMOVE", playlistId: pl.id, id })} />}
      </ul>
      <button type="button" className="lb-sheet-cancel" onClick={close(d)}>Cancel</button>
    </Sheet>
  );
}

function AddToSheet({ s, d, id }: P & { id: string }) {
  const t = s.tracks[id];
  return (
    <Sheet label="Add to a playlist" onClose={close(d)}>
      <h2 className="lb-sheet-title">Add to a playlist</h2>
      {t && <p className="lb-sheet-sub">{t.title} · {t.artist}</p>}
      <ul className="lb-pick">
        <li><button type="button" className="lb-pick-row" onClick={() => d({ type: "SHEET", sheet: { kind: "newPlaylist", addId: id } })}>
          <span className="lb-pick-new"><Icon name="plus" size={24} weight="bold" /></span><span><strong>New playlist…</strong></span>
        </button></li>
        {s.playlists.map((p) => {
          const has = p.tracks.includes(id);
          return (
            <li key={p.id}><button type="button" className="lb-pick-row" onClick={() => d({ type: "PL_ADD", playlistId: p.id, id })}>
              <Mosaic tracks={p.tracks.map((x) => s.tracks[x]).filter(Boolean)} px={112} className="lb-pick-art" />
              <span><strong>{p.name}</strong><small>{songs(p.tracks.length)}{has ? " · already added" : ""}</small></span>
              {has && <Icon name="check" size={20} weight="bold" className="lb-pick-check" />}
            </button></li>
          );
        })}
      </ul>
      <button type="button" className="lb-sheet-cancel" onClick={close(d)}>Cancel</button>
    </Sheet>
  );
}

function NameSheet({ s, d, sheet }: P & { sheet: Extract<SheetData, { kind: "newPlaylist" | "rename" }> }) {
  const renaming = sheet.kind === "rename" ? playlistOf(s, sheet.id) : undefined;
  const [name, setName] = useState(renaming?.name ?? "");
  const title = renaming ? "Rename playlist" : "New playlist";
  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (sheet.kind === "rename") d({ type: "PL_RENAME", id: sheet.id, name });
    else d({ type: "PL_CREATE", name, addId: sheet.addId });
  };
  return (
    <Sheet label={title} onClose={close(d)}>
      <form className="lb-name-form" onSubmit={submit}>
        <div className="lb-sheet-bar">
          <button type="button" className="lb-text-btn" onClick={close(d)}>Cancel</button>
          <h2>{title}</h2>
          <button type="submit" className="lb-text-btn is-strong" disabled={!name.trim()}>{renaming ? "Save" : "Create"}</button>
        </div>
        <label className="lb-field">
          <span className="sr-only">Playlist name</span>
          <input data-autofocus value={name} maxLength={40} placeholder="Playlist name" onChange={(e) => setName(e.target.value)} autoComplete="off" enterKeyHint="done" />
        </label>
        {sheet.kind === "newPlaylist" && sheet.addId && <p className="lb-sheet-sub">Starts with {s.tracks[sheet.addId]?.title}.</p>}
      </form>
    </Sheet>
  );
}

function PlaylistMenu({ s, d, id }: P & { id: string }) {
  const p = playlistOf(s, id);
  const [confirm, setConfirm] = useState(false);
  if (!p) return null;
  return (
    <Sheet label={confirm ? `Delete ${p.name}?` : `Options for ${p.name}`} onClose={close(d)} variant="action">
      {confirm ? (
        <>
          <p className="lb-action-title">Delete “{p.name}”? The songs stay in your library and you can undo for a few seconds.</p>
          <ul className="lb-actions"><Action icon="trash" danger label="Delete playlist" onClick={() => d({ type: "PL_DELETE", id })} /></ul>
        </>
      ) : (
        <ul className="lb-actions">
          <Action icon="rename" label="Rename" onClick={() => d({ type: "SHEET", sheet: { kind: "rename", id } })} />
          <Action icon="shuffle" label="Shuffle play" onClick={() => d({ type: "PLAY_LIST", ids: p.tracks, shuffle: true })} />
          <Action icon="trash" danger label="Delete playlist…" onClick={() => setConfirm(true)} />
        </ul>
      )}
      <button type="button" className="lb-sheet-cancel" onClick={close(d)}>Cancel</button>
    </Sheet>
  );
}

export function SleepSheet({ s, d }: P) {
  const mode = s.sleep.mode;
  return (
    <Sheet label="Sleep timer" onClose={close(d)} variant="action">
      <p className="lb-action-title">Sleep timer{s.sleep.mode === "timer" ? ` · ${clock(s.sleep.left)} left` : ""}. The volume fades out over the last ten seconds.</p>
      <ul className="lb-actions">
        {SLEEP_MINUTES.map((m) => <Action key={m} icon="sleep" label={`${m} minutes`} onClick={() => d({ type: "SLEEP", minutes: m })} />)}
        <Action icon="note" label="End of this song" detail={mode === "end" ? "On" : undefined} onClick={() => d({ type: "SLEEP", minutes: "end" })} />
        {mode !== "off" && <Action icon="close" danger label="Turn off" onClick={() => d({ type: "SLEEP", minutes: "off" })} />}
      </ul>
      <button type="button" className="lb-sheet-cancel" onClick={close(d)}>Cancel</button>
    </Sheet>
  );
}

/** Whichever sheet the reducer has open. */
export function Sheets({ s, d }: P) {
  const sh = s.sheet;
  if (!sh) return null;
  switch (sh.kind) {
    case "track": return <TrackSheet s={s} d={d} id={sh.id} playlistId={sh.playlistId} />;
    case "addTo": return <AddToSheet s={s} d={d} id={sh.id} />;
    case "newPlaylist":
    case "rename": return <NameSheet key={`${sh.kind}-${"id" in sh ? sh.id : sh.addId}`} s={s} d={d} sheet={sh} />;
    case "playlistMenu": return <PlaylistMenu s={s} d={d} id={sh.id} />;
    case "sleep": return <SleepSheet s={s} d={d} />;
    case "where": return <WhereSheet s={s} d={d} id={sh.id} />;
  }
}
