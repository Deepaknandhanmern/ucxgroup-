"use client";

import { useEffect, useRef } from "react";

const TAGS = ["AI & Automation", "Digital Construction", "Prefabrication", "Smart Buildings"];

export default function LabPromo() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    let pending = false;
    let px = 0;
    let py = 0;
    function onPointerMove(e: PointerEvent) {
      const b = sect!.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          sect!.style.setProperty("--mx", px + "px");
          sect!.style.setProperty("--my", py + "px");
          pending = false;
        });
      }
    }
    function onPointerEnter() {
      sect!.classList.add("is-hot");
    }
    function onPointerLeave() {
      sect!.classList.remove("is-hot");
    }
    sect.addEventListener("pointermove", onPointerMove, { passive: true });
    sect.addEventListener("pointerenter", onPointerEnter);
    sect.addEventListener("pointerleave", onPointerLeave);
    return () => {
      sect.removeEventListener("pointermove", onPointerMove);
      sect.removeEventListener("pointerenter", onPointerEnter);
      sect.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="ucx-labpromo" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="lp-blob lp-blob-a" aria-hidden="true"></div>
      <div className="lp-blob lp-blob-b" aria-hidden="true"></div>

      <div className="wrapper">
        <div className="lp-copy">
          <span className="eyebrow">More Than Project Delivery.</span>
          <h2 className="heading">Let&rsquo;s Build What Comes Next.</h2>
          <p className="intro">
            The UCX Collaboration Lab brings industry expertise, technology and project experience together to
            co-create solutions for real AEC challenges.
          </p>
          <div className="tags">
            {TAGS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
          <a className="cta" href="/collaboration-lab">
            <span className="cta-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
            Explore Collaboration Lab
          </a>
        </div>

        <div className="lp-graphic" aria-hidden="true">
          <svg className="orbit-svg" viewBox="0 0 320 320">
            <g className="orbit-spin-slow">
              <circle className="orbit-ring" cx="160" cy="160" r="140" />
            </g>
            <g className="orbit-spin-rev">
              <circle className="orbit-ring" cx="160" cy="160" r="102" />
            </g>
            <g className="orbit-spin-slow">
              <circle className="orbit-ring" cx="160" cy="160" r="64" />
            </g>

            <g className="orbit-spin-slow">
              <circle className="node" cx="160" cy="20" r="6" />
              <circle className="node" cx="300" cy="160" r="5" style={{ animationDelay: ".6s" }} />
            </g>
            <g className="orbit-spin-rev">
              <circle className="node" cx="160" cy="300" r="6" style={{ animationDelay: "1.2s" }} />
              <circle className="node" cx="20" cy="160" r="5" style={{ animationDelay: "1.8s" }} />
            </g>
            <g className="orbit-spin-slow">
              <circle className="node" cx="253" cy="67" r="4" style={{ animationDelay: ".3s" }} />
              <circle className="node" cx="67" cy="253" r="4" style={{ animationDelay: "2.1s" }} />
            </g>

            <circle className="orbit-core" cx="160" cy="160" r="36" />
            <text className="orbit-mark" x="160" y="168" textAnchor="middle">X</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
