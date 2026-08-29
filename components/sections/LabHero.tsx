"use client";

import { useEffect, useRef, useState } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

const TAGS = ["AEC Innovation", "Digital Solutions", "Co-Creation"];
const TITLE_WORDS = ["What", "Can", "We", "Build", "Together?"];
const SUBTITLE = "Exploring practical solutions to real-world AEC challenges.";

// ---------- interactive collaboration sphere ----------
// A rotating geodesic wireframe — a subdivided icosahedron, the same
// construction behind a Japanese kusudama origami ball's faceted panels —
// standing in for many pieces of expertise assembling into one whole.
// Nodes near the pointer light up and draw a live connection to it.
const NET_VB = 360;
const SPHERE_RADIUS = 128;
const PERSPECTIVE = 3.2;
const TILT = 0.45;
const HOVER_RADIUS = 46;
const ROTATION_SPEED = 0.0026;

type Vec3 = [number, number, number];

function normalize([x, y, z]: Vec3): Vec3 {
  const len = Math.sqrt(x * x + y * y + z * z) || 1;
  return [x / len, y / len, z / len];
}

// Icosahedron (12 verts / 20 faces) subdivided once into a 42-vertex,
// 80-face geodesic sphere — dense enough to read as many small facets,
// like a kusudama ball, rather than a plain low-poly shape.
function buildGeodesicSphere(): { vertices: Vec3[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2;
  const vertices: Vec3[] = (
    [
      [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
      [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
      [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
    ] as Vec3[]
  ).map(normalize);

  const baseFaces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];

  const midpointCache = new Map<string, number>();
  function midpoint(a: number, b: number): number {
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    const cached = midpointCache.get(key);
    if (cached !== undefined) return cached;
    const va = vertices[a];
    const vb = vertices[b];
    vertices.push(normalize([(va[0] + vb[0]) / 2, (va[1] + vb[1]) / 2, (va[2] + vb[2]) / 2]));
    const index = vertices.length - 1;
    midpointCache.set(key, index);
    return index;
  }

  const faces: [number, number, number][] = [];
  for (const [a, b, c] of baseFaces) {
    const ab = midpoint(a, b);
    const bc = midpoint(b, c);
    const ca = midpoint(c, a);
    faces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
  }

  const edgeSet = new Set<string>();
  const edges: [number, number][] = [];
  for (const [a, b, c] of faces) {
    for (const [x, y] of [[a, b], [b, c], [c, a]] as [number, number][]) {
      const key = x < y ? `${x}-${y}` : `${y}-${x}`;
      if (!edgeSet.has(key)) {
        edgeSet.add(key);
        edges.push(x < y ? [x, y] : [y, x]);
      }
    }
  }

  return { vertices, edges };
}

function project(v: Vec3, angle: number): { x: number; y: number; z: number } {
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);
  const x1 = v[0] * cosA - v[2] * sinA;
  const z1 = v[0] * sinA + v[2] * cosA;
  const cosT = Math.cos(TILT);
  const sinT = Math.sin(TILT);
  const y2 = v[1] * cosT - z1 * sinT;
  const z2 = v[1] * sinT + z1 * cosT;
  const f = PERSPECTIVE / (PERSPECTIVE + z2);
  return { x: NET_VB / 2 + x1 * SPHERE_RADIUS * f, y: NET_VB / 2 + y2 * SPHERE_RADIUS * f, z: z2 };
}

function CollabNetwork() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const groupRef = useRef<SVGGElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const group = groupRef.current;
    const wrap = wrapRef.current;
    if (!svg || !group || !wrap) return;

    const { vertices, edges } = buildGeodesicSphere();
    const NS = "http://www.w3.org/2000/svg";

    const edgeEls = edges.map(() => {
      const line = document.createElementNS(NS, "line");
      line.setAttribute("class", "net-edge");
      group.appendChild(line);
      return line;
    });
    const nodeEls = vertices.map(() => {
      const c = document.createElementNS(NS, "circle");
      c.setAttribute("class", "net-node");
      group.appendChild(c);
      return c;
    });
    const pointerLineEls = vertices.map(() => {
      const line = document.createElementNS(NS, "line");
      line.setAttribute("class", "net-pointer-line");
      group.appendChild(line);
      return line;
    });
    const pointerDot = document.createElementNS(NS, "circle");
    pointerDot.setAttribute("class", "net-pointer-dot");
    pointerDot.setAttribute("r", "5");
    group.appendChild(pointerDot);

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let angle = 0;
    let raf = 0;

    function draw() {
      const projected = vertices.map((v) => project(v, angle));

      edges.forEach(([a, b], i) => {
        const pa = projected[a];
        const pb = projected[b];
        const el = edgeEls[i];
        el.setAttribute("x1", String(pa.x));
        el.setAttribute("y1", String(pa.y));
        el.setAttribute("x2", String(pb.x));
        el.setAttribute("y2", String(pb.y));
        el.setAttribute("opacity", String(0.1 + ((pa.z + pb.z) / 2 + 1) * 0.14));
      });

      projected.forEach((p, i) => {
        const el = nodeEls[i];
        el.setAttribute("cx", String(p.x));
        el.setAttribute("cy", String(p.y));
        el.setAttribute("r", String(1.6 + (p.z + 1) * 1.3));
        if (!el.classList.contains("is-near")) {
          el.setAttribute("opacity", String(0.3 + (p.z + 1) * 0.28));
        }
      });

      const pointer = pointerRef.current;
      projected.forEach((p, i) => {
        const nodeEl = nodeEls[i];
        const lineEl = pointerLineEls[i];
        const isNear = !!pointer && Math.hypot(p.x - pointer.x, p.y - pointer.y) < HOVER_RADIUS;
        nodeEl.classList.toggle("is-near", isNear);
        if (isNear && pointer) {
          lineEl.setAttribute("x1", String(pointer.x));
          lineEl.setAttribute("y1", String(pointer.y));
          lineEl.setAttribute("x2", String(p.x));
          lineEl.setAttribute("y2", String(p.y));
          lineEl.style.opacity = "1";
        } else {
          lineEl.style.opacity = "0";
        }
      });
      if (pointer) {
        pointerDot.setAttribute("cx", String(pointer.x));
        pointerDot.setAttribute("cy", String(pointer.y));
        pointerDot.style.opacity = "1";
      } else {
        pointerDot.style.opacity = "0";
      }
    }

    function frame() {
      angle += ROTATION_SPEED;
      draw();
      raf = requestAnimationFrame(frame);
    }

    if (reduce) {
      draw();
    } else {
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      const r = svg!.getBoundingClientRect();
      pointerRef.current = {
        x: ((e.clientX - r.left) / r.width) * NET_VB,
        y: ((e.clientY - r.top) / r.height) * NET_VB,
      };
      if (reduce) draw();
    }
    function onLeave() {
      pointerRef.current = null;
      if (reduce) draw();
    }

    const pointerFine = window.matchMedia("(pointer: fine)").matches;
    if (pointerFine) {
      wrap.addEventListener("pointermove", onMove, { passive: true });
      wrap.addEventListener("pointerleave", onLeave);
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      edgeEls.forEach((el) => el.remove());
      nodeEls.forEach((el) => el.remove());
      pointerLineEls.forEach((el) => el.remove());
      pointerDot.remove();
    };
  }, []);

  return (
    <div className="network-wrap" ref={wrapRef}>
      <div className="network-glow"></div>
      <svg ref={svgRef} viewBox={`0 0 ${NET_VB} ${NET_VB}`} className="network-svg" aria-hidden="true">
        <g ref={groupRef}></g>
      </svg>
    </div>
  );
}

