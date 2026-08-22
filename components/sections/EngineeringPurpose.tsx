"use client";

import { useEffect, useRef } from "react";

const LINES = ["Every model.", "Every drawing.", "Every detail.", "Every deliverable."];

export default function EngineeringPurpose() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 8) * 80}ms`;
    });
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ucx-purpose" id="purpose" ref={sectRef}>
      <div className="grid-overlay" aria-hidden="true"></div>
      <div className="wrapper">
        <h2 className="heading" data-reveal>
          We Believe Engineering Information Should Create <em>Clarity</em>, Not Complexity.
        </h2>

        <div className="lines">
          {LINES.map((l) => (
            <span className="line" data-reveal key={l}>
              {l}
            </span>
          ))}
        </div>

        <p className="closing" data-reveal>
          Should improve decision-making and contribute to successful project outcomes.
        </p>
      </div>
    </div>
  );
}
