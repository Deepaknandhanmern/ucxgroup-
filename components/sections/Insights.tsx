"use client";

import { useEffect, useRef, useState } from "react";
import { INSIGHT_FILTERS, type Post, type InsightCategory } from "@/lib/insights";
import { CASE_STUDY_FILTERS, type CaseStudy, type CaseStudyCategory } from "@/lib/case-studies";
import { RESOURCE_FILTERS, type ResourceItem, type ResourceCategory } from "@/lib/resources";
import CardThumb from "@/components/ui/CardThumb";
import SectionRail from "@/components/ui/SectionRail";
import Toast from "@/components/ui/Toast";
import { submitEnquiry } from "@/lib/save-enquiry";

const RAIL_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "ideas", label: "Insights" },
  { id: "knowledge", label: "Project Knowledge" },
  { id: "resources", label: "Resources" },
  { id: "closing", label: "Get Started" },
];

const PREVIEW_COUNT = 3;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function BlogCard({ post }: { post: Post }) {
  const [imgOk, setImgOk] = useState(true);
  const [photoOk, setPhotoOk] = useState(true);

  return (
    <article className="ins-card" data-reveal>
      <a className="ins-media" href={`/insights/${post.slug}`}>
        {imgOk ? (
          <img src={post.image} alt={post.title} loading="lazy" onError={() => setImgOk(false)} />
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
                <img src={post.author.photo} alt={post.author.name} loading="lazy" onError={() => setPhotoOk(false)} />
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

/* ---------- shared preview card, used by Project Knowledge + Resources ---------- */
function PreviewCard({
  href,
  refLabel,
  badge,
  image,
  title,
  category,
}: {
  href: string;
  refLabel: string;
  badge: string;
  image?: string;
  title: string;
  category: string;
}) {
  return (
    <a className="ins-preview-card" href={href} data-reveal>
      <div className="ins-preview-thumb">
        <div className="ins-preview-row">
          <span className="ins-preview-ref">{refLabel}</span>
          <span className="ins-preview-badge">{badge}</span>
        </div>
        <CardThumb src={image} alt={title} />
        <span className="ins-preview-cat">{category}</span>
      </div>
      <h4>{title}</h4>
    </a>
  );
}

/* ---------- Ideas That Move Projects Forward ---------- */
function IdeasSection({ posts }: { posts: Post[] }) {
  const [activeCat, setActiveCat] = useState<InsightCategory | "all">("all");
  const list = activeCat === "all" ? posts : posts.filter((p) => p.category === activeCat);
  const visible = list.slice(0, PREVIEW_COUNT);

  function selectCat(cat: InsightCategory | "all") {
    setActiveCat(cat);
  }

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
            onClick={() => selectCat(f.cat)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="ins-grid">
          {visible.map((p) => (
            <BlogCard post={p} key={p.slug} />
          ))}
        </div>
      ) : (
        <p className="ins-empty" data-reveal>
          No articles in this category yet — check back soon.
        </p>
      )}

      {list.length > PREVIEW_COUNT && (
        <a className="ins-section-cta" href="/blogs" data-reveal>
          See More
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      )}
    </section>
  );
}

/* ---------- From Projects to Knowledge ---------- */
function ProjectKnowledgeSection({ items }: { items: CaseStudy[] }) {
  const [activeCat, setActiveCat] = useState<CaseStudyCategory | "all">("all");
  const filtered = activeCat === "all" ? items : items.filter((c) => c.cat === activeCat);
  const visible = filtered.slice(0, PREVIEW_COUNT);

  return (
    <section className="ins-section" id="knowledge">
      <div className="ins-section-head" data-reveal>
        <h2>From Projects to Knowledge</h2>
        <p>Lessons learned from real project experiences, challenges and delivery decisions.</p>
      </div>

      <div className="ins-filters" data-reveal>
        {CASE_STUDY_FILTERS.map((f) => (
          <button
            key={f.cat}
            className={`ins-chip${activeCat === f.cat ? " is-active" : ""}`}
            onClick={() => setActiveCat(f.cat)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {visible.length > 0 ? (
        <div className="ins-preview-grid">
          {visible.map((c) => (
            <PreviewCard
              key={c.ref}
              href="/case-studies"
              refLabel={c.ref}
              badge={c.pages}
              image={c.image}
              title={c.title}
              category={c.label}
            />
          ))}
        </div>
      ) : (
        <p className="ins-empty" data-reveal>
          More project lessons and delivery insights are on the way.
        </p>
      )}

      <a className="ins-section-cta" href="/case-studies" data-reveal>
        See More
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </a>
    </section>
  );
}

/* ---------- Practical Resources for Project Teams ---------- */
function ResourcesSection({ items }: { items: ResourceItem[] }) {
  const [activeCat, setActiveCat] = useState<ResourceCategory | "all">("all");
  const filtered = activeCat === "all" ? items : items.filter((r) => r.cat === activeCat);
  const visible = filtered.slice(0, PREVIEW_COUNT);

  return (
    <section className="ins-section" id="resources">
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

      {visible.length > 0 ? (
        <div className="ins-preview-grid">
          {visible.map((r) => (
            <PreviewCard
              key={r.ref}
              href="/resources"
              refLabel={r.ref}
              badge={r.format}
              image={r.image}
              title={r.title}
              category={r.label}
            />
          ))}
        </div>
      ) : (
        <p className="ins-empty" data-reveal>
          More resources are on the way.
        </p>
      )}

      <a className="ins-section-cta" href="/resources" data-reveal>
        See More
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h13M13 6l6 6-6 6" />
        </svg>
      </a>
    </section>
  );
}

/* ---------- closing: stay updated subscribe form ---------- */
function SubscribeForm() {
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
      <span className="ins-subscribe-eyebrow">Stay Updated</span>
      <form className="ins-subscribe-form" onSubmit={handleSubmit}>
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

export default function Insights({
  posts,
  caseStudies,
  resources,
}: {
  posts: Post[];
  caseStudies: CaseStudy[];
  resources: ResourceItem[];
}) {
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
      <SectionRail sections={RAIL_SECTIONS} />
      <div className="ins-bg-grid" aria-hidden="true"></div>
      <div className="ins-wrapper">
        <div className="ins-head" id="overview" data-reveal>
          <div className="ins-head-inner">
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
        </div>

        <IdeasSection posts={posts} />
        <ProjectKnowledgeSection items={caseStudies} />
        <ResourcesSection items={resources} />

        <div className="ins-closing" id="closing" data-reveal>
          <h3>Keep Building Your Knowledge.</h3>
          <p>Explore ideas, lessons and technologies shaping the future of the built environment.</p>
          <SubscribeForm />
        </div>
      </div>
    </div>
  );
}
