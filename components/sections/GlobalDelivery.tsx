"use client";

import { useEffect, useRef } from "react";
import { WorldMap } from "@/components/ui/WorldMap";

const TAGS = ["International Delivery", "Remote Collaboration", "Dedicated Teams", "Scalable Capacity"];

const STEPS = [
  { n: "01", label: "Connect", desc: "Align scope, standards, technology and responsibilities." },
  { n: "02", label: "Coordinate", desc: "Work through shared models, structured communication and defined review cycles." },
  { n: "03", label: "Deliver", desc: "Quality-controlled outputs delivered to agreed requirements and schedules." },
];

const PILLARS = [
  {
    label: "Standards",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    label: "Integration",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6H6a3 3 0 00-3 3v0a3 3 0 003 3h1" />
        <path d="M15 18h3a3 3 0 003-3v0a3 3 0 00-3-3h-1" />
        <path d="M8 12h8" />
      </svg>
    ),
  },
  {
    label: "Scale",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M8 3H3v5M16 3h5v5M3 16v5h5M21 16v5h-5" />
      </svg>
    ),
  },
  {
    label: "Control",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

// Coimbatore, Tamil Nadu — every delivery connection on the map originates here.
const INDIA = { lat: 11.0168, lng: 76.9558, label: "India" };

const NODES = [
  { label: "GCC", caption: "UAE · Saudi · Qatar", lat: 25.2048, lng: 55.2708 },
  { label: "Southeast Asia", caption: "Singapore · Malaysia", lat: 1.3521, lng: 103.8198 },
  { label: "UK", caption: "United Kingdom", lat: 51.5074, lng: -0.1278 },
  { label: "USA", caption: "United States", lat: 40.7128, lng: -74.006 },
  { label: "Australia", caption: "Australia", lat: -33.8688, lng: 151.2093 },
];

const MAP_DOTS = NODES.map((n) => ({ start: INDIA, end: n }));

export default function GlobalDelivery() {
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

  // Re-align to the #hash target once fonts/layout settle — the browser's
  // native fragment scroll can land short/long if webfonts reflow late.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    const target = document.querySelector(hash);
    if (!target) return;

    const realign = () => target.scrollIntoView({ block: "start" });
    const fonts = (document as Document & { fonts?: { ready: Promise<unknown> } }).fonts;
    if (fonts?.ready) {
      fonts.ready.then(() => requestAnimationFrame(realign));
    } else {
      requestAnimationFrame(() => requestAnimationFrame(realign));
    }
  }, []);

  return (
    <div className="ucx-global" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        {/* ---------- overview ---------- */}
        <div className="head" id="overview">
          <span className="eyebrow">Global Delivery</span>
          <h1 className="heading">
            India-Based.
            <br />
            Globally Connected.
          </h1>
          <p className="intro">
            UCX supports architects, engineers, contractors, developers and project teams worldwide through
            structured digital delivery, remote collaboration and scalable teams.
          </p>
          <div className="tags">
            {TAGS.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>
        </div>

        {/* ---------- connection map ---------- */}
        <div className="map">
          <div className="map-grid" aria-hidden="true"></div>
          <div className="map-head">
            <h2 className="map-head-title">One Team. Anywhere.</h2>
            <p className="map-head-body">
              We integrate with your existing standards, workflows and technology, allowing international teams to
              extend their delivery capability without geographical limitations.
            </p>
          </div>
          <div className="map-globe">
            <WorldMap dots={MAP_DOTS} />
          </div>
          <div className="map-legend">
            <div className="legend-item legend-hub">
              <span className="legend-dot"></span>
              <div>
                <strong>India</strong>
                <em>Delivery Origin &middot; Coimbatore, Tamil Nadu</em>
              </div>
            </div>
            <div className="legend-group">
              <span className="legend-group-label">Global Reach</span>
              <div className="legend-group-items">
                {NODES.map((n) => (
                  <div className="legend-item" key={n.label}>
                    <span className="legend-dot"></span>
                    <div>
                      <strong>{n.label}</strong>
                      <em>{n.caption}</em>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ---------- quality & standards ---------- */}
        <div className="quality" id="quality">
          <span className="sub-eyebrow">Built for International Delivery</span>
          <div>
            <p className="quality-body">
              Aligned to your standards. Integrated with your team. Scaled to your needs. Delivered with control.
            </p>
            <div className="pillars">
              {PILLARS.map((p) => (
                <div className="pillar" key={p.label}>
                  <span className="pillar-icon" aria-hidden="true">{p.icon}</span>
                  <span className="pillar-label">{p.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ---------- approach ---------- */}
        <div className="approach" id="approach">
          <div className="approach-head">
            <span className="sub-eyebrow">Our Approach</span>
            <h2 className="approach-title">
              Connect <span className="arrow">&rarr;</span> Coordinate <span className="arrow">&rarr;</span> Deliver
            </h2>
            <p className="approach-body">
              One connected delivery environment, regardless of where the project team is located.
            </p>
          </div>

          <div className="steps">
            {STEPS.map((s, i) => (
              <div className="step" key={s.n} style={{ animationDelay: `${0.1 + i * 0.1}s` }}>
                <span className="step-n">{s.n}</span>
                <h3>{s.label}</h3>
                <p>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="capability">
          <h2 className="capability-title">Your Team. Our Capability.</h2>
          <p className="capability-body">
            Whether you need project support, additional capacity, a dedicated team or a long-term delivery partner,
            UCX adapts to the way you work.
          </p>
        </div>

        <div className="closing">
          <p>Ready to work with a connected delivery team?</p>
          <a href="/contact">Start a Collaboration &rarr;</a>
        </div>
      </div>
    </div>
  );
}
