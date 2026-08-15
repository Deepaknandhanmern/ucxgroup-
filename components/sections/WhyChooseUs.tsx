"use client";

import { useEffect, useRef, useState } from "react";

interface Reason {
  badge: string;
  title: string;
  desc: string;
  position: "tl" | "ml" | "bl" | "tr" | "br";
  style: { left?: string; right?: string; top: string };
}

const REASONS: Reason[] = [
  {
    badge: "01",
    title: "Integrated Expertise",
    desc: "Design, BIM, digital engineering and delivery support within one connected framework.",
    position: "tl",
    style: { left: "6%", top: "14%" },
  },
  {
    badge: "02",
    title: "Scalable Capacity",
    desc: "Extend your team without adding permanent delivery overhead.",
    position: "ml",
    style: { left: "6%", top: "48%" },
  },
  {
    badge: "03",
    title: "Technology-Enabled",
    desc: "BIM, automation, data and digital workflows integrated into project delivery.",
    position: "bl",
    style: { left: "6%", top: "82%" },
  },
  {
    badge: "04",
    title: "Delivery Discipline",
    desc: "Structured workflows, coordination and QA/QC aligned to project requirements.",
    position: "tr",
    style: { right: "6%", top: "24%" },
  },
  {
    badge: "05",
    title: "International Delivery",
    desc: "India-based delivery capability supporting international project teams.",
    position: "br",
    style: { right: "6%", top: "72%" },
  },
];

function signalStart(r: Reason): [number, number] {
  const x = r.style.left ? parseFloat(r.style.left) : 100 - parseFloat(r.style.right ?? "0");
  const y = parseFloat(r.style.top);
  return [x, y];
}

// The image is the "body" — every reason radiates straight out from its
// center like a spider's legs, so the diagram reads as one hub with 5 limbs.
const CENTER: [number, number] = [50, 50];

function radialPath(r: Reason): string {
  const [sx, sy] = signalStart(r);
  const [cx, cy] = CENTER;
  return `M${cx},${cy} L${sx},${sy}`;
}

export default function WhyChooseUs() {
  const sectRef = useRef<HTMLDivElement>(null);
  const [imgOk, setImgOk] = useState(true);

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
            <span className="eyebrow">Why UCX</span>
            <h2 className="heading">
              <span className="ln">More Than Capability.</span>
              <span className="ln stroke">A Connected Delivery Partner.</span>
            </h2>
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
            <span className="compass-caption">Global Delivery</span>
          </div>
        </div>

        <div className="diagram">
          {imgOk ? (
            <img
              className="diagram-image"
              src="/brand/why-ucx.png"
              alt="UCX connected delivery"
              onError={() => setImgOk(false)}
            />
          ) : (
            <div className="diagram-placeholder">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="M21 15l-5-5L5 21" />
              </svg>
              <span>Image placeholder &mdash; drop file at public/brand/why-ucx.png</span>
            </div>
          )}

          <svg className="signals" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {REASONS.map((r) => (
              <path key={r.badge} className="leader" d={radialPath(r)} vectorEffect="non-scaling-stroke" fill="none" />
            ))}
            <circle className="spire-tip" cx={CENTER[0]} cy={CENTER[1]} r="1.6" vectorEffect="non-scaling-stroke" />
            <circle className="beacon-ring" cx={CENTER[0]} cy={CENTER[1]} r="1.6" vectorEffect="non-scaling-stroke" />
            <circle className="beacon-ring" cx={CENTER[0]} cy={CENTER[1]} r="1.6" style={{ animationDelay: "1.2s" }} vectorEffect="non-scaling-stroke" />
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
