"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Full-screen viewer for a single image: pinch (or double-tap) to zoom, drag
 * to pan while zoomed, swipe down to dismiss.
 *
 * Touch/tablet only — `useImageLightbox` below simply never opens it on a
 * fine pointer, where a desktop visitor can already see the image at size and
 * has no pinch gesture to offer. Gestures are handled from raw pointer events
 * rather than a library so it stays consistent with the rest of the site's
 * hand-rolled interaction code, and so there's no dependency to carry.
 */

const MAX_SCALE = 4;
const MIN_SCALE = 1;
// how far down you have to drag an un-zoomed image before it dismisses
const DISMISS_DISTANCE = 110;

export interface LightboxImage {
  src: string;
  alt: string;
}

export default function ImageLightbox({ image, onClose }: { image: LightboxImage; onClose: () => void }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [closing, setClosing] = useState(false);

  const close = useCallback(() => {
    setClosing(true);
    // let the fade-out play before unmounting
    setTimeout(onClose, 220);
  }, [onClose]);

  // lock the page behind the viewer so a pan gesture can't scroll it
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  useEffect(() => {
    const stage = stageRef.current;
    const img = imgRef.current;
    if (!stage || !img) return;

    let scale = 1;
    let tx = 0;
    let ty = 0;
    // active pointers, so a second finger turns a drag into a pinch
    const points = new Map<number, { x: number; y: number }>();
    let startDist = 0;
    let startScale = 1;
    let lastX = 0;
    let lastY = 0;
    let lastTap = 0;
    let raf = 0;

    function render() {
      raf = 0;
      img!.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
      // while zoomed out, dragging down fades the backdrop toward dismissal
      const fade = scale <= 1 ? Math.max(0, 1 - Math.abs(ty) / (DISMISS_DISTANCE * 2.2)) : 1;
      stage!.style.setProperty("--lb-fade", String(fade));
    }
    function schedule() {
      if (!raf) raf = requestAnimationFrame(render);
    }

    function clampPan() {
      // keep the image from being dragged entirely off the screen when zoomed
      const bounds = img!.getBoundingClientRect();
      const overflowX = Math.max(0, (bounds.width * 1 - window.innerWidth) / 2);
      const overflowY = Math.max(0, (bounds.height * 1 - window.innerHeight) / 2);
      tx = Math.min(overflowX, Math.max(-overflowX, tx));
      ty = Math.min(overflowY, Math.max(-overflowY, ty));
    }

    function distanceOf() {
      const [a, b] = Array.from(points.values());
      return Math.hypot(a.x - b.x, a.y - b.y);
    }

    function onPointerDown(e: PointerEvent) {
      points.set(e.pointerId, { x: e.clientX, y: e.clientY });
      stage!.setPointerCapture(e.pointerId);

      if (points.size === 2) {
        startDist = distanceOf();
        startScale = scale;
      } else {
        lastX = e.clientX;
        lastY = e.clientY;

        const now = performance.now();
        if (now - lastTap < 300) {
          // double tap toggles between fit and 2.5x
          scale = scale > 1 ? 1 : 2.5;
          tx = 0;
          ty = 0;
          schedule();
          lastTap = 0;
        } else {
          lastTap = now;
        }
      }
    }

    function onPointerMove(e: PointerEvent) {
      if (!points.has(e.pointerId)) return;
      points.set(e.pointerId, { x: e.clientX, y: e.clientY });

      if (points.size >= 2) {
        const dist = distanceOf();
        if (startDist > 0) {
          scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, (startScale * dist) / startDist));
          if (scale <= 1) {
            tx = 0;
            ty = 0;
          } else {
            clampPan();
          }
          schedule();
        }
        return;
      }

      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      if (scale > 1) {
        tx += dx;
        ty += dy;
        clampPan();
      } else {
        // un-zoomed: vertical drag is a dismissal gesture
        ty += dy;
        tx += dx * 0.2;
      }
      schedule();
    }

    function onPointerUp(e: PointerEvent) {
      points.delete(e.pointerId);
      if (stage!.hasPointerCapture(e.pointerId)) stage!.releasePointerCapture(e.pointerId);

      if (points.size === 1) {
        // one finger lifted mid-pinch — resume panning from the other
        const [remaining] = Array.from(points.values());
        lastX = remaining.x;
        lastY = remaining.y;
        startDist = 0;
        return;
      }
      if (points.size > 0) return;

      if (scale <= 1) {
        if (Math.abs(ty) > DISMISS_DISTANCE) {
          close();
          return;
        }
        // snap back to centre
        tx = 0;
        ty = 0;
        img!.style.transition = "transform .25s cubic-bezier(.22,.61,.36,1)";
        schedule();
        setTimeout(() => {
          if (img) img.style.transition = "";
        }, 260);
      }
    }

    stage.addEventListener("pointerdown", onPointerDown);
    stage.addEventListener("pointermove", onPointerMove, { passive: true });
    stage.addEventListener("pointerup", onPointerUp);
    stage.addEventListener("pointercancel", onPointerUp);
    render();

    return () => {
      stage.removeEventListener("pointerdown", onPointerDown);
      stage.removeEventListener("pointermove", onPointerMove);
      stage.removeEventListener("pointerup", onPointerUp);
      stage.removeEventListener("pointercancel", onPointerUp);
      cancelAnimationFrame(raf);
    };
  }, [close]);

  return (
    <div className={`ucx-lightbox${closing ? " is-closing" : ""}`} role="dialog" aria-modal="true" aria-label={image.alt}>
      <div className="ucx-lightbox-stage" ref={stageRef}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="ucx-lightbox-img" ref={imgRef} src={image.src} alt={image.alt} draggable={false} />
      </div>
      <button type="button" className="ucx-lightbox-close" onClick={close} aria-label="Close image">
        &#10005;
      </button>
      <span className="ucx-lightbox-hint" aria-hidden="true">
        Pinch to zoom &middot; swipe down to close
      </span>
    </div>
  );
}
