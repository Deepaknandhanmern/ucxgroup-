"use client";

import { useEffect, useRef } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

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
        <div className="proof-row" data-reveal>
          <div className="proof-media">
            <img src="/brand/home/delivery-before.webp" alt="A UCX project mid-construction" />
          </div>
          <div className="proof-copy">
            <h2 className="heading">Projects Are Connected.</h2>
            <p className="intro">
              From groundbreaking, every discipline works from one connected model &mdash; design, information and
              delivery moving together, not handed off between disconnected teams.
            </p>
          </div>
        </div>

        <div className="proof-row proof-row--reverse" data-reveal>
          <div className="proof-copy">
            <h2 className="heading">Delivery Should Be Too.</h2>
            <p className="intro">
              The same team that started the project carries that connection all the way through to handover
              &mdash; start to finish, one ecosystem.
            </p>
          </div>
          <div className="proof-media">
            <img src="/brand/home/delivery-after.webp" alt="The same project delivered and handed over" />
          </div>
        </div>

        <div className="proof-tags" data-reveal>
          <span>Design</span>
          <span>Digital Delivery</span>
          <span>Site Execution</span>
        </div>
      </div>
    </div>
  );
}
