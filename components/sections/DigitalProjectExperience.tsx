"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";
import { DIGITAL_EXPERIENCE_CATEGORIES } from "@/lib/digital-experience";

interface Cat {
  id: string;
  n: string;
  name: string;
  img: string;
}

const FILTERS = [{ id: "all", label: "All" }, ...DIGITAL_EXPERIENCE_CATEGORIES.map((c) => ({ id: c.id, label: c.name }))];

function CatCard({ cat, index }: { cat: Cat; index: number }) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <div id={cat.id} className="dpe-card" data-reveal style={{ transitionDelay: `${(index % 6) * 60}ms` }}>
      <div className="dpe-media">
        {imgOk ? (
          <img src={cat.img} alt={cat.name} loading="lazy" onError={() => setImgOk(false)} />
        ) : (
          <div className="dpe-media-fallback" aria-hidden="true">
            <span>{cat.name}</span>
          </div>
        )}
      </div>

      <div className="dpe-content">
        <div className="dpe-meta">
          <div>
            <span className="k">Category</span>
            <span className="v">{cat.n}</span>
          </div>
        </div>

        <div className="dpe-bottom">
          <h3>{cat.name}</h3>
        </div>
      </div>
    </div>
  );
}

export default function DigitalProjectExperience({ images }: { images: Record<string, string> }) {
  const sectRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();
  const [activeCat, setActiveCat] = useState("all");

  const categories: Cat[] = useMemo(
    () => DIGITAL_EXPERIENCE_CATEGORIES.map((c) => ({ id: c.id, n: c.n, name: c.name, img: images[c.id] ?? c.defaultImage })),
    [images]
  );

  const filtered = useMemo(
    () => (activeCat === "all" ? categories : categories.filter((c) => c.id === activeCat)),
    [activeCat, categories]
  );

  // scroll reveal
  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;

    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 80}ms`;
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [filtered.length]);

  return (
    <div className="ucx-dpe" ref={sectRef}>
      <div className="grid-overlay" aria-hidden="true"></div>

      <div className="dpe-body" ref={bodyGlowRef}>
        <div className="grid-glow" aria-hidden="true"></div>
        <div className="cursor-haze" aria-hidden="true"></div>

        <div className="wrapper">
          <div id="categories" className="dpe-body-head" data-reveal>
            <span className="sub-eyebrow">03 — Digital Project Experience</span>
            <p className="dpe-body-desc">
              Digital delivery is at the core of UCX&rsquo;s approach. We use BIM, digital engineering, coordination,
              automation and structured information workflows to connect project teams and improve delivery
              certainty.
            </p>

            <div className="dpe-filters">
              {FILTERS.map((f) => (
                <button
                  key={f.id}
                  className={`dpe-chip${activeCat === f.id ? " is-active" : ""}`}
                  onClick={() => setActiveCat(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="dpe-list">
            {filtered.length > 0 ? (
              filtered.map((c, i) => <CatCard cat={c} index={i} key={c.id} />)
            ) : (
              <p className="dpe-empty" data-reveal>
                No categories match this filter yet — check back soon, or{" "}
                <a href="/contact">get in touch</a> about work in this space.
              </p>
            )}
          </div>

          <div className="dpe-more" data-reveal>
            <a href="/contact">
              Start a Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
