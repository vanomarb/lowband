import Link from "next/link";
import { songs } from "../data/catalog";
import { Mosaic } from "../components/Art";
import { Icon } from "../components/Icon";
import { TABS } from "../components/TabBar";
import type { D, Route, State } from "../state/types";

const same = (a: Route | undefined, b: Route) => Boolean(a && a.kind === b.kind && ("id" in a ? a.id : "") === ("id" in b ? b.id : ""));

/** Left rail: brand, the four sections, the listener's library and the way to the phone app. At phone width it is a top bar. */
export function Rail({ s, d, appHref }: { s: State; d: D; appHref: string }) {
  const stack = s.stacks[s.tab];
  const top = s.tab === "library" ? stack[stack.length - 1] : undefined;
  const lib: { route: Route; label: string; sub: string; icon?: "heart" | "recent"; ids?: string[] }[] = [
    { route: { kind: "liked" }, label: "Liked songs", sub: songs(s.liked.length), icon: "heart" },
    { route: { kind: "recent" }, label: "Recently played", sub: songs(s.recent.length), icon: "recent" },
    ...s.playlists.map((p) => ({ route: { kind: "playlist" as const, id: p.id }, label: p.name, sub: songs(p.tracks.length), ids: p.tracks })),
  ];
  return (
    <aside className="lbw-rail" aria-label="Lowband">
      <div className="lbw-rail-top">
        <p className="lbw-brand"><span className="lbw-mark"><Icon name="wave" size={20} weight="bold" /></span><span>Lowband<small>Web player · concept</small></span></p>
        <Link href={appHref} className="lbw-phone-link"><Icon name="phone" size={18} weight="bold" /> Phone app</Link>
      </div>
      <nav className="lbw-nav" aria-label="Main">
        {TABS.map((t) => (
          <button key={t.id} type="button" aria-current={s.tab === t.id && !stack.length ? "page" : undefined} onClick={() => d({ type: "OPEN", tab: t.id })}>
            <Icon name={t.icon} size={22} weight={s.tab === t.id ? "fill" : "regular"} /><span>{t.label}</span>
          </button>
        ))}
      </nav>
      <section className="lbw-lib" aria-labelledby="lbw-lib-h">
        <div className="lbw-lib-head">
          <h2 id="lbw-lib-h">Your library</h2>
          <button type="button" className="lb-icon-btn" aria-label="New playlist" onClick={() => d({ type: "SHEET", sheet: { kind: "newPlaylist" } })}><Icon name="plus" size={20} weight="bold" /></button>
        </div>
        <ul>
          {lib.map((item) => (
            <li key={item.label + ("id" in item.route ? item.route.id : "")}>
              <button type="button" aria-current={same(top, item.route) ? "page" : undefined} onClick={() => d({ type: "OPEN", tab: "library", route: item.route })}>
                {item.icon ? <span className={`lbw-lib-icon is-${item.icon}`}><Icon name={item.icon} size={18} weight="fill" /></span>
                  : <Mosaic tracks={(item.ids ?? []).map((x) => s.tracks[x]).filter(Boolean)} px={80} className="lbw-lib-art" />}
                <span><strong>{item.label}</strong><small>{item.sub}</small></span>
              </button>
            </li>
          ))}
        </ul>
      </section>
      <button type="button" className="lbw-reset" onClick={() => d({ type: "RESET" })}><Icon name="undo" size={18} /> Reset demo</button>
    </aside>
  );
}
