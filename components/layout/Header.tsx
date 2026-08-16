"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

type PanelKey = "capabilities" | "experience" | "lab" | "insights" | "company";

interface ColLink {
  href: string;
  label: string;
}

interface Col {
  index: string;
  title: string;
  desc: string;
  links: ColLink[];
  ctaHref: string;
  ctaLabel: string;
  theme?: "interiors";
}

interface Promo {
  eyebrow: string;
  title: string;
  desc?: string;
  ctaHref: string;
  ctaLabel: string;
  icon?: boolean;
  feature?: boolean;
}

interface Panel {
  key: PanelKey;
  ariaLabel: string;
  colsVariant: 3 | 4;
  cols: Col[];
  side: Promo[];
  sideSingle?: boolean;
}

interface MobileItem {
  key: PanelKey;
  label: string;
  icon?: boolean;
  links: ColLink[];
}

const NAV_ITEMS: { key: PanelKey; label: string; iconOnly?: boolean }[] = [
  { key: "capabilities", label: "Capabilities" },
  { key: "experience", label: "Experience" },
  { key: "lab", label: "Collaboration Lab", iconOnly: true },
  { key: "insights", label: "Insights" },
  { key: "company", label: "Company" },
];

const PANELS: Panel[] = [
  {
    key: "capabilities",
    ariaLabel: "Capabilities menu",
    colsVariant: 4,
    cols: [
      {
        index: "01",
        title: "BIM & Digital Delivery",
        desc: "Digital engineering from design through construction.",
        links: [
          { href: "#link-capabilities-bim-and-vdc", label: "BIM & VDC" },
          { href: "#link-capabilities-digital-engineering", label: "Digital Engineering" },
          { href: "#link-capabilities-bim-coordination", label: "BIM Coordination" },
          { href: "#link-capabilities-digital-construction", label: "Digital Construction" },
          { href: "#link-capabilities-automation-and-4d-5d", label: "Automation & 4D/5D" },
        ],
        ctaHref: "/bim-digital-delivery",
        ctaLabel: "Explore BIM & Digital Delivery",
      },
      {
        index: "02",
        title: "Design & Interiors",
        desc: "Integrated design and interior delivery.",
        theme: "interiors",
        links: [
          { href: "/interiors#architecture-planning", label: "Architecture & Planning" },
          { href: "/interiors#interior-solutions", label: "Interior Solutions" },
          { href: "/interiors#design-development", label: "Design Development" },
          { href: "/interiors#construction-documentation", label: "Construction Documentation" },
          { href: "/interiors#bim-integrated-interiors", label: "BIM-Integrated Interiors" },
        ],
        ctaHref: "/interiors",
        ctaLabel: "Explore Design & Interiors",
      },
      {
        index: "03",
        title: "Project & Construction Support",
        desc: "Coordinated support for project delivery.",
        links: [
          { href: "#link-capabilities-project-documentation", label: "Project Documentation" },
          { href: "#link-capabilities-project-controls", label: "Project Controls" },
          { href: "#link-capabilities-quantity-and-data", label: "Quantity & Data" },
          { href: "#link-capabilities-qa-qc", label: "QA/QC" },
          { href: "#link-capabilities-execution-support", label: "Execution Support" },
        ],
        ctaHref: "/project-construction-support",
        ctaLabel: "Explore Project Support",
      },
      {
        index: "04",
        title: "Asset & Digital Information",
        desc: "Structured information for handover and operations.",
        links: [
          { href: "#link-capabilities-as-built-bim", label: "As-Built BIM" },
          { href: "#link-capabilities-asset-information", label: "Asset Information" },
          { href: "#link-capabilities-cobie-and-data", label: "COBie & Data" },
          { href: "#link-capabilities-fm-models", label: "FM Models" },
          { href: "#link-capabilities-digital-handover-and-twin", label: "Digital Handover & Twin" },
        ],
        ctaHref: "/asset-digital-information",
        ctaLabel: "Explore Asset Information",
      },
    ],
    side: [
      {
        eyebrow: "01 — Specialist Solutions",
        title: "Engineering Beyond the Standard",
        desc: "Advanced solutions that solve complex project and delivery challenges.",
        ctaHref: "#link-capabilities-explore-specialist-solutions",
        ctaLabel: "Explore Specialist Solutions",
      },
      {
        eyebrow: "02 — Training & Workshop",
        title: "Build Capability for the Digital Future",
        desc: "Industry-focused BIM and digital delivery training for professionals and project teams.",
        ctaHref: "#link-capabilities-explore-our-programs",
        ctaLabel: "Explore Our Programs",
      },
    ],
  },
  {
    key: "experience",
    ariaLabel: "Experience menu",
    colsVariant: 3,
    sideSingle: true,
    cols: [
      {
        index: "01",
        title: "Built Environment",
        desc: "Projects spanning complex buildings, developments and infrastructure.",
        links: [
          { href: "#link-experience-commercial-and-mixed-use", label: "Commercial & Mixed-Use" },
          { href: "#link-experience-residential", label: "Residential" },
          { href: "#link-experience-industrial", label: "Industrial" },
          { href: "#link-experience-infrastructure", label: "Infrastructure" },
          { href: "#link-experience-specialized-projects", label: "Specialized Projects" },
          { href: "/projects", label: "Projects" },
        ],
        ctaHref: "/experience#areas",
        ctaLabel: "Explore Built Environment Projects",
      },
      {
        index: "02",
        title: "Design & Interiors",
        desc: "Design and delivery across diverse interior environments.",
        theme: "interiors",
        links: [
          { href: "/interiors#workplace-office", label: "Workplace & Office" },
          { href: "/interiors#hospitality-retail", label: "Hospitality & Retail" },
          { href: "/interiors#residential-interiors", label: "Residential Interiors" },
          { href: "/interiors#custom-furniture", label: "Custom Furniture" },
          { href: "/interiors#modular-interiors", label: "Modular Interiors" },
          { href: "/projects", label: "Projects" },
        ],
        ctaHref: "/interiors",
        ctaLabel: "Explore Interior Projects",
      },
      {
        index: "03",
        title: "Digital Project Experience",
        desc: "Technology-led delivery for complex project requirements.",
        links: [
          { href: "#link-experience-bim-and-vdc", label: "BIM & VDC" },
          { href: "#link-experience-scan-to-bim", label: "Scan-to-BIM" },
          { href: "#link-experience-as-built-bim", label: "As-Built BIM" },
          { href: "#link-experience-digital-engineering", label: "Digital Engineering" },
          { href: "#link-experience-prefabrication", label: "Prefabrication" },
          { href: "/projects", label: "Projects" },
        ],
        ctaHref: "/experience#areas",
        ctaLabel: "Explore Digital Projects",
      },
    ],
    side: [
      {
        eyebrow: "Selected Experience",
        title: "Built Through Collaboration",
        desc: "Explore how UCX connects design, digital engineering and delivery across real-world projects.",
        ctaHref: "/experience",
        ctaLabel: "Explore our Selected Experience",
        feature: true,
      },
    ],
  },
  {
    key: "lab",
    ariaLabel: "Collaboration Lab menu",
    colsVariant: 3,
    sideSingle: true,
    cols: [
      {
        index: "01",
        title: "About the Lab",
        desc: "Co-creating ideas, technologies and workflows for real-world AEC challenges.",
        links: [
          { href: "#link-lab-about-the-lab", label: "About the Lab" },
          { href: "#link-lab-how-it-works", label: "How It Works" },
          { href: "#link-lab-collaboration-process", label: "Collaboration Process" },
          { href: "/collaboration-lab#open-challenges", label: "Live Collaboration Ideas" },
        ],
        ctaHref: "/collaboration-lab",
        ctaLabel: "Explore the Lab",
      },
      {
        index: "02",
        title: "Collaboration Domains",
        desc: "Exploring innovation across the built environment.",
        links: [
          { href: "/collaboration-lab#domains", label: "BIM & Digital Innovation" },
          { href: "/collaboration-lab#domains", label: "Construction & Prefabrication" },
          { href: "/collaboration-lab#domains", label: "AI & Automation" },
          { href: "/collaboration-lab#domains", label: "Smart Assets" },
          { href: "/collaboration-lab#domains", label: "Design & Sustainable Innovation" },
        ],
        ctaHref: "#link-lab-explore-collaboration-domains",
        ctaLabel: "Explore Collaboration Domains",
      },
      {
        index: "03",
        title: "How We Collaborate",
        desc: "Flexible pathways to turn ideas into real-world solutions.",
        links: [
          { href: "#link-lab-project-collaboration", label: "Project Collaboration" },
          { href: "#link-lab-strategic-partnerships", label: "Strategic Partnerships" },
          { href: "#link-lab-co-innovation-and-pilots", label: "Co-Innovation & Pilots" },
          { href: "#link-lab-dedicated-delivery-teams", label: "Dedicated Delivery Teams" },
          { href: "#link-lab-specialist-partnerships", label: "Specialist Partnerships" },
        ],
        ctaHref: "#link-lab-explore-collaboration-models",
        ctaLabel: "Explore Collaboration Models",
      },
    ],
    side: [
      {
        eyebrow: "Have a challenge worth solving?",
        title: "Bring us a challenge, idea or opportunity.",
        desc: "Let's build the solution together.",
        ctaHref: "/collaboration-lab#open-challenges",
        ctaLabel: "Start a Collaboration",
        feature: true,
        icon: true,
      },
    ],
  },
  {
    key: "insights",
    ariaLabel: "Insights menu",
    colsVariant: 3,
    sideSingle: true,
    cols: [
      {
        index: "01",
        title: "Insights",
        desc: "Industry perspectives and practical knowledge.",
        links: [
          { href: "/insights", label: "All Insights" },
          { href: "#link-insights-bim-and-digital", label: "BIM & Digital" },
          { href: "#link-insights-design-and-interiors", label: "Design & Interiors" },
          { href: "#link-insights-technology-and-ai", label: "Technology & AI" },
        ],
        ctaHref: "/insights",
        ctaLabel: "Explore Insights",
      },
      {
        index: "02",
        title: "Project Knowledge",
        desc: "Lessons and outcomes from real project delivery.",
        links: [
          { href: "/case-studies", label: "Case Studies" },
          { href: "#link-insights-project-lessons", label: "Project Lessons" },
          { href: "#link-insights-delivery-insights", label: "Delivery Insights" },
        ],
        ctaHref: "/case-studies",
        ctaLabel: "Explore Case Studies",
      },
      {
        index: "03",
        title: "Resources",
        desc: "Practical tools and knowledge for project teams.",
        links: [
          { href: "#link-insights-guides", label: "Guides" },
          { href: "#link-insights-templates", label: "Templates" },
          { href: "#link-insights-reports", label: "Reports" },
        ],
        ctaHref: "/resources",
        ctaLabel: "Explore Resources",
      },
    ],
    side: [
      {
        eyebrow: "Featured",
        title: "Ideas That Move Projects Forward",
        desc: "Perspectives, lessons and emerging trends from the world of AEC.",
        ctaHref: "#link-insights-read-featured-insight",
        ctaLabel: "Read Featured Insight",
        feature: true,
      },
    ],
  },
  {
    key: "company",
    ariaLabel: "Company menu",
    colsVariant: 3,
    sideSingle: true,
    cols: [
      {
        index: "01",
        title: "About UCX",
        desc: "Our story, people and approach to connected project delivery.",
        links: [
          { href: "#link-company-our-story", label: "Our Story" },
          { href: "#link-company-our-approach", label: "Our Approach" },
          { href: "#link-company-leadership-and-team", label: "Leadership & Team" },
          { href: "/global-delivery#workspace", label: "Our Workspace" },
        ],
        ctaHref: "#link-company-explore-about-ucx",
        ctaLabel: "Explore About UCX",
      },
      {
        index: "02",
        title: "Global Delivery",
        desc: "India-based delivery supporting international project teams.",
        links: [
          { href: "/global-delivery#approach", label: "Delivery Model" },
          { href: "/global-delivery#overview", label: "Global Markets" },
          { href: "/global-delivery#quality", label: "Quality & Standards" },
        ],
        ctaHref: "/global-delivery",
        ctaLabel: "Explore Global Delivery",
      },
      {
        index: "03",
        title: "Careers",
        desc: "Build your career with a collaborative digital delivery team.",
        links: [
          { href: "/careers", label: "Life at UCX" },
          { href: "/careers#open-positions", label: "Open Positions" },
        ],
        ctaHref: "/careers",
        ctaLabel: "Explore Careers",
      },
    ],
    side: [
      {
        eyebrow: "Built Around Collaboration",
        title: "People, technology and expertise working together to deliver better.",
        ctaHref: "#link-company-meet-our-team",
        ctaLabel: "Meet Our Team",
        feature: true,
      },
    ],
  },
];

