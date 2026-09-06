"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const THRESHOLD = 480;
// circumference of the r=21 ring drawn in the SVG below (2πr), used as the
// dash length so a 0..1 progress maps straight onto stroke-dashoffset
const RING_LENGTH = 2 * Math.PI * 21;

export default function BackToTop() {
  const pathname = usePathname();
  const isInteriors = pathname?.startsWith("/design-interiors") ?? false;
  const [visible, setVisible] = useState(false);
  const ringRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    function onScroll() {
      setVisible((window.scrollY || document.documentElement.scrollTop) > THRESHOLD);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Scroll-position ring, touch only — desktop already has the top progress
  // bar plus a real scrollbar to read position from. Written to the DOM in a
  // rAF-throttled handler rather than through state, so scrolling never
  // re-renders this component per frame.
  useEffect(() => {
    const ring = ringRef.current;
    if (!ring) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;

    let ticking = false;
    function apply() {
      ticking = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, (window.scrollY || doc.scrollTop || 0) / scrollable)) : 0;
      ring!.style.strokeDashoffset = String(RING_LENGTH * (1 - progress));
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

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="Back to top"
      tabIndex={visible ? 0 : -1}
      className={`ucx-backtotop${isInteriors ? " ucx-backtotop--interiors" : ""}${visible ? " is-visible" : ""}`}
    >
      <svg
        className="ucx-backtotop-ring"
        viewBox="0 0 46 46"
        fill="none"
        aria-hidden="true"
      >
        <circle
          ref={ringRef}
          cx="23"
          cy="23"
          r="21"
          strokeWidth="2"
          strokeLinecap="round"
          strokeDasharray={RING_LENGTH}
          strokeDashoffset={RING_LENGTH}
        />
      </svg>
      <svg
        className="ucx-backtotop-arrow"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
