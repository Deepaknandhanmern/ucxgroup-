"use client";

import { useEffect, useRef } from "react";
import { WORLD_DOTS } from "./globalDeliveryMap";

const TAGS = ["International Delivery", "Remote Collaboration", "Dedicated Teams", "Scalable Capacity"];

const STEPS = [
  { n: "01", label: "Connect", desc: "We align on scope, standards and the project team on both sides." },
  { n: "02", label: "Coordinate", desc: "Shared models, structured communication and defined delivery cadence." },
  { n: "03", label: "Deliver", desc: "Consistent, quality-controlled output handed off on schedule." },
];

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
        <div className="map" aria-hidden="true">
          <svg className="map-svg" viewBox="-20 0 1140 500" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="gdglow" cx="71.5%" cy="42%" r="45%">
                <stop offset="0%" stopColor="rgba(145,242,181,0.22)" />
                <stop offset="100%" stopColor="rgba(145,242,181,0)" />
              </radialGradient>
            </defs>
            <ellipse className="glow" cx="715" cy="208" rx="320" ry="220" fill="url(#gdglow)"></ellipse>

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
              <text className="hub-caption" x="715" y="285" textAnchor="middle">Delivery Origin</text>
            </g>

            <g className="node" transform="translate(630,175)">
              <circle className="node-dot" r="5" />
              <text className="node-label" x="-16" y="-14" textAnchor="end">GCC</text>
              <text className="node-caption" x="-16" y="4" textAnchor="end">UAE · Saudi · Qatar</text>
            </g>
            <g className="node" transform="translate(880,225)">
              <circle className="node-dot" r="5" />
              <text className="node-label" x="16" y="-14">Southeast Asia</text>
              <text className="node-caption" x="16" y="4">Singapore · Malaysia</text>
            </g>
            <g className="node" transform="translate(185,115)">
              <circle className="node-dot" r="5" />
              <text className="node-label" x="0" y="-18" textAnchor="middle">Global</text>
              <text className="node-caption" x="0" y="2" textAnchor="middle">UK · US · Australia</text>
            </g>
          </svg>
        </div>

        {/* ---------- quality & standards ---------- */}
        <div className="quality" id="quality">
          <span className="sub-eyebrow">Quality &amp; Standards</span>
          <p className="quality-body">
            Consistent documentation, BIM standards, quality control and information management aligned with
            professional project requirements.
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
