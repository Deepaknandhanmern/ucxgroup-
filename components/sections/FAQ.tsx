"use client";

import { useRef, useState } from "react";

export interface FaqItem {
  q: string;
  a: string;
}

const DEFAULT_FAQ_ITEMS: FaqItem[] = [
  {
    q: "What does UCX do?",
    a: "UCX provides BIM & Digital Delivery, Interior Solutions, Specialized Digital Solutions, and Training & Workshops. We help architects, consultants, contractors, developers and organizations improve how projects are designed, coordinated and delivered.",
  },
  {
    q: "Can UCX work as an extension of our existing team?",
    a: "Yes. UCX can integrate with your existing team through project-based support, dedicated BIM teams, white-label delivery, design collaboration or long-term strategic partnerships.",
  },
  {
    q: "Can UCX work with our standards, software and project workflows?",
    a: "Yes. We adapt our delivery approach to your BIM standards, project requirements, LOD, documentation protocols, CDE environment and preferred technology platforms.",
  },
  {
    q: "Can UCX support international projects?",
    a: "Yes. UCX is structured to collaborate with distributed project teams and support international projects through flexible digital delivery, design and BIM workflows aligned with client and project requirements.",
  },
  {
    q: "How do we start a project or collaboration with UCX?",
    a: "Share your project brief, requirements or available drawings/models with us. We begin with a discovery discussion to understand the scope, deliverables, timeline and objectives, then recommend the appropriate delivery and collaboration model.",
  },
];

function IconMedallion() {
  return (
    <span className="faq__icon-disc">
      <span className="faq__icon-face faq__icon-face--front">
        <span className="faq__icon-mark">
          <span></span>
          <span></span>
        </span>
      </span>
      <span className="faq__icon-face faq__icon-face--back">
        <span className="faq__icon-mark">
          <span></span>
          <span></span>
        </span>
      </span>
    </span>
  );
}

export default function FAQ({
  items = DEFAULT_FAQ_ITEMS,
  title = "Frequently asked questions",
  sub = "Everything you need to know before you get started. Can’t find it here? Reach out to us directly.",
}: {
  items?: FaqItem[];
  title?: string;
  sub?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [flippingIndex, setFlippingIndex] = useState<number | null>(null);
  const flipTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleToggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));

    setFlippingIndex(null);
    if (flipTimeout.current) clearTimeout(flipTimeout.current);
    requestAnimationFrame(() => {
      setFlippingIndex(i);
      flipTimeout.current = setTimeout(() => setFlippingIndex(null), 900);
    });
  }

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <section className="ucx-faq" id="faq">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="faq__bg-grid" aria-hidden="true"></div>
      <div className="faq__rings">
        <i></i>
      </div>
      <div className="faq__vignette"></div>
      <div className="faq__inner">
        <p className="faq__eyebrow">FAQ</p>

        <div className="faq__head">
          <h2 className="faq__title">{title}</h2>
          <p className="faq__sub">{sub}</p>
        </div>

        <div className="faq__list">
          {items.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <div className={`faq__item${isOpen ? " is-open" : ""}`} key={item.q}>
                <button className="faq__row" aria-expanded={isOpen} onClick={() => handleToggle(i)}>
                  <span className="faq__index">{String(i + 1).padStart(2, "0")}</span>
                  <span className="faq__q">{item.q}</span>
                  <span className={`faq__icon${flippingIndex === i ? " is-flipping" : ""}`}>
                    <IconMedallion />
                    <span className="faq__icon-sheen"></span>
                  </span>
                </button>
                <div className="faq__panel">
                  <div className="faq__panel-inner">
                    <p className="faq__a">{item.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="faq__foot">
          <p className="faq__foot-text">
            Still have questions? <strong>We&rsquo;re happy to help.</strong>
          </p>
          <a className="faq__cta" href="#contact-form">
            Contact us
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
