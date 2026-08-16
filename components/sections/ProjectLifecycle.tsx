"use client";

import { useEffect, useRef } from "react";

interface Stage {
  index: string;
  title: string;
  items: string[];
}

const STAGES: Stage[] = [
  { index: "01", title: "Design", items: ["Architecture", "Interiors", "Design Development"] },
  { index: "02", title: "Digital Delivery", items: ["BIM", "VDC", "Coordination", "Digital Engineering"] },
  { index: "03", title: "Documentation", items: ["Construction Documentation", "QA/QC", "Data"] },
  { index: "04", title: "Construction", items: ["Execution Support", "Fabrication", "Coordination"] },
  { index: "05", title: "Handover", items: ["As-Built BIM", "Asset Information", "Digital Handover"] },
];

export default function ProjectLifecycle() {
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
    <div className="ucx-lifecycle" ref={rootRef}>
      <div className="pl-grid" aria-hidden="true"></div>
      <div className="pl-wrapper">
        <div className="pl-head" data-reveal>
          <span className="pl-eyebrow">Experience</span>
          <h2 className="pl-title">Experience Across the Project Lifecycle</h2>
          <p className="pl-intro">
            UCX&apos;s experience extends across multiple stages of the project lifecycle, allowing clients to
            engage us for a defined scope or as part of a connected delivery team.
          </p>
          <span className="pl-sub">From Design Intent to Asset Information</span>
        </div>

        <ol className="pl-track">
          {STAGES.map((s, i) => (
            <li className="pl-stage" data-reveal key={s.index}>
              <div className="pl-stage-top">
                <span className="pl-dot">
                  <span className="pl-dot-index">{s.index}</span>
                </span>
                {i < STAGES.length - 1 && (
                  <span className="pl-connector" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </span>
                )}
              </div>
              <div className="pl-stage-body">
                <h3 className="pl-stage-title">{s.title}</h3>
                <p className="pl-stage-items">{s.items.join(" · ")}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
