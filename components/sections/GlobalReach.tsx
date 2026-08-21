"use client";

import { useEffect, useRef } from "react";
import { WorldMap } from "@/components/ui/WorldMap";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

const REGIONS = ["India", "GCC", "Southeast Asia", "Global"];
const TAGS = ["International Delivery", "Remote Collaboration", "Dedicated Teams"];

const INDIA = { lat: 11.0168, lng: 76.9558, label: "India" };
const NODES = [
  { lat: 25.2048, lng: 55.2708, label: "GCC" },
  { lat: 1.3521, lng: 103.8198, label: "Southeast Asia" },
  { lat: 51.5074, lng: -0.1278, label: "Global" }, // UK · US · Australia
];
const MAP_DOTS = NODES.map((n) => ({ start: INDIA, end: n }));

export default function GlobalReach() {
  const sectRef = useRef<HTMLDivElement>(null);
  const glowRef = useCursorGlow<HTMLDivElement>();

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
    <div
      className="ucx-globalreach"
      ref={(el) => {
        sectRef.current = el;
        glowRef.current = el;
      }}
    >
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>
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
          <WorldMap dots={MAP_DOTS} />
        </div>
      </div>
    </div>
  );
}
