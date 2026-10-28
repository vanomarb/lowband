import Link from "next/link";
import { CAPTURED, clock, CONCEPT_LINE, COUNTRIES, longDate, SERVICES, SNAPSHOT } from "../data/catalog";
import { Switch } from "../components/Bits";
import { Icon } from "../components/Icon";
import { Page, useLayout } from "../components/Page";
import type { ScreenProps } from "../state/types";

export function SettingsScreen({ s, d, homeHref }: ScreenProps & { homeHref?: string }) {
  const layout = useLayout();
  const on = SERVICES.filter((x) => s.services[x.id]).length;
  const sleep = s.sleep.mode === "timer" ? `${clock(s.sleep.left)} left` : s.sleep.mode === "end" ? "End of song" : "Off";
  return (
    <Page title="Settings">
      <h2 className="lb-group-title">Listening</h2>
      <ul className="lb-group">
        <li><button type="button" className="lb-cell" onClick={() => d({ type: "SHEET", sheet: { kind: "sleep" } })}>
          <span className="lb-cell-icon is-orchid"><Icon name="sleep" size={20} weight="fill" /></span><span className="lb-cell-label">Sleep timer</span><span className="lb-cell-detail">{sleep}</span><Icon name="caret" size={16} weight="bold" className="lb-chev" />
        </button></li>
        <li className="lb-cell">
          <span className="lb-cell-icon is-aqua"><Icon name="queue" size={20} weight="fill" /></span><span className="lb-cell-label" id="set-auto">Autoplay Up next</span>
          <Switch on={s.autoplay} onChange={() => d({ type: "AUTOPLAY" })} label="Autoplay Up next" />
        </li>
      </ul>
      <h2 className="lb-group-title">Accounts</h2>
      <ul className="lb-group">
        <li><button type="button" className="lb-cell" onClick={() => d({ type: "PUSH", route: { kind: "services" } })}>
          <span className="lb-cell-icon is-coral"><Icon name="plug" size={20} weight="fill" /></span><span className="lb-cell-label">Connected services</span><span className="lb-cell-detail">{on ? `${on} preferred` : "None"}</span><Icon name="caret" size={16} weight="bold" className="lb-chev" />
        </button></li>
      </ul>
      <p className="lb-group-foot">{CONCEPT_LINE}.</p>
      <h2 className="lb-group-title">About this demo</h2>
      <ul className="lb-group">
        <li className="lb-cell"><span className="lb-cell-label">Catalogue</span><span className="lb-cell-detail">iTunes Search API</span></li>
        <li className="lb-cell"><span className="lb-cell-label">Offline snapshot</span><span className="lb-cell-detail">{SNAPSHOT.length} songs · {COUNTRIES} countries · charts of {longDate(CAPTURED)}</span></li>
        <li className="lb-cell"><span className="lb-cell-label">What plays</span><span className="lb-cell-detail">30-second previews</span></li>
      </ul>
      {layout === "phone" && (
        <>
          <h2 className="lb-group-title">Demo</h2>
          <ul className="lb-group">
            <li><button type="button" className="lb-cell" onClick={() => d({ type: "RESET" })}><span className="lb-cell-icon is-amber"><Icon name="undo" size={20} weight="bold" /></span><span className="lb-cell-label lb-tint">Reset demo</span></button></li>
            {homeHref && <li><Link href={homeHref} className="lb-cell"><span className="lb-cell-icon is-magenta"><Icon name="exit" size={20} weight="bold" /></span><span className="lb-cell-label lb-tint">Exit demo</span><Icon name="caret" size={16} weight="bold" className="lb-chev" /></Link></li>}
          </ul>
        </>
      )}
      <p className="lb-footnote">Lowband is a concept by Van Omar Benaires, not a real service. Song data and previews come from the public iTunes Search API; artwork belongs to its owners.</p>
    </Page>
  );
}

export function ServicesScreen({ s, d }: ScreenProps) {
  return (
    <Page title="Connected services" large={false} back="Settings" onBack={() => d({ type: "POP" })}>
      <p className="lb-concept"><Icon name="info" size={20} weight="fill" /><span>{CONCEPT_LINE}.</span></p>
      <h2 className="lb-group-title">Play full tracks from</h2>
      <ul className="lb-group">
        {SERVICES.map((x) => (
          <li key={x.id} className="lb-cell is-tall">
            <span className="lb-cell-stack"><span className="lb-cell-label">{x.name}</span><small>{x.note}</small></span>
            <Switch on={s.services[x.id]} onChange={() => d({ type: "SERVICE", id: x.id })} label={`Prefer ${x.name} (concept)`} />
          </li>
        ))}
      </ul>
      <p className="lb-group-foot">Turning one on only records a preference in this demo. A real build would sign in with the service’s own login and hand playback to its official player. Until then every song plays its 30-second preview.</p>
    </Page>
  );
}
