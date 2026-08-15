"use client";

import { useEffect, useRef, useState } from "react";
import { submitToSplitForms } from "@/lib/splitforms";

const SERVICES = [
  {
    id: "architecture-planning",
    n: "01",
    name: "Architecture & Planning",
    imgA: "/brand/interiors/svc-architecture-planning-a.jpg",
    imgB: "/brand/interiors/svc-architecture-planning-b.jpg",
  },
  {
    id: "interior-solutions",
    n: "02",
    name: "Interior Solutions",
    imgA: "/brand/interiors/svc-interior-solutions-a.jpg",
    imgB: "/brand/interiors/svc-interior-solutions-b.jpg",
  },
  {
    id: "design-development",
    n: "03",
    name: "Design Development",
    imgA: "/brand/interiors/svc-design-development-a.jpg",
    imgB: "/brand/interiors/svc-design-development-b.jpg",
  },
  {
    id: "construction-documentation",
    n: "04",
    name: "Construction Documentation",
    imgA: "/brand/interiors/svc-construction-documentation-a.jpg",
    imgB: "/brand/interiors/svc-construction-documentation-b.jpg",
  },
  {
    id: "bim-integrated-interiors",
    n: "05",
    name: "BIM-Integrated Interiors",
    imgA: "/brand/interiors/svc-bim-integrated-interiors-a.jpg",
    imgB: "/brand/interiors/svc-bim-integrated-interiors-b.jpg",
  },
];

const CATEGORIES = [
  { id: "workplace-office", n: "01", name: "Workplace & Office", img: "/brand/interiors/cat-workplace.jpg" },
  { id: "hospitality-retail", n: "02", name: "Hospitality & Retail", img: "/brand/interiors/cat-hospitality.jpg" },
  { id: "residential-interiors", n: "03", name: "Residential Interiors", img: "/brand/interiors/cat-residential.jpg" },
  { id: "custom-furniture", n: "04", name: "Custom Furniture", img: "/brand/interiors/cat-furniture.jpg" },
  { id: "modular-interiors", n: "05", name: "Modular Interiors", img: "/brand/interiors/cat-modular.jpg" },
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
  return <img className={className} src={src} alt={alt} onError={() => setOk(false)} />;
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

      <div className="wrapper">
        {/* ---------- hero: full-bleed image banner ---------- */}
        <div className="hero-banner" data-reveal>
          <Ph src="/brand/interiors/hero.jpg" alt="SpayceX interior project" className="hero-banner-img" />
          <div className="hero-banner-fade"></div>
          <div className="hero-banner-copy">
            <span className="eyebrow">Interiors</span>
            <h1 className="heading">Design, Documentation &amp; Delivery for Interior Environments</h1>
            <p className="intro">
              UCX combines interior design expertise with BIM, technical documentation, coordination and execution
              support to connect design intent with project delivery.
            </p>
            <a className="hero-cta" href="#categories">
              <span>Explore Our Work</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        {/* ---------- lead strip: full-bleed logo + horizontal form ---------- */}
        <div className="lead-strip" data-reveal>
          <img className="lead-strip-logo" src="/brand/interiors/logo.png" alt="SpayceX" />

          {leadStatus === "sent" ? (
            <p className="lead-strip-done">
              <span>&#10003;</span>
              Thanks &mdash; we&apos;ve got your enquiry and will be in touch shortly.
            </p>
          ) : (
            <form className="lead-strip-form" onSubmit={handleLeadSubmit}>
              <input required type="text" name="name" placeholder="Your name" />
              <input required type="email" name="email" placeholder="you@email.com" />
              <input type="tel" name="phone" placeholder="Phone (optional)" />
              <button type="submit" disabled={leadStatus === "sending"}>
                {leadStatus === "sending" ? "Sending…" : "Start a Project"}
              </button>
            </form>
          )}
          {leadStatus === "error" && <p className="lead-strip-error">Something went wrong &mdash; please try again.</p>}
        </div>

        {/* ---------- services ---------- */}
        <div className="svc-head" data-reveal>
          <span className="sub-eyebrow">What We Deliver</span>
        </div>
        <div className="services">
          {SERVICES.map((s) => (
            <div id={s.id} className="svc-card" key={s.n} data-reveal>
              <span className="svc-index">{s.n}</span>
              <div className="svc-media">
                <Ph src={s.imgA} alt={s.name} className="svc-img svc-img-a" />
                <Ph src={s.imgB} alt={s.name} className="svc-img svc-img-b" />
              </div>
              <h3 className="svc-name">{s.name}</h3>
            </div>
          ))}
        </div>

        {/* ---------- process band (inverted) ---------- */}
        <div className="band" data-reveal>
          <span className="band-step">Design</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">Documentation</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">Delivery</span>
        </div>

        {/* ---------- project categories ---------- */}
        <div id="categories" className="cat-head" data-reveal>
          <span className="sub-eyebrow">Project Categories</span>
        </div>
        <div className="categories">
          {CATEGORIES.map((c) => (
            <div id={c.id} className="cat-card" key={c.n} data-reveal>
              <span className="cat-index">{c.n}</span>
              <div className="cat-thumb">
                <Ph src={c.img} alt={c.name} className="cat-thumb-img" />
              </div>
              <span className="cat-name">{c.name}</span>
            </div>
          ))}
        </div>

        {/* ---------- featured project ---------- */}
        <div className="featured" data-reveal>
          <div className="featured-media">
            <Ph src="/brand/interiors/featured.jpg" alt="Featured SpayceX interior project" className="featured-img" />
          </div>
          <div className="featured-copy">
            <span className="sub-eyebrow">Featured Project</span>
            <h3>A Fit-Out Delivered End to End</h3>
            <p>From concept design through technical documentation to on-site execution &mdash; one connected team, one point of accountability.</p>
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
            <div className="mat-card" key={m.name} data-reveal>
              <Ph src={m.img} alt={m.name} className="mat-img" />
              <span className="mat-name">{m.name}</span>
            </div>
          ))}
        </div>

        {/* ---------- client quote ---------- */}
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

        {/* ---------- closing banner ---------- */}
        <div className="closing" data-reveal>
          <div className="closing-copy">
            <span className="closing-eyebrow">Start a Project</span>
            <h3>Have an Interiors Project in Mind?</h3>
            <p>From concept through delivery &mdash; let&rsquo;s bring your space to life.</p>
          </div>
          <a className="closing-cta" href="/contact">
            Start a Collaboration
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
