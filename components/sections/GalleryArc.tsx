"use client";

import { useCallback, useEffect, useState } from "react";
import { PROJECTS } from "@/lib/projects";

const FEATURED = PROJECTS.slice(0, 8);
const MAX_VISIBLE = 7;
const HALF = 3;

interface FanSlot {
  rot: number;
  scale: number;
  x: number;
  y: number;
  z: number;
}

const FAN_SLOTS: FanSlot[] = [
  { rot: -21, scale: 0.72, x: -19, y: 4.6, z: 1 },
  { rot: -14, scale: 0.8, x: -14, y: 2.6, z: 2 },
  { rot: -7, scale: 0.9, x: -7, y: 0.9, z: 3 },
  { rot: 0, scale: 1, x: 0, y: 0, z: 10 },
  { rot: 7, scale: 0.9, x: 7, y: 0.9, z: 3 },
  { rot: 14, scale: 0.8, x: 14, y: 2.6, z: 2 },
  { rot: 21, scale: 0.72, x: 19, y: 4.6, z: 1 },
];

function spreadForWidth(w: number) {
  if (w < 480) return 0.42;
  if (w < 640) return 0.62;
  if (w < 900) return 0.78;
  if (w < 1200) return 0.92;
  return 1;
}

function slotsForCount(count: number): FanSlot[] {
  if (count >= MAX_VISIBLE) return FAN_SLOTS;
  const center = (count - 1) / 2;
  return Array.from({ length: count }, (_, i) => {
    const dist = center ? (i - center) / center : 0;
    const abs = Math.abs(dist);
    return { rot: dist * 21, scale: 1 - 0.28 * abs * abs, x: dist * 19, y: abs * abs * 4.6, z: 10 - Math.round(abs * 9) };
  });
}

function ProjectImage({ src, alt, discipline }: { src: string; alt: string; discipline: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className="arc-fallback">
        <span>{discipline}</span>
      </div>
    );
  }
  return <img src={src} alt={alt} className="arc-img" onError={() => setOk(false)} draggable={false} />;
}

export default function GalleryArc() {
  const total = FEATURED.length;
  const needsPagination = total > MAX_VISIBLE;
  const [center, setCenter] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const [spread, setSpread] = useState(1);

  useEffect(() => {
    function onResize() {
      setSpread(spreadForWidth(window.innerWidth));
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const slots = slotsForCount(needsPagination ? MAX_VISIBLE : total);
  const centerSlot = (slots.length - 1) / 2;

  const slotFor = useCallback(
    (index: number) => {
      if (!needsPagination) return index;
      const rel = ((index - center) % total + total) % total;
      const offset = rel > total / 2 ? rel - total : rel;
      if (Math.abs(offset) > HALF) return null;
      return offset + HALF;
    },
    [center, total, needsPagination]
  );

  function cycle(dir: 1 | -1) {
    setCenter((c) => ((c + dir) % total + total) % total);
    setHovered(null);
  }

  function goTo(i: number) {
    setCenter(i);
    setHovered(null);
  }

  return (
    <div className="ucx-gallery-arc">
      <div className="arc-content">
        <span className="eyebrow">Selected Work</span>
        <h2 className="heading">Selected Project Experience</h2>
        <p className="intro">From Digital Models to Real-World Delivery</p>
      </div>

      <div className="fan-stage">
        <div className="fan-track" onMouseLeave={() => setHovered(null)}>
          {FEATURED.map((p, i) => {
            const slot = slotFor(i);
            let style: React.CSSProperties;

            if (slot !== null) {
              const base = slots[slot];
              const isHovered = hovered === i;
              let x = base.x * spread;
              let y = base.y;
              let rot = base.rot;
              let scale = base.scale;
              const z = isHovered ? 20 : base.z;

              if (hovered !== null && hovered !== i) {
                const hoveredSlot = slotFor(hovered);
                if (hoveredSlot !== null) {
                  const dist = Math.abs(slot - hoveredSlot);
                  const normalized = centerSlot ? (slot - centerSlot) / centerSlot : 0;
                  const push = 5 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - dist)) * spread;
                  if (slot < hoveredSlot) {
                    x -= push;
                    rot -= 3 / (dist + 1);
                  } else {
                    x += push;
                    rot += 3 / (dist + 1);
                  }
                }
              } else if (isHovered) {
                y -= 2.2;
                scale *= 1.08;
              }

              style = {
                transform: `translate(-50%, 0) translate(${x}rem, ${y}rem) rotate(${rot}deg) scale(${scale})`,
                zIndex: z,
                opacity: 1,
              };
            } else {
              style = {
                transform: "translate(-50%, 0) scale(.4)",
                opacity: 0,
                zIndex: 0,
                pointerEvents: "none",
              };
            }

            return (
              <a
                key={p.slug}
                href={`/projects/${p.slug}`}
                className={`fan-card${hovered === i ? " is-hover" : ""}`}
                style={style}
                onMouseEnter={() => slot !== null && setHovered(i)}
                onFocus={() => slot !== null && setHovered(i)}
              >
                <ProjectImage src={p.image} alt={p.title} discipline={p.discipline} />
                <div className="fan-caption">
                  <span className="fan-sector">
                    {p.sector} &middot; {p.location}
                  </span>
                  <h3>{p.title}</h3>
                </div>
              </a>
            );
          })}
        </div>
      </div>

      {needsPagination && (
        <div className="arc-controls">
          <button type="button" className="arc-arrow" aria-label="Previous project" onClick={() => cycle(-1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 6l-6 6 6 6" />
            </svg>
          </button>
          <div className="arc-dots">
            {FEATURED.map((p, i) => (
              <button
                type="button"
                key={p.slug}
                className={i === center ? "is-active" : ""}
                aria-label={`Show ${p.title}`}
                onClick={() => goTo(i)}
              />
            ))}
          </div>
          <button type="button" className="arc-arrow" aria-label="Next project" onClick={() => cycle(1)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
        </div>
      )}

      <div className="arc-ctas">
        <a className="arc-cta-primary" href="/projects">
          View Project Experience
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
