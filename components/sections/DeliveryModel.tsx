"use client";

import { useEffect, useRef } from "react";
import HowItWorks, { type Step, type StepPosition } from "@/components/ui/how-it-works";

const MINT_TINT = { bg: "bg-[#91F2B5]/15", text: "text-[#00352D]", border: "border-[#91F2B5]/50" };
const DARK_TINT = { bg: "bg-[#00352D]/[0.04]", text: "text-[#00352D]", border: "border-[#00352D]/12" };

const STEP_POSITIONS: StepPosition[] = [
  { className: "md:absolute md:top-0 md:left-[10%]", rotate: "md:rotate-8" },
  { className: "md:absolute md:top-[83px] md:right-[10%]", rotate: "md:-rotate-8" },
  { className: "md:absolute md:top-[310px] md:left-[10%]", rotate: "md:rotate-8" },
  { className: "md:absolute md:top-[393px] md:right-[6%]", rotate: "md:-rotate-8" },
];

const MODELS: Step[] = [
  { title: "Project Delivery", description: "Defined scopes. Clear deliverables.", colors: MINT_TINT },
  { title: "Dedicated Teams", description: "Extend your team with UCX capability.", colors: DARK_TINT },
  { title: "Flexible Delivery", description: "Scale when workloads and deadlines change.", colors: MINT_TINT },
  { title: "Strategic Partnerships", description: "Build long-term delivery capability.", colors: DARK_TINT },
];

export default function DeliveryModel() {
  const sectRef = useRef<HTMLDivElement>(null);

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
    <div className="ucx-model" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="wrapper">
        <div className="head" data-reveal>
          <span className="eyebrow">How We Work</span>
          <h2 className="heading">Built Around Your Delivery Model</h2>
          <p className="intro">Flexible ways to work with UCX&mdash;built around your project, capacity and growth.</p>
        </div>

        <div className="dm-track" data-reveal>
          <HowItWorks
            features={MODELS}
            stepPositions={STEP_POSITIONS}
            trackHeight={620}
            className="!bg-[#F3F1E6] dark:!bg-[#F3F1E6] !py-0 !px-0"
          />
        </div>

        <div className="closing" data-reveal>
          <a className="closing-cta" href="/collaboration-lab">
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