const MOBILE_ITEMS: MobileItem[] = [
  {
    key: "capabilities",
    label: "Capabilities",
    links: [
      { href: "/bim-digital-delivery", label: "BIM & Digital Delivery" },
      { href: "/interiors", label: "Design & Interiors" },
      { href: "/project-construction-support", label: "Project & Construction Support" },
      { href: "/asset-digital-information", label: "Asset & Digital Information" },
    ],
  },
  {
    key: "experience",
    label: "Experience",
    links: [
      { href: "/experience#areas", label: "Built Environment" },
      { href: "/interiors", label: "Design & Interiors" },
      { href: "/experience#areas", label: "Digital Project Experience" },
      { href: "/projects", label: "Projects" },
    ],
  },
  {
    key: "lab",
    label: "Collaboration Lab",
    icon: true,
    links: [
      { href: "#link-experience-about-the-lab", label: "About the Lab" },
      { href: "#link-experience-collaboration-domains", label: "Collaboration Domains" },
      { href: "#link-experience-how-we-collaborate", label: "How We Collaborate" },
    ],
  },
  {
    key: "insights",
    label: "Insights",
    links: [
      { href: "/insights", label: "Insights" },
      { href: "#link-insights-project-knowledge", label: "Project Knowledge" },
      { href: "/resources", label: "Resources" },
    ],
  },
  {
    key: "company",
    label: "Company",
    links: [
      { href: "#link-company-about-ucx", label: "About UCX" },
      { href: "/global-delivery", label: "Global Delivery" },
      { href: "/careers", label: "Careers" },
    ],
  },
];

