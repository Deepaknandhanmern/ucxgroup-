"use client";

import { useEffect, useRef, useState } from "react";
import CollabBuildingScene from "@/components/sections/CollabBuildingScene";

const TAGS = ["AI & Automation", "Digital Construction", "Prefabrication", "Smart Assets"];
// Same verified figures as the Experience page's stats block — reused here
// so this section backs up "next solution together" with real proof points
// instead of just a claim.
const TRUST_STATS = [
  { value: "30+", label: "Projects Delivered" },
  { value: "7+", label: "Disciplines Covered" },
  { value: "3+", label: "Countries Served" },
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

          <div className="lp-trust">
            {TRUST_STATS.map((s) => (
              <div className="lp-trust-stat" key={s.label}>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lp-graphic">
          <CollabBuildingScene />
        </div>
      </div>
    </div>
  );
}
