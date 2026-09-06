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
export interface MarqueeControls {
  /** Advance one card: 1 moves forward through the set, -1 goes back. */
  step: (direction: 1 | -1) => void;
}

export function useSwipeableMarquee<T extends HTMLElement>(options: {
  durationSec: number;
  reverse?: boolean;
  snap?: boolean;
  /** Handed a `step` control once running, for prev/next buttons on touch. */
  onControls?: (controls: MarqueeControls | null) => void;
  onProgress?: (fraction: number) => void;
}) {
  const ref = useRef<T>(null);
  const durationRef = useRef(options.durationSec);
  const reverseRef = useRef(!!options.reverse);
  const snapRef = useRef(!!options.snap);
  const onControlsRef = useRef(options.onControls);
  const onProgressRef = useRef(options.onProgress);

  // Mirrors the latest option values into refs the mount-only effect below
  // can read without needing to re-run — kept in an effect (not written
  // during render) so a render never has the side effect of mutating a ref.
  useEffect(() => {
    durationRef.current = options.durationSec;
    reverseRef.current = !!options.reverse;
    snapRef.current = !!options.snap;
    onControlsRef.current = options.onControls;
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

    // Snap-to-card: the width of one item including its gap. The track holds
    // the item set twice over, so half its scroll width divided by half its
    // child count is one item's pitch — and since `half` is an exact multiple
    // of that pitch, the wrap in apply() below keeps the grid aligned.
    const snapEnabled = snapRef.current && el.children.length >= 2;
    const pitch = snapEnabled ? half / (el.children.length / 2) : 0;
    let draggedSinceSnap = false;
    let holdUntil = 0;
    // when set, the frame loop eases pos onto this instead of drifting —
    // shared by the post-swipe snap and the prev/next controls below
    let snapTarget: number | null = null;

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
      // the target rides along with the wrap, so a step or snap in progress
      // doesn't suddenly find itself a full set-width away
      if (pos <= -half) {
        pos += half;
        if (snapTarget !== null) snapTarget += half;
      }
      if (pos > 0) {
        pos -= half;
        if (snapTarget !== null) snapTarget -= half;
      }
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
      draggedSinceSnap = true;
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
        if (snapTarget === null && Math.abs(velocity) > 0.02) {
          pos += velocity * dt;
          velocity *= 0.94;
        } else {
          velocity = 0;
          if (snapEnabled && snapTarget === null && draggedSinceSnap) {
            // momentum has run out after a swipe — settle onto the nearest
            // card boundary so it never rests half-cut-off
            snapTarget = Math.round(pos / pitch) * pitch;
            draggedSinceSnap = false;
          }

          if (snapTarget !== null) {
            pos += (snapTarget - pos) * 0.18;
            if (Math.abs(snapTarget - pos) < 0.5) {
              pos = snapTarget;
              snapTarget = null;
              // hold a beat before the ambient drift picks up again
              holdUntil = now + 900;
            }
          } else if (now >= holdUntil && !reduceMotion) {
            pos += dir * speedPxPerSec * (dt / 1000);
          }
        }
        apply();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);

    onControlsRef.current?.({
      step(direction) {
        if (!pitch) return;
        // moving forward through the set means shifting content left, so the
        // target position decreases; anchored to the pitch grid from wherever
        // it currently sits, including mid-drift
        const from = snapTarget ?? pos;
        snapTarget = (Math.round(from / pitch) - direction) * pitch;
        velocity = 0;
        draggedSinceSnap = false;
      },
    });

    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      onControlsRef.current?.(null);
    };
  }, []);

  return ref;
}
