"use client";

import { useEffect, useRef, useState } from "react";

const TAGS = ["AI & Automation", "Digital Construction", "Prefabrication", "Smart Assets"];

// Fixed (non-rotating) positions for the four interactive orbit nodes —
// the longer labels sit top/bottom where centered text has room either
// side; the shorter ones sit left/right.
const ORBIT_NODES = [
  { x: 160, y: 18, labelX: 160, labelY: 2, anchor: "middle" as const },
  { x: 296, y: 160, labelX: 308, labelY: 164, anchor: "start" as const },
  { x: 160, y: 302, labelX: 160, labelY: 322, anchor: "middle" as const },
  { x: 24, y: 160, labelX: 12, labelY: 164, anchor: "end" as const },
];

export default function LabPromo() {
  const sectRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

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
          <h2 className="heading">What If We Built the Next Solution Together?</h2>
          <p className="intro">
            The UCX Collaboration Lab brings people, technology and real project challenges together to explore
            what&rsquo;s possible beyond conventional delivery.
          </p>
          <div className="tags">
            {TAGS.map((t, i) => (
              <span
                key={t}
                className={active === i ? "is-active" : undefined}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
              >
                {t}
              </span>
            ))}
          </div>
          <a className="cta" href="/collaboration-lab">
            <span className="cta-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
            Explore the Collaboration Lab
          </a>
        </div>

        <div className="lp-graphic">
          <svg className="orbit-svg" viewBox="0 0 320 320" role="img" aria-label="The four disciplines the Collaboration Lab explores">
            <g className="orbit-spin-slow" aria-hidden="true">
              <circle className="orbit-ring" cx="160" cy="160" r="140" />
            </g>
            <g className="orbit-spin-rev" aria-hidden="true">
              <circle className="orbit-ring" cx="160" cy="160" r="102" />
            </g>
            <g className="orbit-spin-slow" aria-hidden="true">
              <circle className="orbit-ring" cx="160" cy="160" r="64" />
            </g>

            {/* four fixed, hoverable nodes — synced with the tags on the left */}
            {ORBIT_NODES.map((n, i) => (
              <g
                key={TAGS[i]}
                className={`orbit-node${active === i ? " is-active" : ""}`}
                onPointerEnter={() => setActive(i)}
                onPointerLeave={() => setActive(null)}
                tabIndex={0}
                role="button"
                aria-label={TAGS[i]}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
              >
                <circle className="node-hit" cx={n.x} cy={n.y} r="20" />
                <circle className="node" cx={n.x} cy={n.y} r="6" style={{ animationDelay: `${i * 0.4}s` }} />
                <text className="node-label" x={n.labelX} y={n.labelY} textAnchor={n.anchor}>
                  {TAGS[i]}
                </text>
              </g>
            ))}

            <circle className="orbit-core" cx="160" cy="160" r="36" />
            <text className="orbit-mark" x="160" y="168" textAnchor="middle">X</text>
          </svg>
        </div>
      </div>
    </div>
  );
}
