"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

interface Testimonial {
  quote: string;
  author: string;
  role: string;
  location: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "UCX demonstrated strong commitment and attention to detail throughout our as-built conversion project, helping maintain quality and delivery requirements.",
    author: "Fahd Abdullah",
    role: "As-Built BIM & Digital Delivery",
    location: "Saudi Arabia",
  },
  {
    quote:
      "UCX's clear communication, organised project management and understanding of our requirements made the collaboration smooth and effective.",
    author: "Abdul Ashif",
    role: "Project Management & Delivery",
    location: "Saudi Arabia",
  },
  {
    quote:
      "UCX brought a structured approach to coordination and project workflow, helping us achieve a more efficient and coordinated delivery.",
    author: "Imraan Sherrief",
    role: "BIM Coordination & Workflows",
    location: "India",
  },
  {
    quote:
      "UCX's efficient project delivery and commitment to meeting submission schedules made the overall process reliable and seamless.",
    author: "Gajapathy",
    role: "Project Delivery & Documentation",
    location: "India",
  },
  {
    quote:
      "UCX's collaborative approach, flexibility and clear communication made it easy to work together and deliver projects effectively.",
    author: "Mohammed Mohideen",
    role: "Collaborative Delivery",
    location: "India",
  },
  {
    quote:
      "UCX delivered an outstanding interior design solution with a strong understanding of our requirements, professionalism and commitment to quality.",
    author: "Abishek",
    role: "Interior Design",
    location: "Singapore",
  },
  {
    quote:
      "UCX's collaborative approach and technical coordination helped us achieve the expected outcome for our BIM project.",
    author: "Ilayaraja",
    role: "BIM & Digital Engineering",
    location: "India",
  },
  {
    quote:
      "UCX's clear communication and resource coordination have built strong confidence for future project collaboration.",
    author: "Sankar",
    role: "Resource & Delivery Coordination",
    location: "Dubai",
  },
];

const CELL = 121;
const GAP = 8;
const STEP = 3 * (CELL + GAP);
const EXIT_MS = 240;
const SLIDE_MS = 800;
const CHAR_STAGGER_MS = 4;
const EASE = "cubic-bezier(.65,0,.35,1)";
const AUTO_MS = 3000;

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/* Glossy 3D avatar sphere with the person's initials — no photo needed. */
function Featured({ name, hue }: { name: string; hue: number }) {
  return (
    <div className="reel-featured" role="img" aria-label={name}>
      <div className="reel-avatar-3d" style={{ filter: `hue-rotate(${hue}deg)` }}>
        <span className="reel-avatar-initials">{initials(name)}</span>
      </div>
    </div>
  );
}

function Cell() {
  return <div className="reel-cell" aria-hidden="true" />;
}

function Chars({ text, startIndex, staggerMs }: { text: string; startIndex: number; staggerMs: number }) {
  let idx = startIndex;
  const words = text.split(" ");
  return (
    <>
      {words.map((word, wi) => {
        const delayedWord = (
          <span className="reel-word">
            {Array.from(word).map((ch, ci) => {
              const delay = idx * staggerMs;
              idx++;
              return (
                <span key={ci} className="reel-char" style={{ animationDelay: `${delay}ms` }}>
                  {ch}
                </span>
              );
            })}
          </span>
        );
        if (wi < words.length - 1) idx++;
        return (
          <span key={wi}>
            {delayedWord}
            {wi < words.length - 1 ? " " : null}
          </span>
        );
      })}
    </>
  );
}

