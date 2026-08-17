"use client";

import { useEffect, useRef, useCallback } from "react";
import createGlobe from "cobe";

export interface GlobeMarker {
  location: [number, number];
  size?: number;
}

export interface GlobeArc {
  from: [number, number];
  to: [number, number];
}

interface GlobeProps {
  markers?: GlobeMarker[];
  arcs?: GlobeArc[];
  className?: string;
  markerColor?: [number, number, number];
  baseColor?: [number, number, number];
  arcColor?: [number, number, number];
  glowColor?: [number, number, number];
  dark?: number;
  mapBrightness?: number;
  speed?: number;
  theta?: number;
}

export function Globe({
  markers = [],
  arcs = [],
  className = "",
  markerColor = [0.145, 0.329, 0.294],
  baseColor = [0.91, 0.91, 0.89],
  arcColor = [0.145, 0.329, 0.294],
  glowColor = [0.945, 0.933, 0.906],
  dark = 0,
  mapBrightness = 6,
  speed = 0.0025,
  theta = 0.24,
}: GlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null);
  const dragOffset = useRef(0);
  const phiOffsetRef = useRef(0);
  const isPausedRef = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY };
    isPausedRef.current = true;
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing";
  }, []);

  useEffect(() => {
    function onPointerMove(e: PointerEvent) {
      if (!pointerInteracting.current) return;
      const delta = e.clientX - pointerInteracting.current.x;
      dragOffset.current = delta / 300;
    }
    function onPointerUp() {
      if (pointerInteracting.current) {
        phiOffsetRef.current += dragOffset.current;
        dragOffset.current = 0;
      }
      pointerInteracting.current = null;
      isPausedRef.current = false;
      if (canvasRef.current) canvasRef.current.style.cursor = "grab";
    }
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cobeMarkers = markers.map((m) => ({ location: m.location, size: m.size ?? 0.05 }));
    const cobeArcs = arcs.map((a) => ({ from: a.from, to: a.to }));

    let globe: ReturnType<typeof createGlobe> | null = null;
    let animationId = 0;
    let phi = 0;

    function init() {
      const width = canvas!.offsetWidth;
      if (width === 0) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      globe = createGlobe(canvas!, {
        devicePixelRatio: dpr,
        width: width * dpr,
        height: width * dpr,
        phi: 0,
        theta,
        dark,
        diffuse: 1.3,
        mapSamples: 14000,
        mapBrightness,
        baseColor,
        markerColor,
        glowColor,
        markers: cobeMarkers,
        arcs: cobeArcs,
        arcColor,
        arcWidth: 0.5,
        arcHeight: 0.25,
        opacity: 0.85,
      });

      function animate() {
        if (!isPausedRef.current) phi += speed;
        globe!.update({ phi: phi + phiOffsetRef.current + dragOffset.current, theta });
        animationId = requestAnimationFrame(animate);
      }
      animate();

      requestAnimationFrame(() => {
        if (canvas) canvas.style.opacity = "1";
      });
    }

    if (canvas.offsetWidth > 0) {
      init();
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect();
          init();
        }
      });
      ro.observe(canvas);
    }

    return () => {
      cancelAnimationFrame(animationId);
      globe?.destroy();
    };
  }, [markers, arcs, markerColor, baseColor, arcColor, glowColor, dark, mapBrightness, speed, theta]);

  return (
    <div className={`ucx-globe ${className}`}>
      <canvas ref={canvasRef} onPointerDown={onPointerDown} />
    </div>
  );
}
