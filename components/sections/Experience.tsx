"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: number;
  suffix: string;
  label: string;
  pad: number;
}

const STATS: Stat[] = [
  { value: 30, suffix: "+", label: "Projects Delivered", pad: 2 },
  { value: 7, suffix: "+", label: "Disciplines Covered", pad: 2 },
  { value: 3, suffix: "+", label: "Countries Served", pad: 2 },
];

interface Area {
  index: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  tags: string[];
  ctaLabel: string;
}

const AREAS: Area[] = [
  {
    index: "01",
    title: "Built Environment",
    desc: "Projects spanning complex buildings, developments and infrastructure.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M8 40V14l10-6 10 6v26" />
        <path d="M28 40V20l8-4 8 4v20" />
        <path d="M8 40h32" />
        <path d="M13 22h4M13 29h4M33 26h4M33 32h4" />
      </svg>
    ),
    tags: ["Commercial & Mixed-Use", "Residential", "Industrial", "Infrastructure", "Specialized Projects"],
    ctaLabel: "Explore Built Environment Projects",
  },
  {
    index: "02",
    title: "Design & Interiors",
    desc: "Design and delivery across diverse interior environments.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M6 40V17.5L24 6l18 11.5V40H6Z" />
        <path d="M6 30h13V40M19 30h23" />
        <path d="M28 30V19.5h9V30" />
      </svg>
    ),
    tags: ["Workplace & Office", "Hospitality & Retail", "Residential Interiors", "Custom Furniture", "Modular Interiors"],
    ctaLabel: "Explore Interior Projects",
  },
  {
    index: "03",
    title: "Digital Project Experience",
    desc: "Technology-led delivery for complex project requirements.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M24 6 41 15.5v19L24 44 7 34.5v-19L24 6Z" />
        <path d="M7 15.5 24 25l17-9.5M24 25v19" />
        <path d="M15.5 10.75 32.5 20.25v9.5" />
      </svg>
    ),
    tags: ["BIM & VDC", "Scan-to-BIM", "As-Built BIM", "Digital Engineering", "Prefabrication"],
    ctaLabel: "Explore Digital Projects",
  },
];

function StatCounter({ stat }: { stat: Stat }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [n, setN] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let started = false;
    function run() {
      if (started) return;
      started = true;
      const duration = 1400;
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setN(Math.round(eased * stat.value));
        if (t < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }

    if (!("IntersectionObserver" in window)) {
      run();
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && run()),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [stat.value]);

  return (
    <span className="stat-value" ref={ref}>
      {String(n).padStart(stat.pad, "0")}
      <span className="stat-suffix">{stat.suffix}</span>
    </span>
  );
}

export default function Experience() {
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
    <div className="ucx-experience" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        {/* ---------- hero ---------- */}
        <div className="head" id="overview" data-reveal>
          <span className="eyebrow">Experience</span>
          <h1 className="heading">Experience Built Through Collaboration</h1>
          <p className="intro">
            From architecture and interiors to BIM, digital engineering, documentation and project support, UCX
            brings multidisciplinary capabilities together across the built environment.
          </p>
          <p className="intro">
            Our experience spans different project types, delivery stages and technical requirements, allowing us
            to adapt our approach to each project team.
          </p>
          <a className="head-cta" href="#areas">
            View Selected Projects
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v13M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>

        {/* ---------- stats ---------- */}
        <div className="stats-block" data-reveal>
          <span className="sub-eyebrow">Experience at a Glance</span>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <StatCounter stat={s} />
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <p className="stats-tagline">Experience across disciplines. Delivery across borders.</p>
        </div>

        {/* ---------- where experience applies ---------- */}
        <div className="areas-head" id="areas" data-reveal>
          <span className="sub-eyebrow">Where Our Experience Applies</span>
          <p className="areas-intro">Across projects where design, information and delivery need to work together.</p>
        </div>

        <div className="areas">
          {AREAS.map((a) => (
            <div className="area" key={a.index} data-reveal>
              <div className="area-top">
                <span className="area-index">{a.index}</span>
                <span className="area-icon">{a.icon}</span>
              </div>
              <h3 className="area-title">{a.title}</h3>
              <p className="area-desc">{a.desc}</p>
              <div className="area-tags">
                {a.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a className="area-cta" href="/projects">
                {a.ctaLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        <div className="closing" data-reveal>
          <p>Want to see how this experience applies to your project?</p>
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
