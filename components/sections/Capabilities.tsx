"use client";

import { useEffect, useRef } from "react";

interface CapBlock {
  index: string;
  title: string;
  desc: string;
  tags: string[];
  ctaHref: string;
  ctaLabel: string;
}

const BLOCKS: CapBlock[] = [
  {
    index: "01",
    title: "BIM & Digital Delivery",
    desc: "Digital engineering from design through construction.",
    tags: ["BIM & VDC", "Digital Engineering", "BIM Coordination", "Digital Construction", "Automation", "4D/5D"],
    ctaHref: "/bim-digital-delivery",
    ctaLabel: "Explore BIM & Digital Delivery",
  },
  {
    index: "02",
    title: "Design & Interiors",
    desc: "Integrated design from concept to construction-ready documentation.",
    tags: ["Architecture", "Planning", "Interior Design", "Design Development", "Construction Documentation", "BIM-Integrated Interiors"],
    ctaHref: "/interiors",
    ctaLabel: "Explore Design & Interiors",
  },
  {
    index: "03",
    title: "Project & Construction Support",
    desc: "Connecting project information with coordinated execution.",
    tags: ["Project Documentation", "Project Controls", "Quantity & Data", "QA/QC", "Procurement", "Execution Support"],
    ctaHref: "/project-construction-support",
    ctaLabel: "Explore Project Support",
  },
  {
    index: "04",
    title: "Asset & Digital Information",
    desc: "Structuring information for handover, operations and long-term value.",
    tags: ["As-Built BIM", "Asset Information", "COBie", "FM Models", "Digital Handover", "Digital Twin"],
    ctaHref: "/asset-digital-information",
    ctaLabel: "Explore Asset Information",
  },
];

const TAG_ROW = ["BIM & Digital Delivery", "Design & Interiors", "Project Support", "Asset Information"];

interface DeliveryModel {
  index: string;
  title: string;
  desc: string;
}

const DELIVERY_MODELS: DeliveryModel[] = [
  { index: "01", title: "Project-Based Delivery", desc: "Defined scope. Clear deliverables. Dedicated execution." },
  { index: "02", title: "Dedicated Delivery Teams", desc: "Extend your organisation with a dedicated UCX delivery team." },
  { index: "03", title: "Overflow Capacity", desc: "Scale capacity when workloads increase or deadlines tighten." },
  { index: "04", title: "White-Label Delivery", desc: "UCX operates within your brand and delivery structure." },
  { index: "05", title: "Strategic Partnership", desc: "Build long-term delivery capability for recurring requirements." },
  { index: "06", title: "Specialist Collaboration", desc: "Access specialized BIM, digital engineering, automation or asset capabilities when required." },
];

const STATS = [
  { value: "30+", label: "Projects Delivered" },
  { value: "07+", label: "Disciplines Covered" },
  { value: "03+", label: "Countries Served" },
];

export default function Capabilities() {
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

  // scroll reveal
  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 80}ms`;
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ucx-caphub" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        {/* ---------- hero ---------- */}
        <div className="head" id="overview" data-reveal>
          <span className="eyebrow">Capabilities</span>
          <h1 className="heading">Connected expertise for better project delivery.</h1>
          <p className="intro">
            UCX brings together BIM, digital engineering, design, project delivery and asset information through
            one connected delivery framework.
          </p>
          <p className="intro">
            From design development and BIM coordination to construction documentation, execution support and
            digital handover, we help project teams connect information, people and technology across the project
            lifecycle.
          </p>

          <div className="tags">
            {TAG_ROW.map((t) => (
              <span key={t}>{t}</span>
            ))}
          </div>

          <div className="hero-actions">
            <a className="cta-solid" href="/contact">
              Start a Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="cta-ghost" href="#framework">
              Explore Our Capabilities
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v13M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ---------- framework intro ---------- */}
        <div className="framework" id="framework" data-reveal>
          <span className="sub-eyebrow">One Framework</span>
          <h2 className="framework-title">One Framework. Four Connected Capabilities.</h2>
          <div className="framework-copy">
            <p>Projects are rarely limited by one discipline. They are challenged by the gaps between them.</p>
            <p>
              UCX connects design, digital engineering, delivery and asset information through one coordinated
              framework, helping project teams move from intent to information, and from information to execution.
            </p>
          </div>
          <p className="framework-tagline">Different disciplines. One coordinated approach.</p>
        </div>

        {/* ---------- four connected capabilities: modular grid ---------- */}
        <div className="blocks">
          {BLOCKS.map((b) => (
            <div className="mod-card" key={b.index} data-reveal>
              <span className="mod-index" aria-hidden="true">{b.index}</span>
              <h3 className="mod-title">{b.title}</h3>
              <p className="mod-desc">{b.desc}</p>
              <div className="mod-tags">
                {b.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
              <a className="mod-cta" href={b.ctaHref}>
                {b.ctaLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* ---------- delivery models ---------- */}
        <div className="delivery" data-reveal>
          <span className="sub-eyebrow">Engage UCX Around the Way Your Organisation Works</span>
          <h2 className="delivery-title">Capabilities That Adapt to Your Delivery Model</h2>
          <p className="delivery-intro">
            Rather than forcing every client into the same service structure, UCX provides flexible delivery
            models for different project and business requirements.
          </p>

          <div className="delivery-list">
            {DELIVERY_MODELS.map((m) => (
              <div className="delivery-row" key={m.index} data-reveal>
                <span className="delivery-index">{m.index}</span>
                <h3 className="delivery-name">{m.title}</h3>
                <p className="delivery-desc">{m.desc}</p>
              </div>
            ))}
          </div>

          <a className="delivery-cta" href="/contact">
            Discuss Your Delivery Model
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {/* ---------- technology band ---------- */}
        <div className="tech-band" data-reveal>
          <h2>Technology That Enables Delivery</h2>
          <p>
            UCX uses established BIM, coordination, information management, automation and visualization
            technologies according to project requirements.
          </p>
          <span className="tech-tagline">Technology is the enabler. Delivery is the outcome.</span>
        </div>

        {/* ---------- stats ---------- */}
        <div className="stats-block" data-reveal>
          <span className="sub-eyebrow">Capability Is Proven Through Delivery</span>
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- final CTA ---------- */}
        <div className="closing" data-reveal>
          <div className="closing-copy">
            <h3>Need the Right Delivery Capability for Your Project?</h3>
            <p>
              Bring us the requirement. We&apos;ll help structure the right delivery approach. From BIM and digital
              engineering to design, project support and asset information, UCX can integrate with your existing
              team and workflow.
            </p>
          </div>
          <div className="closing-actions">
            <a className="closing-cta" href="/contact">
              Start a Conversation
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="closing-cta closing-cta--ghost" href="/collaboration-lab#domains">
              Explore Collaboration Models
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
