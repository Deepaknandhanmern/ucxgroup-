"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as FRAGS from "@thatopen/fragments";

// Same model + worker as the full /experience/bim-model page (see
// BimModelViewer.tsx) — this is the compact inline preview embedded
// directly in the Experience page's own content, sized to a normal
// section instead of taking over the viewport.
const MODEL_SRC = "/models/aravind-residence.frag";
const WORKER_SRC = "/fragments-worker.js";

export default function BimPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

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

    const loadTimeout = setTimeout(() => {
      if (!cancelled) setStatus("error");
    }, 20000);

    (async () => {
      try {
        fragments = new FRAGS.FragmentsModels(WORKER_SRC);
        controls.addEventListener("change", () => fragments?.update());

        const res = await fetch(MODEL_SRC);
        if (!res.ok) throw new Error(`Failed to fetch model: ${res.status}`);
        const buffer = await res.arrayBuffer();
        if (cancelled) return;

        const model = await fragments.load(buffer, { modelId: "aravind-residence-preview" });
        if (cancelled) return;
        model.useCamera(camera);
        scene.add(model.object);
        await fragments.update(true);

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

        clearTimeout(loadTimeout);
        setStatus("ready");
      } catch (err) {
        clearTimeout(loadTimeout);
        console.error("BIM preview failed to load:", err);
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
      clearTimeout(loadTimeout);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      controls.dispose();
      fragments?.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div className="bim-preview" ref={stageRef}>
      <canvas className="bim-preview-canvas" ref={canvasRef}></canvas>
      {status === "loading" && <div className="bim-preview-status">Loading BIM Model&hellip;</div>}
      {status === "error" && (
        <div className="bim-preview-status">Couldn&rsquo;t load the model — try refreshing.</div>
      )}
    </div>
  );
}
