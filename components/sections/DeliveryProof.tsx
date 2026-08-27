"use client";

import { useEffect, useRef } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";

export default function DeliveryProof() {
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
      className="ucx-proof"
      ref={(el) => {
        sectRef.current = el;
        glowRef.current = el;
      }}
    >
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="proof-grid" data-reveal>
          <div className="proof-media">
            <BeforeAfterSlider
              beforeSrc="/brand/home/delivery-before.png"
              afterSrc="/brand/home/delivery-after.png"
              beforeAlt="A UCX project mid-construction"
              afterAlt="The same project delivered and handed over"
            />
          </div>
          <div className="proof-copy">
            <span className="eyebrow">Proof, Not Promises</span>
            <h2 className="heading">
              Projects Are Connected.
              <br />
              Delivery Should Be Too.
            </h2>
            <p className="intro">
              One connected team carries every project from groundbreaking to
              handover &mdash; the same design, information and delivery
              ecosystem, start to finish. Drag the slider to compare.
            </p>
            <div className="proof-tags">
              <span>Design</span>
              <span>Digital Delivery</span>
              <span>Site Execution</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
