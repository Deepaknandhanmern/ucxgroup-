"use client";

import { useRef, useState } from "react";

interface FaqItem {
  q: string;
  a: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    q: "How long does setup take?",
    a: "Most teams are up and running within a day. There's no heavy onboarding process — connect your workspace, invite your team, and you're ready to go.",
  },
  {
    q: "Can I change my plan later?",
    a: "Yes, you can upgrade, downgrade, or cancel at any time from your account settings. Changes take effect at the start of your next billing cycle.",
  },
  {
    q: "Do you offer support for teams?",
    a: "Every plan includes priority support. Larger teams get a dedicated onboarding specialist and a shared workspace for tracking requests.",
  },
  {
    q: "Is my data kept private?",
    a: "Your data is encrypted in transit and at rest, and it's never used to train external models. You can request a full export or deletion at any time.",
  },
  {
    q: "What if I need a custom integration?",
    a: "Our API covers most workflows out of the box. For anything bespoke, our team can scope a custom integration during onboarding.",
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

export default function FAQ() {
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

  return (
    <section className="ucx-faq">
      <div className="faq__rings">
        <i></i>
      </div>
      <div className="faq__vignette"></div>
      <div className="faq__inner">
        <p className="faq__eyebrow">FAQ</p>

        <div className="faq__head">
          <h2 className="faq__title">Frequently asked questions</h2>
          <p className="faq__sub">Everything you need to know before you get started. Can&rsquo;t find it here? Reach out to us directly.</p>
        </div>

        <div className="faq__list">
          {FAQ_ITEMS.map((item, i) => {
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
