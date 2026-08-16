"use client";

import { useRef, useState } from "react";
import { PROJECTS } from "@/lib/projects";

const FEATURED = PROJECTS.slice(0, 8);

function ProjectImage({ src, alt, discipline }: { src: string; alt: string; discipline: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className="arc-fallback">
        <span>{discipline}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className="arc-img" onError={() => setOk(false)} />;
}

export default function GalleryArc() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  function onScroll() {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 0);
  }

  function scrollByCard(dir: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>(".arc-card");
    const amount = (card?.offsetWidth ?? 360) + 20;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  }

  return (
    <div className="ucx-gallery-arc">
      <div className="arc-content">
        <span className="eyebrow">Selected Work</span>
        <h2 className="heading">Selected Project Experience</h2>
        <p className="intro">From Digital Models to Real-World Delivery</p>
      </div>

      <div className="arc-scroller">
        <div className="arc-track" ref={trackRef} onScroll={onScroll}>
          {FEATURED.map((p) => (
            <a className="arc-card" href={`/projects/${p.slug}`} key={p.slug}>
              <div className="arc-media">
                <ProjectImage src={p.image} alt={p.title} discipline={p.discipline} />
              </div>
              <div className="arc-meta">
                <span className="arc-sector">
                  {p.sector} &middot; {p.location}
                </span>
                <h3>{p.title}</h3>
              </div>
            </a>
          ))}
        </div>

        <div className="arc-controls">
          <button type="button" className="arc-arrow" aria-label="Previous project" onClick={() => scrollByCard(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="arc-progress">
            <span style={{ transform: `scaleX(${Math.max(progress, 0.06)})` }} />
          </div>
          <button type="button" className="arc-arrow" aria-label="Next project" onClick={() => scrollByCard(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="arc-ctas">
        <a className="arc-cta-primary" href="/projects">
          View Project Experience
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
