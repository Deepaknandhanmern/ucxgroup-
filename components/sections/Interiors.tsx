"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { submitToSplitForms } from "@/lib/splitforms";
import InteriorsHero from "@/components/sections/InteriorsHero";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";

const SERVICES = [
  {
    id: "architecture-planning",
    n: "01",
    name: "Architecture & Planning",
    statement: "From Concept to Coordinated Design",
    deliverables: ["Concept development", "Space planning", "Architectural design", "Design development", "Planning support", "Design documentation"],
    imgA: "/brand/interiors/svc-architecture-planning-a.jpg",
    imgB: "/brand/interiors/svc-architecture-planning-b.jpg",
  },
  {
    id: "interior-solutions",
    n: "02",
    name: "Interior Solutions",
    statement: "Interior Design With Delivery in Mind",
    deliverables: ["Workplace interiors", "Commercial interiors", "Residential interiors", "Hospitality & retail", "Space planning", "Interior detailing"],
    imgA: "/brand/interiors/svc-interior-solutions-a.jpg",
    imgB: "/brand/interiors/svc-interior-solutions-b.jpg",
  },
  {
    id: "design-development",
    n: "03",
    name: "Design Development",
    statement: "Developing Ideas Into Buildable Solutions",
    deliverables: ["Design development", "Material coordination", "Technical detailing", "Design coordination", "Constructability considerations"],
    imgA: "/brand/interiors/svc-design-development-a.jpg",
    imgB: "/brand/interiors/svc-design-development-b.jpg",
  },
  {
    id: "construction-documentation",
    n: "04",
    name: "Construction Documentation",
    statement: "Information That Can Be Built",
    deliverables: ["Working drawings", "Detailed drawings", "BIM documentation", "Interior documentation", "Schedules", "Drawing coordination"],
    imgA: "/brand/interiors/svc-construction-documentation-a.jpg",
    imgB: "/brand/interiors/svc-construction-documentation-b.jpg",
  },
  {
    id: "bim-integrated-interiors",
    n: "05",
    name: "BIM-Integrated Interiors",
    statement: "Where Interior Design Meets Digital Delivery",
    deliverables: ["Interior BIM", "Furniture modelling", "Finish schedules", "Detailed interiors", "Coordination", "Fabrication-ready information"],
    imgA: "/brand/interiors/svc-bim-integrated-interiors-a.jpg",
    imgB: "/brand/interiors/svc-bim-integrated-interiors-b.jpg",
  },
];

const PROCESS_STEPS = [
  { n: "01", label: "Design", desc: "Concept through coordinated design intent." },
  { n: "02", label: "Documentation", desc: "Buildable, production-ready drawings." },
  { n: "03", label: "Delivery", desc: "On-site coordination through completion." },
];

const CLOSING_STEPS = [
  { n: "01", label: "Share Your Brief", desc: "Send your requirements, drawings or inspiration our way." },
  { n: "02", label: "Discovery Call", desc: "We align on scope, style, timeline and objectives." },
  { n: "03", label: "Proposal & Scope", desc: "A tailored plan covering design, documentation and delivery." },
  { n: "04", label: "Project Kickoff", desc: "Our team gets to work bringing your space to life." },
];

const MATERIALS = [
  { name: "Timber Veneer", img: "/brand/interiors/material-timber.jpg" },
  { name: "Natural Stone", img: "/brand/interiors/material-stone.jpg" },
  { name: "Brushed Metal", img: "/brand/interiors/material-metal.jpg" },
  { name: "Textured Fabric", img: "/brand/interiors/material-fabric.jpg" },
  { name: "Matte Laminate", img: "/brand/interiors/material-laminate.jpg" },
  { name: "Glass & Glazing", img: "/brand/interiors/material-glass.jpg" },
];

