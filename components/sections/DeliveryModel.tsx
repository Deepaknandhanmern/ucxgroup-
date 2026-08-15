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

        <div className="row">
          {MODELS.map((m) => (
            <div className="col" key={m.index} data-reveal>
              <span className="col-index">{m.index}</span>
              <h3 className="col-title">{m.title}</h3>
              <p className="col-desc">{m.desc}</p>
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
