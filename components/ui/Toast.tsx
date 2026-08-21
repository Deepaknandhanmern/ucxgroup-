"use client";

import { useEffect } from "react";

export default function Toast({
  show,
  message,
  onDismiss,
  tone = "success",
}: {
  show: boolean;
  message: string;
  onDismiss: () => void;
  tone?: "success" | "error";
}) {
  useEffect(() => {
    if (!show) return;
    const t = setTimeout(onDismiss, 4000);
    return () => clearTimeout(t);
  }, [show, onDismiss]);

  return (
    <div className={`ucx-toast ucx-toast--${tone}${show ? " is-visible" : ""}`} role="status" aria-live="polite">
      <span className="ucx-toast-icon" aria-hidden="true">
        {tone === "success" ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v5M12 16h.01" />
          </svg>
        )}
      </span>
      <span className="ucx-toast-msg">{message}</span>
      <button type="button" className="ucx-toast-close" onClick={onDismiss} aria-label="Dismiss">
        &#10005;
      </button>
    </div>
  );
}
