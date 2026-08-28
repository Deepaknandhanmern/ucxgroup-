"use client";

import { useEffect, useRef } from "react";
import { WorldMap } from "@/components/ui/WorldMap";

const TAGS = ["International Delivery", "Remote Collaboration", "Dedicated Teams", "Scalable Capacity"];

const STEPS = [
  { n: "01", label: "Connect", desc: "We align on scope, standards and the project team on both sides." },
  { n: "02", label: "Coordinate", desc: "Shared models, structured communication and defined delivery cadence." },
  { n: "03", label: "Deliver", desc: "Consistent, quality-controlled output handed off on schedule." },
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
            UCX supports international architects, engineers, contractors, developers and project teams through
            structured digital collaboration and scalable delivery models.
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
                <strong>Tamil Nadu, India</strong>
                <em>Delivery Origin &middot; Coimbatore</em>
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
          <p className="quality-body">
            Aligned to your standards. Integrated with your team. Scaled to your needs. Delivered with control.
          </p>
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

        <div className="closing">
          <p>Ready to work with a connected delivery team, wherever your project is based?</p>
          <a href="/contact">Start a Collaboration &rarr;</a>
        </div>
      </div>
    </div>
  );
}
