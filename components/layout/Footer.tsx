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
            <a href="#" aria-label="Twitter">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.163-1.227.163-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z" />
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
