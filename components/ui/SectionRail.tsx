"use client";

import { useEffect, useState } from "react";

export interface RailSection {
  id: string;
  label: string;
}

export default function SectionRail({ sections }: { sections: RailSection[] }) {
  const [active, setActive] = useState(sections[0]?.id);

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

  function jumpTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
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
  );
}
