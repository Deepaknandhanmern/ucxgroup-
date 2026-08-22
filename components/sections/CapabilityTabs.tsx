"use client";

import { useState } from "react";
import type { CapabilityItem } from "@/components/sections/CapabilityPage";

export interface CapabilityTabsProps {
  eyebrow?: string;
  heading: string;
  description?: string;
  items: CapabilityItem[];
}

export default function CapabilityTabs({ eyebrow = "Capabilities", heading, description, items }: CapabilityTabsProps) {
  const [active, setActive] = useState(0);
  const current = items[active];

  return (
    <div className="ucx-captabs">
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
          </div>

          <div className="panel-tags">
            <span className="panel-tags-label">Typical Deliverables</span>
            <div className="tag-list">
              {current.deliverables.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
