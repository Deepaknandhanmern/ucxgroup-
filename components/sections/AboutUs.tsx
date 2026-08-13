"use client";

import { useEffect, useRef } from "react";

export default function AboutUs() {
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
    <div className="ucx-about" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="hero">
          <h1 className="heading">
            <span className="fill">About</span>
            <span className="stroke">Us</span>
          </h1>
        </div>

        <div className="content">
          <div className="left-col">
            <div>
              <span className="label">Fig. 01 / Studio</span>
              <p>Luxurious Interior and Industrial Design.</p>
            </div>
            <div className="rule"></div>
            <div>
              <span className="label">Fig. 02 / Approach</span>
              <p>Modern Elegance: designs featuring clean lines, neutral palettes, and high-quality materials.</p>
            </div>
          </div>

          <figure className="frame main-frame">
            <img
              src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=80"
              alt="Luxurious modern living room interior with curved sofa and floor-to-ceiling windows"
            />
            <span className="corner tl"></span>
            <span className="corner tr"></span>
            <span className="corner bl"></span>
            <span className="corner br"></span>
            <figcaption className="frame-caption">Fig. 03 / Residence, Miami FL</figcaption>
          </figure>

          <div className="right-col">
            <figure className="frame side-frame">
              <img
                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=700&q=80"
                alt="Elegant minimalist bathroom interior detail"
              />
              <span className="corner tl"></span>
              <span className="corner tr"></span>
              <span className="corner bl"></span>
              <span className="corner br"></span>
              <figcaption className="frame-caption">Fig. 04 / Detail</figcaption>
            </figure>

            <span className="label">Fig. 05 / Philosophy</span>
            <h3>Our Philosophy</h3>
            <p>
              At UCX, we believe in creating luxurious, personalized environments that reflect our clients tastes
              and lifestyles.
            </p>

            <a href="/about-us/" className="cta-btn">
              More About Us
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