function Ph({ src, alt, className }: { src: string; alt: string; className?: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className={`ph-fallback ${className ?? ""}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }
  return <img className={className} src={src} alt={alt} loading="lazy" onError={() => setOk(false)} />;
}

function CheckDot() {
  return (
    <svg className="svc-check" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.1" opacity=".35" />
      <path d="M5 8.2l2 2 4-4.4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

type LeadStatus = "idle" | "sending" | "sent" | "error";

export default function Interiors() {
  const sectRef = useRef<HTMLDivElement>(null);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");

  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLeadStatus("sending");
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = { subject: "SpayceX Interiors enquiry" };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });
    const { ok } = await submitToSplitForms(payload);
    setLeadStatus(ok ? "sent" : "error");
  }

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
    <div className="ucx-interiors" ref={sectRef}>
      <div className="cursor-haze"></div>

      {/* ---------- hero ----------
          Rendered outside .wrapper (which is max-width:1200px + padded)
          so it needs no negative-margin escape hack — it's a direct
          child of .ucx-interiors, which has no width constraint at all. */}
      <InteriorsHero />

      {/* ---------- marquee: full-bleed scrolling strip, right under the hero ---------- */}
      <div className="marquee-strip" aria-hidden="true">
        <div className="marquee-track">
          {[...SERVICES, ...SERVICES].map((s, i) => (
            <span key={i}>{s.name}</span>
          ))}
        </div>
      </div>

      <div className="wrapper">
        {/* ---------- services ---------- */}
        <div className="svc-head" data-reveal>
          <span className="sub-eyebrow">What We Deliver</span>
        </div>
        <div className="services">
          {SERVICES.map((s) => (
            <div id={s.id} className="svc-tile" key={s.n} data-reveal tabIndex={0}>
              <div className="svc-card svc-tile-front">
                <span className="svc-index">{s.n}</span>
                <div className="svc-media">
                  <Ph src={s.imgA} alt={s.name} className="svc-img svc-img-a" />
                  <Ph src={s.imgB} alt={s.name} className="svc-img svc-img-b" />
                </div>
                <h3 className="svc-name">{s.name}</h3>
                <span className="svc-cue" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </div>
              <div className="svc-tile-overlay">
                <span className="svc-index">{s.n}</span>
                <p className="svc-statement">{s.statement}</p>
                <ul className="svc-deliverables">
                  {s.deliverables.map((d) => (
                    <li key={d}>
                      <CheckDot />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
          <div className="svc-tile svc-tile--placeholder" data-reveal aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 8v8M8 12h8" />
            </svg>
            <span>More Services Coming Soon</span>
          </div>
        </div>

        {/* ---------- process band: animated stage timeline ---------- */}
        <div className="process-band" data-reveal>
          <span className="process-eyebrow">How We Work</span>
          <div className="process-track">
            {PROCESS_STEPS.map((step, i) => (
              <Fragment key={step.n}>
                <div className="process-step">
                  <div className="process-node">
                    <span>{step.n}</span>
                  </div>
                  <h4 className="process-label">{step.label}</h4>
                  <p className="process-desc">{step.desc}</p>
                </div>
                {i < PROCESS_STEPS.length - 1 && (
                  <div className="process-connector" aria-hidden="true">
                    <span className="process-connector-fill"></span>
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* ---------- featured project ---------- */}
        <div className="featured" data-reveal>
          <div className="featured-media">
            <BeforeAfterSlider
              beforeSrc="/brand/interiors/featured-before.jpg"
              afterSrc="/brand/interiors/featured-after.jpg"
              beforeAlt="The space before the fit-out"
              afterAlt="The completed fit-out"
            />
          </div>
          <div className="featured-copy">
            <span className="sub-eyebrow">Featured Project</span>
            <h3>A Fit-Out Delivered End to End</h3>
            <p>From concept design through technical documentation to on-site execution &mdash; one connected team, one point of accountability. Drag the slider to compare before and after.</p>
            <div className="featured-tags">
              <span>Design</span>
              <span>Documentation</span>
              <span>Site Coordination</span>
            </div>
          </div>
        </div>

        {/* ---------- materials & finishes ---------- */}
        <div className="mat-head" data-reveal>
          <span className="sub-eyebrow">Materials &amp; Finishes</span>
        </div>
        <div className="materials">
          {MATERIALS.map((m) => (
            <div className="mat-card" key={m.name} data-reveal tabIndex={0}>
              <div className="mat-swatch">
                <Ph src={m.img} alt={m.name} className="mat-img" />
                <span className="mat-beam" aria-hidden="true"></span>
              </div>
              <span className="mat-name">{m.name}</span>
            </div>
          ))}
        </div>

        {/* ---------- closing: copy + inline enquiry form ---------- */}
        <div id="closing" className="closing-final" data-reveal>
          <div className="closing-copy">
            <span className="closing-eyebrow">Start a Project</span>
            <h3>Have an Interiors Project in Mind?</h3>
            <p>From concept through delivery &mdash; let&rsquo;s bring your space to life. Here&rsquo;s what happens once you reach out.</p>
            <ul className="closing-steps">
              {CLOSING_STEPS.map((step) => (
                <li key={step.n}>
                  <span className="closing-step-badge">{step.n}</span>
                  <span className="closing-step-copy">
                    <strong>{step.label}</strong>
                    <span>{step.desc}</span>
                  </span>
                </li>
              ))}
            </ul>
            <a className="closing-link" href="/contact">
              Or reach us directly
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>

          <div className="closing-form-card">
            <img className="closing-logo" src="/brand/interiors/logo.png" alt="SpayceX" loading="lazy" />

            {leadStatus === "sent" ? (
              <div className="closing-done">
                <span>&#10003;</span>
                <p>Thanks &mdash; we&rsquo;ve got your enquiry and will be in touch shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit}>
                <input required type="text" name="name" placeholder="Your name" />
                <input required type="email" name="email" placeholder="you@email.com" />
                <input type="tel" name="phone" placeholder="Phone (optional)" />
                <textarea name="message" placeholder="Tell us about your project (optional)" rows={4}></textarea>
                <button type="submit" disabled={leadStatus === "sending"}>
                  {leadStatus === "sending" ? "Sending…" : "Start a Collaboration"}
                </button>
                {leadStatus === "error" && (
                  <p className="closing-error">Something went wrong &mdash; please try again.</p>
                )}
              </form>
            )}
          </div>
        </div>

        {/* ---------- client quote: closes the page, right before the footer ---------- */}
        <div className="quote-block" data-reveal>
          <svg className="quote-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7.17 6C4.87 6 3 7.87 3 10.17c0 2.02 1.44 3.7 3.35 4.08-.13.9-.6 1.7-1.35 2.25a.5.5 0 00.3.9c2.9 0 5.3-2.34 5.3-5.5V10.17C10.6 7.87 8.73 6 7.17 6zm10 0c-2.3 0-4.17 1.87-4.17 4.17 0 2.02 1.44 3.7 3.35 4.08-.13.9-.6 1.7-1.35 2.25a.5.5 0 00.3.9c2.9 0 5.3-2.34 5.3-5.5V10.17C20.6 7.87 18.73 6 17.17 6z" />
          </svg>
          <p className="quote-text">
            &ldquo;UCX delivered an outstanding interior design solution with a strong understanding of our requirements,
            professionalism and commitment to quality.&rdquo;
          </p>
          <div className="quote-meta">
            <span className="quote-name">Abishek</span>
            <span className="quote-role">Interior Design &middot; Singapore</span>
          </div>
        </div>
      </div>
    </div>
  );
}
