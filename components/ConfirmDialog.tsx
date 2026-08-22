"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmOptions = {
  title?: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Styles the confirm button red and swaps the icon tint - use for destructive actions (delete, ban, revoke). */
  danger?: boolean;
};

type ConfirmContextValue = (options: ConfirmOptions | string) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

/**
 * Replaces the browser's native window.confirm() - which renders as an
 * unstyleable "localhost:3000 says" dialog that looks like a broken/unsafe
 * page - with an in-app modal that matches the site's own theme. Exposed as
 * a single global provider + hook so every "are you sure?" prompt in the
 * app (delete content, ban a user, revoke a role, etc.) shares one
 * implementation instead of each component rolling its own modal state.
 */
export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolverRef = useRef<((value: boolean) => void) | null>(null);

  const confirm = useCallback<ConfirmContextValue>((opts) => {
    const normalized = typeof opts === "string" ? { message: opts } : opts;
    setOptions(normalized);
    return new Promise<boolean>((resolve) => {
      resolverRef.current = resolve;
    });
  }, []);

  const settle = (value: boolean) => {
    resolverRef.current?.(value);
    resolverRef.current = null;
    setOptions(null);
  };

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      {options && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-4" role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title">
          <div className="animate-[fadeIn_120ms_ease-out] absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={() => settle(false)} />
          <div
            className="relative w-full max-w-sm rounded-2xl border p-6 shadow-2xl"
            style={{ borderColor: "var(--border-subtle)", backgroundColor: "var(--surface-card)", boxShadow: "var(--shadow-lg)" }}
          >
            <div
              className="mb-4 grid h-11 w-11 place-items-center rounded-xl"
              style={{ backgroundColor: options.danger ? "rgba(220,38,38,0.1)" : "color-mix(in srgb, var(--brand-primary) 12%, transparent)" }}
            >
              <AlertTriangle size={20} color={options.danger ? "#dc2626" : "var(--brand-primary)"} />
            </div>
            <h2 id="confirm-dialog-title" className="mb-2 text-base font-bold text-[var(--brand-text)]">
              {options.title ?? (options.danger ? "Are you sure?" : "Confirm")}
            </h2>
            <p className="mb-6 text-sm leading-relaxed text-[var(--brand-text-muted)]">{options.message}</p>
            <div className="flex justify-end gap-2.5">
              <button
                onClick={() => settle(false)}
                className="rounded-lg border px-4 py-2 text-sm font-semibold transition-all duration-150 hover:bg-[var(--surface-card-hover)] active:scale-95"
                style={{ borderColor: "var(--border-subtle)", color: "var(--brand-text)" }}
              >
                {options.cancelLabel ?? "Cancel"}
              </button>
              <button
                onClick={() => settle(true)}
                autoFocus
                className="rounded-lg px-4 py-2 text-sm font-bold transition-all duration-150 active:scale-95"
                style={options.danger ? { backgroundColor: "#dc2626", color: "#fff" } : { backgroundColor: "var(--brand-primary)", color: "var(--brand-bg-start)" }}
              >
                {options.confirmLabel ?? (options.danger ? "Delete" : "OK")}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used within ConfirmProvider");
  return ctx;
}
