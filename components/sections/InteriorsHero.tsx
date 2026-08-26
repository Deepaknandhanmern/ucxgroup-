"use client";

import { useEffect, useRef } from "react";

export default function InteriorsHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const hero = heroRef.current;
    const media = mediaRef.current;
    if (!wrap || !hero || !media) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      media.style.setProperty("--expand", "1");
      return;
    }

    let raf = 0;
    let pinStart = 0;
    let pinEnd = 0;
    let travel = 0;

    const measure = () => {
      const topOffset = window.innerWidth <= 640 ? 66 : 76;
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      travel = wrap.offsetHeight - hero.offsetHeight;
      pinStart = wrapTop - topOffset;
      pinEnd = pinStart + travel;
      update();
    };

    const update = () => {
      raf = 0;
      const topOffset = window.innerWidth <= 640 ? 66 : 76;
      const y = window.scrollY;

      if (travel <= 0 || y <= pinStart) {
        hero.style.position = "absolute";
        hero.style.top = "0";
        hero.style.bottom = "";
        media.style.setProperty("--expand", "0");
      } else if (y >= pinEnd) {
        hero.style.position = "absolute";
        hero.style.top = `${travel}px`;
        hero.style.bottom = "";
        media.style.setProperty("--expand", "1");
      } else {
        hero.style.position = "fixed";
        hero.style.top = `${topOffset}px`;
        hero.style.bottom = "";
        media.style.setProperty("--expand", String((y - pinStart) / travel));
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", measure);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ih-hero-wrap" ref={wrapRef}>
      <div className="ih-hero" ref={heroRef}>
        <div className="ih-bg" aria-hidden="true">
          <span className="ih-blob b1"></span>
          <span className="ih-blob b2"></span>
          <span className="ih-blob b3"></span>
          <span className="ih-blob b4"></span>
        </div>

        <div className="ih-media" ref={mediaRef} aria-hidden="true">
          <video
            className="ih-media-video"
            autoPlay
            muted
            loop
            playsInline
            poster="/brand/interiors/hero.png"
          >
            <source src="/brand/interiors/hero-expand.mp4" type="video/mp4" />
          </video>
          <div className="ih-media-veil"></div>
        </div>

        <div className="ih-content">
          <span className="ih-badge">
            <i></i> Design &amp; Interiors
          </span>

          <h1 className="ih-heading">
            <span className="ih-line ih-line-lead">Design, Documentation &amp;</span>
            <span className="ih-line ih-line-bold">Delivery</span>
            <span className="ih-line ih-line-italic">for Interior Environments</span>
          </h1>

          <p className="ih-intro">
            UCX combines interior design expertise with BIM, technical documentation, coordination and execution
            support to connect design intent with project delivery.
          </p>

          <div className="ih-actions">
            <a className="ih-cta ih-cta-solid" href="#closing">
              Start a Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="ih-cta ih-cta-ghost" href="#categories">
              Explore Our Work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <a className="ih-vr-link" href="/design-interiors/vr-experience">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 9 5 12l3 3M16 9l3 3-3 3M12 3v18" />
            </svg>
            Try the 360&deg; VR Walkthrough
          </a>
        </div>

        <div className="ih-mark" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <defs>
              <path id="ihRingPath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
            </defs>
            <g className="ih-mark-spin">
              <text className="ih-mark-text">
                <textPath href="#ihRingPath" startOffset="0%">
                  SPAYCEX &middot; DESIGN &amp; INTERIORS &middot; SPAYCEX &middot; DESIGN &amp; INTERIORS &middot;
                </textPath>
              </text>
            </g>
            <circle className="ih-mark-pulse" cx="100" cy="100" r="30" />
            <circle className="ih-mark-core" cx="100" cy="100" r="30" />
            <text className="ih-mark-letter" x="100" y="107" textAnchor="middle">
              S
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
