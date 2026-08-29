"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { TEAM } from "@/lib/team";
import PromoBanner from "./PromoBanner";

function FounderPhoto({ src, alt, initials }: { src: string; alt: string; initials: string }) {
  const [ok, setOk] = useState(true);
  if (ok) {
    return <img className="photo-flip-img" src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
  }
  return (
    <>
      <span className="mark">{initials}</span>
      <span className="photo-caption">Photo coming soon</span>
    </>
  );
}

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
          {TEAM.map((f) => (
            <div className="founder" key={f.index}>
              <span className="founder-index" aria-hidden="true">{f.index}</span>
              <div className="founder-body">
                <h3 className="name">{f.name}</h3>
                <span className="role">{f.role}</span>

                <div className="photo-flip" tabIndex={0}>
                  <div className="photo-flip-front">
                    <FounderPhoto src={f.image} alt={f.name} initials={f.initials} />
                    <span className="photo-flip-cue" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M6 9l6 6 6-6" />
                      </svg>
                    </span>
                  </div>
                  <div className="photo-flip-overlay">
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
          ))}
        </div>

        <PromoBanner
          src="/brand/founders/promo-banner.webp"
          alt="UCX — Connect. Coordinate. Deliver. Integrated BIM, digital delivery, design and project capability."
          href="/contact"
        />

        <div className="team-cta-row">
          <Link href="/team" className="team-cta">
            Meet the UCX Team
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
