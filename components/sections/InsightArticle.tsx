"use client";

import { useEffect, useState } from "react";
import { formatPostDate, type Post } from "@/lib/insights";
import { submitEnquiry } from "@/lib/save-enquiry";

const LEAD_POPUP_DELAY_MS = 20000;
const LEAD_POPUP_SEEN_KEY = "ucx-insight-lead-seen";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

type LeadStatus = "idle" | "sending" | "sent" | "error";

export default function InsightArticle({ post, more }: { post: Post; more: Post[] }) {
  const [imgOk, setImgOk] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);
  const [linkCopied, setLinkCopied] = useState(false);
  const [showLead, setShowLead] = useState(false);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");

  // Show a lead-capture popup once a visitor has spent real time reading an
  // article — 20s of engagement is a much stronger lead signal than a page
  // view, and gating on sessionStorage keeps it from reappearing on every
  // article they click through to during the same visit.
  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(LEAD_POPUP_SEEN_KEY) === "1";
    } catch {
      /* sessionStorage unavailable — popup will just show every visit */
    }
    if (seen) return;

    const t = setTimeout(() => {
      setShowLead(true);
      try {
        sessionStorage.setItem(LEAD_POPUP_SEEN_KEY, "1");
      } catch {
        /* sessionStorage unavailable — nothing to persist */
      }
    }, LEAD_POPUP_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  function closeLead() {
    setShowLead(false);
  }

  async function handleLeadSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLeadStatus("sending");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = {
      subject: `Insight article lead — ${post.title}`,
      article: post.title,
      article_url: `https://ucx-group.com/insights/${post.slug}`,
    };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });
    const { ok } = await submitEnquiry("insight-lead", payload);
    if (ok) {
      setLeadStatus("sent");
      form.reset();
      setTimeout(() => setShowLead(false), 2600);
    } else {
      setLeadStatus("error");
    }
  }

  const articleUrl = `https://ucx-group.com/insights/${post.slug}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(articleUrl)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 1800);
    } catch {
      /* clipboard unavailable — sharing via LinkedIn still works */
    }
  }

  return (
    <div className="ucx-article">
      <div className="art-wrapper">
        <a className="art-back" href="/insights">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M11 18l-6-6 6-6" />
          </svg>
          Back to Insights
        </a>

        <div className="art-tags">
          {post.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <h1 className="art-title">{post.title}</h1>

        <div className="art-meta">
          <div className="art-author">
            <span className="art-avatar">
              {photoOk ? (
                <img src={post.author.photo} alt={post.author.name} loading="lazy" onError={() => setPhotoOk(false)} />
              ) : (
                <span className="art-avatar-initials">{initials(post.author.name)}</span>
              )}
            </span>
            <div className="art-author-text">
              <span className="name">{post.author.name}</span>
              <span className="role">{post.author.role}</span>
            </div>
          </div>
          <span className="art-meta-dot" aria-hidden="true" />
          <span className="art-meta-date">{formatPostDate(post.date)}</span>
          <span className="art-meta-dot" aria-hidden="true" />
          <span className="art-meta-read">{post.readTime}</span>
        </div>

        <div className="art-share">
          <span className="art-share-label">Share</span>
          <a className="art-share-btn" href={linkedInShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.45-2.14 2.94v5.66H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45Z" />
            </svg>
          </a>
          <button type="button" className="art-share-btn" onClick={copyLink} aria-label="Copy article link">
            {linkCopied ? (
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
          {linkCopied && <span className="art-share-copied">Link copied</span>}
        </div>

        <div className="art-hero">
          {imgOk ? (
            <img src={post.image} alt={post.title} onError={() => setImgOk(false)} />
          ) : (
            <div className="art-hero-fallback" aria-hidden="true">
              <span>{post.team}</span>
            </div>
          )}
        </div>

        <div className="art-body" dangerouslySetInnerHTML={{ __html: post.bodyHtml }} />

        <div className="art-cta">
          <div>
            <span className="art-cta-eyebrow">Have a project in mind?</span>
            <h3>Let&apos;s talk about what you&apos;re building.</h3>
          </div>
          <a href="/contact" className="art-cta-link">
            Start a Collaboration
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>

        {more.length > 0 && (
          <div className="art-more">
            <span className="art-more-eyebrow">More Insights</span>
            <div className="art-more-grid">
              {more.map((m) => (
                <a className="art-more-card" href={`/insights/${m.slug}`} key={m.slug}>
                  <span className="art-more-team">{m.team}</span>
                  <h4>{m.title}</h4>
                  <span className="art-more-read">{m.readTime}</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className={`art-lead${showLead ? " is-visible" : ""}`} role="dialog" aria-label="Talk to UCX about your project">
        <button type="button" className="art-lead-close" onClick={closeLead} aria-label="Dismiss">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {leadStatus === "sent" ? (
          <div className="art-lead-done">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <p>Thanks — we&rsquo;ve got it and will be in touch shortly.</p>
          </div>
        ) : (
          <>
            <span className="art-lead-eyebrow">Still Reading?</span>
            <h4 className="art-lead-title">Let&rsquo;s talk about your project.</h4>
            <p className="art-lead-sub">Leave your details and a UCX specialist will reach out.</p>
            <form onSubmit={handleLeadSubmit}>
              <input required type="text" name="name" placeholder="Your name" disabled={leadStatus === "sending"} />
              <input required type="email" name="email" placeholder="you@email.com" disabled={leadStatus === "sending"} />
              <button type="submit" disabled={leadStatus === "sending"}>
                {leadStatus === "sending" ? "Sending…" : "Get in Touch"}
              </button>
              {leadStatus === "error" && <p className="art-lead-error">Something went wrong — please try again.</p>}
            </form>
          </>
        )}
      </div>
    </div>
  );
}
