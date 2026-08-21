"use client";

import { useEffect, useState } from "react";

export interface AnnouncementBannerProps {
  id: string;
  buttonText: string;
  description: string;
  href?: string;
  onButtonClick?: () => void;
  className?: string;
}

export default function AnnouncementBanner({
  id,
  buttonText,
  description,
  href,
  onButtonClick,
  className,
}: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    try {
      setDismissed(localStorage.getItem(`ucx-banner-${id}`) === "1");
    } catch {
      setDismissed(false);
    }
  }, [id]);

  function close() {
    setDismissed(true);
    try {
      localStorage.setItem(`ucx-banner-${id}`, "1");
    } catch {
      /* localStorage unavailable — banner will just reappear next visit */
    }
  }

  if (dismissed) return null;

  return (
    <div className="ucx-banner-wrap">
      <div className={`ucx-banner${className ? ` ${className}` : ""}`}>
        {href ? (
          <a className="ucx-banner-btn" href={href} onClick={onButtonClick}>
            {buttonText}
          </a>
        ) : (
          <button type="button" className="ucx-banner-btn" onClick={onButtonClick}>
            {buttonText}
          </button>
        )}
        <span className="ucx-banner-desc">{description}</span>
        <button type="button" className="ucx-banner-close" onClick={close} aria-label="Dismiss">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
