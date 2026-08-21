"use client";

import { useEffect, useRef } from "react";

/**
 * Tracks the pointer over the returned ref's element, exposing the position
 * as --mx/--my CSS custom properties and an "is-hot" class while hovered —
 * the grid-glow/cursor-haze radial highlight pattern used across sections.
 */
export function useCursorGlow<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let pending = false;
    let px = 0;
    let py = 0;

    function onPointerMove(e: PointerEvent) {
      const b = el!.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          el!.style.setProperty("--mx", px + "px");
          el!.style.setProperty("--my", py + "px");
          pending = false;
        });
      }
    }
    function onPointerEnter() {
      el!.classList.add("is-hot");
    }
    function onPointerLeave() {
      el!.classList.remove("is-hot");
    }

    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerenter", onPointerEnter);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerenter", onPointerEnter);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return ref;
}
