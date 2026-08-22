"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import InteriorsFooter from "@/components/sections/InteriorsFooter";

const EMAIL = "collaborate@ucx-group.com";

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
          <p className="location-line">
            Part LCC Compound, 1-3, Trichy Rd, opposite Srivari Trisara, Singanallur, Coimbatore,
            Tamil Nadu 641005 &middot; Global collaboration
          </p>
        </div>
      </div>

      <div className="footer-mid">
        <div>
          <p className="col-title">Explore</p>
          <ul className="col-links">
            <li><a href="/capabilities">Capabilities</a></li>
            <li><a href="/projects">Projects</a></li>
            <li><a href="/collaboration-lab">Collaboration Lab</a></li>
            <li><a href="/about-us">About UCX</a></li>
            <li><a href="/insights">Insights</a></li>
          </ul>
        </div>

        <div>
          <p className="col-title">Connect</p>
          <a className="cta-link" href="#">
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
