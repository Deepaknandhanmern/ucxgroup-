"use client";

import { useEffect, useRef } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

interface Model {
  title: string;
  description: string;
  tint: "mint" | "dark";
}

const MODELS: Model[] = [
  { title: "Project Delivery", description: "Defined scopes. Clear deliverables.", tint: "mint" },
  { title: "Dedicated Teams", description: "Extend your team with UCX capability.", tint: "dark" },
  { title: "Flexible Delivery", description: "Scale when workloads and deadlines change.", tint: "mint" },
  { title: "White-Label Delivery", description: "Your brand. Our delivery capability.", tint: "dark" },
  { title: "Strategic Partnerships", description: "Build long-term delivery capability.", tint: "mint" },
];

export default function DeliveryModel() {
  const sectRef = useRef<HTMLDivElement>(null);
  const glowRef = useCursorGlow<HTMLDivElement>();

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
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
      { threshold: 0.2, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div
      className="ucx-model"
      ref={(el) => {
        sectRef.current = el;
        glowRef.current = el;
      }}
    >
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>
      <div className="wrapper">
        <div className="head" data-reveal>
          <span className="eyebrow">How We Work</span>
          <h2 className="heading">Built Around Your Delivery Model</h2>
          <p className="intro">Flexible ways to work with UCX&mdash;built around your project, capacity and growth.</p>
        </div>

        <div className="dm-steps" data-reveal>
          {MODELS.map((m, i) => (
            <div className={`dm-step is-${m.tint}`} key={m.title}>
              <span className="dm-step-num">0{i + 1}</span>
              <h3>{m.title}</h3>
              <p>{m.description}</p>
            </div>
          ))}
        </div>

        <div className="closing" data-reveal>
          <a className="closing-cta" href="/capabilities#delivery">
            Explore How We Work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
