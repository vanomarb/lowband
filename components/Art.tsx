"use client";

import Image from "next/image";
import { useState } from "react";
import { artUrl, paletteOf, type Track } from "../data/catalog";
import { Icon } from "./Icon";

/** Anything with an iTunes id and artwork: a track or an album. */
type Props = { track: Pick<Track, "id" | "artwork">; px: number; alt?: string; className?: string; priority?: boolean };

/**
 * Album artwork from the Apple CDN that the iTunes Search API points to, over a tinted placeholder that already
 * looks finished. `unoptimized` serves the CDN's own sized JPEG (it resizes by URL), so no image domain config is
 * needed. If the image fails, the placeholder stays.
 */
export function Art({ track, px, alt = "", className = "", priority }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <span className={`lb-art lb-pal--${paletteOf(track.id)} ${className}`}>
      <span className="lb-art-ph" aria-hidden="true"><Icon name="note" size={Math.max(16, px / 5)} weight="duotone" /></span>
      {!failed && (
        <Image className="lb-art-img" src={artUrl(track, px)} alt={alt} width={px} height={px} unoptimized priority={priority} onError={() => setFailed(true)} />
      )}
    </span>
  );
}

/** Four covers in a square, for playlists. */
export function Mosaic({ tracks, px, className = "" }: { tracks: Track[]; px: number; className?: string }) {
  if (tracks.length < 4) {
    return tracks[0]
      ? <Art track={tracks[0]} px={px} className={className} />
      : <span className={`lb-art lb-art--empty ${className}`}><span className="lb-art-ph" aria-hidden="true"><Icon name="notes" size={Math.max(18, px / 5)} weight="duotone" /></span></span>;
  }
  return (
    <span className={`lb-mosaic ${className}`}>
      {tracks.slice(0, 4).map((t) => <Art key={t.id} track={t} px={Math.round(px / 2)} />)}
    </span>
  );
}
