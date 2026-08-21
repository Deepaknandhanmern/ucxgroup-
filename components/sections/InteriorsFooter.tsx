"use client";

import { useEffect, useRef } from "react";

const VALUES = [
  "Design & Interiors",
  "BIM-Integrated Documentation",
  "Construction-Ready Delivery",
  "Workplace · Hospitality · Residential",
  "SpayceX by UCX",
];

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export default function InteriorsFooter() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const giantRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const giant = giantRef.current;
    const main = mainRef.current;
    if (!wrap || !giant || !main) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    let raf = 0;
    function update() {
      raf = 0;
      const vh = window.innerHeight;
      const rect = wrap!.getBoundingClientRect();
      // 0 when the curtain starts entering the viewport, 1 once it's fully revealed
      const progress = Math.min(1, Math.max(0, (vh - rect.top) / vh));

      giant!.style.transform = `translate(-50%, ${(1 - progress) * 6}vh) scale(${0.85 + progress * 0.15})`;
      giant!.style.opacity = String(progress);

      const contentProgress = Math.min(1, Math.max(0, (vh * 0.75 - rect.top) / (vh * 0.5)));
      main!.style.transform = `translateY(${(1 - contentProgress) * 40}px)`;
      main!.style.opacity = String(contentProgress);
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ifoot-curtain" ref={wrapRef}>
      <footer className="ifoot">
        <div className="ifoot-aurora" aria-hidden="true"></div>
        <div className="ifoot-giant" ref={giantRef} aria-hidden="true">
          SPAYCEX
        </div>

        <div className="ifoot-marquee" aria-hidden="true">
          <div className="ifoot-marquee-track">
            {[...VALUES, ...VALUES].map((v, i) => (
              <span key={i}>
                {v} <i>&#10022;</i>
              </span>
            ))}
          </div>
        </div>

        <div className="ifoot-main" ref={mainRef}>
          <h2 className="ifoot-heading">
            Ready to design
            <br />
            your next space?
          </h2>

          <div className="ifoot-actions">
            <a className="ifoot-pill ifoot-pill--solid" href="/contact">
              Start a Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="ifoot-pill" href="/design-interiors">
              Explore Our Work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <div className="ifoot-links">
            <a className="ifoot-pill ifoot-pill--sm" href="#">
              Privacy
            </a>
            <a className="ifoot-pill ifoot-pill--sm" href="#">
              Terms
            </a>
            <a className="ifoot-pill ifoot-pill--sm" href="mailto:collaborate@ucx-group.com">
              Get in Touch
            </a>
          </div>
        </div>

        <div className="ifoot-bottom">
          <span className="ifoot-copy">
            &copy; {new Date().getFullYear()} SpayceX by UCX. All rights reserved.
            <i className="ifoot-copy-credit">Designed &amp; Developed by Agape Works</i>
          </span>
          <span className="ifoot-credit">
            <i>Design &amp; Delivery</i>
            <b className="ifoot-heart" aria-hidden="true">
              &#10084;
            </b>
            <i>by UCX</i>
          </span>
          <button type="button" className="ifoot-top" onClick={scrollToTop} aria-label="Back to top">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}
