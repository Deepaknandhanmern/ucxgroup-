"use client";

import { useEffect, useRef, useState } from "react";

type Cat = "bim" | "interiors" | "construction" | "asset";

interface Project {
  cat: Cat;
  title: string;
  sector: string;
  location: string;
  discipline: string;
  image: string;
}

const FILTERS: { cat: Cat | "all"; label: string }[] = [
  { cat: "all", label: "All Projects" },
  { cat: "bim", label: "BIM & Digital Delivery" },
  { cat: "interiors", label: "Design & Interiors" },
  { cat: "construction", label: "Construction Support" },
  { cat: "asset", label: "Asset Information" },
];

const PROJECTS: Project[] = [
  {
    cat: "bim",
    title: "BIM Coordination for a Mixed-Use Cultural Campus",
    sector: "Institutional",
    location: "India",
    discipline: "BIM & VDC",
    image: "/brand/projects/cultural-campus.jpg",
  },
  {
    cat: "interiors",
    title: "Interior Design & Documentation for a Hospitality Development",
    sector: "Hospitality",
    location: "UAE",
    discipline: "Design & Interiors",
    image: "/brand/projects/hospitality-interiors.jpg",
  },
  {
    cat: "construction",
    title: "Construction Support for a Regional Medical Campus",
    sector: "Healthcare",
    location: "India",
    discipline: "Construction Support",
    image: "/brand/projects/medical-campus.jpg",
  },
  {
    cat: "asset",
    title: "Asset Information Delivery for an Urban Infrastructure Corridor",
    sector: "Infrastructure",
    location: "United Kingdom",
    discipline: "Asset Information",
    image: "/brand/projects/infrastructure-corridor.jpg",
  },
  {
    cat: "bim",
    title: "Scan-to-BIM for a Multi-Zone Urban Development",
    sector: "Infrastructural",
    location: "United States",
    discipline: "Scan-to-BIM",
    image: "/brand/projects/urban-development.jpg",
  },
  {
    cat: "interiors",
    title: "Workplace Interiors for a Corporate Headquarters",
    sector: "Commercial",
    location: "India",
    discipline: "Workplace & Office",
    image: "/brand/projects/corporate-workplace.jpg",
  },
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const pending = useRef(false);

  function onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    if (!pending.current) {
      pending.current = true;
      requestAnimationFrame(() => {
        el.style.setProperty("--cx", `${x}px`);
        el.style.setProperty("--cy", `${y}px`);
        pending.current = false;
      });
    }
  }

  return (
    <article
      className="fp-card"
      ref={cardRef}
      data-reveal
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      onPointerMove={onPointerMove}
    >
      <div className="fp-media">
        {imgOk ? (
          <img src={project.image} alt={project.title} onError={() => setImgOk(false)} />
        ) : (
          <div className="fp-media-fallback" aria-hidden="true">
            <span>{project.discipline}</span>
          </div>
        )}
        <span className="fp-cursor">View</span>
      </div>

      <div className="fp-content">
        <div className="fp-meta">
          <div>
            <span className="k">Sector</span>
            <span className="v">{project.sector}</span>
          </div>
          <div>
            <span className="k">Location</span>
            <span className="v">{project.location}</span>
          </div>
          <div>
            <span className="k">Discipline</span>
            <span className="v">{project.discipline}</span>
          </div>
        </div>

        <div className="fp-bottom">
          <h3>{project.title}</h3>
          <span className="fp-tag">View project</span>
        </div>
      </div>
    </article>
  );
}

export default function FeaturedProjects() {
  const [activeCat, setActiveCat] = useState<Cat | "all">("all");
  const sectRef = useRef<HTMLDivElement>(null);

  const list = activeCat === "all" ? PROJECTS : PROJECTS.filter((p) => p.cat === activeCat);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    if (!("IntersectionObserver" in window)) {
      sect.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    sect.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [list.length]);

  return (
    <div className="ucx-fp" ref={sectRef}>
      <div className="fp-wrapper">
        <div className="fp-head" data-reveal>
          <span className="fp-eyebrow">Projects</span>
          <h2 className="fp-title">
            Featured <em>work</em>
          </h2>
          <p className="fp-sub">
            A selection of projects across BIM, interiors, construction support and asset information — delivered
            for teams working across sectors and geographies.
          </p>

          <div className="fp-filters">
            {FILTERS.map((f) => (
              <button
                key={f.cat}
                className={`fp-chip${activeCat === f.cat ? " is-active" : ""}`}
                onClick={() => setActiveCat(f.cat)}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div className="fp-list">
          {list.map((p, i) => (
            <ProjectCard project={p} index={i} key={p.title} />
          ))}
        </div>

        <div className="fp-more" data-reveal>
          <a href="/contact">
            Start a Project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
