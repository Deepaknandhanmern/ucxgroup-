"use client";

import { useEffect, useRef, useState } from "react";

interface Service {
  num: string;
  title: string;
  desc: string;
  tags: string[];
  img: string;
}

const SERVICES: Service[] = [
  {
    num: "01",
    title: "BIM & Digital Delivery",
    desc: "Digital engineering from design through construction.",
    tags: ["BIM", "VDC", "Digital Engineering", "Coordination", "4D/5D"],
    img: "/brand/services/bim-digital-delivery.png",
  },
  {
    num: "02",
    title: "Design & Interiors",
    desc: "Integrated design and interior delivery.",
    tags: ["Architecture", "Planning", "Interior Design", "Documentation"],
    img: "/brand/services/design-interiors.png",
  },
  {
    num: "03",
    title: "Project & Construction Support",
    desc: "Coordinated support for project delivery.",
    tags: ["Documentation", "Project Controls", "QA/QC", "Execution Support"],
    img: "/brand/services/project-construction-support.png",
  },
  {
    num: "04",
    title: "Asset & Digital Information",
    desc: "Structured information for handover and operations.",
    tags: ["As-Built BIM", "COBie", "Asset Information", "Digital Handover"],
    img: "/brand/services/asset-digital-information.png",
  },
];

function SvcFigureImg({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className="svc-figure-placeholder">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
        <span>Image placeholder</span>
      </div>
    );
  }
  return <img className="svc-figure-img" src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
}

export default function OurServices() {
  const sectRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<HTMLDivElement>(null);
  const rowRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [previewY, setPreviewY] = useState(0);

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

  // keep the preview panel aligned with the currently hovered row on resize
  useEffect(() => {
    if (activeIndex === null) return;
    function onResize() {
      alignPreviewTo(activeIndex as number);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeIndex]);

  // rest the preview next to the first row before anything's been hovered
  useEffect(() => {
    alignPreviewTo(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function alignPreviewTo(i: number) {
    const rowEl = rowRefs.current[i];
    const containerEl = rowsRef.current;
    if (!rowEl || !containerEl) return;
    const rowRect = rowEl.getBoundingClientRect();
    const containerRect = containerEl.getBoundingClientRect();
    setPreviewY(rowRect.top - containerRect.top + rowRect.height / 2);
  }

  function handleRowEnter(i: number) {
    setActiveIndex(i);
    alignPreviewTo(i);
  }

  function handleListLeave() {
    setActiveIndex(null);
  }

  return (
    <div className="ucx-svc" id="services" ref={sectRef}>
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

        <div className="svc-body">
          <div className="svc-rows" ref={rowsRef} onMouseLeave={handleListLeave}>
            {SERVICES.map((s, i) => (
              <div
                key={s.num}
                ref={(el) => {
                  rowRefs.current[i] = el;
                }}
                className={`svc-row${activeIndex === i ? " is-active" : ""}`}
                onMouseEnter={() => handleRowEnter(i)}
              >
                <div className="svc-num">{s.num}</div>
                <div className="svc-copy">
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                  <div className="svc-tags">
                    {s.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                </div>
                <div className="svc-go">
                  <svg viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="svc-preview-col">
            <div
              className={`svc-preview${activeIndex !== null ? " is-on" : ""}`}
              style={{ transform: `translateY(${previewY.toFixed(2)}px) translateY(-50%)` }}
            >
              <SvcFigureImg src={SERVICES[activeIndex ?? 0].img} alt={SERVICES[activeIndex ?? 0].title} />
            </div>
          </div>
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
