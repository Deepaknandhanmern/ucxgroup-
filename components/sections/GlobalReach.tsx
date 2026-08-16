"use client";

import { useEffect, useRef } from "react";
import { WORLD_DOTS } from "./globalDeliveryMap";

const REGIONS = ["India", "GCC", "Southeast Asia", "Global"];
const TAGS = ["International Delivery", "Remote Collaboration", "Dedicated Teams"];

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

        <div className="map" aria-hidden="true" data-reveal>
          <svg className="map-svg" viewBox="-20 0 1140 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="grglow" cx="71.5%" cy="42%" r="45%">
                <stop offset="0%" stopColor="rgba(145,242,181,0.22)" />
                <stop offset="100%" stopColor="rgba(145,242,181,0)" />
              </radialGradient>
            </defs>
            <ellipse className="glow" cx="715" cy="208" rx="320" ry="220" fill="url(#grglow)"></ellipse>

            <g className="world-dots">
              {WORLD_DOTS.map(([x, y]) => (
                <circle key={`${x}-${y}`} cx={x} cy={y} r="2.1" />
              ))}
            </g>

            <g className="leaders">
              <path className="leader" d="M715,208 Q672,140 630,175" />
              <path className="leader" d="M715,208 Q797,150 880,225" />
              <path className="leader" d="M715,208 Q450,40 185,115" />

              <circle className="pulse p1" r="4" />
              <circle className="pulse p2" r="4" />
              <circle className="pulse p3" r="4" />
            </g>

            <g className="hub">
              <circle className="hub-ring" cx="715" cy="208" r="40" />
              <circle className="hub-ring" cx="715" cy="208" r="26" />
              <circle className="hub-beacon" cx="715" cy="208" r="4.5" />
              <circle className="hub-beacon-pulse" cx="715" cy="208" r="4.5" />
              <text className="hub-label" x="715" y="266" textAnchor="middle">INDIA</text>
            </g>

            <g className="node" transform="translate(630,175)">
              <circle className="node-dot" r="5" />
              <text className="node-label" x="-16" y="-14" textAnchor="end">GCC</text>
            </g>
            <g className="node" transform="translate(880,225)">
              <circle className="node-dot" r="5" />
              <text className="node-label" x="16" y="-14">Southeast Asia</text>
            </g>
            <g className="node" transform="translate(185,115)">
              <circle className="node-dot" r="5" />
              <text className="node-label" x="0" y="-18" textAnchor="middle">Global</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
