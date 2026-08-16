"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

interface ScrollExpandHeroProps {
  mediaType?: "video" | "image";
  mediaSrc: string;
  posterSrc?: string;
  bgImageSrc: string;
  kicker?: string;
  title: string;
  scrollHint?: string;
  children?: ReactNode;
}

function BgPh() {
  return (
    <div className="seh-ph">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="M21 15l-5-5L5 21" />
      </svg>
    </div>
  );
}

export default function ScrollExpandHero({
  mediaType = "video",
  mediaSrc,
  posterSrc,
  bgImageSrc,
  kicker,
  title,
  scrollHint = "Scroll to Expand",
  children,
}: ScrollExpandHeroProps) {
  const [progress, setProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [fullyExpanded, setFullyExpanded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [bgOk, setBgOk] = useState(true);
  const [mediaOk, setMediaOk] = useState(true);
  const touchStartY = useRef(0);

  useEffect(() => {
    function checkMobile() {
      setIsMobile(window.innerWidth < 768);
    }
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setProgress(1);
      setFullyExpanded(true);
      setShowContent(true);
      return;
    }

    function applyProgress(next: number) {
      const clamped = Math.min(Math.max(next, 0), 1);
      setProgress(clamped);
      if (clamped >= 1) {
        setFullyExpanded(true);
        setShowContent(true);
      } else if (clamped < 0.75) {
        setShowContent(false);
      }
    }

    function onWheel(e: WheelEvent) {
      if (fullyExpanded && e.deltaY < 0 && window.scrollY <= 5) {
        setFullyExpanded(false);
        e.preventDefault();
      } else if (!fullyExpanded) {
        e.preventDefault();
        applyProgress(progress + e.deltaY * 0.0009);
      }
    }

    function onTouchStart(e: TouchEvent) {
      touchStartY.current = e.touches[0].clientY;
    }

    function onTouchMove(e: TouchEvent) {
      if (!touchStartY.current) return;
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY.current - touchY;

      if (fullyExpanded && deltaY < -20 && window.scrollY <= 5) {
        setFullyExpanded(false);
        e.preventDefault();
      } else if (!fullyExpanded) {
        e.preventDefault();
        const factor = deltaY < 0 ? 0.008 : 0.005;
        applyProgress(progress + deltaY * factor);
        touchStartY.current = touchY;
      }
    }

    function onTouchEnd() {
      touchStartY.current = 0;
    }

    function onScroll() {
      if (!fullyExpanded) window.scrollTo(0, 0);
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("scroll", onScroll);
    window.addEventListener("touchstart", onTouchStart, { passive: false });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [progress, fullyExpanded]);

  const mediaWidth = 300 + progress * (isMobile ? 650 : 1250);
  const mediaHeight = 400 + progress * (isMobile ? 200 : 400);
  const textShift = progress * (isMobile ? 18 : 15);

  // Split into two roughly balanced phrase lines (not just word one vs.
  // the rest) so the two halves read evenly when they slide apart.
  const words = title.split(" ");
  const mid = Math.ceil(words.length / 2);
  const firstLine = words.slice(0, mid).join(" ");
  const secondLine = words.slice(mid).join(" ");

  return (
    <div className="ucx-scrollhero">
      <section className="seh-section">
        <div className="seh-bg" style={{ opacity: 1 - progress }}>
          {bgOk ? (
            <img className="seh-bg-img" src={bgImageSrc} alt="" onError={() => setBgOk(false)} />
          ) : (
            <BgPh />
          )}
          <div className="seh-bg-tint"></div>
        </div>

        <div className="seh-stage">
          <div
            className="seh-media"
            style={{
              width: `${mediaWidth}px`,
              height: `${mediaHeight}px`,
            }}
          >
            {mediaOk ? (
              mediaType === "video" ? (
                <video
                  className="seh-media-el"
                  src={mediaSrc}
                  poster={posterSrc}
                  autoPlay
                  muted
                  loop
                  playsInline
                  onError={() => setMediaOk(false)}
                />
              ) : (
                <img className="seh-media-el" src={mediaSrc} alt={title} onError={() => setMediaOk(false)} />
              )
            ) : (
              <BgPh />
            )}
            <div className="seh-media-tint" style={{ opacity: 0.5 - progress * 0.3 }}></div>
          </div>

          {kicker && <span className="seh-kicker">{kicker}</span>}

          <div className="seh-titles">
            <span className="seh-word" style={{ transform: `translateX(-${textShift}vw)` }}>{firstLine}</span>
            <span className="seh-word" style={{ transform: `translateX(${textShift}vw)` }}>{secondLine}</span>
          </div>

          {scrollHint && (
            <span className={`seh-hint${fullyExpanded ? " is-hidden" : ""}`}>
              {scrollHint}
              <i className="seh-hint-bar"></i>
            </span>
          )}
        </div>

        {children && (
          <div className={`seh-content${showContent ? " is-in" : ""}`}>
            {children}
          </div>
        )}
      </section>
    </div>
  );
}
