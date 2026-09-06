"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Ticks a figure up from zero the first time it scrolls into view.
 *
 * Touch-only by default (`coarseOnly`): on desktop the number renders at its
 * final value immediately, so this stays a mobile/tablet flourish rather than
 * changing how the site reads on a mouse. Falls back to the final value
 * whenever it can't animate — reduced-motion, no IntersectionObserver — so
 * the figure is never left sitting at zero.
 */
export default function CountUp({
  value,
  suffix = "",
  pad = 0,
  durationMs = 1400,
  coarseOnly = true,
  className,
}: {
  value: number;
  suffix?: string;
  pad?: number;
  durationMs?: number;
  coarseOnly?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // null means "not animating" — the final value renders as-is, so
  // server-rendered HTML and any browser that bails out below (desktop,
  // reduced motion, no IntersectionObserver) shows the real figure and never
  // a stranded zero. Only the observer callback ever puts a number in here.
  const [shown, setShown] = useState<number | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (coarseOnly && !window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    let raf = 0;
    let started = false;

    function run() {
      if (started) return;
      started = true;
      setShown(0);
      const start = performance.now();
      function tick(now: number) {
        const t = Math.min(1, (now - start) / durationMs);
        const eased = 1 - Math.pow(1 - t, 3);
        setShown(Math.round(eased * value));
        if (t < 1) raf = requestAnimationFrame(tick);
      }
      raf = requestAnimationFrame(tick);
    }

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            run();
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, durationMs, coarseOnly]);

  return (
    <span className={className} ref={ref}>
      {String(shown ?? value).padStart(pad, "0")}
      {suffix}
    </span>
  );
}
