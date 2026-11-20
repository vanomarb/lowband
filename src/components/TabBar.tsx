import type { D, State, Tab } from "../state/types";
import { Icon, type IconName } from "./Icon";

export const TABS: { id: Tab; label: string; icon: IconName }[] = [
  { id: "home", label: "Home", icon: "home" },
  { id: "search", label: "Search", icon: "search" },
  { id: "library", label: "Library", icon: "library" },
  { id: "settings", label: "Settings", icon: "settings" },
];

/** 49pt translucent tab bar over the bottom safe area. Tapping the current tab pops it to its root. */
export function TabBar({ s, d }: { s: State; d: D }) {
  return (
    <nav className="lb-tabbar" aria-label="Main">
      {TABS.map((t) => (
        <button key={t.id} type="button" aria-current={s.tab === t.id ? "page" : undefined} onClick={() => d({ type: "TAB", tab: t.id })}>
          <Icon name={t.icon} size={25} weight={s.tab === t.id ? "fill" : "regular"} />
          <span>{t.label}</span>
        </button>
      ))}
    </nav>
  );
}
