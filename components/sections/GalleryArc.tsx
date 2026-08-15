"use client";

import { useEffect, useState } from "react";

interface GalleryImage {
  src: string;
  alt: string;
}

const GALLERY_IMAGES: GalleryImage[] = [
  { src: "/brand/gallery/project-01.jpg", alt: "UCX project 01" },
  { src: "/brand/gallery/project-02.jpg", alt: "UCX project 02" },
  { src: "/brand/gallery/project-03.jpg", alt: "UCX project 03" },
  { src: "/brand/gallery/project-04.jpg", alt: "UCX project 04" },
  { src: "/brand/gallery/project-05.jpg", alt: "UCX project 05" },
  { src: "/brand/gallery/project-06.jpg", alt: "UCX project 06" },
  { src: "/brand/gallery/project-07.jpg", alt: "UCX project 07" },
  { src: "/brand/gallery/project-08.jpg", alt: "UCX project 08" },
  { src: "/brand/gallery/project-09.jpg", alt: "UCX project 09" },
];

const START_ANGLE = 20;
const END_ANGLE = 160;
const RADIUS = { lg: 460, md: 340, sm: 220 };
const CARD = { lg: 116, md: 96, sm: 74 };

function ArcImage({ src, alt }: { src: string; alt: string }) {
  const [ok, setOk] = useState(true);
  if (!ok) {
    return (
      <div className="arc-fallback">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
    );
  }
  return <img src={src} alt={alt} className="arc-img" draggable={false} onError={() => setOk(false)} />;
}

export default function GalleryArc() {
  const [dims, setDims] = useState({ radius: RADIUS.lg, card: CARD.lg });

  useEffect(() => {
    function onResize() {
      const w = window.innerWidth;
      if (w < 640) setDims({ radius: RADIUS.sm, card: CARD.sm });
      else if (w < 1024) setDims({ radius: RADIUS.md, card: CARD.md });
      else setDims({ radius: RADIUS.lg, card: CARD.lg });
    }
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const count = Math.max(GALLERY_IMAGES.length, 2);
  const step = (END_ANGLE - START_ANGLE) / (count - 1);

  return (
    <div className="ucx-gallery-arc">
      <div className="arc-stage" style={{ height: dims.radius * 1.15 }}>
        <div className="arc-pivot">
          {GALLERY_IMAGES.map((img, i) => {
            const angle = START_ANGLE + step * i;
            const rad = (angle * Math.PI) / 180;
            const x = Math.cos(rad) * dims.radius;
            const y = Math.sin(rad) * dims.radius;
            return (
              <div
                key={img.src}
                className="arc-card"
                style={{
                  width: `${dims.card}px`,
                  height: `${dims.card}px`,
                  left: `calc(50% + ${x.toFixed(2)}px)`,
                  bottom: `${y.toFixed(2)}px`,
                  animationDelay: `${i * 90}ms`,
                  zIndex: count - i,
                }}
              >
                <div className="arc-card-inner" style={{ transform: `rotate(${angle / 4}deg)` }}>
                  <ArcImage src={img.src} alt={img.alt} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="arc-content">
        <span className="eyebrow">Selected Work</span>
        <h2 className="heading">Projects Delivered Across the Built Environment</h2>
        <p className="intro">
          A look at the buildings, interiors and digital models UCX has helped design, document and deliver.
        </p>
        <div className="arc-ctas">
          <a className="arc-cta-primary" href="/experience">Explore Our Work</a>
          <a className="arc-cta-ghost" href="/capabilities">View Capabilities</a>
        </div>
      </div>
    </div>
  );
}
