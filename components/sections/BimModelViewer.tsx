"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as FRAGS from "@thatopen/fragments";

// Pre-converted from a 29MB IFC export (see scripts/convert-ifc.mjs) — the
// Fragments format is That Open Company's compact binary representation of
// BIM data, ~12x smaller and built to load fast instead of re-parsing IFC
// in every visitor's browser.
const MODEL_SRC = "/models/aravind-residence.frag";
const WORKER_SRC = "/fragments-worker.mjs";

export default function BimModelViewer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let cancelled = false;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      setStatus("error");
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a1a16);

    const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 2000);
    camera.position.set(20, 16, 20);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 1;
    controls.maxDistance = 300;

    scene.add(new THREE.AmbientLight(0xffffff, 1.1));
    const sun = new THREE.DirectionalLight(0xffffff, 1.4);
    sun.position.set(40, 60, 20);
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xbcd8ff, 0.5);
    fill.position.set(-30, 20, -40);
    scene.add(fill);

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    let fragments: FRAGS.FragmentsModels | null = null;

    const tick = () => {
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    (async () => {
      try {
        fragments = new FRAGS.FragmentsModels(WORKER_SRC);
        controls.addEventListener("change", () => fragments?.update());

        const res = await fetch(MODEL_SRC);
        if (!res.ok) throw new Error(`Failed to fetch model: ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const model = await fragments.load(buffer, { modelId: "aravind-residence" });
        if (cancelled) return;
        model.useCamera(camera);
        scene.add(model.object);
        await fragments.update(true);

        // frame the camera to the model's actual bounding box instead of a
        // guessed distance — real BIM exports vary wildly in scale/units
        const box = new THREE.Box3().setFromObject(model.object);
        if (!box.isEmpty()) {
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          const radius = Math.max(size.x, size.y, size.z) || 10;
          controls.target.copy(center);
          camera.position.copy(center).add(new THREE.Vector3(radius, radius * 0.8, radius));
          camera.near = radius / 100;
          camera.far = radius * 20;
          camera.updateProjectionMatrix();
          controls.update();
        }

        setStatus("ready");
      } catch (err) {
        console.error("BIM model failed to load:", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      controls.dispose();
      fragments?.dispose();
      renderer.dispose();
    };
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      stageRef.current?.requestFullscreen();
    }
  }

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  return (
    <div className="ih-bim">
      <div className="ih-bim-stage" ref={stageRef}>
        <canvas className="ih-bim-canvas" ref={canvasRef}></canvas>

        {status === "loading" && <div className="ih-bim-loading">Loading BIM Model&hellip;</div>}
        {status === "error" && (
          <div className="ih-bim-loading">Couldn&rsquo;t load the model — try refreshing.</div>
        )}

        <a className="ih-bim-back" href="/experience">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Experience
        </a>
        <span className="ih-bim-badge">Live BIM Model</span>

        <button type="button" className="ih-bim-fullscreen" onClick={toggleFullscreen} title="Fullscreen">
          {isFullscreen ? (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 3v4a2 2 0 0 1-2 2H3M15 3v4a2 2 0 0 0 2 2h4M3 15h4a2 2 0 0 1 2 2v4M15 21v-4a2 2 0 0 1 2-2h4" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9V3h6M15 3h6v6M21 15v6h-6M9 21H3v-6" />
            </svg>
          )}
        </button>

        <div className="ih-bim-copy">
          <span className="ih-bim-eyebrow">UCX &middot; BIM &amp; Digital Delivery</span>
          <h1 className="ih-bim-heading">Mr. Aravind Residence</h1>
          <span className="ih-bim-hint">Drag to orbit &middot; Scroll to zoom</span>
        </div>
      </div>

      <div className="ih-bim-closing">
        <p>
          This is a real coordinated BIM model, converted straight from the project&rsquo;s IFC export and rendered
          live in the browser — the same connected-model approach UCX uses across design, coordination and delivery.
        </p>
        <a className="ih-bim-cta" href="/contact">
          Start a Project
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
