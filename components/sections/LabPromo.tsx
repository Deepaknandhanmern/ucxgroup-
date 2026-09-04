"use client";

import { useEffect, useRef, useState } from "react";

const TAGS = ["AI & Automation", "Digital Construction", "Prefabrication", "Smart Assets"];
const CAPTIONS = ["DESIGN", "DIGITAL", "DELIVERY", "ASSET"];

export default function LabPromo() {
  const sectRef = useRef<HTMLDivElement>(null);
  const buildingFrameRef = useRef<HTMLDivElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);

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

  // A gentle 3D tilt on the building card — it leans away from the pointer
  // like it has real depth, instead of sitting flat on the page. Mouse-only:
  // coarse (touch) pointers get the richer set of interactions below instead,
  // since a continuous drag-to-tilt would fight with normal page scrolling.
  useEffect(() => {
    const frame = buildingFrameRef.current;
    if (!frame) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduceMotion || coarse) return;

    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let raf = 0;

    function onMove(e: PointerEvent) {
      const b = frame!.getBoundingClientRect();
      const nx = ((e.clientX - b.left) / b.width) * 2 - 1;
      const ny = ((e.clientY - b.top) / b.height) * 2 - 1;
      targetY = nx * 10;
      targetX = -ny * 8;
    }
    function onLeave() {
      targetX = 0;
      targetY = 0;
    }
    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      frame!.style.transform = `rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    }
    frame.addEventListener("pointermove", onMove, { passive: true });
    frame.addEventListener("pointerleave", onLeave);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  // ---------------------------------------------------------------------
  // Mobile/tablet (coarse pointer) interactions — most visitors only ever
  // see this section on a touchscreen, so it gets its own richer set of
  // gestures instead of just inheriting the desktop hover-tilt (which
  // never fires on touch at all):
  //  - scroll-triggered tilt-in the first time the card enters view
  //  - ambient motion: phone-tilt (gyroscope) when available/granted,
  //    otherwise a gentle auto-sway so it's never static
  //  - tap: a quick "poke" tilt toward the tap point + haptic buzz
  //  - long-press: reveals a rotating stage caption (Design/Digital/
  //    Delivery/Asset)
  //  - swipe left/right: cycles the highlighted tag above, so the same
  //    gesture that works everywhere else on a phone also drives this card
  // Deliberately NOT a continuous drag-to-tilt: capturing touchmove for
  // that would fight with the user's normal page-scroll gesture over the
  // same element, so gestures are read from touchstart/touchend deltas and
  // hold-duration instead of live dragging.
  // ---------------------------------------------------------------------
  useEffect(() => {
    const frame = buildingFrameRef.current;
    const caption = captionRef.current;
    if (!frame || !caption) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) return;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let curX = 0,
      curY = 0,
      targetX = 0,
      targetY = 0;
    let raf = 0;
    let gyroActive = false;
    let swayT = 0;
    let started = false;

    function tick() {
      if (!gyroActive && !reduceMotion) {
        swayT += 0.006;
        targetX = Math.sin(swayT * 0.7) * 3;
        targetY = Math.sin(swayT) * 14;
      }
      curX += (targetX - curX) * 0.05;
      curY += (targetY - curY) * 0.05;
      frame!.style.transform = `rotateX(${curX.toFixed(2)}deg) rotateY(${curY.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    }

    function startAnimating() {
      if (started) return;
      started = true;
      // enter tilted, then ease into the ambient motion — a one-time
      // "wake up" moment instead of appearing already mid-animation
      curX = 10;
      curY = -16;
      if (!reduceMotion) raf = requestAnimationFrame(tick);
      else frame!.style.transform = "none";
    }

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              startAnimating();
              io!.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(frame);
    } else {
      startAnimating();
    }

    function onOrientation(e: DeviceOrientationEvent) {
      gyroActive = true;
      const beta = e.beta ?? 0;
      const gamma = e.gamma ?? 0;
      targetX = Math.max(-8, Math.min(8, (beta - 45) * -0.15));
      targetY = Math.max(-10, Math.min(10, gamma * 0.2));
    }
    let gyroRequested = false;
    function requestGyro() {
      if (gyroRequested || reduceMotion) return;
      gyroRequested = true;
      const DOE = window.DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (DOE && typeof DOE.requestPermission === "function") {
        DOE.requestPermission()
          .then((state) => {
            if (state === "granted") window.addEventListener("deviceorientation", onOrientation);
          })
          .catch(() => {});
      } else if ("DeviceOrientationEvent" in window) {
        window.addEventListener("deviceorientation", onOrientation);
      }
    }

    let captionIndex = 0;
    function showCaption() {
      caption!.textContent = CAPTIONS[captionIndex % CAPTIONS.length];
      captionIndex++;
      caption!.classList.add("show");
    }
    function hideCaption() {
      caption!.classList.remove("show");
    }

    let touchStartX = 0,
      touchStartY = 0,
      touchStartTime = 0;
    let longPressTimer: ReturnType<typeof setTimeout> | null = null;
    let longPressFired = false;

    function onTouchStart(e: TouchEvent) {
      requestGyro();
      const t = e.touches[0];
      touchStartX = t.clientX;
      touchStartY = t.clientY;
      touchStartTime = performance.now();
      longPressFired = false;
      longPressTimer = setTimeout(() => {
        longPressFired = true;
        showCaption();
        if (navigator.vibrate) navigator.vibrate(12);
      }, 480);

      const b = frame!.getBoundingClientRect();
      const nx = ((t.clientX - b.left) / b.width) * 2 - 1;
      const ny = ((t.clientY - b.top) / b.height) * 2 - 1;
      targetY = nx * 12;
      targetX = -ny * 8;
      frame!.classList.add("is-poked");
    }

    function onTouchEnd(e: TouchEvent) {
      if (longPressTimer) clearTimeout(longPressTimer);
      frame!.classList.remove("is-poked");
      hideCaption();

      const t = e.changedTouches[0];
      const dx = t.clientX - touchStartX;
      const dy = t.clientY - touchStartY;
      const dt = performance.now() - touchStartTime;
      const absDx = Math.abs(dx);
      const absDy = Math.abs(dy);

      if (!longPressFired) {
        if (absDx > 40 && absDx > absDy * 1.4) {
          // a real horizontal swipe — cycle the highlighted tag
          setActive((prev) => {
            const count = TAGS.length;
            const cur = prev ?? 0;
            return dx < 0 ? (cur + 1) % count : (cur - 1 + count) % count;
          });
          if (navigator.vibrate) navigator.vibrate(8);
        } else if (absDx < 12 && absDy < 12 && dt < 400) {
          // a tap — quick poke pulse
          frame!.classList.remove("is-tapped");
          void frame!.offsetWidth;
          frame!.classList.add("is-tapped");
          if (navigator.vibrate) navigator.vibrate(10);
        }
      }
      targetX = 0;
      targetY = 0;
    }

    frame.addEventListener("touchstart", onTouchStart, { passive: true });
    frame.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      if (io) io.disconnect();
      cancelAnimationFrame(raf);
      window.removeEventListener("deviceorientation", onOrientation);
      frame!.removeEventListener("touchstart", onTouchStart);
      frame!.removeEventListener("touchend", onTouchEnd);
      if (longPressTimer) clearTimeout(longPressTimer);
    };
  }, []);

  return (
    <div className="ucx-labpromo" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="lp-blob lp-blob-a" aria-hidden="true"></div>
      <div className="lp-blob lp-blob-b" aria-hidden="true"></div>

      <div className="wrapper">
        <div className="lp-copy">
          <span className="eyebrow">More Than Project Delivery.</span>
          <h2 className="heading">What If We Built the Next Solution Together?</h2>
          <p className="intro">
            The UCX Collaboration Lab brings people, technology and real project challenges together to explore
            what&rsquo;s possible beyond conventional delivery.
          </p>
          <div className="tags">
            {TAGS.map((t, i) => (
              <span
                key={t}
                className={active === i ? "is-active" : undefined}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                tabIndex={0}
              >
                {t}
              </span>
            ))}
          </div>
          <a className="cta" href="/collaboration-lab">
            <span className="cta-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </span>
            Explore the Collaboration Lab
          </a>
        </div>

        <div className="lp-graphic">
          <div className="lp-building-frame" ref={buildingFrameRef}>
            <div className="lp-building-bg">
              <div className="lp-building-shadow" aria-hidden="true"></div>
            </div>
            <img className="lp-building-img" src="/brand/lab-promo/building.png" alt="A UCX-designed residential tower elevation" />
            <div className="lp-caption" ref={captionRef} aria-hidden="true"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