export default function TestimonialReel() {
  const glowRef = useCursorGlow<HTMLDivElement>();
  const [index, setIndex] = useState(0);
  const [displayIndex, setDisplayIndex] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [paused, setPaused] = useState(false);
  const animating = useRef(false);
  const timeouts = useRef<ReturnType<typeof setTimeout>[]>([]);

  const count = TESTIMONIALS.length;

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => {
      cancelAnimationFrame(raf);
      timeouts.current.forEach(clearTimeout);
    };
  }, []);

  const goTo = useCallback((next: number) => {
    if (animating.current) return;
    animating.current = true;

    setIndex(next);
    setExiting(true);

    timeouts.current.push(
      setTimeout(() => {
        setDisplayIndex(next);
        setExiting(false);
      }, EXIT_MS)
    );
    timeouts.current.push(
      setTimeout(() => {
        animating.current = false;
      }, SLIDE_MS)
    );
  }, []);

  const paginate = useCallback(
    (dir: 1 | -1) => {
      const next = index + dir;
      if (next < 0 || next >= count) return;
      goTo(next);
    },
    [index, count, goTo]
  );

  // auto-advance every 3s, looping back to the first testimonial; pauses on hover/focus
  useEffect(() => {
    if (paused) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setTimeout(() => {
      goTo((index + 1) % count);
    }, AUTO_MS);
    return () => clearTimeout(id);
  }, [paused, count, goTo, index]);

  function onKeyDown(e: KeyboardEvent) {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      paginate(1);
    }
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      paginate(-1);
    }
  }

  const middleItems = useMemo(() => {
    const items: Array<{ type: "cell" } | { type: "featured"; i: number }> = [];
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    TESTIMONIALS.forEach((_, i) => {
      items.push({ type: "featured", i });
      if (i < count - 1) items.push({ type: "cell" }, { type: "cell" });
    });
    for (let i = 0; i < 3; i++) items.push({ type: "cell" });
    return items;
  }, [count]);

  const sideCellCount = 4 + 2 * count;
  const centerIdx = (count - 1) / 2;
  const middleY = (centerIdx - index) * STEP;
  const sideY = -middleY;

  const colStyle = (y: number): CSSProperties => ({
    transform: `translateY(${y}px)`,
    transition: mounted ? `transform ${SLIDE_MS}ms ${EASE}` : "none",
  });

  const current = TESTIMONIALS[displayIndex];
  const authorLine = `${current.author} — ${current.role}, ${current.location}`;

  return (
    <div className="ucx-reel" ref={glowRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="reel-head">
          <span className="eyebrow">Testimonials</span>
          <h2 className="heading">
            Trusted through collaboration.
            <br />
            Proven through delivery.
          </h2>
        </div>

        <div
          role="region"
          aria-roledescription="carousel"
          aria-label="Testimonials"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
          className="reel-shell"
        >
          <div className="reel-stage" aria-hidden="true">
            <div className="reel-track">
              <div className="reel-col" style={colStyle(sideY)}>
                {Array.from({ length: sideCellCount }).map((_, i) => (
                  <Cell key={i} />
                ))}
              </div>

              <div className="reel-col reel-col--mid" style={colStyle(middleY)}>
                {middleItems.map((item, i) =>
                  item.type === "featured" ? (
                    <Featured key={i} name={TESTIMONIALS[item.i].author} hue={(item.i * 47) % 360} />
                  ) : (
                    <Cell key={i} />
                  )
                )}
              </div>

              <div className="reel-col" style={colStyle(sideY)}>
                {Array.from({ length: sideCellCount }).map((_, i) => (
                  <Cell key={i} />
                ))}
              </div>
            </div>
          </div>

          <div className="reel-content">
            <svg className="reel-quote-mark" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7.17 6C4.87 6 3 7.87 3 10.17c0 2.02 1.44 3.7 3.35 4.08-.13.9-.6 1.7-1.35 2.25a.5.5 0 00.3.9c2.9 0 5.3-2.34 5.3-5.5V10.17C10.6 7.87 8.73 6 7.17 6zm10 0c-2.3 0-4.17 1.87-4.17 4.17 0 2.02 1.44 3.7 3.35 4.08-.13.9-.6 1.7-1.35 2.25a.5.5 0 00.3.9c2.9 0 5.3-2.34 5.3-5.5V10.17C20.6 7.87 18.73 6 17.17 6z" />
            </svg>

            <div className="reel-text-stage" aria-live="polite">
              <div className="reel-text-ghost" aria-hidden="true">
                <p className="reel-quote">{current.quote}</p>
                <p className="reel-author">{authorLine}</p>
              </div>
              <div key={displayIndex} className={`reel-text${exiting ? " reel-text--exit" : ""}`}>
                <p className="reel-quote">
                  <Chars text={current.quote} startIndex={0} staggerMs={CHAR_STAGGER_MS} />
                </p>
                <p className="reel-author">
                  <Chars text={authorLine} startIndex={current.quote.length + 6} staggerMs={CHAR_STAGGER_MS} />
                </p>
              </div>
            </div>

            <div className="reel-controls">
              <button
                type="button"
                onClick={() => paginate(-1)}
                disabled={index === 0}
                aria-label="Previous testimonial"
                className="reel-arrow"
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M7.5 2.5 3.5 6l4 3.5" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => paginate(1)}
                disabled={index === count - 1}
                aria-label="Next testimonial"
                className="reel-arrow"
              >
                <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m4.5 2.5 4 3.5-4 3.5" />
                </svg>
              </button>
              <span className="reel-counter">
                {String(displayIndex + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
