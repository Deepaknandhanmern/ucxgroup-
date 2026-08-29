"use client";

import { useEffect, useRef } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";
import SectionRail from "@/components/ui/SectionRail";
import CardThumb from "@/components/ui/CardThumb";
import FAQ from "@/components/sections/FAQ";

const RAIL_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "framework", label: "Framework" },
  { id: "modules", label: "Capabilities" },
  { id: "delivery", label: "Delivery Models" },
  { id: "closing", label: "Get Started" },
];

interface CapBlock {
  index: string;
  title: string;
  desc: string;
  img: string;
  tags: string[];
  ctaHref: string;
  ctaLabel: string;
}

const BLOCKS: CapBlock[] = [
  {
    index: "01",
    title: "BIM & Digital Delivery",
    desc: "Digital engineering from design through construction.",
    img: "/brand/capabilities/bim-digital-delivery.webp",
    tags: ["BIM & VDC", "Digital Engineering", "BIM Coordination", "Digital Construction", "Automation", "4D/5D"],
    ctaHref: "/bim-digital-delivery",
    ctaLabel: "Explore BIM & Digital Delivery",
  },
  {
    index: "02",
    title: "Design & Interiors",
    desc: "Integrated design from concept to construction-ready documentation.",
    img: "/brand/capabilities/design-interiors.webp",
    tags: ["Architecture", "Planning", "Interior Design", "Design Development", "Construction Documentation", "BIM-Integrated Interiors"],
    ctaHref: "/design-interiors",
    ctaLabel: "Explore Design & Interiors",
  },
  {
    index: "03",
    title: "Project & Construction Support",
    desc: "Connecting project information with coordinated execution.",
    img: "/brand/capabilities/project-construction-support.webp",
    tags: ["Project Documentation", "Project Controls", "Quantity & Data", "QA/QC", "Procurement", "Execution Support"],
    ctaHref: "/project-construction-support",
    ctaLabel: "Explore Project Support",
  },
  {
    index: "04",
    title: "Asset & Digital Information",
    desc: "Structuring information for handover, operations and long-term value.",
    img: "/brand/capabilities/asset-digital-information.webp",
    tags: ["As-Built BIM", "Asset Information", "COBie", "FM Models", "Digital Handover", "Digital Twin"],
    ctaHref: "/asset-digital-information",
    ctaLabel: "Explore Asset Information",
  },
];

interface ExtraBlock {
  index: string;
  eyebrow: string;
  title: string;
  desc: string;
  ctaHref: string;
  ctaLabel: string;
}

