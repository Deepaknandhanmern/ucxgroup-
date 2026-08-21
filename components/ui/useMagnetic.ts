"use client";

import { useEffect, useRef } from "react";

/**
 * Subtly pulls the returned ref's element toward the pointer while hovered,
 * springing back to rest on leave — used on primary CTA buttons only.
 * No-ops on touch/coarse-pointer devices.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.3) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onPointerMove(e: PointerEvent) {
      const b = el!.getBoundingClientRect();
      const dx = (e.clientX - (b.left + b.width / 2)) * strength;
      const dy = (e.clientY - (b.top + b.height / 2)) * strength;
      el!.style.transform = `translate(${dx}px, ${dy}px)`;
    }
    function onPointerLeave() {
      el!.style.transform = "";
    }

    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerleave", onPointerLeave);
    return () => {
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerleave", onPointerLeave);
    };
  }, [strength]);

  return ref;
}
