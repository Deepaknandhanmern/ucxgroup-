"use client";

import { useEffect, useRef, useState } from "react";

const TAGS = ["AI & Automation", "Digital Construction", "Prefabrication", "Smart Assets"];

// Fixed callout-marker positions around the blueprint, each with a leader
// line to the building feature it annotates — synced with the tags on the
// left. Order matches TAGS: rooftop sensors, facade grid, the prefab
// module, the door/foundation.
const CALLOUTS = [
  { x: 160, y: 18, labelX: 160, labelY: 2, anchor: "middle" as const, tx: 113, ty: 40 },
  { x: 296, y: 160, labelX: 308, labelY: 164, anchor: "start" as const, tx: 226, ty: 150 },
  { x: 160, y: 302, labelX: 160, labelY: 322, anchor: "middle" as const, tx: 111, ty: 196 },
  { x: 24, y: 160, labelX: 12, labelY: 164, anchor: "end" as const, tx: 113, ty: 240 },
];

function makeWindowGrid(x0: number, y0: number, x1: number, y1: number, cols: number, rows: number, size: number) {
  const cellW = (x1 - x0) / cols;
  const cellH = (y1 - y0) / rows;
  const cells: { x: number; y: number }[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      cells.push({ x: x0 + c * cellW + (cellW - size) / 2, y: y0 + r * cellH + (cellH - size) / 2 });
    }
  }
  return cells;
}
const WINDOWS = [
  ...makeWindowGrid(82, 76, 144, 216, 3, 5, 12),
  ...makeWindowGrid(172, 136, 240, 256, 3, 4, 12),
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
          <svg className="orbit-svg" viewBox="0 0 320 320" role="img" aria-label="A blueprint of a building drawing itself, annotated with the four disciplines the Collaboration Lab brings together">
            <line className="blueprint-ground" x1="34" y1="272" x2="286" y2="272" aria-hidden="true" />

            {/* the building sketches itself in on a loop, like a blueprint being drawn */}
            <path className="blueprint-outline" d="M68,60 L158,60 L158,120 L254,120 L254,272 L68,272 Z" pathLength={1} aria-hidden="true" />

            <g aria-hidden="true">
              {WINDOWS.map((w, i) => (
                <rect key={i} className="blueprint-window" x={w.x} y={w.y} width="12" height="12" style={{ animationDelay: `${-(i * 0.04)}s` }} />
              ))}
              <rect className="blueprint-window" x="95" y="224" width="36" height="48" style={{ animationDelay: `${-(WINDOWS.length * 0.04)}s` }} />
            </g>

            <line className="blueprint-mast" x1="113" y1="60" x2="113" y2="42" aria-hidden="true" />
            <circle className="blueprint-sensor-dot" cx="113" cy="40" r="4" aria-hidden="true" />
            <line className="blueprint-mast" x1="206" y1="120" x2="206" y2="104" style={{ animationDelay: "-.5s" }} aria-hidden="true" />
            <circle className="blueprint-sensor-dot" cx="206" cy="102" r="4" style={{ animationDelay: "-.5s" }} aria-hidden="true" />

            <rect className="blueprint-module" x="76" y="168" width="70" height="56" aria-hidden="true" />

            {/* title-block stamp — the fixed brand mark on the drawing */}
            <circle className="blueprint-stamp" cx="278" cy="292" r="20" aria-hidden="true" />
            <text className="blueprint-stamp-mark" x="278" y="299" textAnchor="middle" aria-hidden="true">X</text>

            {/* four fixed, hoverable annotation callouts — synced with the tags on
                the left, each pointing a leader line at the feature it names */}
            {CALLOUTS.map((n, i) => (
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
                <line className="orbit-connector" x1={n.x} y1={n.y} x2={n.tx} y2={n.ty} />
                <circle className="orbit-target" cx={n.tx} cy={n.ty} r="8" />
                <circle className="node-hit" cx={n.x} cy={n.y} r="20" />
                <circle className="node" cx={n.x} cy={n.y} r="6" />
                <text className="node-label" x={n.labelX} y={n.labelY} textAnchor={n.anchor}>
                  {TAGS[i]}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
