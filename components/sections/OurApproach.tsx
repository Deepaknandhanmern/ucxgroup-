"use client";

import { useEffect, useRef } from "react";

const WORDS = ["Connect.", "Challenge.", "Create."];

export default function OurApproach() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 90}ms`;
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
    <div className="ucx-approach" id="approach" ref={sectRef}>
      <div className="wrapper">
        <div className="approach-copy" data-reveal>
          <span className="eyebrow">A Different Way to Deliver</span>
          <h2 className="heading">Connecting People, Information &amp; Expertise</h2>
          <p className="intro">
            Modern projects involve multiple disciplines, technologies and stakeholders. UCX was created to help
            connect them.
          </p>
          <p className="intro">
            Our approach brings design, BIM, digital engineering, documentation and delivery support into a
            coordinated workflow, helping project teams reduce fragmentation and deliver with greater confidence.
          </p>
        </div>

        <div className="approach-words" aria-hidden="true">
          {WORDS.map((w, i) => (
            <span className="approach-word" data-reveal key={w} style={{ transitionDelay: `${i * 140}ms` }}>
              {w}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
