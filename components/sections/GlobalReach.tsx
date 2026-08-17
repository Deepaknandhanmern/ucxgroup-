"use client";

import { useEffect, useRef } from "react";
import { Globe } from "@/components/ui/Globe";

const REGIONS = ["India", "GCC", "Southeast Asia", "Global"];
const TAGS = ["International Delivery", "Remote Collaboration", "Dedicated Teams"];

const INDIA: [number, number] = [11.0168, 76.9558];
const NODES: [number, number][] = [
  [25.2048, 55.2708], // GCC
  [1.3521, 103.8198], // Southeast Asia
  [51.5074, -0.1278], // Global (UK · US · Australia)
];
const GLOBE_MARKERS = [{ location: INDIA, size: 0.06 }, ...NODES.map((location) => ({ location, size: 0.035 }))];
const GLOBE_ARCS = NODES.map((to) => ({ from: INDIA, to }));

export default function GlobalReach() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 80}ms`;
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
    <div className="ucx-globalreach" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="wrapper">
        <div className="copy" data-reveal>
          <h2 className="heading">
            India-Based.
            <br />
            Globally Connected.
          </h2>
          <p className="intro">Scalable BIM and digital project delivery for international project teams.</p>

          <div className="regions">
            {REGIONS.map((r) => (
              <span key={r}>{r}</span>
            ))}
          </div>
          <div className="tags">
            {TAGS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <a className="cta" href="/global-delivery">
            Explore Global Delivery
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="map" data-reveal>
          <Globe markers={GLOBE_MARKERS} arcs={GLOBE_ARCS} />
        </div>
      </div>
    </div>
  );
}
