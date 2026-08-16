"use client";

import { useState } from "react";
import { PROJECTS } from "@/lib/projects";

const FEATURED = PROJECTS.slice(0, 6);

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
  const [featured, ...rest] = FEATURED;

  return (
    <div className="ucx-gallery-arc">
      <div className="arc-content">
        <span className="eyebrow">Selected Work</span>
        <h2 className="heading">Selected Project Experience</h2>
        <p className="intro">From Digital Models to Real-World Delivery</p>
      </div>

      <div className="arc-grid">
        <a className="arc-card arc-card--featured" href={`/projects/${featured.slug}`}>
          <div className="arc-media">
            <ProjectImage src={featured.image} alt={featured.title} discipline={featured.discipline} />
          </div>
          <div className="arc-meta">
            <span className="arc-sector">
              {featured.sector} &middot; {featured.location}
            </span>
            <h3>{featured.title}</h3>
          </div>
        </a>

        {rest.map((p) => (
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
