"use client";

import { useEffect, useRef, useState } from "react";

interface Pillar {
  index: string;
  eyebrow: string;
  subtitle: string;
  desc: string;
  tags: string[];
}

const PILLARS: Pillar[] = [
  {
    index: "01",
    eyebrow: "Design Intelligence",
    subtitle: "From vision to buildable design.",
    desc: "From concept to detailed documentation, we connect design thinking with delivery requirements.",
    tags: ["Architecture", "Interiors", "Design Development"],
  },
  {
    index: "02",
    eyebrow: "Digital Intelligence",
    subtitle: "From design to intelligent information.",
    desc: "We transform project information into coordinated, data-rich digital environments for better decisions and delivery.",
    tags: ["BIM", "Digital Engineering", "Coordination", "Automation"],
  },
  {
    index: "03",
    eyebrow: "Delivery Intelligence",
    subtitle: "From information to coordinated execution.",
    desc: "We support teams with coordinated documentation, project controls and execution-focused delivery support.",
    tags: ["Documentation", "QA/QC", "Project Controls", "Execution"],
  },
  {
    index: "04",
    eyebrow: "Asset Intelligence",
    subtitle: "From handover to operational value.",
    desc: "We structure asset information for digital handover, facilities management and long-term operational performance.",
    tags: ["As-Built BIM", "COBie", "Asset Information", "Digital Handover"],
  },
];

const PANEL_COUNT = PILLARS.length + 1; // intro panel + 4 pillars
const DESKTOP_MIN = 900;

export default function Ecosystem() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [pinned, setPinned] = useState(true);

  useEffect(() => {
    const outer = outerRef.current;
    const track = trackRef.current;
    if (!outer || !track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;

    function update() {
      raf = 0;
      const isDesktop = window.innerWidth >= DESKTOP_MIN;
      setPinned(isDesktop);

      if (!isDesktop) {
        track!.style.transform = "none";
        return;
      }

      const vh = window.innerHeight;
      const rect = outer!.getBoundingClientRect();
      const scrollable = outer!.offsetHeight - vh;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      const maxShift = (PANEL_COUNT - 1) * vh;
      track!.style.transform = reduce ? "none" : `translateX(-${progress * maxShift}px)`;
      setActive(Math.round(progress * (PANEL_COUNT - 1)));
    }

    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ucx-ecosystem">
      <div
        className={`ucx-eco-pin${pinned ? "" : " is-stacked"}`}
        ref={outerRef}
        style={pinned ? { height: `${PANEL_COUNT * 100}vh` } : undefined}
      >
        <div className="ucx-eco-sticky">
          <div className="grid-overlay"></div>

          <div className="ucx-eco-track" ref={trackRef}>
            {/* ---------- intro panel ---------- */}
            <div className="ucx-eco-panel intro">
              <span className="eyebrow">The UCX Ecosystem</span>
              <h2 className="heading">One Connected Delivery Ecosystem</h2>
              <p className="tagline">Four integrated intelligence pillars connecting projects from design through operations.</p>
              <span className="scroll-hint">Scroll to explore &rarr;</span>
            </div>

            {/* ---------- pillar panels ---------- */}
            {PILLARS.map((p) => (
              <div className="ucx-eco-panel pillar" key={p.index}>
                <div className="pillar-image">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <span>Image placeholder</span>
                </div>
                <div className="pillar-body">
                  <span className="pillar-index">{p.index}</span>
                  <span className="pillar-eyebrow">{p.eyebrow}</span>
                  <h3 className="pillar-subtitle">{p.subtitle}</h3>
                  <p className="pillar-desc">{p.desc}</p>
                  <div className="pillar-tags">
                    {p.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ---------- progress dots ---------- */}
          <div className="ucx-eco-progress">
            {Array.from({ length: PANEL_COUNT }).map((_, i) => (
              <span key={i} className={i === active ? "is-active" : ""}></span>
            ))}
          </div>
        </div>
      </div>

      <div className="ucx-eco-closing">
        <a className="closing-cta" href="/capabilities">
          Explore the UCX Ecosystem
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
