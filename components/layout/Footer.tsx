"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import InteriorsFooter from "@/components/sections/InteriorsFooter";
import { submitToSplitForms } from "@/lib/splitforms";
import Toast from "@/components/ui/Toast";

const EMAIL = "collaborate@ucx-group.com";

const QUICK_LINKS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/experience", label: "Experience" },
  { href: "/collaboration-lab", label: "Collaboration Lab" },
  { href: "/insights", label: "Insights" },
  { href: "/about-us", label: "Company" },
  { href: "/contact", label: "Contact" },
];

type NewsletterStatus = "idle" | "submitting" | "error";

export default function Footer() {
  const pathname = usePathname();
  const [isInteriorsFilter, setIsInteriorsFilter] = useState(false);
  const [copied, setCopied] = useState(false);
  const [newsletterStatus, setNewsletterStatus] = useState<NewsletterStatus>("idle");
  const [toastShow, setToastShow] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
    }
  }

  async function handleNewsletterSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setNewsletterStatus("submitting");

    const form = e.currentTarget;
    const email = new FormData(form).get("email");
    const { ok } = await submitToSplitForms({
      subject: "Newsletter signup",
      email: String(email ?? ""),
    });

    if (ok) {
      form.reset();
      setNewsletterStatus("idle");
      setToastShow(true);
    } else {
      setNewsletterStatus("error");
    }
  }

  useEffect(() => {
    setIsInteriorsFilter(
      pathname === "/projects" && new URLSearchParams(window.location.search).get("filter") === "interiors"
    );
  }, [pathname]);

  const isInteriors = (pathname?.startsWith("/design-interiors") ?? false) || isInteriorsFilter;

  if (isInteriors) return <InteriorsFooter />;

  return (
    <footer className="ucx-footer">
      <div className="footer-top">
        <div className="badge-wrap">
            <svg viewBox="0 0 420 420" role="img" aria-label="UCX ecosystem badge: Design, Digital, Delivery, Asset">
              <defs>
                <radialGradient id="badgeGlow" cx="50%" cy="42%" r="65%">
                  <stop offset="0%" stopColor="var(--primary-light)" />
                  <stop offset="100%" stopColor="var(--primary)" />
                </radialGradient>
              </defs>

              <circle cx="210" cy="210" r="209" fill="var(--primary)" stroke="var(--secondary)" strokeWidth="1.5" opacity="1" />
              <circle cx="210" cy="210" r="198" fill="none" stroke="var(--white)" strokeWidth="0.75" opacity="0.18" />

              <g className="ring">
                <path id="arc1" fill="none" d="M226.5,52.9 A158,158 0 0,1 367.1,193.5" />
                <path id="arc2" fill="none" d="M367.1,226.5 A158,158 0 0,1 226.5,367.1" />
                <path id="arc3" fill="none" d="M193.5,367.1 A158,158 0 0,1 52.9,226.5" />
                <path id="arc4" fill="none" d="M52.9,193.5 A158,158 0 0,1 193.5,52.9" />

                <text className="ring-label">
                  <textPath href="#arc1" startOffset="50%" textAnchor="middle">&middot; DESIGN &middot;</textPath>
                </text>
                <text className="ring-label">
                  <textPath href="#arc2" startOffset="50%" textAnchor="middle">&middot; DIGITAL &middot;</textPath>
                </text>
                <text className="ring-label">
                  <textPath href="#arc3" startOffset="50%" textAnchor="middle">&middot; DELIVERY &middot;</textPath>
                </text>
                <text className="ring-label">
                  <textPath href="#arc4" startOffset="50%" textAnchor="middle">&middot; ASSET &middot;</textPath>
                </text>
              </g>

              <circle cx="210" cy="210" r="122" fill="url(#badgeGlow)" stroke="var(--secondary)" strokeWidth="1" opacity="1" />
              <image
                href="/brand/footer/ucx-mark-badge.png"
                x="122"
                y="177"
                width="176"
                height="90"
                preserveAspectRatio="xMidYMid meet"
              />
            </svg>
        </div>

        <div>
          <p className="eyebrow">UCX Engineering Technologies</p>
          <h2 className="headline">One connected delivery ecosystem</h2>
          <p className="services-line">DESIGN &middot; DIGITAL ENGINEERING &middot; PROJECT DELIVERY &middot; ASSET INFORMATION</p>

          <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
            <label className="newsletter-label" htmlFor="footer-newsletter-email">
              Stay connected — join our newsletter
            </label>
            <div className="newsletter-field">
              <input
                id="footer-newsletter-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                disabled={newsletterStatus === "submitting"}
              />
              <button type="submit" aria-label="Subscribe" disabled={newsletterStatus === "submitting"}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </div>
            {newsletterStatus === "error" && (
              <span className="newsletter-error">Something went wrong — please try again.</span>
            )}
          </form>
        </div>
      </div>

      <div className="footer-mid">
        <div>
          <p className="col-title">Quick Links</p>
          <ul className="col-links">
            {QUICK_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href}>{link.label}</a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="col-title">Contact Us</p>
          <a className="cta-link" href="/contact">
            Start a conversation <span>&rarr;</span>
          </a>
          <br />
          <span className="email-row">
            <a className="email-link" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <button type="button" className="email-copy" onClick={copyEmail} aria-label="Copy email address">
              {copied ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="12" height="12" rx="2" />
                  <path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1" />
                </svg>
              )}
            </button>
            {copied && <span className="email-copied-label">Copied</span>}
          </span>
        </div>

        <div>
          <p className="col-title">Follow</p>
          <div className="social-row">
            <a href="#" aria-label="LinkedIn"><img src="/brand/social.png" alt="" loading="lazy" /></a>
            <a href="#" aria-label="Instagram"><img src="/brand/instagram.png" alt="" loading="lazy" /></a>
            <a href="#" aria-label="YouTube"><img src="/brand/youtube.png" alt="" loading="lazy" /></a>
            <a href="#" aria-label="X (Twitter)">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} UCX. All rights reserved. <span className="credit">Designed &amp; Developed by Agape Works</span>
        </p>
        <ul className="legal-links">
          <li><a href="/privacy-policy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
          <li><a href="/cookies">Cookies</a></li>
        </ul>
      </div>

      <Toast show={toastShow} message="You're subscribed — thanks for joining." onDismiss={() => setToastShow(false)} />
    </footer>
  );
}
