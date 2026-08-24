"use client";

import { useEffect, useRef } from "react";

export default function CompanyHero() {
  const sectRef = useRef<HTMLDivElement>(null);

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
            Driven by Possibility.
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
      </div>
    </div>
  );
}
