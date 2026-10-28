import { songs } from "../data/catalog";
import { Mosaic } from "../components/Art";
import { Icon, type IconName } from "../components/Icon";
import { Page } from "../components/Page";
import type { D, Route, ScreenProps } from "../state/types";

function Row({ d, route, icon, title, detail }: { d: D; route: Route; icon: IconName; title: string; detail: string }) {
  return (
    <li>
      <button type="button" className="lb-cell" onClick={() => d({ type: "PUSH", route })}>
        <span className="lb-cell-icon"><Icon name={icon} size={22} weight="fill" /></span>
        <span className="lb-cell-label">{title}</span>
        <span className="lb-cell-detail">{detail}</span>
        <Icon name="caret" size={16} weight="bold" className="lb-chev" />
      </button>
    </li>
  );
}

export function LibraryScreen({ s, d }: ScreenProps) {
  return (
    <Page title="Library" actions={<button type="button" className="lb-icon-btn" aria-label="New playlist" onClick={() => d({ type: "SHEET", sheet: { kind: "newPlaylist" } })}><Icon name="plus" size={24} weight="bold" /></button>}>
      <ul className="lb-group">
        <Row d={d} route={{ kind: "liked" }} icon="heart" title="Liked songs" detail={String(s.liked.length)} />
        <Row d={d} route={{ kind: "recent" }} icon="recent" title="Recently played" detail={String(s.recent.length)} />
      </ul>
      <section className="lb-section" aria-labelledby="l-pl">
        <div className="lb-section-head"><h2 id="l-pl">Playlists</h2></div>
        <ul className="lb-list lb-pl-list">
          <li>
            <button type="button" className="lb-pl-row" onClick={() => d({ type: "SHEET", sheet: { kind: "newPlaylist" } })}>
              <span className="lb-pl-new"><Icon name="plus" size={26} weight="bold" /></span>
              <span className="lb-row-text"><strong className="lb-tint">New playlist…</strong></span>
            </button>
          </li>
          {s.playlists.map((p) => (
            <li key={p.id}>
              <button type="button" className="lb-pl-row" onClick={() => d({ type: "PUSH", route: { kind: "playlist", id: p.id } })}>
                <Mosaic tracks={p.tracks.map((x) => s.tracks[x]).filter(Boolean)} px={120} className="lb-pl-art" />
                <span className="lb-row-text"><strong>{p.name}</strong><small>{songs(p.tracks.length)}</small></span>
                <Icon name="caret" size={16} weight="bold" className="lb-chev" />
              </button>
            </li>
          ))}
        </ul>
      </section>
    </Page>
  );
}
