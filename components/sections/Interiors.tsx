"use client";

import { useEffect, useRef } from "react";

const CATEGORIES = [
  { n: "01", name: "Workplace & Office" },
  { n: "02", name: "Hospitality & Retail" },
  { n: "03", name: "Residential Interiors" },
  { n: "04", name: "Custom Furniture" },
  { n: "05", name: "Modular Interiors" },
];

export default function Interiors() {
  const sectRef = useRef<HTMLDivElement>(null);

  // cursor spotlight
  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;

    let pending = false;
    let px = 0;
    let py = 0;

    function onPointerMove(e: PointerEvent) {
      const b = sect!.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          sect!.style.setProperty("--mx", px + "px");
          sect!.style.setProperty("--my", py + "px");
          pending = false;
        });
      }
    }
    function onPointerEnter() {
      sect!.classList.add("is-hot");
    }
    function onPointerLeave() {
      sect!.classList.remove("is-hot");
    }

    sect.addEventListener("pointermove", onPointerMove, { passive: true });
    sect.addEventListener("pointerenter", onPointerEnter);
    sect.addEventListener("pointerleave", onPointerLeave);
    return () => {
      sect.removeEventListener("pointermove", onPointerMove);
      sect.removeEventListener("pointerenter", onPointerEnter);
      sect.removeEventListener("pointerleave", onPointerLeave);
    };
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
  }, []);

  return (
    <div className="ucx-interiors" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        {/* ---------- hero ---------- */}
        <div className="hero">
          <div className="hero-copy" data-reveal>
            <img className="brand-logo" src="/brand/interiors/logo.png" alt="SpayceX" />
            <span className="eyebrow">Interiors</span>
            <h1 className="heading">Design, Documentation &amp; Delivery for Interior Environments</h1>
            <p className="intro">
              UCX combines interior design expertise with BIM, technical documentation, coordination and execution
              support to connect design intent with project delivery.
            </p>
          </div>

          <div className="hero-panel" data-reveal>
            <svg className="plan-motif" viewBox="0 0 320 260" aria-hidden="true">
              <rect className="plan-wall" x="14" y="14" width="292" height="232" rx="2" />
              <line className="plan-wall" x1="150" y1="14" x2="150" y2="120" />
              <line className="plan-wall" x1="150" y1="120" x2="306" y2="120" />
              <path className="plan-door" d="M150,120 A56,56 0 0 1 206,176" />
              <line className="plan-door" x1="150" y1="120" x2="150" y2="176" />
              <rect className="plan-item" x="34" y="34" width="72" height="40" rx="3" />
              <rect className="plan-item" x="34" y="150" width="56" height="72" rx="3" />
              <rect className="plan-item" x="184" y="34" width="100" height="60" rx="3" />
              <circle className="plan-item" cx="250" cy="180" r="26" />
              <g className="plan-ticks">
                <line x1="14" y1="252" x2="306" y2="252" />
                <line x1="14" y1="246" x2="14" y2="258" />
                <line x1="150" y1="246" x2="150" y2="258" />
                <line x1="306" y1="246" x2="306" y2="258" />
              </g>
            </svg>
          </div>
        </div>

        {/* ---------- process band (inverted) ---------- */}
        <div className="band" data-reveal>
          <span className="band-step">Design</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">Documentation</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">Delivery</span>
        </div>

        {/* ---------- project categories ---------- */}
        <div className="cat-head" data-reveal>
          <span className="sub-eyebrow">Project Categories</span>
        </div>
        <div className="categories">
          {CATEGORIES.map((c) => (
            <div className="cat-card" key={c.n} data-reveal>
              <span className="cat-index">{c.n}</span>
              <div className="cat-thumb">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
              </div>
              <span className="cat-name">{c.name}</span>
            </div>
          ))}
        </div>

        {/* ---------- closing ---------- */}
        <div className="closing" data-reveal>
          <p>Have an interiors project in mind?</p>
          <a className="closing-cta" href="/contact">
            Start a Collaboration
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
