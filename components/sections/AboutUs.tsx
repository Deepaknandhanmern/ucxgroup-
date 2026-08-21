"use client";

import { useEffect, useRef } from "react";
import LinkPreview from "@/components/ui/LinkPreview";

export default function AboutUs() {
  const sectRef = useRef<HTMLDivElement>(null);

  // cursor spotlight
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

  // scroll-triggered kinetic reveal
  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const target = sect.querySelector<HTMLElement>(".copy");
    if (!target) return;

    if (!("IntersectionObserver" in window)) {
      target.classList.add("is-in");
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    io.observe(target);
    return () => io.disconnect();
  }, []);

  return (
    <div className="ucx-about" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="copy">
          <h1 className="heading">
            <span className="line-mask">
              <span className="line-inner">
                <LinkPreview href="/capabilities" image="/brand/capabilities/bim-digital-delivery.jpg" className="heading-link">
                  Projects Are Connected.
                </LinkPreview>
              </span>
            </span>
            <span className="line-mask">
              <span className="line-inner accent">
                <LinkPreview href="/capabilities" image="/brand/capabilities/bim-digital-delivery.jpg" className="heading-link">
                  Delivery Should Be Too.
                </LinkPreview>
              </span>
            </span>
          </h1>

          <div className="para-mask">
            <p className="lede">
              Modern projects bring together multiple disciplines, teams and technologies. Yet information often
              remains fragmented.
            </p>
          </div>
          <div className="para-mask">
            <p className="sub">
              UCX connects design, information and delivery through one integrated project ecosystem.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
