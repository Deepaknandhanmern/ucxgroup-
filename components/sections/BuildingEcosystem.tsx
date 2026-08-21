"use client";

import { useEffect, useRef } from "react";

interface Pillar {
  index: string;
  title: string;
  desc: string;
}

const PILLARS: Pillar[] = [
  { index: "01", title: "Expertise", desc: "Multidisciplinary capability across design, BIM and project delivery." },
  { index: "02", title: "Platform", desc: "A connected environment where people, information and technology work together." },
  { index: "03", title: "Ecosystem", desc: "A network of clients, partners and specialists collaborating across opportunities." },
];

export default function BuildingEcosystem() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 90}ms`;
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
    <div className="ucx-buildeco" ref={sectRef}>
      <div className="grid-overlay" aria-hidden="true"></div>
      <div className="wrapper">
        <h2 className="heading" data-reveal>What We&apos;re Building: A Connected Delivery Ecosystem</h2>

        <div className="pillars">
          {PILLARS.map((p) => (
            <div className="pillar" data-reveal key={p.index}>
              <span className="pillar-index">{p.index}</span>
              <h3 className="pillar-title">{p.title}</h3>
              <p className="pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
