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
  const galleryImages = [post.image, ...post.images].filter(Boolean);
  const hasCarousel = galleryImages.length > 1;

  const [imgOk, setImgOk] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [photoOk, setPhotoOk] = useState(true);
  const [showLead, setShowLead] = useState(false);
  const [leadStatus, setLeadStatus] = useState<LeadStatus>("idle");

  function goToImage(i: number) {
    setActiveImage(i);
    setImgOk(true);
  }
  function stepImage(dir: 1 | -1) {
    goToImage((activeImage + dir + galleryImages.length) % galleryImages.length);
  }

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
  const xShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(post.title)}`;
  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${post.title} ${articleUrl}`)}`;

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
          <a className="art-share-btn" href="#" aria-label="Share on Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </a>
          <a className="art-share-btn" href={xShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on X">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
          <a className="art-share-btn" href={whatsappShareUrl} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347M12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.36.101 11.943c0 2.105.549 4.16 1.595 5.976L0 24l6.335-1.652a11.882 11.882 0 0 0 5.71 1.44h.005c6.582 0 11.941-5.36 11.944-11.943a11.86 11.86 0 0 0-3.474-8.396" />
            </svg>
          </a>
        </div>

        <div className="art-hero">
          {imgOk ? (
            <img key={activeImage} src={galleryImages[activeImage]} alt={post.title} onError={() => setImgOk(false)} />
          ) : (
            <div className="art-hero-fallback" aria-hidden="true">
              <span>{post.team}</span>
            </div>
          )}
          {hasCarousel && imgOk && (
            <>
              <button type="button" className="art-hero-arrow art-hero-arrow--prev" onClick={() => stepImage(-1)} aria-label="Previous image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6l-6 6 6 6" />
                </svg>
              </button>
              <button type="button" className="art-hero-arrow art-hero-arrow--next" onClick={() => stepImage(1)} aria-label="Next image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
              <span className="art-hero-count">
                {activeImage + 1} / {galleryImages.length}
              </span>
            </>
          )}
        </div>

        {hasCarousel && (
          <div className="art-hero-thumbs" role="tablist" aria-label="Article image gallery">
            {galleryImages.map((src, i) => (
              <button
                type="button"
                key={src + i}
                role="tab"
                aria-selected={i === activeImage}
                aria-label={`Show image ${i + 1} of ${galleryImages.length}`}
                className={`art-hero-thumb${i === activeImage ? " is-active" : ""}`}
                onClick={() => goToImage(i)}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            ))}
          </div>
        )}

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
