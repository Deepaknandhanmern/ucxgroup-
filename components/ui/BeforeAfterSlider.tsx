"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface BeforeAfterSliderProps {
  beforeSrc: string;
  afterSrc: string;
  beforeAlt?: string;
  afterAlt?: string;
  beforeLabel?: string;
  afterLabel?: string;
}

function SliderImage({ src, alt, className }: { src: string; alt: string; className: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className={`${className} basl-fallback`} aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} draggable={false} onError={() => setOk(false)} />;
}

export default function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  beforeLabel = "Before",
  afterLabel = "After",
}: BeforeAfterSliderProps) {
  const [position, setPosition] = useState(50);
  const [dragging, setDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateFromClientX = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.max(0, Math.min(100, next)));
  }, []);

  useEffect(() => {
    if (!dragging) return;

    function onMouseMove(e: MouseEvent) {
      updateFromClientX(e.clientX);
    }
    function onTouchMove(e: TouchEvent) {
      if (e.touches[0]) updateFromClientX(e.touches[0].clientX);
    }
    function stop() {
      setDragging(false);
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", stop);
    window.addEventListener("touchmove", onTouchMove);
    window.addEventListener("touchend", stop);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", stop);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", stop);
    };
  }, [dragging, updateFromClientX]);

  return (
    <div className="basl" ref={containerRef}>
      <SliderImage src={beforeSrc} alt={beforeAlt} className="basl-img" />

      <div className="basl-after" style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>
        <SliderImage src={afterSrc} alt={afterAlt} className="basl-img" />
      </div>

      <span className="basl-tag basl-tag-before">{beforeLabel}</span>
      <span className="basl-tag basl-tag-after">{afterLabel}</span>

      <div className="basl-line" style={{ left: `${position}%` }} aria-hidden="true" />

      <button
        type="button"
        className={`basl-handle${dragging ? " is-dragging" : ""}`}
        style={{ left: `${position}%` }}
        onMouseDown={() => setDragging(true)}
        onTouchStart={() => setDragging(true)}
        aria-label="Drag to compare before and after"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 6l-6 6 6 6" />
          <path d="M11 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
}
