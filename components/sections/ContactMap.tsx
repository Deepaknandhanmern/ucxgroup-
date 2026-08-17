"use client";

import { useRef, useState } from "react";

const ADDRESS =
  "Door No. 653, Part LCC Compound, 1-3, Trichy Rd, opposite Srivari Trisara, Singanallur, Coimbatore, Tamil Nadu 641005";
const DIRECTIONS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`;

export default function ContactMap() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [hovered, setHovered] = useState(false);

  function onPointerMove(e: React.PointerEvent) {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * 8).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
  }

  function onPointerLeave() {
    const el = cardRef.current;
    if (el) {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    }
    setHovered(false);
  }

  return (
    <div className="ucx-loc" data-expanded={expanded}>
      <div
        className="ucx-loc-card"
        ref={cardRef}
        onPointerMove={onPointerMove}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={onPointerLeave}
        onClick={() => setExpanded((v) => !v)}
        role="button"
        tabIndex={0}
        aria-expanded={expanded}
        aria-label="Toggle UCX Coimbatore studio location details"
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
      >
        <div className="loc-grid" aria-hidden="true"></div>

        {expanded && (
          <svg className="loc-schematic" aria-hidden="true" preserveAspectRatio="none">
            <line className="road" pathLength="1" x1="0%" y1="35%" x2="100%" y2="35%" style={{ animationDelay: ".05s" }} />
            <line className="road" pathLength="1" x1="0%" y1="66%" x2="100%" y2="66%" style={{ animationDelay: ".14s" }} />
            <line className="road minor" pathLength="1" x1="28%" y1="0%" x2="28%" y2="100%" style={{ animationDelay: ".2s" }} />
            <line className="road minor" pathLength="1" x1="72%" y1="0%" x2="72%" y2="100%" style={{ animationDelay: ".28s" }} />
            <rect className="block" pathLength="1" x="8%" y="42%" width="15%" height="20%" style={{ animationDelay: ".32s" }} />
            <rect className="block" pathLength="1" x="36%" y="14%" width="12%" height="16%" style={{ animationDelay: ".38s" }} />
            <rect className="block" pathLength="1" x="74%" y="70%" width="17%" height="17%" style={{ animationDelay: ".44s" }} />
            <rect className="block" pathLength="1" x="80%" y="16%" width="11%" height="20%" style={{ animationDelay: ".5s" }} />
          </svg>
        )}

        <div className="loc-pin" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#00352D" />
            <circle cx="12" cy="9" r="2.5" fill="#F3F1E6" />
          </svg>
        </div>

        <div className="loc-content">
          <div className="loc-top">
            <svg className="loc-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" x2="9" y1="3" y2="18" />
              <line x1="15" x2="15" y1="6" y2="21" />
            </svg>
            <span className="loc-live">
              <i></i> Coimbatore Studio
            </span>
          </div>

          <div className="loc-bottom">
            <h3>Singanallur, Coimbatore</h3>
            <span className="loc-underline"></span>
          </div>
        </div>
      </div>

      {expanded ? (
        <a
          className="loc-directions"
          href={DIRECTIONS_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
        >
          Get directions
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      ) : (
        <span className={`loc-hint${hovered ? " is-visible" : ""}`}>Click to expand</span>
      )}
    </div>
  );
}
