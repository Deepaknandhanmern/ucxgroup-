"use client";

import { useEffect, useRef, useState } from "react";
import { POSTS, type Post } from "@/lib/insights";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

function BlogCard({ post }: { post: Post }) {
  const [imgOk, setImgOk] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <article className="ins-card" data-reveal>
      <a className="ins-media" href={`/insights/${post.slug}`}>
        {imgOk ? (
          <img src={post.image} alt={post.title} onError={() => setImgOk(false)} />
        ) : (
          <div className="ins-media-fallback" aria-hidden="true">
            <span>{post.team}</span>
          </div>
        )}
        <div className="ins-media-tags">
          {post.tags.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>
        <div className="ins-media-veil">
          <span className="ins-read-btn">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
            </svg>
            Read Article
          </span>
        </div>
      </a>

      <div className="ins-body">
        <h3>
          <a href={`/insights/${post.slug}`}>{post.title}</a>
        </h3>
        <p>{post.excerpt}</p>

        <div className="ins-footer">
          <a className="ins-author" href={`/insights/${post.slug}`}>
            <span className="ins-avatar">
              {photoOk ? (
                <img src={post.author.photo} alt={post.author.name} onError={() => setPhotoOk(false)} />
              ) : (
                <span className="ins-avatar-initials">{initials(post.author.name)}</span>
              )}
            </span>
            <div className="ins-author-text">
              <span className="name">{post.author.name}</span>
              <span className="role">{post.author.role}</span>
            </div>
          </a>
          <div className="ins-time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3.5 2" />
            </svg>
            <span>{post.readTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Insights() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 70}ms`;
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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <div className="ucx-insights" ref={rootRef}>
      <div className="ins-wrapper">
        <div className="ins-head" data-reveal>
          <span className="ins-eyebrow">Insights</span>
          <h1 className="ins-title">
            Notes from the <em>studio floor</em>
          </h1>
          <p className="ins-sub">
            Field notes on BIM coordination, digital engineering and interiors documentation — written by the teams
            who run the projects.
          </p>
        </div>

        <div className="ins-grid">
          {POSTS.map((p) => (
            <BlogCard post={p} key={p.slug} />
          ))}
        </div>
      </div>
    </div>
  );
}