interface Stage {
  index: string;
  title: string;
  subline: string;
  tags: string[];
}

const STAGES: Stage[] = [
  { index: "01", title: "Identify", subline: "Find the problem.", tags: ["Industry challenges", "Project gaps", "Emerging opportunities"] },
  { index: "02", title: "Co-Create", subline: "Develop the approach.", tags: ["Ideas", "Research", "Expertise", "Solution design"] },
  { index: "03", title: "Prototype", subline: "Build and test.", tags: ["Workflows", "Models", "Tools", "Simulations", "Pilots"] },
  { index: "04", title: "Deploy", subline: "Apply what works.", tags: ["Projects", "Processes", "Systems", "Scalable solutions"] },
];

export default function LabHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const heroBandRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();
  const [visibleWords, setVisibleWords] = useState(0);
  const [restVisible, setRestVisible] = useState(false);

  // word-by-word title reveal, then subtitle/tags/actions
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisibleWords(TITLE_WORDS.length);
      setRestVisible(true);
      return;
    }
    if (visibleWords < TITLE_WORDS.length) {
      const t = setTimeout(() => setVisibleWords((v) => v + 1), 220);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setRestVisible(true), 260);
    return () => clearTimeout(t);
  }, [visibleWords]);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const targets = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 6) * 80}ms`;
    });
    if (!("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" }
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  function scrollToNext() {
    const band = heroBandRef.current;
    const next = band?.nextElementSibling;
    if (next) next.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="ucx-labhero" id="overview" ref={rootRef}>
      {/* ---------- hero band: full-bleed, dark ---------- */}
      <div className="hero-band" ref={heroBandRef}>
        <div className="grid-overlay"></div>
        <div className="aura"></div>
        <div className="vignette"></div>

        <div className="hero-inner">
          <div className="hero-copy">
            <span className="eyebrow">Collaboration Lab</span>
            <h1 className="heading">
              {TITLE_WORDS.map((word, i) => (
                <span className="word-mask" key={word}>
                  <span className={`word-inner${i < visibleWords ? " is-in" : ""}`}>{word}</span>
                </span>
              ))}
            </h1>
            <p className={`subtitle${restVisible ? " is-in" : ""}`}>{SUBTITLE}</p>

            <div className={`tags${restVisible ? " is-in" : ""}`}>
              {TAGS.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className={`hero-actions${restVisible ? " is-in" : ""}`}>
              <a className="cta-solid" href="/contact">
                Propose a Collaboration
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h13M13 6l6 6-6 6" />
                </svg>
              </a>
              <a className="cta-ghost" href="#domains">
                Explore Live Ideas
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v13M6 13l6 6 6-6" />
                </svg>
              </a>
            </div>
          </div>

          <CollabNetwork />
        </div>

        <button type="button" className="scroll-cue" onClick={scrollToNext} aria-label="Scroll to explore">
          <span>Scroll to explore</span>
          <span className="bar"></span>
        </button>
      </div>

      {/* ---------- white body: manifesto + process ---------- */}
      <div className="lab-body" ref={bodyGlowRef}>
        <div className="grid-overlay"></div>
        <div className="grid-glow"></div>
        <div className="cursor-haze"></div>

        <div className="wrapper">
          {/* ---------- manifesto ---------- */}
          <div className="manifesto" data-reveal>
            <h2>
              Most Firms Deliver Services. We Build Solutions, <em>Together.</em>
            </h2>
            <span className="manifesto-flow">Challenge <i>&rarr;</i> Collaboration <i>&rarr;</i> Solution</span>
            <p>
              The Lab starts with real industry problems. We bring the right expertise together, develop practical
              approaches and test them through prototypes, pilots and real project environments.
            </p>
          </div>

          {/* ---------- 4-stage process ---------- */}
          <div className="process-head" data-reveal>
            <h3>From Challenge to Applied Solution</h3>
          </div>
          <ol className="stages">
            {STAGES.map((s, i) => (
              <li className="stage" data-reveal key={s.index}>
                <div className="stage-top">
                  <span className="stage-dot">
                    <span>{s.index}</span>
                  </span>
                  {i < STAGES.length - 1 && (
                    <span className="stage-connector" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h13M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  )}
                </div>
                <div className="stage-body">
                  <h4>{s.title}</h4>
                  <p className="stage-subline">{s.subline}</p>
                  <p className="stage-tags">{s.tags.join(" · ")}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
