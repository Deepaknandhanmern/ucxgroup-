"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

interface Card {
  label: string;
  back: string;
  icon: ReactNode;
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const SECTORS: Card[] = [
  { label: "Commercial", back: "Offices, retail & mixed-use workplaces", icon: <Icon d="M4 21V6l8-3 8 3v15M4 21h16M9 9h1M14 9h1M9 13h1M14 13h1M9 21v-5h6v5" /> },
  { label: "Residential", back: "Multi-family, housing & residential developments", icon: <Icon d="M3 11l9-7 9 7M5 10v10h14V10M10 20v-6h4v6" /> },
  { label: "Mixed-Use", back: "Integrated urban & mixed-use developments", icon: <Icon d="M4 21V9l6-4v4l6-4v16M4 21h16M8 21v-4M14 21v-4" /> },
  { label: "Hospitality", back: "Hotels, resorts & leisure environments", icon: <Icon d="M3 19v-9a2 2 0 012-2h3v4M3 19h18M8 12h3a2 2 0 012 2v1M3 19v-3M21 19v-6a2 2 0 00-2-2h-3" /> },
  { label: "Healthcare", back: "Hospitals, clinics & healthcare facilities", icon: <Icon d="M12 3v6M9 6h6M4 21V10l8-6 8 6v11M4 21h16M10 21v-5h4v5" /> },
  { label: "Industrial", back: "Manufacturing, logistics & industrial facilities", icon: <Icon d="M3 21V11l5 3v-3l5 3v-3l5 3v7H3ZM7 21v-4M12 21v-4M17 21v-4" /> },
];

const PARTNERS: Card[] = [
  { label: "Developers", back: "Project sponsors & development teams", icon: <Icon d="M4 21V8l8-5 8 5v13M4 21h16M9 21v-6h6v6M9 12h.01M15 12h.01M12 8h.01" /> },
  { label: "Architects", back: "Design leads & architectural practices", icon: <Icon d="M3 21L14 3l7 4-11 18-7-4ZM11 8l5 3M8 13l5 3" /> },
  { label: "Engineers", back: "Structural, MEP & specialist consultants", icon: <Icon d="M14.7 6.3a4 4 0 01-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 015.4-5.4l-2.3 2.3-1.5-1.5 2.3-2.3Z" /> },
  { label: "Contractors", back: "Construction & delivery teams", icon: <Icon d="M3 8l3-4h12l3 4M3 8v2a2 2 0 002 2h1M3 8h18M21 8v2a2 2 0 01-2 2h-1M6 12v9h12v-9M10 21v-5h4v5" /> },
  { label: "Manufacturers", back: "Prefab, product & building-system partners", icon: <Icon d="M12 2l9 5v10l-9 5-9-5V7l9-5ZM3 7l9 5 9-5M12 12v9" /> },
  { label: "Owners & Operators", back: "Asset owners & operational teams", icon: <Icon d="M12 3l2.6 5.6L21 9.3l-4.5 4.2 1.2 6-5.7-3.1L6.3 19.5l1.2-6L3 9.3l6.4-.7Z" /> },
];

function FlipCard({ card }: { card: Card }) {
  return (
    <div className="flip-card" tabIndex={0}>
      <div className="flip-inner">
        <div className="flip-face flip-front">
          {card.icon}
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
    <div className="ucx-sectors" id="sectors" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head">
          <span className="eyebrow">Who We Work With</span>
          <h2 className="heading">Built for the Built Environment</h2>
          <p className="intro">Across sectors. Alongside the teams shaping, delivering and operating them.</p>
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
          <span className="group-title">Project Stakeholders</span>
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
