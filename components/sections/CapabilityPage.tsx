"use client";

import { useEffect, useRef, useState } from "react";

export interface CapabilityItem {
  title: string;
  desc: string;
  icon: React.ReactNode;
}

export interface CapabilityPageProps {
  index: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: CapabilityItem[];
  process: [string, string, string];
  heroMotif: React.ReactNode;
  /** Optional real photo — shown in place of heroMotif once the file exists at this path. */
  heroImage?: string;
}

export default function CapabilityPage({ index, eyebrow, title, intro, items, process, heroMotif, heroImage }: CapabilityPageProps) {
  const sectRef = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(true);

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
    <div className="ucx-cap" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        {/* ---------- hero ---------- */}
        <div className="hero">
          <div className="hero-copy" data-reveal>
            <span className="ghost-index" aria-hidden="true">{index}</span>
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="heading">{title}</h1>
            <p className="intro">{intro}</p>
            <a className="head-cta" href="#capabilities">
              Explore Capabilities
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v13M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>

          <div className="hero-motif" data-reveal aria-hidden="true">
            {heroImage && imgOk ? (
              <img className="hero-motif-img" src={heroImage} alt="" onError={() => setImgOk(false)} />
            ) : (
              heroMotif
            )}
          </div>
        </div>

        {/* ---------- process band ---------- */}
        <div className="band" data-reveal>
          <span className="band-step">{process[0]}</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">{process[1]}</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">{process[2]}</span>
        </div>

        {/* ---------- capabilities grid ---------- */}
        <div className="cap-head" id="capabilities" data-reveal>
          <span className="sub-eyebrow">Capabilities</span>
        </div>
        <div className="grid">
          {items.map((it) => (
            <div className="card" key={it.title} data-reveal>
              <span className="card-icon">{it.icon}</span>
              <h3 className="card-title">{it.title}</h3>
              <p className="card-desc">{it.desc}</p>
            </div>
          ))}
        </div>

        {/* ---------- closing ---------- */}
        <div className="closing" data-reveal>
          <p>Have a project that needs this capability?</p>
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
