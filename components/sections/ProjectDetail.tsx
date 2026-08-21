"use client";

import { useState } from "react";
import { CAT_LABELS, type Project } from "@/lib/projects";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export default function ProjectDetail({ project, more }: { project: Project; more: Project[] }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div className="ucx-pd">
      <div className="pd-bg-grid" aria-hidden="true"></div>
      <div className="pd-wrapper">
        <Breadcrumbs
          variant="light"
          items={[{ label: "Home", href: "/" }, { label: "Projects", href: "/projects" }, { label: project.title }]}
        />
        <a className="pd-back" href="/projects">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to Projects
        </a>

        <span className="pd-eyebrow">{project.discipline}</span>
        <h1 className="pd-title">{project.title}</h1>
        <p className="pd-summary">{project.summary}</p>

        <div className="pd-hero">
          {imgOk ? (
            <img src={project.image} alt={project.title} onError={() => setImgOk(false)} />
          ) : (
            <div className="pd-hero-fallback" aria-hidden="true">
              <span>{project.discipline}</span>
            </div>
          )}
        </div>

        <div className="pd-layout">
          <div className="pd-body">
            {project.body.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <aside className="pd-side">
            <div className="pd-side-block">
              <span className="k">Sector</span>
              <span className="v">{CAT_LABELS[project.cat]}</span>
            </div>
            <div className="pd-side-block">
              <span className="k">Location</span>
              <span className="v">{project.location}</span>
            </div>
            <div className="pd-side-block">
              <span className="k">Discipline</span>
              <span className="v">{project.discipline}</span>
            </div>
            <div className="pd-side-block">
              <span className="k">Project Stage</span>
              <span className="v">{project.stage}</span>
            </div>
            <div className="pd-side-block">
              <span className="k">Technology</span>
              <span className="v">{project.technology.join(" · ")}</span>
            </div>
            <div className="pd-side-block">
              <span className="k">Scope</span>
              <ul className="pd-scope">
                {project.scope.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <div className="pd-cta">
          <div>
            <span className="pd-cta-eyebrow">Have a similar project in mind?</span>
            <h3>Let&apos;s talk about what you&apos;re building.</h3>
          </div>
          <a href="/contact" className="pd-cta-link">
            Start a Collaboration
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {more.length > 0 && (
          <div className="pd-more">
            <span className="pd-more-eyebrow">More Projects</span>
            <div className="pd-more-grid">
              {more.map((m) => (
                <a className="pd-more-card" href={`/projects/${m.slug}`} key={m.slug}>
                  <span className="pd-more-discipline">{m.discipline}</span>
                  <h4>{m.title}</h4>
                  <span className="pd-more-location">{m.location}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
