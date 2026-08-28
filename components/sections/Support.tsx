"use client";

import { useEffect, useRef, useState } from "react";
import { submitEnquiry } from "@/lib/save-enquiry";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

interface SupportLine {
  href: string;
  name: string;
  copy: string;
  icon: React.ReactNode;
}

const LINES: SupportLine[] = [
  {
    href: "/contact?type=bim#contact-form",
    name: "BIM & Digital Delivery",
    copy: "Model coordination, LOD, clash detection and information handover — direct access to the team delivering your project.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M24 6 41 15.5v19L24 44 7 34.5v-19L24 6Z" />
        <path d="M7 15.5 24 25l17-9.5M24 25v19" />
        <path d="M15.5 10.75 32.5 20.25v9.5" />
      </svg>
    ),
  },
  {
    href: "/contact?type=interior#contact-form",
    name: "Interior Solutions",
    copy: "Layouts, materials, joinery and design development — connected directly to our interiors team.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M6 40V17.5L24 6l18 11.5V40H6Z" />
        <path d="M6 30h13V40M19 30h23" />
        <path d="M28 30V19.5h9V30" />
      </svg>
    ),
  },
  {
    href: "/contact?type=training#contact-form",
    name: "Training & Workshops",
    copy: "Courses, schedules, certification and team enrolment — everything you need to build digital capability.",
    icon: (
      <svg viewBox="0 0 48 48">
        <path d="M24 7 44 16 24 25 4 16 24 7Z" />
        <path d="M12 20v11c0 3.9 5.4 7 12 7s12-3.1 12-7V20" />
        <path d="M40 18v10" />
      </svg>
    ),
  },
];

type QueryStatus = "idle" | "sending" | "sent" | "error";

export default function Support() {
  const sectRef = useRef<HTMLElement>(null);
  const glowRef = useCursorGlow<HTMLElement>();
  const [status, setStatus] = useState<QueryStatus>("idle");

  async function handleQuerySubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = { subject: "Homepage query" };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });
    const { ok } = await submitEnquiry("homepage-query", payload);
    setStatus(ok ? "sent" : "error");
  }

  useEffect(() => {
    const section = sectRef.current;
    if (!section) return;

    const targets = [
      section.querySelector<HTMLElement>(".ucx-support__lead"),
      ...Array.from(section.querySelectorAll<HTMLElement>(".ucx-line")),
      section.querySelector<HTMLElement>(".ucx-final"),
    ].filter((el): el is HTMLElement => el !== null);

    targets.forEach((el, i) => {
      el.setAttribute("data-reveal", "");
      el.style.transitionDelay = `${i * 90}ms`;
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
    <section
      className="ucx-support"
      id="support"
      ref={(el) => {
        sectRef.current = el;
        glowRef.current = el;
      }}
    >
      <div className="ucx-bg-grid"></div>
      <div className="ucx-bg-aurora">
        <span className="b1"></span>
        <span className="b2"></span>
        <span className="b3"></span>
      </div>
      <div className="ucx-cursor-haze"></div>
      <div className="ucx-support__inner">
        <div className="ucx-support__lead">
          <span className="ucx-support__eyebrow">Support</span>
          <h2 className="ucx-support__title">
            Talk to the Right
            <br />
            Team. First Time.
          </h2>
          <p className="ucx-support__sub">Three direct channels. Your enquiry goes straight to the people who understand the work.</p>
          <a className="ucx-support__cta" href="/contact">
            <span>Book a call</span>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        <div className="ucx-support__lines">
          {LINES.map((line) => (
            <a className="ucx-line" href={line.href} key={line.name}>
              <span className="ucx-line__icon" aria-hidden="true">
                {line.icon}
              </span>
              <span className="ucx-line__body">
                <span className="ucx-line__head">
                  <span className="ucx-line__name">{line.name}</span>
                  <svg className="ucx-line__arrow" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </span>
                <span className="ucx-line__copy">{line.copy}</span>
              </span>
            </a>
          ))}
        </div>
      </div>

      <div className="ucx-final">
        <div className="ucx-final__copy">
          <span className="ucx-final__eyebrow">Have a Project to Deliver?</span>
          <h3>Let&rsquo;s Build a Better Way to Deliver It.</h3>
          <p>Whether you need BIM expertise, additional delivery capacity, digital engineering support or a long-term project partner &mdash; let&rsquo;s collaborate.</p>
          <div className="ucx-final__ctas">
            <a className="ucx-final__cta-primary" href="/contact">
              <span>Start a Collaboration</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="ucx-final__cta-ghost" href="/capabilities">
              <span>Explore Capabilities</span>
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <form className="ucx-final__form" onSubmit={handleQuerySubmit}>
          {status === "sent" ? (
            <div className="ucx-final__done">
              <span>&#10003;</span>
              <span>Thanks — we&apos;ve got your query and will be in touch shortly.</span>
            </div>
          ) : (
            <>
              <span className="ucx-final__label">Have Queries?</span>
              <input required type="text" name="name" placeholder="Your name" />
              <input required type="email" name="email" placeholder="you@email.com" />
              <textarea name="message" placeholder="What's your question?"></textarea>
              {status === "error" && <p className="ucx-final__error">Something went wrong — please try again.</p>}
              <button type="submit" disabled={status === "sending"}>
                {status === "sending" ? "Sending…" : "Send Query"}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
