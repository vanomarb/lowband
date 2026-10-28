"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { Icon } from "./Icon";

/** Screens are shared by the phone app and the web player; the chrome around them is not. */
export const LayoutContext = createContext<"phone" | "web">("phone");
export const useLayout = () => useContext(LayoutContext);

type Props = {
  title: string;
  /** Root screens show a 34px large title in the content that collapses into the bar on scroll. */
  large?: boolean;
  /** Label of the screen underneath, for the back button on pushed screens. */
  back?: string;
  onBack?: () => void;
  actions?: ReactNode;
  children: ReactNode;
};

/**
 * Phone: a fixed 44px navigation bar under the status bar, and the only scrolling region below it. The large
 * title scrolls with the content; once it is gone, the centred 17px title fades into the bar (iOS behaviour).
 * Web: a plain header inside the web player's main column.
 */
export function Page({ title, large = true, back, onBack, actions, children }: Props) {
  const layout = useLayout();
  const [collapsed, setCollapsed] = useState(!large);
  const backBtn = back && onBack && (
    <button type="button" className="lb-nav-back" onClick={onBack}><Icon name="back" size={22} weight="bold" /><span>{back}</span></button>
  );

  if (layout === "web") {
    return (
      <div className="lbw-page">
        {backBtn && <div className="lbw-page-back">{backBtn}</div>}
        <header className="lbw-page-head">
          <h1 tabIndex={-1} data-view-focus>{title}</h1>
          {actions && <div className="lbw-page-actions">{actions}</div>}
        </header>
        {children}
      </div>
    );
  }

  return (
    <div className="lb-page">
      <header className={`lb-nav ${collapsed ? "is-collapsed" : ""}`}>
        <div className="lb-nav-lead">{backBtn}</div>
        {large ? <p className="lb-nav-title" aria-hidden="true">{title}</p> : <h1 className="lb-nav-title" tabIndex={-1} data-view-focus>{title}</h1>}
        <div className="lb-nav-trail">{actions}</div>
      </header>
      <div className="lb-scroll" onScroll={large ? (e) => setCollapsed(e.currentTarget.scrollTop > 36) : undefined}>
        {large && <h1 className="lb-large" tabIndex={-1} data-view-focus>{title}</h1>}
        {children}
      </div>
    </div>
  );
}

/** A labelled group of content with an optional trailing action, 16px insets. */
export function Section({ title, action, children, id }: { title?: string; action?: ReactNode; children: ReactNode; id: string }) {
  return (
    <section className="lb-section" aria-labelledby={title ? id : undefined}>
      {title && <div className="lb-section-head"><h2 id={id}>{title}</h2>{action}</div>}
      {children}
    </section>
  );
}
