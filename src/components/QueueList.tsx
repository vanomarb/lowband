import type { D, State } from "../state/types";
import { Art } from "./Art";
import { Empty } from "./Bits";
import { Icon } from "./Icon";

/** Up next: play any song from here, or remove it (with undo from the toast). */
export function QueueList({ s, d }: { s: State; d: D }) {
  const items = s.queue.map((id) => s.tracks[id]).filter(Boolean);
  if (!items.length) return <Empty icon="queue" title="Nothing up next" text="Use More on any song and choose Play next or Add to Up next." />;
  return (
    <div className="lb-queue">
      <div className="lb-queue-head">
        <h3>Up next <span>{items.length}</span></h3>
        <button type="button" className="lb-text-btn" onClick={() => d({ type: "QUEUE_CLEAR" })}>Clear</button>
      </div>
      <ul className="lb-list">
        {items.map((t) => (
          <li key={t.id} className="lb-row">
            <button type="button" className="lb-row-main" onClick={() => d({ type: "PLAY", id: t.id })}>
              <Art track={t} px={100} className="lb-row-art" />
              <span className="lb-row-text"><strong>{t.title}</strong><small>{t.artist}</small></span>
            </button>
            <button type="button" className="lb-icon-btn lb-row-more" aria-label={`Remove ${t.title} from Up next`} onClick={() => d({ type: "QUEUE_REMOVE", id: t.id })}><Icon name="close" size={20} /></button>
          </li>
        ))}
      </ul>
    </div>
  );
}
