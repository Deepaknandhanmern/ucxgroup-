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

interface Program {
  id: string;
  n: string;
  format: string;
  title: string;
  statement: string;
  desc: string;
  outcomes: string[];
  idealFor: string;
  ctaLabel: string;
  icon: React.ReactNode;
}

const PROGRAMS: Program[] = [
  {
    id: "bim-fundamentals",
    n: "01",
    format: "5 Weeks · Online / Hybrid",
    title: "BIM Fundamentals",
    statement: "Build a Strong BIM Foundation",
    desc: "A structured introduction to BIM, modelling principles and essential workflows for students and professionals beginning their digital delivery journey.",
    outcomes: [
      "BIM fundamentals & principles",
      "Revit modelling essentials",
      "Project setup & standards",
      "Views, sheets & documentation",
      "Basic project workflows",
      "Practical modelling exercises",
    ],
    idealFor: "Students, freshers, architects and professionals starting their BIM journey.",
    ctaLabel: "Explore BIM Fundamentals",
    icon: IconGraduate,
  },
  {
    id: "bim-advanced",
    n: "02",
    format: "10 Weeks · Online / Hybrid",
    title: "BIM Advanced",
    statement: "Develop Technical & Coordination Skills",
    desc: "Take your BIM skills beyond modelling with advanced workflows focused on project coordination, documentation and efficient digital delivery.",
    outcomes: [
      "Advanced Revit workflows",
      "BIM coordination",
      "Model management",
      "Advanced documentation",
      "Families & project standards",
      "Clash detection & coordination",
      "Real-world project exercises",
    ],
    idealFor: "BIM professionals and designers looking to strengthen their technical and project delivery capabilities.",
    ctaLabel: "Explore BIM Advanced",
    icon: IconPresentation,
  },
  {
    id: "bim-professional",
    n: "03",
    format: "15 Weeks · Online / Hybrid",
    title: "BIM Professional",
    statement: "Prepare for Real-World BIM Delivery",
    desc: "An industry-focused program designed to develop professional BIM capability across modelling, coordination, documentation, standards and project workflows.",
    outcomes: [
      "Professional BIM workflows",
      "Project standards & information management",
      "Multidisciplinary coordination",
      "BIM QA/QC",
      "Advanced documentation",
      "Project-based delivery",
      "Industry best practices",
    ],
    idealFor: "Experienced professionals and BIM practitioners preparing for higher-level project responsibilities.",
    ctaLabel: "Explore BIM Professional",
    icon: IconUsers,
  },
];

const WHY = [
  { title: "Industry-Led Learning", desc: "Learn from professionals who work with BIM and digital delivery on real projects — not just from theoretical course material.", icon: IconTag },
  { title: "Project-Based Practice", desc: "Build skills through practical exercises and project scenarios that reflect actual industry workflows.", icon: IconWrench },
  { title: "Software + Workflow", desc: "Go beyond learning software. Understand how BIM is applied, coordinated and delivered within real project environments.", icon: IconNodes },
  { title: "Career-Focused Development", desc: "Develop practical skills that can strengthen your portfolio, workplace performance and readiness for BIM roles.", icon: IconShieldCheck },
];

const FORMATS = [
  { n: "01", title: "Learn With Industry Experts", desc: "Live online and hybrid sessions led by industry professionals, with dual-monitor learning for demonstrations, practice and real-time guidance." },
  { n: "02", title: "Learn. Specialise. Get Certified.", desc: "Progress through Autodesk-recognised certification-focused BIM programs with specialist workshops designed to build practical, industry-ready skills." },
  { n: "03", title: "Learn Beyond the Course", desc: "Attend specialist workshops, receive career guidance and build the practical knowledge needed to move confidently into professional BIM roles." },
];

type LeadStatus = "idle" | "sending" | "sent" | "error";

export default function TrainingWorkshop() {
  const sectRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();
  const talkCtaRef = useMagnetic<HTMLAnchorElement>();
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");
  const [heroImgOk, setHeroImgOk] = useState(true);

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
                <strong>3</strong>
                <span>Professional Programs</span>
              </div>
              <div className="train-stat">
                <strong>100%</strong>
                <span>Practical &amp; Project-Based</span>
              </div>
              <div className="train-stat">
                <strong>Certified</strong>
                <span>Globally recognised</span>
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
            {heroImgOk ? (
              <img
                className="hero-motif-img"
                src="/brand/capabilities/training-workshop.webp"
                alt=""
                onError={() => setHeroImgOk(false)}
              />
            ) : (
              IconGraduate
            )}
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
            <h2>Three Levels. One Clear Path to BIM Proficiency.</h2>
          </div>

          <div className="prog-grid">
            {PROGRAMS.map((p) => (
              <div className="prog-card" key={p.id} data-reveal>
                <div className="prog-card-head">
                  <span className="prog-icon">{p.icon}</span>
                  <span className="prog-format">{p.format}</span>
                </div>
                <span className="prog-index">{p.n}</span>
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
                <p className="prog-idealfor">
                  <strong>Ideal for:</strong> {p.idealFor}
                </p>
                <a className="prog-cta" href="#enquire">
                  {p.ctaLabel}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </a>
              </div>
            ))}
          </div>

          {/* ---------- why learn with us ---------- */}
          <div className="why-band" data-reveal>
            <span className="sub-eyebrow">Why Learn With Us?</span>
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
            <span className="sub-eyebrow">How You Can Learn</span>
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
              <h3>Ready to Build Your BIM Career?</h3>
              <p>Tell us where you are in your BIM journey, and we&rsquo;ll help you choose the right program for your goals.</p>
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
                    <option value="" disabled>Which program are you interested in?</option>
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
