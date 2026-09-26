import React, { useEffect } from "react";
import Icon from "./Icon";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export default function Modal({ open, onClose, title, children, maxWidth = "max-w-2xl" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
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
        className="absolute inset-0 bg-navy/75 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative z-10 w-full ${maxWidth} max-h-[92vh] overflow-y-auto no-scrollbar rounded-t-3xl bg-white p-6 shadow-[0_25px_60px_rgba(15,24,36,0.45)] border border-slate-200/90 animate-in fade-in slide-in-from-bottom-6 duration-300 sm:rounded-3xl sm:p-8 before:absolute before:inset-x-0 before:top-0 before:h-[2px] before:bg-gradient-to-r before:from-transparent before:via-gold before:to-transparent`}
      >
        <div className="mb-6 flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2.5">
            <span className="h-2 w-2 rounded-full bg-gold animate-pulse shadow-[0_0_6px_rgba(217,155,56,0.8)]" />
            <h3 className="min-w-0 font-display text-lg font-bold text-navy sm:text-xl tracking-tight">{title}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 text-navy-700 transition-all hover:border-gold hover:bg-gold/10 hover:text-gold shadow-2xs"
          >
            <Icon name="close" className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
}

export function ConfirmDialog({ open, onClose, onConfirm, title = "Confirm delete", message }: ConfirmDialogProps) {
  return (
    <Modal open={open} onClose={onClose} title={title} maxWidth="max-w-md">
      <p className="text-sm text-muted-foreground">{message}</p>
      <div className="mt-6 flex flex-wrap justify-end gap-2">
        <button className="btn-base btn-ghost-navy text-xs font-semibold px-4 py-2" onClick={onClose}>
          Cancel
        </button>
        <button
          className="btn-base bg-destructive text-destructive-foreground hover:brightness-110 text-xs font-bold px-4 py-2 rounded-xl shadow-md"
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
