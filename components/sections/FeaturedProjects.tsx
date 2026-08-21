"use client";

import { useEffect, useRef, useState } from "react";
import { CAT_LABELS, FILTERS, PROJECTS, type Cat, type Project } from "@/lib/projects";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const pending = useRef(false);

  function onPointerMove(e: React.PointerEvent<HTMLAnchorElement>) {
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
    <a
      className="fp-card"
      href={`/projects/${project.slug}`}
      ref={cardRef}
      data-reveal
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      onPointerMove={onPointerMove}
    >
      <div className="fp-media">
        {imgOk ? (
          <img src={project.image} alt={project.title} loading="lazy" onError={() => setImgOk(false)} />
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
            <span className="v">{CAT_LABELS[project.cat]}</span>
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
    </a>
  );
}

export default function FeaturedProjects() {
  const [activeCat, setActiveCat] = useState<Cat | "all">("all");
  const [isInteriorsFilter, setIsInteriorsFilter] = useState(false);
  const sectRef = useRef<HTMLDivElement>(null);

  const list = activeCat === "all" ? PROJECTS : PROJECTS.filter((p) => p.cat === activeCat);

  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get("filter");
    if (filter && FILTERS.some((f) => f.cat === filter)) setActiveCat(filter as Cat);
    setIsInteriorsFilter(filter === "interiors");
  }, []);

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
      {!isInteriorsFilter && <div className="fp-bg-grid" aria-hidden="true"></div>}
      <div className="fp-wrapper">
        <div className="fp-head" data-reveal>
          <span className="fp-eyebrow">01 — Built Environment</span>
          <h2 className="fp-title">
            Featured <em>work</em>
          </h2>
          <p className="fp-sub">
            A selection of projects across commercial, residential, industrial and infrastructure environments —
            delivered for teams working across sectors and geographies.
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
          {list.length > 0 ? (
            list.map((p, i) => <ProjectCard project={p} index={i} key={p.slug} />)
          ) : (
            <p className="fp-empty" data-reveal>
              No projects published in this category yet — check back soon, or{" "}
              <a href="/contact">get in touch</a> about work in this space.
            </p>
          )}
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
