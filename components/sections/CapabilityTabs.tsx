"use client";

import { useEffect, useRef, useState } from "react";
import type { CapabilityItem } from "@/components/sections/CapabilityPage";
import CardThumb from "@/components/ui/CardThumb";

export interface CapabilityTabsProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: CapabilityItem[];
  /** Render without its own outer padding/max-width — for nesting inside another section's wrapper (e.g. CapabilityPage's capabilitiesSlot). */
  embedded?: boolean;
}

export default function CapabilityTabs({ eyebrow = "Capabilities", heading, description, items, embedded }: CapabilityTabsProps) {
  const [active, setActive] = useState(0);
  const current = items[active];
  const rootRef = useRef<HTMLDivElement>(null);

  // Header mega-menu links land here as #service-1, #service-2, etc. (1-based,
  // matching the item's position) — select and scroll to that tab, since only
  // the active tab's panel exists in the DOM for a plain anchor to land on.
  useEffect(() => {
    const match = window.location.hash.match(/^#service-(\d+)$/);
    if (!match) return;
    const index = Number(match[1]) - 1;
    if (index < 0 || index >= items.length) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- deferred to the client, mirrors ContactForm's ?type= handling
    setActive(index);
    rootRef.current?.scrollIntoView({ block: "start" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- run once on mount only
  }, []);

  return (
    <div className={`ucx-captabs${embedded ? " ucx-captabs--embedded" : ""}`} id="capabilities" ref={rootRef}>
      <div className="wrapper">
        <div className="head">
          <span className="eyebrow">{eyebrow}</span>
          <h2 className="heading">{heading}</h2>
          {description && <p className="description">{description}</p>}
        </div>

        <div className="tab-triggers" role="tablist" aria-label={heading}>
          {items.map((it, i) => (
            <button
              key={it.title}
              type="button"
              role="tab"
              id={`captabs-trigger-${i}`}
              aria-selected={active === i}
              aria-controls={`captabs-panel-${i}`}
              className={`tab-trigger${active === i ? " is-active" : ""}`}
              onClick={() => setActive(i)}
            >
              <span className="tab-icon" aria-hidden="true">{it.icon}</span>
              {it.title}
            </button>
          ))}
        </div>

        <div className="panel" role="tabpanel" id={`captabs-panel-${active}`} aria-labelledby={`captabs-trigger-${active}`}>
          <div className="panel-copy">
            <span className="panel-badge">{current.title}</span>
            <h3 className="panel-title">{current.statement}</h3>
            <p className="panel-desc">{current.desc}</p>
            <a className="panel-cta" href="#capabilities">
              Explore Capabilities
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <div className="panel-tags">
              <span className="panel-tags-label">Typical Deliverables</span>
              <div className="tag-list">
                {current.deliverables.map((d) => (
                  <span key={d}>{d}</span>
                ))}
              </div>
              {current.noteText && (
                <p className="panel-note">
                  <strong>{current.noteLabel}:</strong> {current.noteText}
                </p>
              )}
            </div>
          </div>

          <div className="panel-side">
            <div className="panel-thumb">
              <CardThumb src={current.image} alt={current.title} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
