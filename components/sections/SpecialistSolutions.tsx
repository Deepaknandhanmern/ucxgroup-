"use client";

import { useEffect, useRef, useState } from "react";

interface Card {
  index: string;
  title: string;
  flow: string;
  img: string;
}

const CARDS: Card[] = [
  { index: "01", title: "Scan-to-BIM", flow: "Existing conditions → Digital environments", img: "/brand/specialist/scan-to-bim-v2.png" },
  { index: "02", title: "Prefabrication", flow: "BIM → Fabrication → Modular delivery", img: "/brand/specialist/prefabrication-v2.png" },
  { index: "03", title: "Heritage", flow: "Existing assets → Structured digital information", img: "/brand/specialist/heritage-v2.png" },
  { index: "04", title: "Automation & AI", flow: "Smarter workflows → Better delivery", img: "/brand/specialist/automation-ai-v2.png" },
  { index: "05", title: "Parametric Systems", flow: "Design → Logic → Adaptability", img: "/brand/specialist/parametric-systems-v2.png" },
];

function CardImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return <img className="card-image-photo" src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
  }
  return (
    <>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
      <span>Image placeholder</span>
    </>
  );
}

export default function SpecialistSolutions() {
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

  return (
    <div className="ucx-special" id="solutions" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head">
          <div className="head-text">
            <span className="eyebrow">Specialist Solutions</span>
            <h2 className="heading">Beyond the Standard</h2>
            <p className="intro">Specialist workflows for complex project requirements.</p>
          </div>
        </div>

        <div className="slider">
          <div className="track">
            {[...CARDS, ...CARDS].map((c, i) => (
              <article className="card" key={`${c.index}-${i}`}>
                <div className="card-image">
                  <CardImage src={c.img} alt={c.title} />
                </div>
                <div className="card-body">
                  <span className="card-index">{c.index}</span>
                  <h3>{c.title}</h3>
                  <p className="card-flow">{c.flow}</p>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="closing">
          <a className="closing-cta" href="/specialist-solutions">
            Explore Specialist Solutions
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
