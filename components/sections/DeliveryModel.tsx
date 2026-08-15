"use client";

import { useEffect, useRef } from "react";

interface Model {
  index: string;
  title: string;
  desc: string;
}

const MODELS: Model[] = [
  { index: "01", title: "Project Delivery", desc: "Defined scopes. Clear deliverables." },
  { index: "02", title: "Dedicated Teams", desc: "Extend your team with UCX capability." },
  { index: "03", title: "Flexible Delivery", desc: "Scale when workloads and deadlines change." },
  { index: "04", title: "Strategic Partnerships", desc: "Build long-term delivery capability." },
];

export default function DeliveryModel() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
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
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ucx-model" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="wrapper">
        <div className="head" data-reveal>
          <span className="eyebrow">How We Work</span>
          <h2 className="heading">Built Around Your Delivery Model</h2>
          <p className="intro">Flexible ways to work with UCX&mdash;built around your project, capacity and growth.</p>
        </div>

        <div className="dm-track">
          <span className="dm-spine" aria-hidden="true"></span>
          {MODELS.map((m, i) => (
            <div className={`dm-pin ${i % 2 === 0 ? "is-left" : "is-right"}`} key={m.index} data-reveal>
              <div className="dm-pin-card">
                <svg className="dm-pin-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M16 3a1 1 0 0 1 .117 1.993l-.117 .007v4.764l1.894 3.789a1 1 0 0 1 .1 .331l.006 .116v2a1 1 0 0 1 -.883 .993l-.117 .007h-4v4a1 1 0 0 1 -1.993 .117l-.007 -.117v-4h-4a1 1 0 0 1 -.993 -.883l-.007 -.117v-2a1 1 0 0 1 .06 -.34l.046 -.107l1.894 -3.791v-4.762a1 1 0 0 1 -.117 -1.993l.117 -.007h8z" />
                </svg>
                <span className="dm-pin-number">{m.index}</span>
                <h3 className="dm-pin-title">{m.title}</h3>
                <p className="dm-pin-desc">{m.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="closing" data-reveal>
          <a className="closing-cta" href="/collaboration-lab">
            Explore How We Work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
