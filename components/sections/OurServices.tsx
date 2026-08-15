"use client";

import { useEffect, useRef, useState } from "react";

interface Service {
  num: string;
  title: string;
  desc: string;
  tags: string[];
}

const SERVICES: Service[] = [
  {
    num: "01",
    title: "BIM & Digital Delivery",
    desc: "Digital engineering from design through construction.",
    tags: ["BIM", "VDC", "Digital Engineering", "Coordination", "4D/5D"],
  },
  {
    num: "02",
    title: "Design & Interiors",
    desc: "Integrated design and interior delivery.",
    tags: ["Architecture", "Planning", "Interior Design", "Documentation"],
  },
  {
    num: "03",
    title: "Project & Construction Support",
    desc: "Coordinated support for project delivery.",
    tags: ["Documentation", "Project Controls", "QA/QC", "Execution Support"],
  },
  {
    num: "04",
    title: "Asset & Digital Information",
    desc: "Structured information for handover and operations.",
    tags: ["As-Built BIM", "COBie", "Asset Information", "Digital Handover"],
  },
];

export default function OurServices() {
  const sectRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [figureTop, setFigureTop] = useState(0);
  const [figureTransform, setFigureTransform] = useState("translate(-50%, 0)");

  // cursor spotlight over the grid
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

  // floating figure follows the pointer with easing
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let tx = 0,
      ty = 0,
      cx = 0,
      cy = 0,
      raf: number | null = null;

    function loop() {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      setFigureTransform(`translate(calc(-50% + ${cx}px), ${cy}px)`);
      raf = Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1 ? requestAnimationFrame(loop) : null;
    }

    function onMouseMove(e: MouseEvent) {
      const b = list!.getBoundingClientRect();
      tx = ((e.clientX - b.left) / b.width - 0.5) * 26;
      ty = ((e.clientY - b.top) / b.height - 0.5) * 14;
      if (!raf) raf = requestAnimationFrame(loop);
    }

    list.addEventListener("mousemove", onMouseMove);
    return () => {
      list.removeEventListener("mousemove", onMouseMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  function handleEnter(i: number) {
    setActiveIndex(i);
    const row = rowRefs.current[i];
    if (row) setFigureTop(row.offsetTop + row.offsetHeight / 2);
  }

  function handleListLeave() {
    setActiveIndex(null);
  }

  return (
    <div className="ucx-svc" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head">
          <span className="eyebrow">What We Deliver</span>
          <h2 className="heading">
            What We <span className="stroke">Deliver</span>
          </h2>
          <p className="intro">Integrated capabilities for complex project requirements.</p>
        </div>

        <div className="svc-list" ref={listRef} onMouseLeave={handleListLeave}>
          <div
            className={`svc-figure${activeIndex !== null ? " is-on" : ""}`}
            style={{ top: figureTop, transform: figureTransform }}
          >
            <div className="svc-figure-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span>Image placeholder</span>
            </div>
          </div>

          {SERVICES.map((s, i) => (
            <div
              key={s.num}
              ref={(el) => {
                rowRefs.current[i] = el;
              }}
              className={`svc-row${activeIndex === i ? " is-active" : ""}`}
              onMouseEnter={() => handleEnter(i)}
            >
              <div className="svc-num">{s.num}</div>
              <div className="svc-copy">
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
              <div className="svc-tags">
                {s.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <div className="svc-go">
                <svg viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          ))}
        </div>

        <div className="svc-closing">
          <a className="svc-closing-cta" href="/capabilities">
            Explore All Capabilities
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
