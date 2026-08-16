"use client";

import { useEffect, useRef } from "react";

const QUICK_LINKS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/projects", label: "Projects" },
  { href: "/insights", label: "Insights" },
  { href: "/contact", label: "Contact" },
];

export default function NotFoundContent() {
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
    <div className="ucx-404" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <span className="ghost" aria-hidden="true">404</span>

        <span className="eyebrow">Error 404</span>
        <h1>Off the Grid.</h1>
        <p>
          The page you&apos;re looking for doesn&apos;t exist, or has moved. Let&apos;s get you back to solid
          ground.
        </p>

        <a className="home-cta" href="/">
          Back to Home
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>

        <div className="quick-links">
          {QUICK_LINKS.map((l) => (
            <a href={l.href} key={l.href}>
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
