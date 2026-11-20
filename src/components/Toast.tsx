import type { D, Toast as ToastData } from "../state/types";
import { Icon } from "./Icon";

export function Toast({ toast, d }: { toast: ToastData | null; d: D }) {
  return (
    <div className="lb-toast-wrap" role="status">
      {toast && (
        <div key={toast.id} className={`lb-toast ${toast.tone === "error" ? "is-error" : ""}`}>
          <Icon name={toast.tone === "error" ? "warn" : "check"} size={18} weight="bold" />
          <span>{toast.message}</span>
          {toast.undo && <button type="button" className="lb-toast-undo" onClick={() => d({ type: "UNDO" })}>Undo</button>}
          <button type="button" className="lb-icon-btn lb-toast-x" aria-label="Dismiss message" onClick={() => d({ type: "DISMISS", id: toast.id })}><Icon name="close" size={16} /></button>
        </div>
      )}
    </div>
  );
}
