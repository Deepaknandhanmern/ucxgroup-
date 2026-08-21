"use client";

import { useState } from "react";
import type { ReactNode } from "react";

interface Domain {
  title: string;
  tagline: string;
  desc: string;
  tags: string[];
  icon: ReactNode;
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

const DOMAINS: Domain[] = [
  {
    title: "BIM & Digital Innovation",
    tagline: "Connect Information. Improve Delivery.",
    desc: "Explore smarter BIM workflows, connected information systems and automation that improve how project data is created, coordinated and used.",
    tags: ["BIM workflows", "Information systems", "Automation", "Digital platforms"],
    icon: <Icon d="M12 3v6M12 15v6M4.5 7.5l5 3M14.5 13.5l5 3M19.5 7.5l-5 3M9.5 13.5l-5 3M12 9a3 3 0 100 6 3 3 0 000-6Z" />,
  },
  {
    title: "AI & Automation",
    tagline: "Apply Intelligence Where It Matters.",
    desc: "Explore practical applications of AI and automation that reduce repetitive work, support decision-making and improve AEC workflows.",
    tags: ["AI-assisted workflows", "Documentation", "Data analysis", "Process automation"],
    icon: <Icon d="M9 3h6v3H9V3ZM6 9h12v9a2 2 0 01-2 2H8a2 2 0 01-2-2V9ZM6 12H3M6 16H3M21 12h-3M21 16h-3M9.5 13h1M13.5 13h1M9 17.5h6" />,
  },
  {
    title: "Construction & Prefabrication",
    tagline: "Connect Design With Making.",
    desc: "Explore digital workflows that connect design information with fabrication, modular construction and on-site delivery.",
    tags: ["BIM-to-fabrication", "Modular systems", "Shop drawings", "Manufacturing data"],
    icon: <Icon d="M3 21V11l5 3v-3l5 3v-3l5 3v7H3ZM7 21v-4M12 21v-4M17 21v-4" />,
  },
  {
    title: "Smart Assets",
    tagline: "Extend Value Beyond Construction.",
    desc: "Explore connected asset information and digital systems that help buildings become more intelligent, measurable and manageable throughout their lifecycle.",
    tags: ["Asset information", "FM systems", "Digital twins", "Lifecycle data"],
    icon: <Icon d="M4 21V10l8-6 8 6v11M4 21h16M10 21v-5h4v5M12 3v4M9 3h6" />,
  },
  {
    title: "Design Technology",
    tagline: "Explore New Ways to Design.",
    desc: "Combine design thinking with computational and digital technologies to explore more adaptable, efficient and buildable solutions.",
    tags: ["Parametric design", "Computational workflows", "Generative design", "Design automation"],
    icon: <Icon d="M4 20L15 3l5 3-11 17H4v-3ZM12 8l4 2.5M9 12.5l4 2.5" />,
  },
  {
    title: "Sustainable Innovation",
    tagline: "Design for Long-Term Value.",
    desc: "Explore approaches that connect design, materials, technology and lifecycle thinking to improve environmental and project outcomes.",
    tags: ["Energy analysis", "Material optimisation", "Lifecycle thinking", "Sustainable systems"],
    icon: <Icon d="M12 21c-4-1.5-7-5-7-10a9 9 0 0114-7 9 9 0 01-7 17ZM12 21V9M9 12c0-2 1.5-3.5 3-4" />,
  },
];

type Status = "Concept" | "Open for Collaboration" | "Pilot" | "Exploration" | "Research";

interface Idea {
  title: string;
  category: string;
  desc: string;
  status: Status;
}

const IDEAS: Idea[] = [
  {
    title: "Smart Asset Management",
    category: "BIM + Asset Information",
    desc: "Exploring digital environments for asset, maintenance and space information.",
    status: "Concept",
  },
  {
    title: "BIM-to-Fabrication",
    category: "Prefabrication + Digital Delivery",
    desc: "Exploring connected workflows from coordinated BIM models to fabrication.",
    status: "Open for Collaboration",
  },
  {
    title: "Construction Monitoring",
    category: "BIM + Site Data",
    desc: "Exploring dashboards that connect site progress, issues and project information.",
    status: "Pilot",
  },
  {
    title: "Digital Twin for Operations",
    category: "Asset Intelligence",
    desc: "Exploring how structured project information can support asset operations.",
    status: "Exploration",
  },
  {
    title: "AI-Assisted Documentation",
    category: "AI + Automation",
    desc: "Exploring intelligent support for repetitive documentation workflows.",
    status: "Research",
  },
  {
    title: "Parametric Furniture System",
    category: "Interior Systems",
    desc: "Exploring configurable furniture systems connected to BIM and fabrication.",
    status: "Concept",
  },
];

const STATUS_CLASS: Record<Status, string> = {
  Concept: "concept",
  "Open for Collaboration": "open",
  Pilot: "pilot",
  Exploration: "exploration",
  Research: "research",
};

type Mode = "explore" | "ideas";

function ToggleRow({ mode, setMode, position = "top" }: { mode: Mode; setMode: React.Dispatch<React.SetStateAction<Mode>>; position?: "top" | "bottom" }) {
  return (
    <div className={`lx-toggle-row${position === "bottom" ? " lx-toggle-row--bottom" : ""}`}>
      <span className={`lx-toggle-label${mode === "explore" ? " is-active" : ""}`}>Where We Explore</span>
      <button
        type="button"
        role="switch"
        aria-checked={mode === "ideas"}
        aria-label="Switch between Where We Explore and Ideas in the Lab"
        className={`lx-switch${mode === "ideas" ? " is-on" : ""}`}
        onClick={() => setMode((m) => (m === "explore" ? "ideas" : "explore"))}
      >
        <span className="lx-switch-thumb"></span>
      </button>
      <span className={`lx-toggle-label${mode === "ideas" ? " is-active" : ""}`}>Ideas in the Lab</span>
    </div>
  );
}

export default function LabExplore() {
  const [mode, setMode] = useState<Mode>("explore");

  return (
    <div className="ucx-lab-explore" id="domains">
      <div className="lx-bg-grid" aria-hidden="true"></div>

      <div className="wrapper">
        <div className="head">
          <span className="eyebrow">Collaboration Lab</span>
          <h2 className="heading">{mode === "explore" ? "Where We Explore" : "Ideas in the Lab"}</h2>
          <p className="intro">
            {mode === "explore"
              ? "Six domains where technology, design and industry expertise come together."
              : "Early-stage concepts, active explorations and pilot opportunities."}
          </p>
        </div>

        <ToggleRow mode={mode} setMode={setMode} />

        {mode === "explore" ? (
          <div className="lx-fade" key="explore">
            <div className="li-grid">
              {DOMAINS.map((d, i) => (
                <div className="li-card" key={d.title}>
                  <div className="li-card-top">
                    <span className="li-number">{String(i + 1).padStart(2, "0")}</span>
                    <span className="li-icon-badge">{d.icon}</span>
                  </div>
                  <h3 className="li-title">{d.title}</h3>
                  <span className="li-category">{d.tagline}</span>
                  <p className="li-desc">{d.desc}</p>
                  <div className="li-tags">
                    {d.tags.map((t) => (
                      <span key={t}>{t}</span>
                    ))}
                  </div>
                  <a className="li-cta" href="/contact">
                    Explore Domain
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
            <ToggleRow mode={mode} setMode={setMode} position="bottom" />
          </div>
        ) : (
          <div className="lx-fade" key="ideas" id="ideas">
            <div className="li-grid">
              {IDEAS.map((idea, i) => (
                <div className="li-card" key={idea.title}>
                  <div className="li-card-top">
                    <span className="li-number">{String(i + 1).padStart(2, "0")}</span>
                    <span className={`li-status li-status-${STATUS_CLASS[idea.status]}`}>{idea.status}</span>
                  </div>
                  <h3 className="li-title">{idea.title}</h3>
                  <span className="li-category">{idea.category}</span>
                  <p className="li-desc">{idea.desc}</p>
                  <a className="li-cta" href="/contact">
                    Explore Idea
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h13M13 6l6 6-6 6" />
                    </svg>
                  </a>
                </div>
              ))}
            </div>
            <ToggleRow mode={mode} setMode={setMode} position="bottom" />
          </div>
        )}
      </div>
    </div>
  );
}
