"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

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

const DURATION = 5200;
const TICK = 50;

export default function WhyChooseUs() {
  const sectRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const [paused, setPaused] = useState(false);
  const [indicator, setIndicator] = useState({ top: 0, height: 0 });
  const reduceMotionRef = useRef(false);

  useEffect(() => {
    reduceMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

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

  // auto-advance timer, paused on hover/focus, skipped for reduced motion
  useEffect(() => {
    if (paused || reduceMotionRef.current) return;
    const id = setInterval(() => {
      setProgress((p) => {
        const next = p + TICK / DURATION;
        if (next >= 1) {
          setActive((a) => (a + 1) % REASONS.length);
          return 0;
        }
        return next;
      });
    }, TICK);
    return () => clearInterval(id);
  }, [paused]);

  // slide the rail indicator to the active row
  useLayoutEffect(() => {
    const el = rowRefs.current[active];
    if (!el) return;
    const sync = () => setIndicator({ top: el.offsetTop, height: el.offsetHeight });
    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [active]);

  function handleSelect(i: number) {
    setActive(i);
    setProgress(0);
  }

  const current = REASONS[active];

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
        </div>

        <div
          className="why-stage-wrap"
          data-reveal
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          <div className="why-nav" role="tablist" aria-label="Reasons to choose UCX" ref={navRef}>
            <div
              className="why-nav-indicator"
              aria-hidden="true"
              style={{ transform: `translateY(${indicator.top}px)`, height: indicator.height }}
            />
            {REASONS.map((r, i) => (
              <button
                key={r.index}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                type="button"
                role="tab"
                aria-selected={active === i}
                className={`why-nav-row${active === i ? " is-active" : ""}`}
                onClick={() => handleSelect(i)}
              >
                <span className="why-nav-index">{r.index}</span>
                <span className="why-nav-title">{r.title}</span>
                <span
                  className="why-nav-fill"
                  style={active === i ? { transform: `scaleX(${progress})` } : { transform: "scaleX(0)" }}
                />
              </button>
            ))}
          </div>

          <div className="why-stage" role="tabpanel" aria-live="polite">
            <span className="why-stage-ghost" aria-hidden="true">{current.index}</span>
            <div className="why-stage-inner" key={active}>
              <div className="why-stage-icon">
                <svg className="stage-ring" viewBox="0 0 108 108" aria-hidden="true">
                  <circle cx="54" cy="54" r="50" pathLength="100" />
                </svg>
                {current.icon}
              </div>
              <span className="why-stage-count">
                {String(active + 1).padStart(2, "0")} / {String(REASONS.length).padStart(2, "0")}
              </span>
              <h3>{current.title}</h3>
              <p>{current.desc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
