"use client";

import { useEffect, useRef, useState } from "react";

interface Slide {
  src: string;
  alt: string;
}

export default function ImageCarousel({ slides, intervalMs = 4000 }: { slides: Slide[]; intervalMs?: number }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused || slides.length < 2) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, intervalMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [paused, slides.length, intervalMs]);

  function go(i: number) {
    setIndex((i + slides.length) % slides.length);
  }

  return (
    <div
      className="ucx-carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          src={s.src}
          alt={s.alt}
          className={`ucx-carousel-slide${i === index ? " is-active" : ""}`}
          loading={i === 0 ? "eager" : "lazy"}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button type="button" className="ucx-carousel-nav ucx-carousel-prev" onClick={() => go(index - 1)} aria-label="Previous view">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <button type="button" className="ucx-carousel-nav ucx-carousel-next" onClick={() => go(index + 1)} aria-label="Next view">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div className="ucx-carousel-dots">
            {slides.map((s, i) => (
              <button
                key={s.src}
                type="button"
                className={`ucx-carousel-dot${i === index ? " is-active" : ""}`}
                onClick={() => go(i)}
                aria-label={`Go to view ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
