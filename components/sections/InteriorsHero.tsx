"use client";

import { useEffect, useRef } from "react";

// House-build frame sequence: ezgif-frame-001..050.jpg, 1280x720 (16:9),
// copied verbatim into public/ from the client's original export folder.
const SEQUENCE_FRAME_COUNT = 50;
const sequenceSrc = (i: number) =>
  `/brand/interiors/sequence/ezgif-frame-${String(i + 1).padStart(3, "0")}.jpg`;

export default function InteriorsHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const hero = heroRef.current;
    const media = mediaRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !hero || !media || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Preload every frame up front — the set is tiny (~1.2MB for 50 frames)
    // so a full parallel preload beats the complexity of a lazy/windowed
    // scheme, and guarantees no blank frames once scrubbing starts.
    const images: HTMLImageElement[] = [];
    for (let i = 0; i < SEQUENCE_FRAME_COUNT; i++) {
      const img = new Image();
      img.decoding = "async";
      img.src = sequenceSrc(i);
      if (i === 0) img.onload = () => drawFrame(0);
      images.push(img);
    }

    // Draws the given frame into the canvas with CSS object-fit:cover
    // semantics (crop to fill, never stretch) so the source 16:9 aspect
    // ratio is preserved regardless of the hero's current container shape.
    const drawFrame = (index: number) => {
      const clamped = Math.max(0, Math.min(SEQUENCE_FRAME_COUNT - 1, index));
      let img = images[clamped];
      if (!img.complete || img.naturalWidth === 0) {
        // Frame not decoded yet — hold on the nearest already-loaded one
        // rather than drawing nothing.
        img = images.find((candidate) => candidate.complete && candidate.naturalWidth > 0) ?? img;
        if (!img.complete || img.naturalWidth === 0) return;
      }

      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.clientWidth;
      const ch = canvas.clientHeight;
      if (canvas.width !== cw * dpr || canvas.height !== ch * dpr) {
        canvas.width = cw * dpr;
        canvas.height = ch * dpr;
      }

      const canvasRatio = cw / ch;
      const imgRatio = img.naturalWidth / img.naturalHeight;
      let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;
      if (imgRatio > canvasRatio) {
        sw = img.naturalHeight * canvasRatio;
        sx = (img.naturalWidth - sw) / 2;
      } else {
        sh = img.naturalWidth / canvasRatio;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    };

    if (reduceMotion) {
      media.style.setProperty("--expand", "1");
      images[SEQUENCE_FRAME_COUNT - 1].onload = () => drawFrame(SEQUENCE_FRAME_COUNT - 1);
      if (images[SEQUENCE_FRAME_COUNT - 1].complete) drawFrame(SEQUENCE_FRAME_COUNT - 1);
      return;
    }

    let raf = 0;
    let pinStart = 0;
    let pinEnd = 0;
    let travel = 0;
    let lastFrame = -1;

    const measure = () => {
      const topOffset = window.innerWidth <= 640 ? 66 : 76;
      const wrapTop = wrap.getBoundingClientRect().top + window.scrollY;
      travel = wrap.offsetHeight - hero.offsetHeight;
      pinStart = wrapTop - topOffset;
      pinEnd = pinStart + travel;
      lastFrame = -1;
      update();
    };

    const update = () => {
      raf = 0;
      const topOffset = window.innerWidth <= 640 ? 66 : 76;
      const y = window.scrollY;

      let progress: number;
      if (travel <= 0 || y <= pinStart) {
        hero.style.position = "absolute";
        hero.style.top = "0";
        hero.style.bottom = "";
        progress = 0;
      } else if (y >= pinEnd) {
        hero.style.position = "absolute";
        hero.style.top = `${travel}px`;
        hero.style.bottom = "";
        progress = 1;
      } else {
        hero.style.position = "fixed";
        hero.style.top = `${topOffset}px`;
        hero.style.bottom = "";
        progress = (y - pinStart) / travel;
      }

      media.style.setProperty("--expand", String(progress));

      const frame = Math.round(progress * (SEQUENCE_FRAME_COUNT - 1));
      if (frame !== lastFrame) {
        lastFrame = frame;
        drawFrame(frame);
      }
    };

    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(update);
    };

    const onResize = () => {
      measure();
      if (lastFrame >= 0) drawFrame(lastFrame);
    };

    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ih-hero-wrap" ref={wrapRef}>
      <div className="ih-hero" ref={heroRef}>
        <div className="ih-bg" aria-hidden="true">
          <span className="ih-blob b1"></span>
          <span className="ih-blob b2"></span>
          <span className="ih-blob b3"></span>
          <span className="ih-blob b4"></span>
        </div>

        <div className="ih-media" ref={mediaRef} aria-hidden="true">
          <canvas className="ih-media-canvas" ref={canvasRef}></canvas>
          <div className="ih-media-veil"></div>
        </div>

        <div className="ih-content">
          <span className="ih-badge">
            <i></i> Design &amp; Interiors
          </span>

          <h1 className="ih-heading">
            <span className="ih-line ih-line-lead">Design, Documentation &amp;</span>
            <span className="ih-line ih-line-bold">Delivery</span>
            <span className="ih-line ih-line-italic">for Interior Environments</span>
          </h1>

          <p className="ih-intro">
            UCX combines interior design expertise with BIM, technical documentation, coordination and execution
            support to connect design intent with project delivery.
          </p>

          <div className="ih-actions">
            <a className="ih-cta ih-cta-solid" href="#closing">
              Start a Project
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="ih-cta ih-cta-ghost" href="#categories">
              Explore Our Work
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="ih-mark" aria-hidden="true">
          <svg viewBox="0 0 200 200">
            <defs>
              <path id="ihRingPath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
            </defs>
            <g className="ih-mark-spin">
              <text className="ih-mark-text">
                <textPath href="#ihRingPath" startOffset="0%">
                  SPAYCEX &middot; DESIGN &amp; INTERIORS &middot; SPAYCEX &middot; DESIGN &amp; INTERIORS &middot;
                </textPath>
              </text>
            </g>
            <circle className="ih-mark-pulse" cx="100" cy="100" r="30" />
            <circle className="ih-mark-core" cx="100" cy="100" r="30" />
            <text className="ih-mark-letter" x="100" y="107" textAnchor="middle">
              S
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}
