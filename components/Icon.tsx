import {
  ArrowCounterClockwise, CaretDown, CaretLeft, CaretRight, Check, CircleNotch, ClockCounterClockwise, DotsThree, DeviceMobile,
  DiscoBall, Gear, Waves, Guitar, Headphones, Heart, House, Info, ListPlus, MagnifyingGlass, MicrophoneStage, MoonStars,
  MusicNote, MusicNotes, MusicNotesSimple, Pause, PencilSimple, PianoKeys, Play, Playlist, Plus, Queue, Shuffle, SignOut, SkipBack,
  SkipForward, SpeakerHigh, SpeakerLow, SpeakerSlash, Trash, Warning, Waveform, X, Books, PlugsConnected, VinylRecord, Globe, WaveSine, Disc, UserSound, ArrowUpRight,
} from "@phosphor-icons/react/dist/ssr";
import type { Icon as PhosphorIcon } from "@phosphor-icons/react";

const icons = {
  home: House, search: MagnifyingGlass, library: Books, settings: Gear, play: Play, pause: Pause, next: SkipForward, prev: SkipBack,
  down: CaretDown, back: CaretLeft, caret: CaretRight, close: X, more: DotsThree, heart: Heart, plus: Plus, check: Check, warn: Warning,
  info: Info, trash: Trash, rename: PencilSimple, spinner: CircleNotch, queue: Queue, queueAdd: ListPlus, playNext: Playlist, shuffle: Shuffle,
  sleep: MoonStars, volume: SpeakerHigh, volumeLow: SpeakerLow, mute: SpeakerSlash, recent: ClockCounterClockwise, undo: ArrowCounterClockwise,
  exit: SignOut, phone: DeviceMobile, plug: PlugsConnected, note: MusicNote, notes: MusicNotes, wave: Waveform, globe: Globe, headphones: Headphones,
  album: Disc, artist: UserSound, out: ArrowUpRight,
  // category tiles
  afro: Waves, kpop: DiscoBall, latin: Guitar, jazz: VinylRecord, classical: PianoKeys, electronic: WaveSine, bossa: MusicNotesSimple, reggae: MicrophoneStage,
} satisfies Record<string, PhosphorIcon>;

export type IconName = keyof typeof icons;
type Props = { name: IconName; size?: number; weight?: "regular" | "bold" | "fill" | "duotone"; label?: string; className?: string };

/** One semantic name per Phosphor icon. Decorative unless a label is given. */
export function Icon({ name, size = 22, weight = "regular", label, className }: Props) {
  const Glyph = icons[name];
  return <Glyph size={size} weight={weight} className={className} aria-hidden={label ? undefined : true} aria-label={label} role={label ? "img" : undefined} />;
}
