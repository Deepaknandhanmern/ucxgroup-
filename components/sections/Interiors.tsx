"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { submitEnquiry } from "@/lib/save-enquiry";
import InteriorsHero from "@/components/sections/InteriorsHero";
import BeforeAfterSlider from "@/components/ui/BeforeAfterSlider";
import PromoBanner from "@/components/sections/PromoBanner";

const SERVICES = [
  {
    id: "architecture-planning",
    n: "01",
    name: "Architecture & Planning",
    statement: "From Concept to Coordinated Design",
    deliverables: ["Concept development", "Space planning", "Architectural & facade design", "Design development & detailing", "Refurbishment & adaptive reuse", "Planning & design documentation"],
    img: "/brand/interiors/svc-architecture-planning-a.webp",
  },
  {
    id: "interior-solutions",
    n: "02",
    name: "Interior Solutions",
    statement: "Interior Design With Delivery in Mind",
    deliverables: ["Workplace & commercial interiors", "Residential & hospitality interiors", "Retail interiors", "Space planning & interior detailing", "Renovation & refurbishment", "Turnkey interior solutions"],
    img: "/brand/interiors/svc-interior-solutions-a.webp",
  },
  {
    id: "design-development",
    n: "03",
    name: "Design Development",
    statement: "Developing Ideas Into Buildable Solutions",
    deliverables: ["Design development", "Material coordination", "Technical detailing", "Design coordination", "Constructability considerations"],
    img: "/brand/interiors/svc-design-development-a.webp",
  },
  {
    id: "construction-documentation",
    n: "04",
    name: "Construction Documentation",
    statement: "Information That Can Be Built",
    deliverables: ["Working drawings", "Detailed drawings", "BIM documentation", "Interior documentation", "Schedules", "Drawing coordination"],
    img: "/brand/interiors/svc-construction-documentation-a.webp",
  },
  {
    id: "bim-integrated-interiors",
    n: "05",
    name: "BIM-Integrated Interiors",
    statement: "Where Interior Design Meets Digital Delivery",
    deliverables: ["Interior BIM", "Furniture modelling", "Finish schedules", "Detailed interiors", "Coordination", "Fabrication-ready information"],
    img: "/brand/interiors/svc-bim-integrated-interiors-a.webp",
  },
  {
    id: "signage-wayfinding",
    n: "06",
    name: "Signage & Wayfinding",
    statement: "Guiding People Through the Spaces We Design",
    deliverables: ["Wayfinding strategy", "Signage design", "Environmental graphics", "Signage schedules", "Fabrication coordination", "Installation support"],
    img: "/brand/interiors/svc-signage-wayfinding-a.webp",
  },
];

const TESTIMONIALS = [
  {
    name: "Shruthi Ramesh",
    location: "Bangalore, India",
    role: "Renovation & Interior Design",
    quote:
      "UCX transformed our existing space with thoughtful design and practical solutions, delivering a renovation that feels both beautiful and functional.",
  },
  {
    name: "Veni",
    location: "Coimbatore, India",
    role: "Turnkey Interior Design & Execution",
    quote:
      "UCX handled our interior project with strong attention to detail and smooth coordination, delivering a space that reflected our requirements from design to execution.",
  },
  {
    name: "Jayaraman",
    location: "Udumalpet, India",
    role: "Renovation & Interior Design",
    quote:
      "UCX brought clarity to our renovation and interior project, providing practical solutions that transformed the existing space into a well-designed environment.",
  },
  {
    name: "Arun",
    location: "Coimbatore, India",
    role: "Architectural Turnkey & Interior Solutions",
    quote:
      "UCX provided a coordinated approach from architectural planning to interior execution, making the overall project delivery organised and seamless.",
  },
  {
    name: "Raghava",
    location: "Bangalore, India",
    role: "Interior Consultation & Design Solutions",
    quote:
      "UCX provided practical and well-considered interior solutions, helping us make confident decisions while creating a clear direction for the space.",
  },
];
const TESTIMONIALS_ROW_1 = TESTIMONIALS.slice(0, 2);
const TESTIMONIALS_ROW_2 = TESTIMONIALS.slice(2);

function testimonialInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="tm-card">
      <p className="tm-quote">&ldquo;{t.quote}&rdquo;</p>
      <div className="tm-person">
        <span className="tm-avatar">{testimonialInitials(t.name)}</span>
        <div className="tm-meta">
          <span className="tm-name">{t.name}</span>
          <span className="tm-role">{t.role}</span>
          <span className="tm-location">{t.location}</span>
        </div>
      </div>
    </div>
  );
}

const PROCESS_STEPS = [
  { n: "01", label: "Design", desc: "Concept through coordinated design intent." },
  { n: "02", label: "Documentation", desc: "Buildable, production-ready drawings." },
  { n: "03", label: "Procurement", desc: "Sourcing materials, furniture and finishes to spec." },
  { n: "04", label: "Execution & Delivery", desc: "On-site coordination through completion." },
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
    const { ok } = await submitEnquiry("interiors-enquiry", payload);
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
        {/* ---------- 360° VR experience promo card ---------- */}
        <a className="vr-promo" href="/design-interiors/vr-experience" data-reveal>
          <span className="vr-promo-badge">360&deg; VR Experience</span>
          <div className="vr-promo-copy">
            <h3>Step Inside a Real Project</h3>
            <p>Drag to look around a real UCX interior, rendered live in your browser.</p>
          </div>
          <span className="vr-promo-cta">
            Click Here
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </span>
        </a>

        {/* ---------- services ---------- */}
        <div className="svc-head" data-reveal>
          <span className="sub-eyebrow">What We Deliver</span>
        </div>
        <div className="services">
          {SERVICES.map((s) => (
            <div id={s.id} className="svc-tile" key={s.n} data-reveal tabIndex={0}>
              <div className="svc-media">
                <Ph src={s.img} alt={s.name} className="svc-img" />
              </div>
              <div className="svc-scrim" aria-hidden="true"></div>
              <span className="svc-index" aria-hidden="true">{s.n}</span>
              <div className="svc-content">
                <h3 className="svc-name">{s.name}</h3>
                <div className="svc-reveal">
                  <div className="svc-reveal-inner">
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
              </div>
            </div>
          ))}
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
              beforeSrc="/brand/home/delivery-before.webp"
              afterSrc="/brand/home/delivery-after.webp"
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

        <div className="promo-banner-slot" data-reveal>
          <PromoBanner
            src="/brand/interiors/promo-banner.webp"
            alt="SpayceX — Design With Intention. Delivered With Precision. Luxury interiors shaped by thoughtful design, refined detailing and coordinated delivery."
            href="#closing"
            ctaLabel="Start Your Project"
          />
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

        {/* ---------- testimonials: closes the page, right before the footer ---------- */}
        <div className="tm-head" data-reveal>
          <span className="sub-eyebrow">Testimonials</span>
          <h2 className="tm-title">What Our Clients Say</h2>
          <p className="tm-intro">Trusted through collaboration. Proven through delivery.</p>
        </div>
      </div>

      <div className="tm-marquee" data-reveal>
        <div className="tm-row">
          {[...TESTIMONIALS_ROW_1, ...TESTIMONIALS_ROW_1].map((t, i) => (
            <TestimonialCard t={t} key={`${t.name}-${i}`} />
          ))}
        </div>
        <div className="tm-row tm-row--reverse">
          {[...TESTIMONIALS_ROW_2, ...TESTIMONIALS_ROW_2].map((t, i) => (
            <TestimonialCard t={t} key={`${t.name}-${i}`} />
          ))}
        </div>
        <span className="tm-edge tm-edge--left" aria-hidden="true"></span>
        <span className="tm-edge tm-edge--right" aria-hidden="true"></span>
      </div>
    </div>
  );
}
