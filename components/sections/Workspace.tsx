"use client";

import { useEffect, useRef } from "react";

const TAGS = ["Project Delivery", "Team Collaboration", "Knowledge Sharing"];

const PLACEHOLDERS = [
  { n: "01", label: "Studio Floor" },
  { n: "02", label: "Design Review" },
  { n: "03", label: "Coordination Room" },
  { n: "04", label: "Team Collaboration" },
  { n: "05", label: "Workshop Session" },
  { n: "06", label: "Delivery Sync" },
];

export default function Workspace() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;

    let pending = false;
    let px = 0;
    let py = 0;

    function onPointerMove(e: PointerEvent) {
      const b = sect!.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          sect!.style.setProperty("--mx", px + "px");
          sect!.style.setProperty("--my", py + "px");
          pending = false;
        });
      }
    }
    function onPointerEnter() {
      sect!.classList.add("is-hot");
    }
    function onPointerLeave() {
      sect!.classList.remove("is-hot");
    }

    sect.addEventListener("pointermove", onPointerMove, { passive: true });
    sect.addEventListener("pointerenter", onPointerEnter);
    sect.addEventListener("pointerleave", onPointerLeave);
    return () => {
      sect.removeEventListener("pointermove", onPointerMove);
      sect.removeEventListener("pointerenter", onPointerEnter);
      sect.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="ucx-workspace" id="workspace" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <h2 className="heading">Where People, Projects &amp; Ideas Connect</h2>
        <p className="intro">
          UCX operates from an India-based collaborative workspace that supports focused project delivery, team
          interaction and professional collaboration.
        </p>
        <div className="tags">
          {TAGS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="gallery">
          {PLACEHOLDERS.map((p) => (
            <div className="ph" key={p.n}>
              <span className="ph-index">{p.n}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="ph-label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
