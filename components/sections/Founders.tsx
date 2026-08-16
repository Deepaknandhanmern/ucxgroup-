"use client";

import { useEffect, useRef } from "react";

interface Founder {
  index: string;
  initials: string;
  name: string;
  role: string;
  bio: string;
  focus: string[];
}

const FOUNDERS: Founder[] = [
  {
    index: "01",
    initials: "SR",
    name: "Shangeeth Raju",
    role: "Co-Founder | BIM & Digital Delivery",
    bio: "Leads UCX's BIM, digital delivery and technology strategy, with a focus on coordinated project workflows and scalable digital delivery.",
    focus: ["BIM", "Digital Delivery", "Technology", "Project Strategy"],
  },
  {
    index: "02",
    initials: "BH",
    name: "Bhuvaneshwari",
    role: "Co-Founder | Interiors & Business",
    bio: "Leads UCX's interiors and business development direction, connecting design capability with client requirements and commercial growth.",
    focus: ["Interiors", "Business Development", "Client Strategy", "Growth"],
  },
];

export default function Founders() {
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
    <div className="ucx-founders" id="founders" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <span className="eyebrow">Leadership</span>
        <h2 className="heading">Our Founders</h2>
        <p className="tagline">Different Expertise. One Direction.</p>
        <p className="intro">
          UCX is built by people with complementary experience across architecture, BIM, interiors, technology and
          business, united by a shared ambition to build something different.
        </p>

        <div className="roster">
          {FOUNDERS.map((f) => (
            <div className="founder" key={f.index}>
              <span className="founder-index" aria-hidden="true">{f.index}</span>
              <div className="founder-body">
                <h3 className="name">{f.name}</h3>
                <span className="role">{f.role}</span>

                <div className="photo-flip">
                  <div className="photo-flip-inner">
                    <div className="photo-flip-face photo-flip-front">
                      <span className="mark">{f.initials}</span>
                      <span className="photo-caption">Photo coming soon</span>
                    </div>
                    <div className="photo-flip-face photo-flip-back">
                      <p className="bio">{f.bio}</p>
                      <span className="focus-label">Focus</span>
                      <div className="focus-tags">
                        {f.focus.map((item) => (
                          <span key={item}>{item}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="team-cta-row">
          <a href="#link-company-leadership-and-team" className="team-cta">
            Meet the UCX Team
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
