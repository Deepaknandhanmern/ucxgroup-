"use client";

import { useEffect, useRef, useState } from "react";

export interface RailSection {
  id: string;
  label: string;
}

export default function SectionRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const targets = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [sections]);

  // close the mobile popover on outside click / Escape
  useEffect(() => {
    if (!mobileOpen) return;
    function onDocClick(e: MouseEvent) {
      if (mobileRef.current && !mobileRef.current.contains(e.target as Node)) setMobileOpen(false);
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileOpen(false);
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMobileOpen(false);
  }

  const activeLabel = sections.find((s) => s.id === active)?.label ?? sections[0]?.label;

  return (
    <>
      <nav className="ucx-rail" aria-label="Section navigation">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`rail-dot${active === s.id ? " is-active" : ""}`}
            onClick={() => jumpTo(s.id)}
            aria-label={`Jump to ${s.label}`}
            aria-current={active === s.id ? "true" : undefined}
          >
            <span className="rail-dot-mark" aria-hidden="true" />
            <span className="rail-dot-label">{s.label}</span>
          </button>
        ))}
      </nav>

      <div className="ucx-rail-mobile" ref={mobileRef}>
        {mobileOpen && (
          <div className="ucx-rail-mobile-list" role="menu">
            {sections.map((s) => (
              <button
                key={s.id}
                type="button"
                role="menuitem"
                className={`ucx-rail-mobile-item${active === s.id ? " is-active" : ""}`}
                onClick={() => jumpTo(s.id)}
                aria-current={active === s.id ? "true" : undefined}
              >
                {s.label}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          className="ucx-rail-mobile-trigger"
          aria-expanded={mobileOpen}
          aria-label="Jump to section"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span className="ucx-rail-mobile-dot" aria-hidden="true" />
          {activeLabel}
          <svg
            className={`ucx-rail-mobile-chevron${mobileOpen ? " is-open" : ""}`}
            width="10"
            height="6"
            viewBox="0 0 10 6"
            fill="none"
            aria-hidden="true"
          >
            <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </>
  );
}
