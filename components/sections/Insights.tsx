"use client";

import { useEffect, useRef, useState } from "react";
import { POSTS, INSIGHT_FILTERS, type Post, type InsightCategory } from "@/lib/insights";
import FileCard, { type FileFormat } from "@/components/ui/FileCard";

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

/* ---------- Ideas That Move Projects Forward ---------- */
function IdeasSection() {
  const [activeCat, setActiveCat] = useState<InsightCategory | "all">("all");
  const list = activeCat === "all" ? POSTS : POSTS.filter((p) => p.category === activeCat);

  return (
    <section className="ins-section" id="ideas">
      <div className="ins-section-head" data-reveal>
        <h2>Ideas That Move Projects Forward</h2>
        <p>
          Explore perspectives on emerging technologies, changing project workflows and the ideas shaping the
          future of the built environment.
        </p>
      </div>

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
        <p className="ins-empty" data-reveal>
          No articles in this category yet — check back soon.
        </p>
      )}
    </section>
  );
}

/* ---------- From Projects to Knowledge ---------- */
type KnowledgeCat = "case-studies" | "project-lessons" | "delivery-insights";

const KNOWLEDGE_FILTERS: { cat: KnowledgeCat | "all"; label: string }[] = [
  { cat: "all", label: "All" },
  { cat: "case-studies", label: "Case Studies" },
  { cat: "project-lessons", label: "Project Lessons" },
  { cat: "delivery-insights", label: "Delivery Insights" },
];

const KNOWLEDGE_PREVIEW: { cat: KnowledgeCat; ref: string; label: string; title: string }[] = [
  {
    cat: "case-studies",
    ref: "CS-01",
    label: "Institutional",
    title: "Structural documentation & multidisciplinary coordination for a mixed-use cultural campus",
  },
  {
    cat: "case-studies",
    ref: "CS-02",
    label: "Infrastructural",
    title: "Landscape modeling & streetscape coordination for an urban infrastructure corridor",
  },
  {
    cat: "case-studies",
    ref: "CS-04",
    label: "Hospitality",
    title: "Facade documentation with multidisciplinary coordination for a hospitality development",
  },
];

function ProjectKnowledgeSection() {
  const [activeCat, setActiveCat] = useState<KnowledgeCat | "all">("all");
  const list = activeCat === "all" ? KNOWLEDGE_PREVIEW : KNOWLEDGE_PREVIEW.filter((k) => k.cat === activeCat);

  return (
    <section className="ins-section">
      <div className="ins-section-head" data-reveal>
        <h2>From Projects to Knowledge</h2>
        <p>Lessons learned from real project experiences, challenges and delivery decisions.</p>
      </div>

      <div className="ins-filters" data-reveal>
        {KNOWLEDGE_FILTERS.map((f) => (
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
        <div className="ins-teaser-grid">
          {list.map((k) => (
            <a className="ins-teaser-card" href="/case-studies" key={k.ref} data-reveal>
              <span className="ref">{k.ref}</span>
              <h4>{k.title}</h4>
              <span className="cat">{k.label}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="ins-empty" data-reveal>
          More project lessons and delivery insights are on the way.
        </p>
      )}

      <a className="ins-section-cta" href="/case-studies" data-reveal>
        Explore Case Studies
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </a>
    </section>
  );
}

/* ---------- Practical Resources for Project Teams ---------- */
type ResourceCat = "guides" | "templates" | "reports";

const RESOURCE_FILTERS: { cat: ResourceCat | "all"; label: string }[] = [
  { cat: "all", label: "All" },
  { cat: "guides", label: "Guides" },
  { cat: "templates", label: "Templates" },
  { cat: "reports", label: "Reports" },
];

const RESOURCE_PREVIEW: { cat: ResourceCat; ref: string; title: string; format: FileFormat }[] = [
  { cat: "guides", ref: "RS-01", title: "BIM Standards Guide for project teams", format: "pdf" },
  { cat: "templates", ref: "RS-04", title: "Project Documentation Template", format: "doc" },
  { cat: "reports", ref: "RS-07", title: "Annual Delivery Report", format: "pdf" },
];

function ResourcesSection() {
  const [activeCat, setActiveCat] = useState<ResourceCat | "all">("all");
  const list = activeCat === "all" ? RESOURCE_PREVIEW : RESOURCE_PREVIEW.filter((r) => r.cat === activeCat);

  return (
    <section className="ins-section">
      <div className="ins-section-head" data-reveal>
        <h2>Practical Resources for Project Teams</h2>
        <p>Useful knowledge and reference material for professionals working across the built environment.</p>
      </div>

      <div className="ins-filters" data-reveal>
        {RESOURCE_FILTERS.map((f) => (
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
        <div className="ins-resource-grid">
          {list.map((r) => (
            <a className="ins-resource-card" href="/resources" key={r.ref} data-reveal>
              <FileCard format={r.format} />
              <span className="title">{r.title}</span>
            </a>
          ))}
        </div>
      ) : (
        <p className="ins-empty" data-reveal>
          More resources are on the way.
        </p>
      )}

      <a className="ins-section-cta" href="/resources" data-reveal>
        Explore Resources
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </a>
    </section>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ucx-insights" ref={rootRef}>
      <div className="ins-wrapper">
        <div className="ins-head" data-reveal>
          <h1 className="ins-title">Ideas, Knowledge &amp; Perspectives for the Built Environment</h1>
          <p className="ins-sub">
            Practical perspectives, project lessons and emerging thinking across BIM, digital engineering, design
            and construction technology.
          </p>
          <a className="ins-hero-cta" href="#ideas">
            Explore Insights
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v13M6 13l6 6 6-6" />
            </svg>
          </a>
        </div>

        <IdeasSection />
        <ProjectKnowledgeSection />
        <ResourcesSection />

        <div className="ins-closing" data-reveal>
          <h3>Keep Building Your Knowledge.</h3>
          <p>Explore ideas, lessons and technologies shaping the future of the built environment.</p>
          <a className="ins-section-cta" href="/contact">
            Start a Collaboration
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
