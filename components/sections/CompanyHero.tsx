"use client";

import { useEffect, useRef, useState } from "react";

export default function CompanyHero() {
  const sectRef = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(true);

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
    <div className="ucx-companyhero" id="overview" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>

      <div className="wrapper">
        <div className="hero-copy">
          <h1 className="heading">
            Built on Collaboration.
            <br />
            Driven by <em>Possibility.</em>
          </h1>

          <p className="intro">
            UCX is an India-based BIM and digital delivery partner connecting design, technology and project
            delivery across the built environment, bringing architecture, interiors, digital engineering and
            delivery support together to help teams work with greater clarity, coordination and capacity.
          </p>

          <a className="hero-cta" href="#approach">
            Our Story
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="hero-frame">
          {imgOk ? (
            <img src="/brand/about/hero.jpg" alt="UCX studio" onError={() => setImgOk(false)} />
          ) : (
            <div className="hero-frame-fallback" aria-hidden="true">
              <svg viewBox="0 0 120 150" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M14 140V56L60 18l46 38v84" />
                <path d="M14 140h92" />
                <path d="M40 140V88h40v52" />
                <path d="M24 66h10M24 80h10M24 94h10M86 66h10M86 80h10" />
              </svg>
            </div>
          )}
          <span className="hero-frame-caption">Design &amp; Delivery, India</span>
        </div>
      </div>
    </div>
  );
}
