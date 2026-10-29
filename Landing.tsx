import Image from "next/image";
import Link from "next/link";
import "./landing.css";
import { Icon, type IconName } from "./components/Icon";
import type { LandingProps } from "./types";

// next/image doesn't add next.config's basePath to a src string, so public files carry it here.
const asset = (path: string) => `/lowband${path}`;

const features: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "search",
    title: "Search once",
    body: "Songs, albums and artists, searched live. Song search falls back to a saved catalogue when the network drops.",
  },
  {
    icon: "globe",
    title: "See where it plays",
    body: "Open any song's menu to find the same recording on Apple Music and Deezer, with covers, remixes, sped-up and live versions labelled.",
  },
  {
    icon: "album",
    title: "Albums and artists",
    body: "Real tracklists, top songs and albums, one tap from any song, the menu or the full player.",
  },
  {
    icon: "heart",
    title: "A library of your own",
    body: "Like songs, look back at what you played, and build playlists you can rename, edit and delete, with undo.",
  },
  {
    icon: "queue",
    title: "Up next and sleep timer",
    body: "Queue what comes next, set the volume, and let a sleep timer fade the music out.",
  },
  {
    icon: "phone",
    title: "Made for both screens",
    body: "A desktop player with a library rail and an Up next panel, and a phone app whose sheets drag down and follow the back gesture.",
  },
];

const facts: { label: string; body: string }[] = [
  {
    label: "Real",
    body: "Search, album and artist pages, artwork and 30-second audio previews come from the public iTunes Search API.",
  },
  {
    label: "Real",
    body: "Where it plays checks Deezer live, matching artist, title and length to within three seconds.",
  },
  {
    label: "A search",
    body: "Spotify and YouTube Music open a search, because their availability can't be checked without an account.",
  },
  {
    label: "Not connected",
    body: "Service switches in Settings are preferences only. Your library lives in the open tab and resets when you reload.",
  },
];

/** The marketing page at /. The player itself lives at playHref (device-aware) and appHref (phone app). */
export default function Landing({ playHref, appHref }: LandingProps) {
  return (
    <div className="lbl">
      <header className="lbl-header">
        <Link href="/" className="lbl-brand">
          <span className="lbl-mark">
            <Icon name="wave" size={20} weight="bold" />
          </span>
          Lowband
        </Link>
        <nav className="lbl-nav" aria-label="Sections">
          <a href="#features">Features</a>
          <a href="#where">Where it plays</a>
          <a href="#data">What&apos;s real</a>
        </nav>
        <Link href={playHref} className="lbl-button is-small">
          Open Lowband
        </Link>
      </header>

      <main>
        <section className="lbl-hero">
          <div className="lbl-hero-copy">
            <p className="lbl-eyebrow">Music player · web and phone</p>
            <h1>One library for music that lives everywhere.</h1>
            <p className="lbl-lead">
              Search once, play a 30-second preview, and see which services carry the exact recording: the official
              release, the live take, the cover or the sped-up edit.
            </p>
            <div className="lbl-actions">
              <Link href={playHref} className="lbl-button">
                <Icon name="play" size={18} weight="fill" /> Open Lowband
              </Link>
              <Link href={appHref} className="lbl-button is-ghost">
                <Icon name="phone" size={18} weight="bold" /> Try the phone app
              </Link>
            </div>
            <p className="lbl-note">Free in your browser · No account · Previews from the iTunes Search API</p>
          </div>
          <div className="lbl-hero-shots">
            <figure className="lbl-browser">
              <span className="lbl-dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <Image
                priority
                src={asset("/shots/web-player.webp")}
                width={1440}
                height={900}
                alt="The Lowband web player: library rail, Listen Now, Up next and the player bar"
              />
            </figure>
            <figure className="lbl-phone">
              <Image
                src={asset("/shots/phone-home.webp")}
                width={390}
                height={844}
                alt="The Lowband phone app home screen with today's pick and recently played"
              />
            </figure>
          </div>
        </section>

        <section id="features" className="lbl-section">
          <h2>Everything a listening app needs, before the hand-off.</h2>
          <ul className="lbl-features">
            {features.map((feature) => (
              <li key={feature.title}>
                <span className="lbl-feature-icon">
                  <Icon name={feature.icon} size={22} weight="bold" />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="where" className="lbl-section lbl-split">
          <div>
            <p className="lbl-eyebrow">Where it plays</p>
            <h2>The song you want is often on a different service.</h2>
            <p className="lbl-lead">
              Covers, live sessions and remixes live in one place, official releases in another. Lowband shows the
              recording you picked on each service it can check, and labels every other version instead of swapping it in
              quietly.
            </p>
            <Link href={appHref} className="lbl-button is-ghost">
              See it on the phone app <Icon name="out" size={16} weight="bold" />
            </Link>
          </div>
          <figure className="lbl-phone is-solo">
            <Image
              src={asset("/shots/phone-where-it-plays.webp")}
              width={390}
              height={844}
              alt="The Where it plays sheet: the same recording on Apple Music and Deezer, and other versions tagged"
            />
          </figure>
        </section>

        <section id="data" className="lbl-section">
          <h2>What&apos;s real, and what isn&apos;t.</h2>
          <ul className="lbl-facts">
            {facts.map((fact) => (
              <li key={fact.body}>
                <span className="lbl-tag">{fact.label}</span>
                <p>{fact.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="lbl-section lbl-cta">
          <h2>Press play.</h2>
          <div className="lbl-actions">
            <Link href={playHref} className="lbl-button">
              <Icon name="play" size={18} weight="fill" /> Open Lowband
            </Link>
            <Link href={appHref} className="lbl-button is-ghost">
              <Icon name="phone" size={18} weight="bold" /> Try the phone app
            </Link>
          </div>
        </section>
      </main>

      <footer className="lbl-footer">
        <p>
          Lowband plays previews; it isn&apos;t a streaming service. Spotify, YouTube Music, Apple Music and Deezer are
          trademarks of their owners, and Lowband isn&apos;t affiliated with any of them.
        </p>
        <p>
          Made by <a href="https://github.com/vanomarb">Van Omar Benaires</a> ·{" "}
          <a href="https://github.com/vanomarb/lowband">Source</a>
        </p>
      </footer>
    </div>
  );
}
