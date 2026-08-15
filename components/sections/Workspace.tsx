"use client";

import { useEffect, useRef } from "react";

const TAGS = ["Project Delivery", "Team Collaboration", "Knowledge Sharing"];

const PLACEHOLDERS = [
  { n: "01", size: "lg" },
  { n: "02", size: "sm" },
  { n: "03", size: "sm" },
  { n: "04", size: "sm" },
  { n: "05", size: "sm" },
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
        <span className="eyebrow">Our Workspace</span>
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
            <div className={`ph ph-${p.size}`} key={p.n}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span className="ph-label">Workspace Photo {p.n}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
