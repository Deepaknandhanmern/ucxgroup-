"use client";

import { useEffect, useRef, useState } from "react";
import { INSIGHT_FILTERS, type Post, type InsightCategory } from "@/lib/insights";
import { BlogCard } from "@/components/sections/Insights";

export default function Blogs({ posts }: { posts: Post[] }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [activeCat, setActiveCat] = useState<InsightCategory | "all">("all");
  const list = activeCat === "all" ? posts : posts.filter((p) => p.category === activeCat);

  // Header mega-menu category links land here as ?category=bim-digital etc.
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    if (category && INSIGHT_FILTERS.some((f) => f.cat === category)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deferred to the client to avoid a hydration mismatch, same pattern as FeaturedProjects
      setActiveCat(category as InsightCategory);
    }
  }, []);

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
      <div className="ins-bg-grid" aria-hidden="true"></div>
      <div className="ins-wrapper">
        <div className="ins-head">
          <div className="ins-head-inner">
            <h1 className="ins-title">Blogs</h1>
            <p className="ins-sub">
              Every perspective UCX has published on BIM, digital engineering, design and construction technology —
              all in one place.
            </p>
          </div>
        </div>

        <section className="ins-section" style={{ marginTop: 0, paddingTop: 0, borderTop: "none" }}>
          <div className="ins-filters" data-reveal>
            {INSIGHT_FILTERS.map((f) => (
              <button
                key={f.cat}
                className={`ins-chip${activeCat === f.cat ? " is-active" : ""}`}
                onClick={() => setActiveCat(f.cat)}
              >
                {f.label}
              </button>
            ))}
          </div>

          {list.length > 0 ? (
            <div className="ins-grid">
              {list.map((p) => (
                <BlogCard post={p} key={p.slug} />
              ))}
            </div>
          ) : (
            <p className="ins-empty">No articles in this category yet — check back soon.</p>
          )}
        </section>
      </div>
    </div>
  );
}
