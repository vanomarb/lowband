import type { ReactNode } from "react";
import { Icon, type IconName } from "./Icon";

export function Empty({ icon, title, text, action }: { icon: IconName; title: string; text: string; action?: ReactNode }) {
  return (
    <div className="lb-empty">
      <span className="lb-empty-icon"><Icon name={icon} size={30} weight="duotone" /></span>
      <h2>{title}</h2>
      <p>{text}</p>
      {action}
    </div>
  );
}

export function SkeletonRows({ rows = 6 }: { rows?: number }) {
  return (
    <ul className="lb-list" aria-hidden="true">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="lb-skel-row"><span className="lb-skel lb-skel-art" /><span className="lb-skel-lines"><span className="lb-skel" /><span className="lb-skel" /></span></li>
      ))}
    </ul>
  );
}

/** iOS-style switch (51x31) with switch semantics. */
export function Switch({ on, onChange, label }: { on: boolean; onChange: () => void; label: string }) {
  return (
    <button type="button" role="switch" aria-checked={on} aria-label={label} className="lb-switch" onClick={onChange}>
      <span className="lb-switch-knob" />
    </button>
  );
}

/** The source note, said the same way everywhere. */
export function SourceTag({ explicit }: { explicit?: boolean }) {
  return explicit ? <b className="lb-explicit" aria-label="Explicit">E</b> : null;
}

/** Locks a region behind a sheet or the full player: no focus, no clicks, hidden from assistive tech. */
export const inertProps = (on: boolean) => ({ inert: on });
