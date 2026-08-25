"use client";

import { useEffect, useRef, useState } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";
import { useMagnetic } from "@/components/ui/useMagnetic";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import { submitEnquiry } from "@/lib/save-enquiry";
import {
  IconGraduate,
  IconPresentation,
  IconUsers,
  IconTag,
  IconWrench,
  IconNodes,
  IconShieldCheck,
} from "@/components/sections/capabilityIcons";

type Category = "foundational" | "advanced" | "corporate";

interface Program {
  id: string;
  category: Category;
  format: string;
  title: string;
  statement: string;
  desc: string;
  outcomes: string[];
  icon: React.ReactNode;
}

const PROGRAMS: Program[] = [
  {
    id: "bim-fundamentals",
    category: "foundational",
    format: "2 Weeks · Instructor-Led",
    title: "BIM Fundamentals Training",
    statement: "Building the Foundation for Digital Delivery",
    desc: "Structured training in core BIM software, standards and workflows for professionals starting their digital delivery journey.",
    outcomes: ["BIM software training", "Modelling fundamentals", "Standards & workflows", "Hands-on exercises"],
    icon: IconGraduate,
  },
  {
    id: "advanced-vdc",
    category: "advanced",
    format: "4 Weeks · Hands-On Workshop",
    title: "Advanced BIM & VDC Workshops",
    statement: "Deepening Technical Capability",
    desc: "Hands-on workshops covering coordination, clash resolution and advanced modelling for teams ready to go beyond the basics.",
    outcomes: ["Multidisciplinary coordination", "Clash detection practice", "Advanced modelling techniques", "Applied case studies"],
    icon: IconPresentation,
  },
  {
    id: "corporate-training",
    category: "corporate",
    format: "Flexible · Custom Curriculum",
    title: "Corporate Training Programs",
    statement: "Tailored Training for Project Teams",
    desc: "Customised in-house programs designed around a firm's tools, standards and project requirements.",
    outcomes: ["Needs assessment", "Custom curriculum design", "Team-based training", "On-site & remote delivery"],
    icon: IconUsers,
  },
];

const FILTERS: { cat: Category | "all"; label: string }[] = [
  { cat: "all", label: "All Programs" },
  { cat: "foundational", label: "Foundational" },
  { cat: "advanced", label: "Advanced" },
  { cat: "corporate", label: "Corporate" },
];

const WHY = [
  { title: "Industry-Focused Curriculum", desc: "Built around real BIM and digital delivery workflows, not generic theory.", icon: IconTag },
  { title: "Hands-On, Project-Based Learning", desc: "Every program includes applied exercises and real project scenarios.", icon: IconWrench },
  { title: "Flexible Delivery Formats", desc: "In-person, remote or blended — designed around your team's schedule.", icon: IconNodes },
  { title: "Certification & Career Growth", desc: "Structured learning paths with measurable, certifiable outcomes.", icon: IconShieldCheck },
];

const FORMATS = [
  { n: "01", title: "Instructor-Led Workshops", desc: "Live, hands-on sessions guided by industry practitioners." },
  { n: "02", title: "Corporate & In-House Programs", desc: "Tailored training delivered at your organization, around your tools and standards." },
  { n: "03", title: "Self-Paced Certification Tracks", desc: "Structured, flexible learning with measurable, certifiable outcomes." },
];

type LeadStatus = "idle" | "sending" | "sent" | "error";

