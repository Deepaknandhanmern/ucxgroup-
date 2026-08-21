"use client";

import { useEffect, useRef, useState } from "react";

export interface WorldMapPoint {
  lat: number;
  lng: number;
  label?: string;
}

export interface WorldMapDot {
  start: WorldMapPoint;
  end: WorldMapPoint;
}

interface WorldMapProps {
  dots: WorldMapDot[];
  lineColor?: string;
  showLabels?: boolean;
  className?: string;
}

function projectPoint(lat: number, lng: number) {
  const x = (lng + 180) * (800 / 360);
  const y = (90 - lat) * (400 / 180);
  return { x, y };
}

function createCurvedPath(start: { x: number; y: number }, end: { x: number; y: number }) {
  const midX = (start.x + end.x) / 2;
  const midY = Math.min(start.y, end.y) - 50;
  return `M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`;
}

const STAGGER = 0.45;

export function WorldMap({ dots, lineColor = "#91F2B5", showLabels = true, className = "" }: WorldMapProps) {
  const [mounted, setMounted] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setMounted(true)));
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={`ucx-worldmap ${className}`} ref={wrapRef}>
      <img className="ucx-worldmap-bg" src="/brand/world-dotted-map.svg" alt="" aria-hidden="true" draggable={false} />

      <svg className="ucx-worldmap-svg" viewBox="0 0 800 400" preserveAspectRatio="xMidYMid meet">
        <defs>
          <linearGradient id="wm-path-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0" />
            <stop offset="6%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="94%" stopColor={lineColor} stopOpacity="1" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
          <filter id="wm-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="1.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dots.map((dot, i) => {
          const start = projectPoint(dot.start.lat, dot.start.lng);
          const end = projectPoint(dot.end.lat, dot.end.lng);
          const d = createCurvedPath(start, end);
          const delay = `${i * STAGGER}s`;

          return (
            <g className="ucx-worldmap-arc" key={`arc-${i}`} style={{ animationDelay: delay }}>
              <path d={d} className="ucx-worldmap-path" stroke="url(#wm-path-gradient)" pathLength={1} />
              <circle r="3.5" className="ucx-worldmap-runner" fill={lineColor} style={{ offsetPath: `path('${d}')` }} />
            </g>
          );
        })}

        {dots.map((dot, i) => (
          <g key={`markers-${i}`}>
            {([dot.start, dot.end] as const).map((pt, j) => {
              const p = projectPoint(pt.lat, pt.lng);
              const key = pt.label || `${i}-${j}`;
              return (
                <g
                  key={key}
                  className="ucx-worldmap-marker"
                  onPointerEnter={() => setHovered(pt.label || null)}
                  onPointerLeave={() => setHovered(null)}
                >
                  <circle cx={p.x} cy={p.y} r="3" fill={lineColor} filter="url(#wm-glow)" />
                  <circle cx={p.x} cy={p.y} r="3" fill={lineColor} opacity="0.5">
                    <animate attributeName="r" from="3" to="12" dur="2s" begin={`${(i + j * 0.3) * 0.2}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.6" to="0" dur="2s" begin={`${(i + j * 0.3) * 0.2}s`} repeatCount="indefinite" />
                  </circle>

                  {showLabels && pt.label && (
                    <foreignObject x={p.x - 40} y={p.y - 28} width="80" height="22" className="ucx-worldmap-label-slot">
                      <div className={`ucx-worldmap-label${mounted ? " is-in" : ""}`} style={{ transitionDelay: `${0.4 + i * 0.08}s` }}>
                        {pt.label}
                      </div>
                    </foreignObject>
                  )}
                </g>
              );
            })}
          </g>
        ))}
      </svg>

      {hovered && <div className="ucx-worldmap-tooltip">{hovered}</div>}
    </div>
  );
}
