"use client";

import { useEffect, useRef, useState } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";
import { useMagnetic } from "@/components/ui/useMagnetic";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export interface CapabilityItem {
  title: string;
  statement: string;
  desc: string;
  deliverables: string[];
  icon: React.ReactNode;
  image?: string;
}

export interface RelatedCapability {
  label: string;
  href: string;
}

export interface CapabilityPageProps {
  index: string;
  eyebrow: string;
  title: string;
  intro: string;
  items: CapabilityItem[];
  process: [string, string, string];
  heroMotif: React.ReactNode;
  /** Optional real photo — shown in place of heroMotif once the file exists at this path. */
  heroImage?: string;
  /** Other capabilities to cross-link at the bottom of the page. */
  related?: RelatedCapability[];
  /** Replaces the default capability card grid — e.g. a <CapabilityTabs embedded /> explorer over the same items. */
  children?: React.ReactNode;
}

export default function CapabilityPage({ index, eyebrow, title, intro, items, process, heroMotif, heroImage, related, children }: CapabilityPageProps) {
  const sectRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();
  const closingCtaRef = useMagnetic<HTMLAnchorElement>();
  const [imgOk, setImgOk] = useState(true);

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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: intro,
    provider: { "@type": "Organization", name: "UCX Group", url: "https://ucx-group.com" },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: title,
      itemListElement: items.map((it) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: it.title, description: it.desc },
      })),
    },
  };

  return (
    <div className="ucx-cap" ref={sectRef}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      {/* ---------- hero: its own dark band, matching Hero.css ---------- */}
      <div className="hero-band">
        <div className="grid-overlay"></div>
        <div className="hero">
          <div className="hero-copy" data-reveal>
            <Breadcrumbs
              variant="dark"
              items={[{ label: "Home", href: "/" }, { label: "Capabilities", href: "/capabilities" }, { label: title }]}
            />
            <span className="ghost-index" aria-hidden="true">{index}</span>
            <span className="eyebrow">{eyebrow}</span>
            <h1 className="heading">{title}</h1>
            <p className="intro">{intro}</p>
            <a className="head-cta" href="#capabilities">
              Explore Capabilities
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v13M6 13l6 6 6-6" />
              </svg>
            </a>
          </div>

          <div className="hero-motif" data-reveal aria-hidden="true">
            {heroImage && imgOk ? (
              <img className="hero-motif-img" src={heroImage} alt="" onError={() => setImgOk(false)} />
            ) : (
              heroMotif
            )}
          </div>
        </div>
      </div>

      <div className="cap-body" ref={bodyGlowRef}>
        <div className="grid-overlay"></div>
        <div className="grid-glow"></div>
        <div className="cursor-haze"></div>

        <div className="wrapper">
        {/* ---------- process band (full-bleed) ---------- */}
        <div className="band" data-reveal>
          <span className="band-step">{process[0]}</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">{process[1]}</span>
          <span className="band-arrow">&rarr;</span>
          <span className="band-step">{process[2]}</span>
        </div>

        {/* ---------- services ---------- */}
        {children ?? (
          <>
            <div className="cap-head" id="capabilities" data-reveal>
              <span className="sub-eyebrow">Capabilities</span>
            </div>
            <div className="services">
              {items.map((it, i) => (
                <div className="service" key={it.title} data-reveal>
                  <div className="service-head">
                    <span className="service-index">{String(i + 1).padStart(2, "0")}</span>
                    <span className="service-icon">{it.icon}</span>
                  </div>
                  <div className="service-body">
                    <h3 className="service-title">{it.title}</h3>
                    <p className="service-statement">{it.statement}</p>
                    <p className="service-desc">{it.desc}</p>
                    <div className="service-deliverables">
                      <span className="deliverables-label">Typical Deliverables</span>
                      <ul>
                        {it.deliverables.map((d) => (
                          <li key={d}>{d}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ---------- related capabilities ---------- */}
        {related && related.length > 0 && (
          <div className="related" data-reveal>
            <span className="sub-eyebrow">See Also</span>
            <div className="related-links">
              {related.map((r) => (
                <a className="related-link" href={r.href} key={r.href}>
                  {r.label}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ---------- closing ---------- */}
        <div className="closing" data-reveal>
          <p>Have a project that needs this capability?</p>
          <a className="closing-cta" href="/contact" ref={closingCtaRef}>
            Start a Collaboration
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
