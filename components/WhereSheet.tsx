"use client";

import type { ReactNode } from "react";
import { clock } from "../data/catalog";
import { appleMusicUrl, findOnDeezer, KIND_LABEL, spotifySearchUrl, youtubeMusicSearchUrl, type Candidate } from "../data/deezer";
import { useLookup } from "../hooks/useLookup";
import type { D, State } from "../state/types";
import { Art } from "./Art";
import { Icon } from "./Icon";
import { Sheet } from "./Sheet";

type Status = "yes" | "no" | "wait" | "ask";

function Service({ name, status, detail, href, cta }: { name: string; status: Status; detail: ReactNode; href?: string; cta?: string }) {
  return (
    <li className={`lb-where-row is-${status}`}>
      <span className="lb-where-mark" aria-hidden="true">
        <Icon name={status === "yes" ? "check" : status === "no" ? "close" : status === "wait" ? "spinner" : "search"} size={16} weight="bold" />
      </span>
      <span className="lb-where-text"><strong>{name}</strong><small>{detail}</small></span>
      {href && (
        <a className="lb-where-link" href={href} target="_blank" rel="noopener noreferrer">
          {cta ?? "Open"}<Icon name="out" size={14} /><span className="sr-only"> in {name} (new tab)</span>
        </a>
      )}
    </li>
  );
}

function Version({ c }: { c: Candidate }) {
  return (
    <li className="lb-where-row">
      <span className={`lb-kind is-${c.kind}`}>{KIND_LABEL[c.kind]}</span>
      <span className="lb-where-text"><strong>{c.title}</strong><small>{c.artist} · {clock(c.seconds)}</small></span>
      <a className="lb-where-link" href={c.link} target="_blank" rel="noopener noreferrer" aria-label={`Open ${c.title} by ${c.artist} on Deezer (new tab)`}><Icon name="out" size={14} /></a>
    </li>
  );
}

/**
 * Where this exact recording plays, and which other versions exist. Apple Music is the demo's own catalogue,
 * Deezer is checked live, and Spotify / YouTube Music need an account to check, so they hand off to search.
 */
export function WhereSheet({ s, d, id }: { s: State; d: D; id: string }) {
  const t = s.tracks[id];
  const r = useLookup(t ? `where:${t.id}` : null, (signal) => findOnDeezer(t!, signal));
  if (!t) return null;
  const close = () => d({ type: "SHEET", sheet: null });
  const deezer: { status: Status; detail: ReactNode; href?: string } =
    !r || r.status === "loading" ? { status: "wait", detail: "Checking…" }
    : r.status === "error" ? { status: "ask", detail: `Couldn’t check (${r.reason})` }
    : r.data.same ? { status: "yes", detail: `Same recording · ${clock(r.data.same.seconds)}`, href: r.data.same.link }
    : { status: "no", detail: r.data.others.length ? "This recording isn’t there; other versions are" : "Not found" };

  return (
    <Sheet label={`Where ${t.title} plays`} onClose={close}>
      <div className="lb-sheet-track">
        <Art track={t} px={120} className="lb-sheet-art" />
        <div><strong>{t.title}</strong><span>{t.artist}</span><small>{t.album}{t.seconds ? ` · ${clock(t.seconds)}` : ""}</small></div>
      </div>
      <h2 className="lb-where-h">This recording</h2>
      <ul className="lb-where">
        <Service name="Apple Music" status="yes" detail="In this demo’s catalogue" href={appleMusicUrl(t)} />
        <Service name="Deezer" {...deezer} />
        <Service name="Spotify" status="ask" detail="Needs your account to check" href={spotifySearchUrl(t)} cta="Search" />
        <Service name="YouTube Music" status="ask" detail="Needs your account to check" href={youtubeMusicSearchUrl(t)} cta="Search" />
      </ul>
      {r?.status === "done" && r.data.others.length > 0 && (
        <>
          <h2 className="lb-where-h">Other versions on Deezer</h2>
          <ul className="lb-where">{r.data.others.map((c) => <Version key={c.id} c={c} />)}</ul>
        </>
      )}
      <p className="lb-sheet-note"><Icon name="info" size={16} />Deezer is checked live with its public API and matched by artist, title and length; a real build would match the recording’s ISRC first. Lowband never swaps in a different version without asking.</p>
      <button type="button" className="lb-sheet-cancel" onClick={close}>Done</button>
    </Sheet>
  );
}
