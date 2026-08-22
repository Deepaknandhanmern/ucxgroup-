"use client";

import { useEffect, useRef, useState } from "react";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

const TAGS = ["AEC Innovation", "Digital Solutions", "Co-Creation"];
const TITLE_WORDS = ["What", "Can", "We", "Build", "Together?"];
const SUBTITLE = "Exploring practical solutions to real-world AEC challenges.";

// ---------- interactive collaboration network ----------
// A loose graph of nodes representing people/ideas coming together — nodes
// near the pointer light up and draw a live connection to it, echoing the
// "bring expertise together" idea the Lab is actually about.
const NET_VB = 360;
interface NetNode { id: number; x: number; y: number }
const NET_NODES: NetNode[] = [
  { id: 0, x: 70, y: 60 },
  { id: 1, x: 180, y: 40 },
  { id: 2, x: 290, y: 80 },
  { id: 3, x: 130, y: 130 },
  { id: 4, x: 250, y: 160 },
  { id: 5, x: 60, y: 200 },
  { id: 6, x: 180, y: 220 },
  { id: 7, x: 300, y: 240 },
  { id: 8, x: 110, y: 290 },
  { id: 9, x: 230, y: 310 },
  { id: 10, x: 40, y: 320 },
];
const NET_EDGES: [number, number][] = [
  [0, 1], [1, 2], [0, 3], [1, 3], [3, 4], [2, 4], [3, 5], [3, 6],
  [4, 6], [4, 7], [5, 6], [6, 7], [5, 8], [6, 8], [6, 9], [7, 9], [8, 9], [8, 10],
];
const NET_RADIUS = 110;

function CollabNetwork() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const rafRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const svg = svgRef.current;
    if (!wrap || !svg) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    function onMove(e: PointerEvent) {
      if (rafRef.current) return;
      rafRef.current = requestAnimationFrame(() => {
        const r = svg!.getBoundingClientRect();
        setPointer({
          x: ((e.clientX - r.left) / r.width) * NET_VB,
          y: ((e.clientY - r.top) / r.height) * NET_VB,
        });
        rafRef.current = null;
      });
    }
    function onLeave() {
      setPointer(null);
    }

    wrap.addEventListener("pointermove", onMove, { passive: true });
    wrap.addEventListener("pointerleave", onLeave);
    return () => {
      wrap.removeEventListener("pointermove", onMove);
      wrap.removeEventListener("pointerleave", onLeave);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const near = pointer
    ? NET_NODES.filter((n) => Math.hypot(n.x - pointer.x, n.y - pointer.y) < NET_RADIUS)
    : [];
  const nearIds = new Set(near.map((n) => n.id));

  return (
    <div className="network-wrap" ref={wrapRef}>
      <div className="network-glow"></div>
      <svg ref={svgRef} viewBox={`0 0 ${NET_VB} ${NET_VB}`} className="network-svg" aria-hidden="true">
        <g className="net-edges">
          {NET_EDGES.map(([a, b], i) => {
            const na = NET_NODES[a];
            const nb = NET_NODES[b];
            return <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y} />;
          })}
        </g>
        {pointer &&
          near.map((n) => (
            <line key={`p-${n.id}`} className="net-pointer-line" x1={pointer.x} y1={pointer.y} x2={n.x} y2={n.y} />
          ))}
        <g className="net-nodes">
          {NET_NODES.map((n, i) => (
            <circle
              key={n.id}
              className={`net-node${nearIds.has(n.id) ? " is-near" : ""}`}
              cx={n.x}
              cy={n.y}
              r={nearIds.has(n.id) ? 7 : 4.5}
              style={{ animationDelay: `${(i % 6) * -1.3}s` }}
            />
          ))}
        </g>
        {pointer && <circle className="net-pointer-dot" cx={pointer.x} cy={pointer.y} r="5" />}
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