const EXTRA_BLOCKS: ExtraBlock[] = [
  {
    index: "05",
    eyebrow: "Specialist Solutions",
    title: "Engineering Beyond the Standard",
    desc: "Advanced solutions that solve complex project and delivery challenges.",
    ctaHref: "/specialist-solutions",
    ctaLabel: "Explore Specialist Solutions",
  },
  {
    index: "06",
    eyebrow: "Training & Workshop",
    title: "Build Capability for the Digital Future",
    desc: "Industry-focused BIM and digital delivery training for professionals and project teams.",
    ctaHref: "/training-workshop",
    ctaLabel: "Explore Our Programs",
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

const FAQS = [
  {
    q: "What capabilities does UCX offer?",
    a: "UCX offers four connected core capabilities — BIM & Digital Delivery, Design & Interiors, Project & Construction Support, and Asset & Digital Information — supported by Specialist Solutions and Training & Workshop programs.",
  },
  {
    q: "Does UCX work on one capability at a time, or across multiple capabilities?",
    a: "Both. UCX can deliver individual capabilities or connect design, digital engineering, delivery and asset information through one coordinated framework — from project intent to execution.",
  },
  {
    q: "What delivery models does UCX offer?",
    a: "Project-Based Delivery, Dedicated Delivery Teams, Overflow Capacity, White-Label Delivery, Strategic Partnership and Specialist Collaboration — flexible engagement models for different project and business requirements.",
  },
  {
    q: "Can UCX integrate with our existing team and standards?",
    a: "Yes. UCX adapts its delivery approach to your BIM standards, project requirements, LOD, documentation protocols, CDE environment and preferred technology platforms.",
  },
];

function FrameworkMotif() {
  return (
    <svg viewBox="0 0 300 300" aria-hidden="true">
      <circle className="fw-ring" cx="150" cy="150" r="132" />
      <circle className="fw-ring" cx="150" cy="150" r="108" />

      <g className="fw-spokes">
        <line x1="150" y1="150" x2="150" y2="46" />
        <line x1="150" y1="150" x2="254" y2="150" />
        <line x1="150" y1="150" x2="150" y2="254" />
        <line x1="150" y1="150" x2="46" y2="150" />
      </g>

      <circle className="fw-pulse p1" r="3.5" />
      <circle className="fw-pulse p2" r="3.5" />
      <circle className="fw-pulse p3" r="3.5" />
      <circle className="fw-pulse p4" r="3.5" />

      <g className="fw-hub">
        <circle className="fw-hub-ring" cx="150" cy="150" r="30" />
        <circle className="fw-hub-beacon" cx="150" cy="150" r="4" />
        <circle className="fw-hub-beacon-pulse" cx="150" cy="150" r="4" />
        <text className="fw-hub-label" x="150" y="154" textAnchor="middle">UCX</text>
      </g>

      <g className="fw-node">
        <circle cx="150" cy="46" r="6" />
        <text x="150" y="26" textAnchor="middle">DESIGN</text>
      </g>
      <g className="fw-node">
        <circle cx="254" cy="150" r="6" />
        <text x="254" y="176" textAnchor="middle">DIGITAL</text>
      </g>
      <g className="fw-node">
        <circle cx="150" cy="254" r="6" />
        <text x="150" y="280" textAnchor="middle">DELIVERY</text>
      </g>
      <g className="fw-node">
        <circle cx="46" cy="150" r="6" />
        <text x="46" y="176" textAnchor="middle">ASSET</text>
      </g>
    </svg>
  );
}

export default function Capabilities() {
  const sectRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();

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
      <SectionRail sections={RAIL_SECTIONS} />
      {/* ---------- hero: its own dark band, matching the home page Hero ---------- */}
      <div className="cap-hero-band" id="overview">
        <div className="grid-overlay"></div>
        <div className="hero">
          <div className="hero-copy" data-reveal>
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

          <div className="hero-motif" data-reveal>
            <FrameworkMotif />
          </div>
        </div>
      </div>

      <div className="cap-body" ref={bodyGlowRef}>
        <div className="grid-overlay"></div>
        <div className="grid-glow"></div>
        <div className="cursor-haze"></div>

        <div className="wrapper">
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
        <div className="blocks" id="modules">
          {BLOCKS.map((b) => (
            <div className="mod-card" key={b.index} data-reveal>
              <div className="mod-media">
                <CardThumb src={b.img} alt={b.title} />
              </div>
              <div className="mod-scrim" aria-hidden="true"></div>
              <span className="mod-index" aria-hidden="true">{b.index}</span>
              <div className="mod-content">
                <h3 className="mod-title">{b.title}</h3>
                <p className="mod-desc">{b.desc}</p>
                <div className="mod-reveal">
                  <div className="mod-reveal-inner">
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
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="blocks-extra">
          {EXTRA_BLOCKS.map((b) => (
            <div className="mod-card-sm" key={b.index} data-reveal>
              <span className="mod-sm-index" aria-hidden="true">{b.index}</span>
              <span className="mod-sm-eyebrow">{b.eyebrow}</span>
              <h3 className="mod-sm-title">{b.title}</h3>
              <p className="mod-sm-desc">{b.desc}</p>
              <a className="mod-sm-cta" href={b.ctaHref}>
                {b.ctaLabel}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </a>
            </div>
          ))}
        </div>

        {/* ---------- delivery models ---------- */}
        <div className="delivery" id="delivery" data-reveal>
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
          <div className="stats">
            {STATS.map((s) => (
              <div className="stat" key={s.label}>
                <span className="stat-value">{s.value}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ---------- FAQ ---------- */}
        <FAQ items={FAQS} title="Capabilities — Frequently Asked Questions" sub="Common questions about how UCX's capabilities work together. Can’t find it here? Reach out to us directly." />

        {/* ---------- final CTA ---------- */}
        <div className="closing" id="closing" data-reveal>
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
    </div>
  );
}
