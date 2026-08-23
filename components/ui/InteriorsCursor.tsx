"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], input, textarea, select, .svc-tile, .orbit-node, .ins-preview-card, .mat-card";

export default function InteriorsCursor() {
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const arrow = arrowRef.current;
    if (!arrow) return;

    const onMove = (e: MouseEvent) => {
      arrow.style.opacity = "1";
      arrow.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate(-4px, -4px)`;
    };

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      arrow.classList.toggle("is-active", !!target.closest?.(INTERACTIVE_SELECTOR));
    };

    const onLeaveDoc = () => {
      arrow.style.opacity = "0";
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    document.addEventListener("mouseleave", onLeaveDoc);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseleave", onLeaveDoc);
    };
  }, []);

  return (
    <div className="ih-cursor-arrow" ref={arrowRef} aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none">
        <path
          d="M4.037 4.688a.495.495 0 0 1 .651-.651l16 6.5a.5.5 0 0 1-.063.947l-6.124 1.58a2 2 0 0 0-1.438 1.435l-1.579 6.126a.5.5 0 0 1-.947.063z"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
