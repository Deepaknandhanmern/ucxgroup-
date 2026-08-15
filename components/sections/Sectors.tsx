"use client";

import { useEffect, useRef } from "react";

interface Card {
  label: string;
  back: string;
}

const SECTORS: Card[] = [
  { label: "Commercial", back: "Offices & mixed-use" },
  { label: "Residential", back: "Multi-family & housing" },
  { label: "Mixed-Use", back: "Blended developments" },
  { label: "Hospitality", back: "Hotels & leisure" },
  { label: "Healthcare", back: "Clinical & medical" },
  { label: "Industrial", back: "Manufacturing & logistics" },
  { label: "Infrastructure", back: "Civil & public works" },
];

const PARTNERS: Card[] = [
  { label: "Developers", back: "Project sponsors" },
  { label: "Architects", back: "Design leads" },
  { label: "Engineers", back: "MEP & structural" },
  { label: "Contractors", back: "Site & delivery teams" },
  { label: "Manufacturers", back: "Prefab & product" },
  { label: "Owners & Operators", back: "Long-term asset value" },
];

function FlipCard({ card }: { card: Card }) {
  return (
    <div className="flip-card" tabIndex={0}>
      <div className="flip-inner">
        <div className="flip-face flip-front">
          <span>{card.label}</span>
        </div>
        <div className="flip-face flip-back">
          <span>{card.back}</span>
        </div>
      </div>
    </div>
  );
}

export default function Sectors() {
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
    <div className="ucx-sectors" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head">
          <span className="eyebrow">Who We Work With</span>
          <h2 className="heading">Built for the Built Environment</h2>
          <p className="intro">Across sectors. Alongside the teams delivering them.</p>
        </div>

        <div className="group">
          <span className="group-title">Sectors</span>
          <div className="flip-grid">
            {SECTORS.map((c) => (
              <FlipCard card={c} key={c.label} />
            ))}
          </div>
        </div>

        <div className="group">
          <span className="group-title">Who We Work With</span>
          <div className="flip-grid">
            {PARTNERS.map((c) => (
              <FlipCard card={c} key={c.label} />
            ))}
          </div>
        </div>

        <div className="closing">
          <a className="closing-cta" href="/experience">
            Explore Industries
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
