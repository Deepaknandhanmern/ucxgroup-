"use client";

import { useEffect, useRef } from "react";

interface Reason {
  index: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
}

const REASONS: Reason[] = [
  {
    index: "01",
    title: "Integrated Expertise",
    desc: "Design, BIM, digital engineering and delivery support within one connected framework — not five vendors stitched together after the fact.",
    icon: (
      <svg viewBox="0 0 48 48">
        <circle cx="19" cy="24" r="13" />
        <circle cx="29" cy="24" r="13" />
      </svg>
    ),
  },
  {
    index: "02",
    title: "Scalable Capacity",
    desc: "Extend your team without adding permanent delivery overhead.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M9 38V28M19 38V17M29 38V23M39 38V9" />
        <path d="M5 38h38" />
      </svg>
    ),
  },
  {
    index: "03",
    title: "Technology-Enabled",
    desc: "BIM, automation, data and digital workflows integrated into project delivery.",
    icon: (
      <svg viewBox="0 0 48 48">
        <rect x="14" y="14" width="20" height="20" rx="2" />
        <path d="M20 14V6M28 14V6M20 42v-8M28 42v-8M14 20H6M14 28H6M42 20h-8M42 28h-8" />
      </svg>
    ),
  },
  {
    index: "04",
    title: "Delivery Discipline",
    desc: "Structured workflows, coordination and QA/QC aligned to project requirements.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M24 5 40 11v13c0 11-7 17-16 19-9-2-16-8-16-19V11Z" />
        <path d="M17 24l5 5 9-11" />
      </svg>
    ),
  },
  {
    index: "05",
    title: "International Delivery",
    desc: "India-based delivery capability supporting international project teams.",
    icon: (
      <svg viewBox="0 0 48 48">
        <circle cx="24" cy="24" r="18" />
        <path d="M6 24h36M24 6c6 6 6 30 0 36M24 6c-6 6-6 30 0 36" />
      </svg>
    ),
  },
];

export default function WhyChooseUs() {
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
    <div className="ucx-why2" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head-row" data-reveal>
          <div className="head-text">
            <span className="eyebrow">Why UCX</span>
            <h2 className="heading">
              <span className="ln">More Than Capability.</span>
              <span className="ln stroke">A Connected Delivery Partner.</span>
            </h2>
          </div>

          <div className="compass" aria-hidden="true">
            <svg className="compass-svg" viewBox="0 0 200 200">
              <circle className="compass-ring" cx="100" cy="100" r="82" />
              <circle className="compass-ring" cx="100" cy="100" r="68" />

              <line className="compass-tick" x1="100" y1="18" x2="100" y2="34" />
              <line className="compass-tick" x1="100" y1="166" x2="100" y2="182" />
              <line className="compass-tick" x1="18" y1="100" x2="34" y2="100" />
              <line className="compass-tick" x1="166" y1="100" x2="182" y2="100" />

              <line className="compass-tick minor" x1="41.7" y1="41.7" x2="52.4" y2="52.4" />
              <line className="compass-tick minor" x1="158.3" y1="41.7" x2="147.6" y2="52.4" />
              <line className="compass-tick minor" x1="41.7" y1="158.3" x2="52.4" y2="147.6" />
              <line className="compass-tick minor" x1="158.3" y1="158.3" x2="147.6" y2="147.6" />

              <text className="compass-n" x="100" y="14" textAnchor="middle">N</text>
              <text className="compass-label" x="100" y="196" textAnchor="middle">S</text>
              <text className="compass-label" x="10" y="104" textAnchor="middle">W</text>
              <text className="compass-label" x="190" y="104" textAnchor="middle">E</text>

              <g className="compass-needle">
                <polygon className="needle-north" points="100,50 93,100 107,100" />
                <polygon className="needle-south" points="100,150 93,100 107,100" />
              </g>
              <circle className="compass-pivot" cx="100" cy="100" r="5" />
            </svg>
            <span className="compass-caption">Global Delivery</span>
          </div>
        </div>

        <div className="why-grid">
          {REASONS.map((r, i) => (
            <div className={`why-card${i === 0 ? " is-featured" : ""}`} key={r.index} data-reveal>
              <span className="why-ghost" aria-hidden="true">{r.index}</span>
              <span className="why-icon">{r.icon}</span>
              <h3>{r.title}</h3>
              <p>{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
