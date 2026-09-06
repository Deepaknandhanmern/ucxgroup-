"use client";

import { useEffect, useRef } from "react";

/**
 * A thin bar pinned to the very top of the viewport that fills left-to-right
 * as the page is scrolled, reaching full width at the bottom of the page —
 * a reading-position cue for the site's long scrolling pages, where there's
 * no visible scrollbar on touch devices to judge progress by.
 *
 * Driven by a transform (not width) so each frame stays on the compositor,
 * and written straight to the DOM inside one rAF-throttled scroll handler
 * rather than through React state, which would re-render on every frame.
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    let ticking = false;

    function apply() {
      ticking = false;
      const doc = document.documentElement;
      // total distance the page can actually travel; 0 on pages shorter
      // than the viewport, where a progress bar would be meaningless
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) {
        bar!.style.transform = "scaleX(0)";
        bar!.style.opacity = "0";
        return;
      }
      const progress = Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop || 0) / scrollable));
      bar!.style.transform = `scaleX(${progress.toFixed(4)})`;
      bar!.style.opacity = progress > 0.005 ? "1" : "0";
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(apply);
      }
    }

    apply();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="ucx-scroll-progress" aria-hidden="true">
      <div className="ucx-scroll-progress-bar" ref={barRef}></div>
    </div>
  );
}
