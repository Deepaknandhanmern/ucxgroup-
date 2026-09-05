"use client";

import { useEffect, useRef } from "react";

const HINT_KEY = "ucx-swipe-hint-shown";
// Module-level, not per-hook-instance: several marquees mount in the same
// page load, but the "you can swipe this" hint only needs to appear once,
// on whichever one the visitor reaches first — not once per row.
let hintShownThisLoad = false;

// A one-shot "swipe" pill that fades in, nudges left-right, then removes
// itself — pure inline styles + the Web Animations API so this hook stays
// self-contained (no CSS file of its own to keep in sync with callers).
function showSwipeHint(track: HTMLElement) {
  const parent = track.parentElement;
  if (!parent) return;
  if (getComputedStyle(parent).position === "static") parent.style.position = "relative";

  const layer = document.createElement("div");
  layer.setAttribute("aria-hidden", "true");
  Object.assign(layer.style, {
    position: "absolute",
    inset: "0",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
    zIndex: "5",
  });

  const pill = document.createElement("div");
  Object.assign(pill.style, {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 16px",
    borderRadius: "999px",
    background: "rgba(0,20,15,0.72)",
    color: "#91F2B5",
    fontSize: "12px",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
    fontFamily: "inherit",
    boxShadow: "0 8px 24px -8px rgba(0,0,0,.5)",
    whiteSpace: "nowrap",
  });
  pill.innerHTML =
    '<span style="font-size:14px;line-height:1">&#8592;</span><span>Swipe</span><span style="font-size:14px;line-height:1">&#8594;</span>';

  layer.appendChild(pill);
  parent.appendChild(layer);

  const anim = pill.animate(
    [
      { opacity: 0, transform: "translateX(0)", offset: 0 },
      { opacity: 1, transform: "translateX(0)", offset: 0.15 },
      { opacity: 1, transform: "translateX(-10px)", offset: 0.45 },
      { opacity: 1, transform: "translateX(10px)", offset: 0.75 },
      { opacity: 0, transform: "translateX(0)", offset: 1 },
    ],
    { duration: 1900, easing: "ease-in-out" }
  );
  anim.onfinish = () => layer.remove();
}

/**
 * Makes a CSS keyframe marquee row (built from a duplicated child set, e.g.
 * `[...items, ...items]` with `width: max-content`) finger-swipeable with
 * momentum on touch devices, while leaving the original CSS animation (and
 * its hover-to-pause behavior) completely untouched on mouse/desktop.
 *
 * On a coarse pointer, the CSS animation is disengaged and replaced with a
 * single continuous position value driven by one requestAnimationFrame
 * loop: it auto-advances at the same visual speed the CSS animation used,
 * responds 1:1 to a drag, and on release decays the drag's velocity into
 * momentum before smoothly resuming auto-advance from wherever that comes
 * to rest — no separate "snap back" step, so there's never a visible jump.
 *
 * The first such row a visitor reaches also gets a one-time "swipe" hint
 * (localStorage-gated, never repeats), and callers can pass onProgress to
 * read back how far through one loop of the (non-duplicated) item set the
 * row currently is — e.g. to drive a page-position dots indicator.
 */
export function useSwipeableMarquee<T extends HTMLElement>(options: {
  durationSec: number;
  reverse?: boolean;
  onProgress?: (fraction: number) => void;
}) {
  const ref = useRef<T>(null);
  const durationRef = useRef(options.durationSec);
  const reverseRef = useRef(!!options.reverse);
  const onProgressRef = useRef(options.onProgress);

  // Mirrors the latest option values into refs the mount-only effect below
  // can read without needing to re-run — kept in an effect (not written
  // during render) so a render never has the side effect of mutating a ref.
  useEffect(() => {
    durationRef.current = options.durationSec;
    reverseRef.current = !!options.reverse;
    onProgressRef.current = options.onProgress;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (!coarse) return; // desktop keeps the original CSS marquee + hover-pause

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dir = reverseRef.current ? 1 : -1;
    const half = el.scrollWidth / 2 || 1;
    // matches the CSS animation's own speed (half the duplicated width over
    // its animation-duration) instead of a hardcoded px/s, since card widths
    // vary with viewport (min(360px, 82vw)) and content length
    const speedPxPerSec = half / durationRef.current;
    let pos = reverseRef.current ? -half : 0;
    let velocity = 0;
    let dragging = false;
    let lastX = 0;
    let lastT = performance.now();
    let raf = 0;
    let lastProgressReport = 0;

    el.style.animation = "none";
    el.style.touchAction = "pan-y";

    if (!hintShownThisLoad && !reduceMotion) {
      hintShownThisLoad = true;
      let seen = false;
      try {
        seen = localStorage.getItem(HINT_KEY) === "1";
      } catch {
        /* private mode / storage disabled — just skip the hint */
      }
      if (!seen) {
        showSwipeHint(el);
        try {
          localStorage.setItem(HINT_KEY, "1");
        } catch {
          /* ignore */
        }
      }
    }

    function apply() {
      if (pos <= -half) pos += half;
      if (pos > 0) pos -= half;
      el!.style.transform = `translateX(${pos}px)`;

      if (onProgressRef.current) {
        const now = performance.now();
        if (now - lastProgressReport > 100) {
          lastProgressReport = now;
          onProgressRef.current(Math.abs(pos) / half);
        }
      }
    }

    function onPointerDown(e: PointerEvent) {
      dragging = true;
      velocity = 0;
      lastX = e.clientX;
      lastT = performance.now();
      el!.setPointerCapture(e.pointerId);
    }
    function onPointerMove(e: PointerEvent) {
      if (!dragging) return;
      const now = performance.now();
      const dx = e.clientX - lastX;
      pos += dx;
      const dt = Math.max(1, now - lastT);
      velocity = dx / dt;
      lastX = e.clientX;
      lastT = now;
      apply();
    }
    function onPointerUp(e: PointerEvent) {
      dragging = false;
      if (el!.hasPointerCapture(e.pointerId)) el!.releasePointerCapture(e.pointerId);
    }

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    let lastFrame = performance.now();
    function frame(now: number) {
      const dt = now - lastFrame;
      lastFrame = now;
      if (!dragging) {
        if (Math.abs(velocity) > 0.02) {
          pos += velocity * dt;
          velocity *= 0.94;
        } else {
          velocity = 0;
          if (!reduceMotion) pos += dir * speedPxPerSec * (dt / 1000);
        }
        apply();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, []);

  return ref;
}