const XMARK_SRC = "/brand/x-mark.png";

function Chevron({ className }: { className?: string }) {
  return (
    <svg className={className} width="10" height="6" viewBox="0 0 10 6" fill="none" aria-hidden="true">
      <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowRight({ width, height, viewBox, d }: { width: string; height: string; viewBox: string; d: string }) {
  return (
    <svg width={width} height={height} viewBox={viewBox} fill="none" aria-hidden="true">
      <path d={d} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Header() {
  const rootRef = useRef<HTMLElement>(null);
  const xIconRef = useRef<HTMLImageElement>(null);
  const pathname = usePathname();
  const isInteriors = pathname?.startsWith("/interiors") ?? false;

  const [openKey, setOpenKey] = useState<PanelKey | null>(null);
  const [mobileOpenKey, setMobileOpenKey] = useState<PanelKey | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const closeAll = () => setOpenKey(null);
  const openMenu = (key: PanelKey) => setOpenKey(key);

  // close on outside click / Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeAll();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") closeAll();
    }
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  // close mobile drawer if resized past breakpoint
  useEffect(() => {
    function onResize() {
      if (window.innerWidth > 960 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
        closeAll();
      }
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [isMobileMenuOpen]);

  // lock body scroll while mobile drawer open
  useEffect(() => {
    document.body.classList.toggle("ucxnav-lock", isMobileMenuOpen);
  }, [isMobileMenuOpen]);

  // sticky-bar "scrolled" state (drives logo collapse)
  useEffect(() => {
    const THRESHOLD = 24;
    let ticking = false;
    function apply() {
      const y = window.pageYOffset || document.documentElement.scrollTop || 0;
      setIsScrolled(y > THRESHOLD);
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(apply);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    apply();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Collaboration Lab X icon rotates while scrolling
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ticking = false;
    function rotate() {
      const deg = (window.pageYOffset || document.documentElement.scrollTop || 0) * 0.6;
      if (xIconRef.current) xIconRef.current.style.transform = `rotate(${deg % 360}deg)`;
      ticking = false;
    }
    function onScroll() {
      if (!ticking) {
        window.requestAnimationFrame(rotate);
        ticking = true;
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  function handleItemClick(e: React.MouseEvent, key: PanelKey) {
    e.stopPropagation();
    setOpenKey((prev) => (prev === key ? null : key));
  }

  function handleItemMouseEnter(key: PanelKey) {
    if (window.matchMedia("(hover:hover) and (min-width:961px)").matches) openMenu(key);
  }

  function handlePanelsMouseLeave() {
    if (window.matchMedia("(hover:hover) and (min-width:961px)").matches) closeAll();
  }

  function toggleMobileItem(key: PanelKey) {
    setMobileOpenKey((prev) => (prev === key ? null : key));
  }

  function toggleMobileMenu() {
    setIsMobileMenuOpen((prev) => {
      const next = !prev;
      if (!next) closeAll();
      return next;
    });
  }

  return (
    <header
      ref={rootRef}
      id="ucxnav"
      className={`ucxnav${isScrolled ? " is-scrolled" : ""}${isMobileMenuOpen ? " is-mobile-open" : ""}${isInteriors ? " ucxnav--interiors" : ""}`}
    >
      <div className="ucxnav__bar">
        <div className="ucxnav__inner">
          {/* ---------- Logo ---------- */}
          {isInteriors ? (
            <a href="/interiors" className="ucxnav__logo" aria-label="SpayceX — Design & Interiors by UCX, home">
              <img className="ucxnav__logo-img" src="/brand/interiors/logo.png" alt="SpayceX" />
            </a>
          ) : (
            <a href="/" className="ucxnav__logo" aria-label="UCX — Unconventional Collaboration, home">
              <span className="ucxnav__logo-lockup" aria-hidden="true">
                <span className="ucxnav__logo-word1">
                  <span className="ucxnav__logo-letter">U</span>
                  <span className="ucxnav__logo-rest">nconventional</span>
                </span>
                <span className="ucxnav__logo-word2">
                  <span className="ucxnav__logo-word2-text">
                    <span className="ucxnav__logo-letter ucxnav__logo-letter--mint">C</span>
                    <span className="ucxnav__logo-rest ucxnav__logo-rest--mint">ollaboration</span>
                  </span>
                  <span className="ucxnav__logo-xletter" aria-hidden="true">X</span>
                </span>
              </span>
              <span className="ucxnav__visually-hidden">UCX — Unconventional Collaboration</span>
            </a>
          )}

          {/* ---------- Primary nav ---------- */}
          <nav className="ucxnav__nav" aria-label="Primary">
            <ul className="ucxnav__list">
              {NAV_ITEMS.map((item) => (
                <li
                  key={item.key}
                  className={`ucxnav__item${item.iconOnly ? " ucxnav__item--icon" : ""}${
                    openKey === item.key ? " is-open" : ""
                  }`}
                  data-menu={item.key}
                  onMouseEnter={() => handleItemMouseEnter(item.key)}
                >
                  <button
                    className={`ucxnav__link${item.iconOnly ? " ucxnav__link--icon" : ""}`}
                    aria-expanded={openKey === item.key}
                    aria-controls={`panel-${item.key}`}
                    aria-label={item.iconOnly ? item.label : undefined}
                    onClick={(e) => handleItemClick(e, item.key)}
                  >
                    {item.iconOnly ? (
                      <>
                        <img
                          ref={xIconRef}
                          id="ucxnavXIcon"
                          className="ucxnav__xicon"
                          src={XMARK_SRC}
                          alt=""
                          aria-hidden="true"
                        />
                        <span className="ucxnav__link-label ucxnav__visually-hidden">{item.label}</span>
                      </>
                    ) : (
                      <>
                        {item.label}
                        <Chevron className="ucxnav__chev" />
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* ---------- Contact CTA ---------- */}
          <a href="/contact" className="ucxnav__cta">
            Contact
            <ArrowRight width="13" height="12" viewBox="0 0 13 12" d="M1 6H12M12 6L7.5 1M12 6L7.5 11" />
          </a>

          {/* ---------- Mobile toggle ---------- */}
          <button
            className="ucxnav__burger"
            id="ucxnavBurger"
            aria-expanded={isMobileMenuOpen}
            aria-controls="ucxnavMobile"
            aria-label="Open menu"
            onClick={toggleMobileMenu}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>

      {/* ================= DESKTOP MEGA PANELS ================= */}
      <div className="ucxnav__panels" id="ucxnavPanels" onMouseLeave={handlePanelsMouseLeave}>
        {PANELS.map((panel) => (
          <div
            key={panel.key}
            className={`ucxnav__panel${openKey === panel.key ? " is-active" : ""}`}
            id={`panel-${panel.key}`}
            role="region"
            aria-label={panel.ariaLabel}
          >
            <div className="ucxnav__panel-inner">
              <div className={`ucxnav__cols ucxnav__cols--${panel.colsVariant}`}>
                {panel.cols.map((col) => (
                  <div
                    className={`ucxnav__col${col.theme ? ` ucxnav__col--${col.theme}` : ""}`}
                    key={col.index}
                  >
                    {col.theme === "interiors" && (
                      <img className="ucxnav__col-logo" src="/brand/interiors/logo.png" alt="SpayceX" />
                    )}
                    <span className="ucxnav__col-index">{col.index}</span>
                    <h3 className="ucxnav__col-title">{col.title}</h3>
                    <p className="ucxnav__col-desc">{col.desc}</p>
                    <ul className="ucxnav__col-list">
                      {col.links.map((link) => (
                        <li key={link.label}>
                          <a href={link.href}>{link.label}</a>
                        </li>
                      ))}
                    </ul>
                    <a href={col.ctaHref} className="ucxnav__col-cta">
                      {col.ctaLabel}
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h13M13 6l6 6-6 6" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>

              <div className={`ucxnav__side${panel.sideSingle ? " ucxnav__side--single" : ""}`}>
                {panel.side.map((promo, i) => (
                  <div
                    className={`ucxnav__promo${promo.feature ? " ucxnav__promo--feature" : ""}`}
                    key={i}
                  >
                    {promo.icon && (
                      <img className="ucxnav__promo-xicon" src={XMARK_SRC} alt="" aria-hidden="true" />
                    )}
                    <span className="ucxnav__promo-eyebrow">{promo.eyebrow}</span>
                    <h4 className="ucxnav__promo-title">{promo.title}</h4>
                    {promo.desc && <p className="ucxnav__promo-desc">{promo.desc}</p>}
                    <a href={promo.ctaHref} className="ucxnav__promo-cta">
                      {promo.ctaLabel}{" "}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ================= MOBILE MENU ================= */}
      <div className="ucxnav__mobile" id="ucxnavMobile">
        <div className="ucxnav__mobile-scroll">
          <ul className="ucxnav__mobile-list">
            {MOBILE_ITEMS.map((item) => (
              <li
                key={item.key}
                className={`ucxnav__mobile-item${mobileOpenKey === item.key ? " is-open" : ""}`}
              >
                <button
                  className="ucxnav__mobile-trigger"
                  aria-expanded={mobileOpenKey === item.key}
                  onClick={() => toggleMobileItem(item.key)}
                >
                  {item.icon ? (
                    <span className="ucxnav__mobile-trigger-label">
                      <img
                        className="ucxnav__xicon ucxnav__xicon--sm"
                        src={XMARK_SRC}
                        alt=""
                        aria-hidden="true"
                      />
                      {item.label}
                    </span>
                  ) : (
                    item.label
                  )}
                  <Chevron />
                </button>
                <ul className="ucxnav__mobile-sub">
                  {item.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          <a href="/contact" className="ucxnav__mobile-cta">
            Contact
            <ArrowRight width="13" height="12" viewBox="0 0 13 12" d="M1 6H12M12 6L7.5 1M12 6L7.5 11" />
          </a>
        </div>
      </div>
    </header>
  );
}
