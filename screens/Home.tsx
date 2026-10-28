import { longDate, paletteOf, SHELVES, songs, type Track } from "../data/catalog";
import { Art, Mosaic } from "../components/Art";
import { Icon } from "../components/Icon";
import { Page, Section } from "../components/Page";
import type { D, ScreenProps, State } from "../state/types";

function Card({ s, d, t, list }: { s: State; d: D; t: Track; list: string[] }) {
  const playing = s.current === t.id && s.playing;
  return (
    <li>
      <button type="button" className={`lb-card lb-pal--${paletteOf(t.id)}`} aria-label={`${playing ? "Pause" : "Play"} ${t.title} by ${t.artist}`}
        onClick={() => (s.current === t.id ? d({ type: "TOGGLE" }) : d({ type: "PLAY", id: t.id, list }))}
        onContextMenu={(e) => { e.preventDefault(); d({ type: "SHEET", sheet: { kind: "track", id: t.id } }); }}>
        <span className="lb-card-art">
          <Art track={t} px={300} />
          <span className="lb-card-play" aria-hidden="true"><Icon name={playing ? "pause" : "play"} size={18} weight="fill" /></span>
        </span>
        <strong>{t.title}</strong>
        <small>{t.artist}</small>
      </button>
    </li>
  );
}

export function HomeScreen({ s, d, today }: ScreenProps) {
  const pick = s.tracks["1440718584"];
  const recent = s.recent.map((id) => s.tracks[id]).filter(Boolean);
  return (
    <Page title="Listen Now">
      <p className="lb-dateline">{longDate(today)}</p>
      {pick && (
        <button type="button" className={`lb-hero lb-pal--${paletteOf(pick.id)}`} onClick={() => d({ type: "PLAY_LIST", ids: SHELVES[1].ids })}>
          <Art track={pick} px={600} className="lb-hero-art" priority />
          <span className="lb-hero-text">
            <small>Today’s pick</small>
            <strong>{SHELVES[1].title}</strong>
            <span>{SHELVES[1].note}. Starts with {pick.artist}.</span>
          </span>
          <span className="lb-hero-play" aria-hidden="true"><Icon name="play" size={20} weight="fill" /> Play</span>
        </button>
      )}
      {recent.length > 0 && (
        <Section id="h-recent" title="Recently played" action={<button type="button" className="lb-text-btn" onClick={() => { d({ type: "TAB", tab: "library" }); d({ type: "PUSH", route: { kind: "recent" } }); }}>See all</button>}>
          <ul className="lb-shelf">{recent.slice(0, 8).map((t) => <Card key={t.id} s={s} d={d} t={t} list={s.recent} />)}</ul>
        </Section>
      )}
      {SHELVES.filter((sh) => sh.id !== "focus").map((sh) => (
        <Section key={sh.id} id={`h-${sh.id}`} title={sh.title}>
          <p className="lb-section-note">{sh.note}</p>
          <ul className="lb-shelf">{sh.ids.map((id) => s.tracks[id]).filter(Boolean).map((t) => <Card key={t.id} s={s} d={d} t={t} list={sh.ids} />)}</ul>
        </Section>
      ))}
      <Section id="h-playlists" title="Your playlists">
        <ul className="lb-shelf">
          {s.playlists.map((p) => (
            <li key={p.id}>
              <button type="button" className="lb-card" onClick={() => d({ type: "PUSH", route: { kind: "playlist", id: p.id } })}>
                <span className="lb-card-art"><Mosaic tracks={p.tracks.map((x) => s.tracks[x]).filter(Boolean)} px={300} /></span>
                <strong>{p.name}</strong><small>{songs(p.tracks.length)}</small>
              </button>
            </li>
          ))}
        </ul>
      </Section>
      <p className="lb-footnote">Every song here is a real track from the iTunes Search API, playing its 30-second preview. Lowband is a concept: it does not stream from Spotify, YouTube Music or Apple Music.</p>
    </Page>
  );
}
