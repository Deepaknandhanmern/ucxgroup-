"use client";

import { useEffect, useRef, useState } from "react";

interface Card {
  index: string;
  title: string;
  flow: string;
}

const CARDS: Card[] = [
  { index: "01", title: "Scan-to-BIM", flow: "Existing conditions → Digital environments" },
  { index: "02", title: "Prefabrication", flow: "BIM → Fabrication → Modular delivery" },
  { index: "03", title: "Heritage", flow: "Existing assets → Structured digital information" },
  { index: "04", title: "Automation & AI", flow: "Smarter workflows → Better delivery" },
];

export default function SpecialistSolutions() {
  const sectRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // cursor spotlight
  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    let pending = false;
    let px = 0;
    let py = 0;
    function onPointerMove(e: PointerEvent) {
      const b = sect!.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          sect!.style.setProperty("--mx", px + "px");
          sect!.style.setProperty("--my", py + "px");
          pending = false;
        });
      }
    }
    function onPointerEnter() {
      sect!.classList.add("is-hot");
    }
    function onPointerLeave() {
      sect!.classList.remove("is-hot");
    }
    sect.addEventListener("pointermove", onPointerMove, { passive: true });
    sect.addEventListener("pointerenter", onPointerEnter);
    sect.addEventListener("pointerleave", onPointerLeave);
    return () => {
      sect.removeEventListener("pointermove", onPointerMove);
      sect.removeEventListener("pointerenter", onPointerEnter);
      sect.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  // drag-to-scroll + snap tracking
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let isDown = false;
    let startX = 0;
    let startScroll = 0;
    let paused = false;
    let resumeTimer: ReturnType<typeof setTimeout> | null = null;
    let autoTimer: ReturnType<typeof setInterval> | null = null;

    function goToIndex(i: number) {
      const cardWidth = track!.scrollWidth / CARDS.length;
      track!.scrollTo({ left: cardWidth * i, behavior: "smooth" });
    }

    function startAuto() {
      if (reduce || autoTimer) return;
      autoTimer = setInterval(() => {
        if (paused) return;
        const cardWidth = track!.scrollWidth / CARDS.length;
        const current = Math.round(track!.scrollLeft / cardWidth);
        goToIndex((current + 1) % CARDS.length);
      }, 3200);
    }
    function pauseAuto(temporary: boolean) {
      paused = true;
      if (resumeTimer) clearTimeout(resumeTimer);
      if (temporary) resumeTimer = setTimeout(() => (paused = false), 4500);
    }

    function onDown(e: PointerEvent) {
      isDown = true;
      pauseAuto(false);
      track!.setPointerCapture(e.pointerId);
      startX = e.clientX;
      startScroll = track!.scrollLeft;
      track!.classList.add("is-dragging");
    }
    function onMove(e: PointerEvent) {
      if (!isDown) return;
      track!.scrollLeft = startScroll - (e.clientX - startX);
    }
    function onUp(e: PointerEvent) {
      isDown = false;
      track!.releasePointerCapture(e.pointerId);
      track!.classList.remove("is-dragging");
      pauseAuto(true);
    }
    function onEnter() {
      pauseAuto(false);
    }
    function onLeave() {
      if (!isDown) pauseAuto(true);
    }
    function onScroll() {
      const cardWidth = track!.scrollWidth / CARDS.length;
      setActive(Math.round(track!.scrollLeft / cardWidth));
    }

    track.addEventListener("pointerdown", onDown);
    track.addEventListener("pointermove", onMove);
    track.addEventListener("pointerup", onUp);
    track.addEventListener("pointerenter", onEnter);
    track.addEventListener("pointerleave", onLeave);
    track.addEventListener("scroll", onScroll, { passive: true });
    startAuto();
    return () => {
      track.removeEventListener("pointerdown", onDown);
      track.removeEventListener("pointermove", onMove);
      track.removeEventListener("pointerup", onUp);
      track.removeEventListener("pointerenter", onEnter);
      track.removeEventListener("pointerleave", onLeave);
      track.removeEventListener("scroll", onScroll);
      if (autoTimer) clearInterval(autoTimer);
      if (resumeTimer) clearTimeout(resumeTimer);
    };
  }, []);

  function goTo(i: number) {
    const track = trackRef.current;
    if (!track) return;
    const cardWidth = track.scrollWidth / CARDS.length;
    track.scrollTo({ left: cardWidth * i, behavior: "smooth" });
  }

  return (
    <div className="ucx-special" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head">
          <div className="head-text">
            <span className="eyebrow">Specialist Solutions</span>
            <h2 className="heading">Beyond the Standard</h2>
            <p className="intro">Specialist workflows for complex project requirements.</p>
          </div>
          <div className="head-nav">
            <button type="button" aria-label="Previous" onClick={() => goTo(Math.max(0, active - 1))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6l-6 6 6 6" /></svg>
            </button>
            <button type="button" aria-label="Next" onClick={() => goTo(Math.min(CARDS.length - 1, active + 1))}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 6l6 6-6 6" /></svg>
            </button>
          </div>
        </div>

        <div className="carousel" ref={trackRef}>
          {CARDS.map((c) => (
            <article className="card" key={c.index}>
              <div className="card-image">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <circle cx="8.5" cy="8.5" r="1.5" />
                  <path d="M21 15l-5-5L5 21" />
                </svg>
                <span>Image placeholder</span>
              </div>
              <div className="card-body">
                <span className="card-index">{c.index}</span>
                <h3>{c.title}</h3>
                <p className="card-flow">{c.flow}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="dots">
          {CARDS.map((c, i) => (
            <button key={c.index} type="button" className={i === active ? "is-active" : ""} onClick={() => goTo(i)} aria-label={`Go to ${c.title}`}></button>
          ))}
        </div>

        <div className="closing">
          <a className="closing-cta" href="/collaboration-lab">
            Explore Specialist Solutions
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
