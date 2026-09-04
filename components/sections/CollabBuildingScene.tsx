"use client";

import { useEffect, useRef } from "react";

/**
 * The Lab promo's right-panel graphic: a slowly-revolving CSS 3D building
 * whose facade, MEP cores and BIM wireframe cycle through Design / Digital /
 * Delivery / Asset "intelligence" stages, then a collaboration-node view and
 * a closing tagline, on a fixed loop. Ported from a standalone full-viewport
 * HTML/CSS/JS mockup: geometry units are converted from vmin (viewport-
 * relative) to cqi (this component's own container width) so it scales
 * correctly at panel size instead of hero size, and the cursor interaction
 * is rescoped from `window` to this component's own root — the original
 * tracked the pointer across the whole page, which only makes sense for a
 * full-bleed hero, not an embedded card.
 */

interface Stage {
  key: string;
  dur: number;
  title?: string;
  micro?: [string, string, string, string];
}

const STAGES: Stage[] = [
  { key: "design", dur: 6, title: "Design Intelligence", micro: ["Design", "Space", "Material", "Experience"] },
  { key: "digital", dur: 6, title: "Digital Intelligence", micro: ["BIM", "Data", "Coordination", "Automation"] },
  { key: "delivery", dur: 6, title: "Delivery Intelligence", micro: ["Construction", "Fabrication", "Coordination", "Execution"] },
  { key: "asset", dur: 6, title: "Asset Intelligence", micro: ["Handover", "Asset Data", "FM", "Digital Twin"] },
  { key: "collaborate", dur: 5 },
  { key: "clean", dur: 2 },
  { key: "tagline", dur: 3 },
];
const TOTAL = STAGES.reduce((s, x) => s + x.dur, 0);
const BOUNDS: [number, number, Stage][] = (() => {
  let acc = 0;
  return STAGES.map((s) => {
    const b: [number, number, Stage] = [acc, acc + s.dur, s];
    acc += s.dur;
    return b;
  });
})();

type Mode = "content" | "collab" | "tagline" | "none";

