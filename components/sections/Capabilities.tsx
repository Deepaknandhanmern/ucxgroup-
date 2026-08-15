"use client";

import { useEffect, useRef } from "react";

interface CapBlock {
  index: string;
  title: string;
  desc: string;
  tags: string[];
  ctaHref: string;
  ctaLabel: string;
}

const BLOCKS: CapBlock[] = [
  {
    index: "01",
    title: "BIM & Digital Delivery",
    desc: "Digital engineering from design through construction.",
    tags: ["BIM & VDC", "Digital Engineering", "BIM Coordination", "Digital Construction", "Automation", "4D/5D"],
    ctaHref: "/bim-digital-delivery",
    ctaLabel: "Explore BIM & Digital Delivery",
  },
  {
    index: "02",
    title: "Design & Interiors",
    desc: "Integrated design from concept to construction-ready documentation.",
    tags: ["Architecture", "Planning", "Interior Design", "Design Development", "Construction Documentation", "BIM-Integrated Interiors"],
    ctaHref: "/interiors",
    ctaLabel: "Explore Design & Interiors",
  },
  {
    index: "03",
    title: "Project & Construction Support",
    desc: "Connecting project information with coordinated execution.",
    tags: ["Project Documentation", "Project Controls", "Quantity & Data", "QA/QC", "Procurement", "Execution Support"],
    ctaHref: "/project-construction-support",
    ctaLabel: "Explore Project Support",
  },
  {
    index: "04",
    title: "Asset & Digital Information",
    desc: "Structuring information for handover, operations and long-term value.",
    tags: ["As-Built BIM", "Asset Information", "COBie", "FM Models", "Digital Handover", "Digital Twin"],
    ctaHref: "/asset-digital-information",
    ctaLabel: "Explore Asset Information",
  },
];

const TAG_ROW = ["BIM & Digital Delivery", "Design & Interiors", "Project Support", "Asset Information"];

export default function Capabilities() {
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
    <div className="ucx-caphub" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        {/* ---------- hero ---------- */}
        <div className="head" id="overview" data-reveal>
          <span className="eyebrow">Capabilities</span>
          <h1 className="heading">Connected expertise for better project delivery.</h1>
          <p className="intro">
            UCX brings together BIM, digital engineering, design, project delivery and asset information through
            one connected delivery framework.
          </p>
          <p className="intro">
            From design development and BIM coordination to construction documentation, execution support and
            digital handover, we help project teams connect information, people and technology across the project
            lifecycle.
          </p>

          <div className="tags">
            {TAG_ROW.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div className="hero-actions">
            <a className="cta-solid" href="/contact">
              Start a Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="cta-ghost" href="#framework">
              Explore Our Capabilities
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v13M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ---------- framework intro ---------- */}
        <div className="framework" id="framework" data-reveal>
          <span className="sub-eyebrow">One Framework</span>
          <h2 className="framework-title">One Framework. Four Connected Capabilities.</h2>
          <div className="framework-copy">
            <p>Projects are rarely limited by one discipline. They are challenged by the gaps between them.</p>
            <p>
              UCX connects design, digital engineering, delivery and asset information through one coordinated
              framework&mdash;helping project teams move from intent to information, and from information to
              execution.
            </p>
          </div>
          <p className="framework-tagline">Different disciplines. One coordinated approach.</p>
        </div>

        {/* ---------- four connected capabilities: modular grid ---------- */}
        <div className="blocks">
          {BLOCKS.map((b) => (
            <div className="mod-card" key={b.index} data-reveal>
              <span className="mod-index" aria-hidden="true">{b.index}</span>
              <h3 className="mod-title">{b.title}</h3>
              <p className="mod-desc">{b.desc}</p>
              <div className="mod-tags">
                {b.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a className="mod-cta" href={b.ctaHref}>
                {b.ctaLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className="closing" data-reveal>
          <p>Not sure which capability fits your project?</p>
          <a className="closing-cta" href="/contact">
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
