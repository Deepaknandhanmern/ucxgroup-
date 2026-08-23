"use client";

import { useState } from "react";

export default function CardThumb({ src, alt }: { src?: string; alt: string }) {
  const [ok, setOk] = useState(Boolean(src));

  if (src && ok) {
    return <img className="ucx-card-thumb-img" src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
  }

  return (
    <div className="ucx-card-thumb-placeholder">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span>Thumbnail coming soon</span>
    </div>
  );
}
