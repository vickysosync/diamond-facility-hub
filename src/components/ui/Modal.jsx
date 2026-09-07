import { useEffect } from "react";
import Icon from "./Icon.jsx";

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-2xl" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center p-0 sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-navy/70 backdrop-blur-sm animate-in fade-in"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 w-full ${maxWidth} max-h-[92vh] overflow-y-auto rounded-t-2xl bg-card p-5 shadow-lift animate-in fade-in slide-in-from-bottom-4 sm:rounded-2xl sm:p-7`}
      >
        <div className="mb-5 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4">
          <h3 className="min-w-0 text-lg font-bold text-navy sm:text-xl">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-lg border border-border p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-navy"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title = "Confirm delete", message }) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button className="btn-base btn-ghost-navy" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-base bg-destructive text-destructive-foreground hover:brightness-110"
          onClick={() => {
            onConfirm();
            onClose();
          }}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
