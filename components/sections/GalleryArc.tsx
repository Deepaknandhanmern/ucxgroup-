"use client";

import { useEffect, useState } from "react";
import CardThumb from "@/components/ui/CardThumb";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

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

const IMAGES = Array.from({ length: 7 }, (_, i) => `/brand/experience/${i + 1}.webp`);

function spreadForWidth(w: number) {
  if (w < 480) return 0.42;
  if (w < 640) return 0.62;
  if (w < 900) return 0.78;
  if (w < 1200) return 0.92;
  return 1;
}

export default function GalleryArc() {
  const glowRef = useCursorGlow<HTMLDivElement>();
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

  return (
    <div className="ucx-gallery-arc" ref={glowRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>
      <div className="arc-content">
        <span className="eyebrow">Selected Work</span>
        <h2 className="heading">Selected Project Experience</h2>
        <p className="intro">From Digital Models to Real-World Delivery</p>
      </div>

      <div className="fan-stage">
        <div className="fan-track" onMouseLeave={() => setHovered(null)}>
          {IMAGES.map((src, i) => {
            const base = FAN_SLOTS[i];
            const isHovered = hovered === i;
            let x = base.x * spread;
            let y = base.y;
            let rot = base.rot;
            let scale = base.scale;
            const z = isHovered ? 20 : base.z;

            if (hovered !== null && hovered !== i) {
              const dist = Math.abs(i - hovered);
              const normalized = (i - 3) / 3;
              const push = 5 * (1 - Math.abs(normalized)) * (1 + 0.2 * Math.max(0, 3 - dist)) * spread;
              if (i < hovered) {
                x -= push;
                rot -= 3 / (dist + 1);
              } else {
                x += push;
                rot += 3 / (dist + 1);
              }
            } else if (isHovered) {
              y -= 2.2;
              scale *= 1.08;
            }

            const style: React.CSSProperties = {
              transform: `translate(-50%, 0) translate(${x}rem, ${y}rem) rotate(${rot}deg) scale(${scale})`,
              zIndex: z,
            };

            return (
              <div
                key={src}
                className={`fan-card${isHovered ? " is-hover" : ""}`}
                style={style}
                onMouseEnter={() => setHovered(i)}
              >
                <CardThumb src={src} alt="" />
              </div>
            );
          })}
        </div>
      </div>

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
