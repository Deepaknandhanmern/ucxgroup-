"use client";

import { useEffect, useRef } from "react";

const TAGS = ["AEC Innovation", "Digital Solutions", "Co-Creation"];

interface Stage {
  index: string;
  title: string;
  subline: string;
  tags: string[];
}

const STAGES: Stage[] = [
  { index: "01", title: "Identify", subline: "Find the problem.", tags: ["Industry challenges", "Project gaps", "Emerging opportunities"] },
  { index: "02", title: "Co-Create", subline: "Develop the approach.", tags: ["Ideas", "Research", "Expertise", "Solution design"] },
  { index: "03", title: "Prototype", subline: "Build and test.", tags: ["Workflows", "Models", "Tools", "Simulations", "Pilots"] },
  { index: "04", title: "Deploy", subline: "Apply what works.", tags: ["Projects", "Processes", "Systems", "Scalable solutions"] },
];

export default function LabHero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
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
  }, []);

  return (
    <div className="ucx-labhero" ref={rootRef}>
      <div className="wrapper">
        {/* ---------- hero ---------- */}
        <div className="hero" data-reveal>
          <h1 className="heading">What Can We Build Together?</h1>
          <p className="intro">
            Exploring practical solutions to real-world AEC challenges. The UCX Collaboration Lab brings industry
            expertise, design, BIM and technology together to explore problems, test ideas and develop solutions
            for the built environment.
          </p>
          <div className="tags">
            {TAGS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <div className="hero-actions">
            <a className="cta-solid" href="/contact">
              Propose a Collaboration
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="cta-ghost" href="#domains">
              Explore Live Ideas
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v13M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ---------- manifesto ---------- */}
        <div className="manifesto" data-reveal>
          <h2>
            Most Firms Deliver Services. We Build Solutions, <em>Together.</em>
          </h2>
          <span className="manifesto-flow">Challenge <i>&rarr;</i> Collaboration <i>&rarr;</i> Solution</span>
          <p>
            The Lab starts with real industry problems. We bring the right expertise together, develop practical
            approaches and test them through prototypes, pilots and real project environments.
          </p>
        </div>

        {/* ---------- 4-stage process ---------- */}
        <div className="process-head" data-reveal>
          <h3>From Challenge to Applied Solution</h3>
        </div>
        <ol className="stages">
          {STAGES.map((s, i) => (
            <li className="stage" data-reveal key={s.index}>
              <div className="stage-top">
                <span className="stage-dot">
                  <span>{s.index}</span>
                </span>
                {i < STAGES.length - 1 && (
                  <span className="stage-connector" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="stage-body">
                <h4>{s.title}</h4>
                <p className="stage-subline">{s.subline}</p>
                <p className="stage-tags">{s.tags.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
