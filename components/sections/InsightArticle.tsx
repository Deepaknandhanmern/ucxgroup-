"use client";

import { useState } from "react";
import { formatPostDate, type Post } from "@/lib/insights";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export default function InsightArticle({ post, more }: { post: Post; more: Post[] }) {
  const [imgOk, setImgOk] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);

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
                <img src={post.author.photo} alt={post.author.name} onError={() => setPhotoOk(false)} />
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
    </div>
  );
}
