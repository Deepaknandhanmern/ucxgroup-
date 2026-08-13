"use client";

import { useEffect, useRef } from "react";

interface Reason {
  badge: string;
  title: string;
  desc: string;
  position: "tl" | "bl" | "tr" | "br";
  style: { left?: string; right?: string; top: string };
}

const REASONS: Reason[] = [
  {
    badge: "01",
    title: "Local Experts",
    desc: "In-depth understanding of the regional design and architecture market.",
    position: "tl",
    style: { left: "7.8%", top: "19.3%" },
  },
  {
    badge: "02",
    title: "Personalized Service",
    desc: "Customized solutions tailored to your unique property requirements.",
    position: "bl",
    style: { left: "7.8%", top: "74.2%" },
  },
  {
    badge: "03",
    title: "Proven Success",
    desc: "A track record of delivering exceptional design outcomes for clients.",
    position: "tr",
    style: { right: "7.8%", top: "19.3%" },
  },
  {
    badge: "04",
    title: "Industry Recognition",
    desc: "Proud members of leading associations and award recipients.",
    position: "br",
    style: { right: "7.8%", top: "74.2%" },
  },
];

export default function WhyChooseUs() {
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

  return (
    <div className="ucx-why2" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head-row">
          <div className="head-text">
            <span className="eyebrow">Our Advantage</span>
            <h2 className="heading">
              Why <span className="stroke">Choose</span> Us
            </h2>
            <p className="intro">
              Every reason below is load-bearing. We design with precision, deliver with certainty, and build
              relationships the same way we build spaces, to last.
            </p>
          </div>

          <div className="compass" aria-hidden="true">
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
            <span className="compass-caption">Est. 2010</span>
          </div>
        </div>

        <div className="diagram">
          <svg className="diagram-svg" viewBox="0 0 900 620" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="w2glow" cx="50%" cy="45%" r="55%">
                <stop offset="0%" stopColor="rgba(145,242,181,0.30)" />
                <stop offset="100%" stopColor="rgba(145,242,181,0)" />
              </radialGradient>
            </defs>
            <ellipse className="glow" cx="450" cy="330" rx="260" ry="230" fill="url(#w2glow)"></ellipse>

            <line x1="150" y1="560" x2="750" y2="560" className="ground" />
            <g className="ticks">
              <line x1="180" y1="554" x2="180" y2="566" />
              <line x1="270" y1="554" x2="270" y2="566" />
              <line x1="360" y1="554" x2="360" y2="566" />
              <line x1="450" y1="554" x2="450" y2="566" />
              <line x1="540" y1="554" x2="540" y2="566" />
              <line x1="630" y1="554" x2="630" y2="566" />
              <line x1="720" y1="554" x2="720" y2="566" />
            </g>

            <g className="building">
              <rect x="360" y="380" width="180" height="180" />
              <rect x="385" y="220" width="130" height="160" />
              <rect x="405" y="100" width="90" height="120" />
              <line x1="450" y1="100" x2="450" y2="60" className="spire" />
              <circle className="beacon-ring" cx="450" cy="58" r="3" />
              <circle className="beacon-ring" cx="450" cy="58" r="3" style={{ animationDelay: "1.2s" }} />
              <circle cx="450" cy="58" r="3" className="spire-tip" />
              <g className="windows">
                <line x1="368" y1="410" x2="532" y2="410" />
                <line x1="368" y1="440" x2="532" y2="440" />
                <line x1="368" y1="470" x2="532" y2="470" />
                <line x1="368" y1="500" x2="532" y2="500" />
                <line x1="368" y1="530" x2="532" y2="530" />
                <line x1="392" y1="250" x2="508" y2="250" />
                <line x1="392" y1="280" x2="508" y2="280" />
                <line x1="392" y1="310" x2="508" y2="310" />
                <line x1="392" y1="340" x2="508" y2="340" />
                <line x1="392" y1="370" x2="508" y2="370" />
                <line x1="412" y1="130" x2="488" y2="130" />
                <line x1="412" y1="155" x2="488" y2="155" />
                <line x1="412" y1="180" x2="488" y2="180" />
                <line x1="412" y1="205" x2="488" y2="205" />
              </g>
            </g>

            <g className="leaders">
              <path className="leader" d="M405,140 L70,120" />
              <circle className="leader-dot" cx="405" cy="140" r="4" />
              <circle className="leader-dot" cx="70" cy="120" r="4" />

              <path className="leader" d="M365,420 L70,460" />
              <circle className="leader-dot" cx="365" cy="420" r="4" />
              <circle className="leader-dot" cx="70" cy="460" r="4" />

              <path className="leader" d="M495,140 L830,120" />
              <circle className="leader-dot" cx="495" cy="140" r="4" />
              <circle className="leader-dot" cx="830" cy="120" r="4" />

              <path className="leader" d="M535,420 L830,460" />
              <circle className="leader-dot" cx="535" cy="420" r="4" />
              <circle className="leader-dot" cx="830" cy="460" r="4" />

              <circle className="pulse p1" r="3.4" />
              <circle className="pulse p2" r="3.4" />
              <circle className="pulse p3" r="3.4" />
              <circle className="pulse p4" r="3.4" />
            </g>
          </svg>

          {REASONS.map((r) => (
            <div key={r.badge} className={`callout ${r.position}`} style={r.style}>
              <span className="badge">{r.badge}</span>
              <div className="callout-text">
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mobile-list">
          {REASONS.map((r) => (
            <div key={r.badge} className="m-item">
              <span className="badge">{r.badge}</span>
              <div>
                <h3>{r.title}</h3>
                <p>{r.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
