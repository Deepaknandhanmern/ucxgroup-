"use client";

import { useEffect, useRef } from "react";
import { WorldMap } from "@/components/ui/WorldMap";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

const REGIONS = ["India", "GCC", "Southeast Asia", "UK", "USA", "Australia"];
const TAGS = ["International Delivery", "Remote Collaboration", "Dedicated Teams"];

// Coimbatore, Tamil Nadu — every delivery connection on the map originates here.
const INDIA = { lat: 11.0168, lng: 76.9558, label: "India" };
const NODES = [
  { lat: 25.2048, lng: 55.2708, label: "GCC" },
  { lat: 1.3521, lng: 103.8198, label: "Southeast Asia" },
  { lat: 51.5074, lng: -0.1278, label: "UK" },
  { lat: 40.7128, lng: -74.006, label: "USA" },
  { lat: -33.8688, lng: 151.2093, label: "Australia" },
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
              <span key={r} className={r === "India" ? "is-origin" : undefined}>
                {r}
              </span>
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
          <div className="map-compass" aria-hidden="true">
            <svg className="compass-svg" viewBox="0 0 200 200">
              <circle className="compass-ring" cx="100" cy="100" r="82" />
              <circle className="compass-ring" cx="100" cy="100" r="68" />

              <line className="compass-tick" x1="100" y1="18" x2="100" y2="34" />
              <line className="compass-tick" x1="100" y1="166" x2="100" y2="182" />
              <line className="compass-tick" x1="18" y1="100" x2="34" y2="100" />
              <line className="compass-tick" x1="166" y1="100" x2="182" y2="100" />

              <line className="compass-tick minor" x1="41.7" y1="41.7" x2="52.4" y2="52.4" />
              <line className="compass-tick minor" x1="158.3" y1="41.7" x2="147.6" y2="52.4" />
              <line className="compass-tick minor" x1="41.7" y1="158.3" x2="52.4" y2="147.6" />
              <line className="compass-tick minor" x1="158.3" y1="158.3" x2="147.6" y2="147.6" />

              <text className="compass-n" x="100" y="14" textAnchor="middle">N</text>
              <text className="compass-label" x="100" y="196" textAnchor="middle">S</text>
              <text className="compass-label" x="10" y="104" textAnchor="middle">W</text>
              <text className="compass-label" x="190" y="104" textAnchor="middle">E</text>

              <g className="compass-needle">
                <polygon className="needle-north" points="100,50 93,100 107,100" />
                <polygon className="needle-south" points="100,150 93,100 107,100" />
              </g>
              <circle className="compass-pivot" cx="100" cy="100" r="5" />
            </svg>
            <span className="compass-caption">Global Delivery</span>
          </div>
          <WorldMap dots={MAP_DOTS} />
        </div>
      </div>
    </div>
  );
}
