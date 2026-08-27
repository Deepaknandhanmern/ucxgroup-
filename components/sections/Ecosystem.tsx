"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

interface Pillar {
  index: string;
  eyebrow: string;
  subtitle: string;
  desc: string;
  tags: string[];
  image: string;
}

const PILLARS: Pillar[] = [
  {
    index: "01",
    eyebrow: "Design Intelligence",
    subtitle: "From vision to buildable design.",
    desc: "From concept to detailed documentation, we connect design thinking with delivery requirements.",
    tags: ["Architecture", "Interiors", "Design Development"],
    image: "/brand/ecosystem/design-intelligence-v2.webp",
  },
  {
    index: "02",
    eyebrow: "Digital Intelligence",
    subtitle: "From design to intelligent information.",
    desc: "We transform project information into coordinated, data-rich digital environments for better decisions and delivery.",
    tags: ["BIM", "Digital Engineering", "Coordination", "Automation"],
    image: "/brand/ecosystem/digital-intelligence-v2.webp",
  },
  {
    index: "03",
    eyebrow: "Delivery Intelligence",
    subtitle: "From information to coordinated execution.",
    desc: "We support teams with coordinated documentation, project controls and execution-focused delivery support.",
    tags: ["Documentation", "QA/QC", "Project Controls", "Execution"],
    image: "/brand/ecosystem/delivery-intelligence-v2.webp",
  },
  {
    index: "04",
    eyebrow: "Asset Intelligence",
    subtitle: "From handover to operational value.",
    desc: "We structure asset information for digital handover, facilities management and long-term operational performance.",
    tags: ["As-Built BIM", "COBie", "Asset Information", "Digital Handover"],
    image: "/brand/ecosystem/asset-intelligence-v2.webp",
  },
];

const PANEL_COUNT = PILLARS.length + 1; // intro panel + 4 pillars
const DESKTOP_MIN = 900;

function PillarVisual({ src, alt, index }: { src: string; alt: string; index: string }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return <img className="pillar-photo" src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
  }
  return (
    <>
      <span className="pillar-ghost" aria-hidden="true">{index}</span>
      <span className="pillar-image-pulse" aria-hidden="true"></span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span>Image placeholder</span>
    </>
  );
}

export default function Ecosystem() {
  const outerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const glowRef = useCursorGlow<HTMLDivElement>();
  const [active, setActive] = useState(0);
  const [activeFrac, setActiveFrac] = useState(0);
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
      const vw = window.innerWidth;
      const rect = outer!.getBoundingClientRect();
      const scrollable = outer!.offsetHeight - vh;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0;

      const maxShift = (PANEL_COUNT - 1) * vw;
      track!.style.transform = reduce ? "none" : `translateX(-${progress * maxShift}px)`;
      outer!.style.setProperty("--progress", String(progress));
      const raw = progress * (PANEL_COUNT - 1);
      setActive(Math.round(raw));
      setActiveFrac(raw);
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

  function focusStyle(panelIndex: number): CSSProperties {
    if (!pinned) return {};
    const dist = Math.min(1, Math.abs(activeFrac - panelIndex));
    return {
      transform: `scale(${1 - dist * 0.1})`,
      opacity: 1 - dist * 0.55,
    };
  }

  return (
    <div className="ucx-ecosystem" id="ecosystem">
      <div
        className={`ucx-eco-pin${pinned ? "" : " is-stacked"}`}
        ref={outerRef}
        style={pinned ? { height: `${PANEL_COUNT * 100}vh` } : undefined}
      >
        <div className="ucx-eco-sticky" ref={glowRef}>
          <div className="grid-overlay"></div>
          <div className="grid-glow"></div>
          <div className="cursor-haze"></div>
          <div className="ucx-eco-glow" aria-hidden="true"></div>

          <div className="ucx-eco-track" ref={trackRef}>
            {/* ---------- intro panel ---------- */}
            <div className="ucx-eco-panel intro">
              <div className="focus-inner" style={focusStyle(0)}>
                <span className="eyebrow">The UCX Ecosystem</span>
                <h2 className="heading">One Connected Delivery Ecosystem</h2>
                <p className="tagline">Four integrated intelligence pillars connecting projects from design through operations.</p>
                <span className="scroll-hint">Scroll to explore &rarr;</span>
              </div>
            </div>

            {/* ---------- pillar panels ---------- */}
            {PILLARS.map((p, i) => (
              <div className="ucx-eco-panel pillar" key={p.index}>
                <div className="focus-inner" style={focusStyle(i + 1)}>
                  <div className="pillar-image">
                    <PillarVisual src={p.image} alt={p.eyebrow} index={p.index} />
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
              </div>
            ))}
          </div>

          {/* ---------- progress rail ---------- */}
          <div className="ucx-eco-progress">
            <div className="ucx-eco-progress-track">
              <div className="ucx-eco-progress-fill"></div>
            </div>
            <div className="ucx-eco-progress-labels">
              <span className={active === 0 ? "is-active" : ""}>Overview</span>
              {PILLARS.map((p, i) => (
                <span key={p.index} className={active === i + 1 ? "is-active" : ""}>
                  {p.eyebrow.replace(" Intelligence", "")}
                </span>
              ))}
            </div>
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
