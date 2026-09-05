"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import InteriorsFooter from "@/components/sections/InteriorsFooter";
import { submitEnquiry } from "@/lib/save-enquiry";
import Toast from "@/components/ui/Toast";

const EMAIL = "collaborate@ucx-group.com";

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [toast, setToast] = useState<{ show: boolean; message: string; tone: "success" | "error" }>({
    show: false,
    message: "",
    tone: "success",
  });

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const { ok } = await submitEnquiry("newsletter-signup", { email });
    setStatus("idle");
    if (ok) {
      setEmail("");
      setToast({ show: true, message: "Subscribed — you'll hear from us with new insights.", tone: "success" });
    } else {
      setToast({ show: true, message: "Something went wrong — please try again.", tone: "error" });
    }
  }

  return (
    <>
      <form className="newsletter-form" onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          required
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Email address"
        />
        <button type="submit" disabled={status === "submitting"}>
          {status === "submitting" ? "Sending…" : "Subscribe"}
        </button>
      </form>
      <Toast show={toast.show} message={toast.message} tone={toast.tone} onDismiss={() => setToast((t) => ({ ...t, show: false }))} />
    </>
  );
}

const QUICK_LINKS = [
  { href: "/capabilities", label: "Capabilities" },
  { href: "/experience", label: "Experience" },
  { href: "/collaboration-lab", label: "Collaboration Lab" },
  { href: "/insights", label: "Insights" },
  { href: "/about-us", label: "Company" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  const pathname = usePathname();
  const [isInteriorsFilter, setIsInteriorsFilter] = useState(false);
  const [copied, setCopied] = useState(false);

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard unavailable — the mailto link still works */
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
          <p className="col-title">Stay Updated</p>
          <p className="newsletter-copy">Get new insights and case studies in your inbox — no spam.</p>
          <NewsletterForm />
        </div>

        <div>
          <p className="col-title">Follow</p>
          <div className="social-row">
            <a href="#" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a href="#" aria-label="Instagram"><img src="/brand/instagram.png" alt="" loading="lazy" /></a>
            <a href="https://www.youtube.com/channel/UC1pPghePzMLFOdvlRg3PvcQ" target="_blank" rel="noopener noreferrer" aria-label="YouTube"><img src="/brand/youtube.png" alt="" loading="lazy" /></a>
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
    </footer>
  );
}