export default function TrainingWorkshop() {
  const sectRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();
  const talkCtaRef = useMagnetic<HTMLAnchorElement>();
  const [activeCat, setActiveCat] = useState<Category | "all">("all");
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");

  const list = activeCat === "all" ? PROGRAMS : PROGRAMS.filter((p) => p.category === activeCat);

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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLeadStatus("sending");
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = { subject: "Training & Workshop enquiry" };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });
    const { ok } = await submitEnquiry("training-workshop", payload);
    setLeadStatus(ok ? "sent" : "error");
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Training & Workshop",
    description: "Industry-focused BIM and digital delivery training for professionals and project teams.",
    provider: { "@type": "Organization", name: "UCX Group", url: "https://ucx-group.com" },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Training & Workshop",
      itemListElement: PROGRAMS.map((p) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Course", name: p.title, description: p.desc },
      })),
    },
  };

  return (
    <div className="ucx-cap ucx-train" ref={sectRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />

      {/* ---------- hero ---------- */}
      <div className="hero-band">
        <div className="grid-overlay"></div>
        <div className="hero">
          <div className="hero-copy" data-reveal>
            <Breadcrumbs
              variant="dark"
              items={[{ label: "Home", href: "/" }, { label: "Capabilities", href: "/capabilities" }, { label: "Training & Workshop" }]}
            />
            <span className="ghost-index" aria-hidden="true">06</span>
            <span className="eyebrow">Capabilities · Training & Workshop</span>
            <h1 className="heading">Build Capability for the Digital Future</h1>
            <p className="intro">Industry-focused BIM and digital delivery training for professionals and project teams — from fundamentals to certification.</p>

            <div className="train-stats">
              <div className="train-stat">
                <strong>5</strong>
                <span>Programs</span>
              </div>
              <div className="train-stat">
                <strong>100%</strong>
                <span>Practical</span>
              </div>
              <div className="train-stat">
                <strong>Yes</strong>
                <span>Certification Included</span>
              </div>
            </div>

            <div className="train-hero-actions">
              <a className="head-cta" href="#programs">
                Explore Our Programs
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v13M6 13l6 6 6-6" />
                </svg>
              </a>
              <a className="train-cta-ghost" href="#enquire" ref={talkCtaRef}>
                Talk to Our Training Team
              </a>
            </div>
          </div>

          <div className="hero-motif" data-reveal aria-hidden="true">
            {IconGraduate}
          </div>
        </div>
      </div>

      <div className="cap-body" ref={bodyGlowRef}>
        <div className="grid-overlay"></div>
        <div className="grid-glow"></div>
        <div className="cursor-haze"></div>

        <div className="wrapper">
          {/* ---------- programs ---------- */}
          <div className="prog-head" id="programs" data-reveal>
            <span className="sub-eyebrow">Our Programs</span>
            <h2>Five Ways to Build Digital Delivery Capability</h2>
          </div>

          <div className="prog-filters" data-reveal>
            {FILTERS.map((f) => (
              <button
                key={f.cat}
                type="button"
                className={`prog-filter${activeCat === f.cat ? " is-active" : ""}`}
                onClick={() => setActiveCat(f.cat)}
              >
                {f.label}
              </button>
            ))}
            <span className="prog-count">
              {list.length} {list.length === 1 ? "program" : "programs"}
            </span>
          </div>

          <div className="prog-grid">
            {list.map((p) => (
              <div className="prog-card" key={p.id} data-reveal>
                <div className="prog-card-head">
                  <span className="prog-icon">{p.icon}</span>
                  <span className="prog-format">{p.format}</span>
                </div>
                <h3 className="prog-title">{p.title}</h3>
                <p className="prog-statement">{p.statement}</p>
                <p className="prog-desc">{p.desc}</p>
                <div className="prog-outcomes">
                  <span className="outcomes-label">What You&rsquo;ll Learn</span>
                  <ul>
                    {p.outcomes.map((o) => (
                      <li key={o}>{o}</li>
                    ))}
                  </ul>
                </div>
                <a className="prog-cta" href="#enquire">
                  Enquire About This Program
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* ---------- why train with us ---------- */}
          <div className="why-band" data-reveal>
            <span className="sub-eyebrow">Why Train With Us</span>
            <div className="why-grid">
              {WHY.map((w) => (
                <div className="why-card" key={w.title}>
                  <span className="why-icon">{w.icon}</span>
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- delivery formats ---------- */}
          <div className="formats-band" data-reveal>
            <span className="sub-eyebrow">How You Can Train</span>
            <div className="formats-grid">
              {FORMATS.map((f) => (
                <div className="format-card" key={f.title}>
                  <span className="format-index">{f.n}</span>
                  <h4>{f.title}</h4>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ---------- enquiry ---------- */}
          <div id="enquire" className="enquire-final" data-reveal>
            <div className="enquire-copy">
              <span className="enquire-eyebrow">Get Started</span>
              <h3>Ready to Build Your Team&rsquo;s Capability?</h3>
              <p>Tell us about your training needs and we&rsquo;ll help you find the right program.</p>
            </div>

            <div className="enquire-form-card">
              {leadStatus === "sent" ? (
                <div className="enquire-done">
                  <span>&#10003;</span>
                  <p>Thanks &mdash; we&rsquo;ve got your enquiry and will be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <input required type="text" name="name" placeholder="Your name" />
                  <input required type="email" name="email" placeholder="you@email.com" />
                  <input type="tel" name="phone" placeholder="Phone (optional)" />
                  <select name="program" defaultValue="">
                    <option value="" disabled>Which program interests you?</option>
                    {PROGRAMS.map((p) => (
                      <option key={p.id} value={p.title}>{p.title}</option>
                    ))}
                  </select>
                  <textarea name="message" placeholder="Tell us about your training needs (optional)" rows={4}></textarea>
                  <button type="submit" disabled={leadStatus === "sending"}>
                    {leadStatus === "sending" ? "Sending…" : "Request Program Details"}
                  </button>
                  {leadStatus === "error" && (
                    <p className="enquire-error">Something went wrong &mdash; please try again.</p>
                  )}
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