export default function CollabBuildingScene() {
  const rootRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);
  const rigRef = useRef<HTMLDivElement>(null);
  const buildingRef = useRef<HTMLDivElement>(null);
  const bgGridRef = useRef<HTMLDivElement>(null);
  const faceFrontRef = useRef<HTMLDivElement>(null);
  const faceBackRef = useRef<HTMLDivElement>(null);
  const titleTextRef = useRef<HTMLHeadingElement>(null);
  const microRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const root = rootRef.current;
    const scene = sceneRef.current;
    const rig = rigRef.current;
    const building = buildingRef.current;
    const bgGrid = bgGridRef.current;
    const faceFront = faceFrontRef.current;
    const faceBack = faceBackRef.current;
    const titleText = titleTextRef.current;
    if (!root || !scene || !rig || !building || !bgGrid || !faceFront || !faceBack || !titleText) return;

    const contentLineGroups = Array.from(root.querySelectorAll<HTMLElement>(".content-lines"));
    const assetNet = root.querySelector<SVGGElement>(".asset-net");
    const collabLines = root.querySelector<SVGGElement>(".collab-lines");
    const collabLayer = root.querySelector<HTMLElement>(".collab-layer");
    const tagline = root.querySelector<HTMLElement>(".tagline");
    if (!assetNet || !collabLines || !collabLayer || !tagline) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // ---------- build facade panels ----------
    function buildFace(el: HTMLElement, rows: number, cols: number, stoneRows: number) {
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const p = document.createElement("div");
          p.className = "panel" + (r >= rows - stoneRows ? " stone" : "");
          if ((r + c) % 3 === 0) {
            p.classList.add("ex");
            p.style.setProperty("--ez", (18 + Math.random() * 64).toFixed(0) + "px");
          }
          el.appendChild(p);
        }
      }
    }
    buildFace(faceFront, 9, 4, 2);
    buildFace(faceBack, 9, 4, 2);

    const explodablePanels = root.querySelectorAll<HTMLElement>(".panel.ex");
    function setExploded(on: boolean) {
      explodablePanels.forEach((p) => {
        p.style.transform = on ? "translateZ(var(--ez,0px))" : "translateZ(0px)";
      });
    }

    function setGroups(mode: Mode, currentKey: string | null) {
      contentLineGroups.forEach((g) => g.classList.toggle("visible", mode === "content"));
      assetNet!.classList.toggle("visible", mode === "content" && currentKey === "asset");
      collabLines!.classList.toggle("visible", mode === "collab");
      collabLayer!.classList.toggle("visible", mode === "collab");
      tagline!.classList.toggle("visible", mode === "tagline");
    }

    let currentKey: string | null = null;

    function enterStage(stage: Stage) {
      currentKey = stage.key;
      building!.className = "building stage-" + stage.key;

      // a brief camera "punch-in" on every stage cut — like a documentary
      // cutting to a fresh angle, instead of the scene just relabeling itself.
      // Applied to .scene (not .rig, which the rotation loop drives via its
      // own inline transform every frame) so the two animations don't fight.
      scene!.classList.remove("cam-punch");
      void scene!.offsetWidth;
      scene!.classList.add("cam-punch");

      if (stage.title && stage.micro) {
        titleText!.textContent = stage.title;
        stage.micro.forEach((m, i) => {
          const el = microRefs.current[i];
          if (el) el.textContent = m;
        });
        setGroups("content", stage.key);
        building!.classList.toggle("digital-active", stage.key === "digital");
        if (stage.key === "delivery") {
          building!.classList.add("exploded");
          setExploded(true);
        } else {
          setExploded(false);
        }
        assetNet!.classList.toggle("visible", stage.key === "asset");
      } else if (stage.key === "collaborate") {
        setGroups("collab", currentKey);
        setExploded(false);
      } else if (stage.key === "tagline") {
        setGroups("tagline", currentKey);
        setExploded(false);
      } else {
        setGroups("none", currentKey);
        setExploded(false);
      }
    }

    // ---------- cursor interaction (scoped to this component, not window) ----------
    let targetRotOffset = 0;
    let curRotOffset = 0;
    let targetTilt = 0;
    let curTilt = 0;
    let targetParX = 0;
    let curParX = 0;

    function onPointerMove(e: PointerEvent) {
      const b = root!.getBoundingClientRect();
      const nx = ((e.clientX - b.left) / b.width) * 2 - 1;
      const ny = ((e.clientY - b.top) / b.height) * 2 - 1;
      targetRotOffset = nx * 16;
      targetTilt = -ny * 6;
      targetParX = -nx * 8;
    }
    if (!reduceMotion) {
      root.addEventListener("pointermove", onPointerMove, { passive: true });
    }

    // ---------- main loop ----------
    const start = performance.now();
    const ROT_SPEED = reduceMotion ? 1.2 : 7.2;
    let raf = 0;

    function frame(now: number) {
      const elapsed = (now - start) / 1000;
      const loopT = elapsed % TOTAL;

      let stage = STAGES[STAGES.length - 1];
      for (const [a, b, s] of BOUNDS) {
        if (loopT >= a && loopT < b) {
          stage = s;
          break;
        }
      }
      if (stage.key !== currentKey) enterStage(stage);

      curRotOffset += (targetRotOffset - curRotOffset) * 0.045;
      curTilt += (targetTilt - curTilt) * 0.045;
      curParX += (targetParX - curParX) * 0.03;

      const rotY = elapsed * ROT_SPEED + curRotOffset;
      rig!.style.transform = `translateZ(0) rotateX(${curTilt.toFixed(2)}deg) rotateY(${rotY.toFixed(2)}deg)`;
      bgGrid!.style.transform = `translateX(${(curParX * 0.6).toFixed(1)}px)`;

      raf = requestAnimationFrame(frame);
    }

    enterStage(STAGES[0]);
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      root.removeEventListener("pointermove", onPointerMove);
      explodablePanels.forEach((p) => p.remove());
    };
  }, []);

  return (
    <div className="ucx-collab-building" ref={rootRef}>
      <h2 className="sr-only">
        UCX Collaboration Lab — a rotating skyscraper visualising design, digital, delivery and asset intelligence,
        converging into applied solutions.
      </h2>

      <div className="bg-grid" ref={bgGridRef}></div>
      <div className="bg-vignette"></div>
      <div className="color-grade" aria-hidden="true"></div>
      <div className="ground-ring"></div>
      <div className="ground-shadow"></div>

      <div className="particles" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <span key={i} className={`particle p${i + 1}`}></span>
        ))}
      </div>
      <div className="glint" aria-hidden="true"></div>

      <div className="frame-corners" aria-hidden="true">
        <span className="fc fc-tl"></span>
        <span className="fc fc-tr"></span>
        <span className="fc fc-bl"></span>
        <span className="fc fc-br"></span>
      </div>

      <div className="scene" ref={sceneRef}>
        <div className="rig" ref={rigRef}>
          <div className="building" ref={buildingRef}>
            <div className="face front" ref={faceFrontRef}></div>
            <div className="face back" ref={faceBackRef}></div>
            <div className="face left"></div>
            <div className="face right"></div>
            <div className="roof">
              <div className="mep m1"></div>
              <div className="mep m2"></div>
              <div className="mep m3"></div>
            </div>
            <div className="core"></div>
            <div className="interior-wire">
              <div className="iw-face front"></div>
              <div className="iw-face back"></div>
              <div className="iw-face left"></div>
              <div className="iw-face right"></div>
            </div>
          </div>
        </div>
      </div>

      <svg className="connections" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <g className="content-lines">
          <line x1="50" y1="15" x2="50" y2="30"></line>
          <line x1="16" y1="30" x2="41.5" y2="41"></line>
          <line x1="84" y1="30" x2="58.5" y2="41"></line>
          <line x1="16" y1="79" x2="41.5" y2="70"></line>
          <line x1="84" y1="79" x2="58.5" y2="70"></line>
        </g>
        <g className="asset-net">
          <line x1="41.5" y1="41" x2="58.5" y2="41"></line>
          <line x1="41.5" y1="70" x2="58.5" y2="70"></line>
          <line x1="41.5" y1="41" x2="41.5" y2="70"></line>
          <line x1="58.5" y1="41" x2="58.5" y2="70"></line>
        </g>
        <g className="collab-lines">
          <line x1="14" y1="39" x2="50" y2="55"></line>
          <line x1="86" y1="39" x2="50" y2="55"></line>
          <line x1="86" y1="73" x2="50" y2="55"></line>
          <line x1="14" y1="73" x2="50" y2="55"></line>
          <line x1="50" y1="91" x2="50" y2="55"></line>
          <line x1="50" y1="19" x2="50" y2="55"></line>
        </g>
      </svg>

      <div className="overlay-layer">
        <div className="title-block content-lines">
          <span className="eyebrow">Collaboration Lab</span>
          <h1 ref={titleTextRef}>Design Intelligence</h1>
        </div>

        <div className="micro tl content-lines">
          <span ref={(el) => { microRefs.current[0] = el; }}></span>
        </div>
        <div className="micro tr content-lines">
          <span ref={(el) => { microRefs.current[1] = el; }}></span>
        </div>
        <div className="micro bl content-lines">
          <span ref={(el) => { microRefs.current[2] = el; }}></span>
        </div>
        <div className="micro br content-lines">
          <span ref={(el) => { microRefs.current[3] = el; }}></span>
        </div>

        <div className="collab-layer">
          <div className="node n1">Architects</div>
          <div className="node n2">Engineers</div>
          <div className="node n3">Contractors</div>
          <div className="node n4">Developers</div>
          <div className="node n5">Manufacturers</div>
          <div className="node n6">Technology</div>
        </div>

        <div className="tagline">
          Challenge<span className="arrow">&rarr;</span>Collaborate<span className="arrow">&rarr;</span>Explore
          <span className="arrow">&rarr;</span>Apply
        </div>
      </div>

      <div className="letterbox letterbox-top" aria-hidden="true"></div>
      <div className="letterbox letterbox-bottom" aria-hidden="true"></div>
      <div className="film-grain" aria-hidden="true"></div>
    </div>
  );
}
