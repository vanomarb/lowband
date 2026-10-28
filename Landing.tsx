import "./theme.css";
import "./native.css";
import "./player.css";
import "./screens.css";
import "./web.css";
import type { LandingProps } from "./types";
import WebPlayer from "./web/WebPlayer";

/**
 * Lowband's website is the web player itself, not a marketing page: a desktop listening app that shares the
 * phone app's catalogue, reducer and audio engine. On phones, app/page.tsx shows the phone app instead.
 */
export default function Landing({ appHref }: LandingProps) {
  return <WebPlayer appHref={appHref} />;
}
