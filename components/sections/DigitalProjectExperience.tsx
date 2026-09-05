"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";
import { attachGlintOnView } from "@/components/ui/glintOnView";
import { DIGITAL_FILTERS, type DigitalCat, type Project } from "@/lib/projects";

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [imgOk, setImgOk] = useState(true);
  const pending = useRef(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    return attachGlintOnView(el);
  }, []);

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
      className="dpe-card"
      href={`/projects/${project.slug}`}
      ref={cardRef}
      data-reveal
      style={{ transitionDelay: `${(index % 6) * 60}ms` }}
      onPointerMove={onPointerMove}
    >
      <div className="dpe-media">
        {imgOk ? (
          <img src={project.image} alt={project.title} loading="lazy" onError={() => setImgOk(false)} />
        ) : (
          <div className="dpe-media-fallback" aria-hidden="true">
            <span>{project.discipline}</span>
          </div>
        )}
        <span className="dpe-cursor">View</span>
      </div>

      <div className="dpe-content">
        <div className="dpe-meta">
          <div>
            <span className="k">Discipline</span>
            <span className="v">{project.discipline}</span>
          </div>
          <div>
            <span className="k">Location</span>
            <span className="v">{project.location}</span>
          </div>
        </div>

        <div className="dpe-bottom">
          <h3>{project.title}</h3>
          <span className="dpe-tag">View project</span>
        </div>
      </div>
    </a>
  );
}

export default function DigitalProjectExperience({ projects }: { projects: Project[] }) {
  const sectRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();
  const [activeCat, setActiveCat] = useState<DigitalCat | "all">("all");

  const digitalProjects = useMemo(() => projects.filter((p) => p.digitalCategory), [projects]);
  const filtered = useMemo(
    () => (activeCat === "all" ? digitalProjects : digitalProjects.filter((p) => p.digitalCategory === activeCat)),
    [activeCat, digitalProjects]
  );

  // Header mega-menu category links land here as ?filter=bim-vdc etc.
  useEffect(() => {
    const filter = new URLSearchParams(window.location.search).get("filter");
    if (filter && DIGITAL_FILTERS.some((f) => f.cat === filter)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deferred to the client to avoid a hydration mismatch, same pattern as FeaturedProjects
      setActiveCat(filter as DigitalCat);
    }
  }, []);

  // scroll reveal
  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;

    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 80}ms`;
    });

    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered.length]);

  return (
    <div className="ucx-dpe" ref={sectRef}>
      <div className="grid-overlay" aria-hidden="true"></div>

      <div className="dpe-body" ref={bodyGlowRef}>
        <div className="grid-glow" aria-hidden="true"></div>
        <div className="cursor-haze" aria-hidden="true"></div>

        <div className="wrapper">
          <div id="categories" className="dpe-body-head" data-reveal>
            <span className="sub-eyebrow">03 — Digital Project Experience</span>
            <p className="dpe-body-desc">
              Digital delivery is at the core of UCX&rsquo;s approach. We use BIM, digital engineering, coordination,
              automation and structured information workflows to connect project teams and improve delivery
              certainty.
            </p>

            <div className="dpe-filters">
              {DIGITAL_FILTERS.map((f) => (
                <button
                  key={f.cat}
                  className={`dpe-chip${activeCat === f.cat ? " is-active" : ""}`}
                  onClick={() => setActiveCat(f.cat)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="dpe-list">
            {filtered.length > 0 ? (
              filtered.map((p, i) => <ProjectCard project={p} index={i} key={p.slug} />)
            ) : (
              <p className="dpe-empty" data-reveal>
                No projects published in this category yet — check back soon, or{" "}
                <a href="/contact">get in touch</a> about work in this space.
              </p>
            )}
          </div>

          <div className="dpe-more" data-reveal>
            <a href="/contact">
              Start a Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
