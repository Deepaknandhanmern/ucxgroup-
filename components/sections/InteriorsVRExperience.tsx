"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

// Real UCX project cube-face captures (front/back/left/right/up/down, 512px
// each) — pulled from the client's own hosted tour. Six separate squares
// rather than one equirectangular image, so the shader below picks a face
// per-pixel from the blended view direction instead of doing a single
// lon/lat texture lookup.
const FACE_SRC = {
  f: "/brand/interiors/vr-cube/f.jpg",
  b: "/brand/interiors/vr-cube/b.jpg",
  l: "/brand/interiors/vr-cube/l.jpg",
  r: "/brand/interiors/vr-cube/r.jpg",
  u: "/brand/interiors/vr-cube/u.jpg",
  d: "/brand/interiors/vr-cube/d.jpg",
};

// Single fragment shader drives both states: a "little planet" (stereographic
// azimuthal) landing view and a normal rectilinear look-around, continuously
// blended by uMorph. Both formulas resolve to a 3D direction that's then
// resolved against the cube faces, so scrubbing uMorph is a real, smooth
// unfurl from planet to first-person — not a swap between two viewers.
const VERTEX_SHADER = /* glsl */ `
  varying vec2 vNdc;
  void main() {
    vNdc = position.xy;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform sampler2D uFaceF;
  uniform sampler2D uFaceB;
  uniform sampler2D uFaceL;
  uniform sampler2D uFaceR;
  uniform sampler2D uFaceU;
  uniform sampler2D uFaceD;
  uniform float uAspect;
  uniform float uMorph;
  uniform float uYaw;
  uniform float uPitch;
  uniform float uFov;
  varying vec2 vNdc;

  vec3 rotateYawPitch(vec3 d, float yaw, float pitch) {
    float cp = cos(pitch), sp = sin(pitch);
    vec3 d1 = vec3(d.x, d.y * cp - d.z * sp, d.y * sp + d.z * cp);
    float cy = cos(yaw), sy = sin(yaw);
    return vec3(d1.x * cy + d1.z * sy, d1.y, -d1.x * sy + d1.z * cy);
  }

  // Standard cube-face selection: pick the dominant axis of the direction,
  // resolve a per-face UV from the other two components.
  vec3 sampleCube(vec3 d) {
    float ax = abs(d.x), ay = abs(d.y), az = abs(d.z);
    vec2 uv;
    if (ax >= ay && ax >= az) {
      if (d.x > 0.0) { uv = vec2(-d.z, d.y) / ax; return texture2D(uFaceR, uv * 0.5 + 0.5).rgb; }
      else { uv = vec2(d.z, d.y) / ax; return texture2D(uFaceL, uv * 0.5 + 0.5).rgb; }
    } else if (ay >= ax && ay >= az) {
      if (d.y > 0.0) { uv = vec2(d.x, -d.z) / ay; return texture2D(uFaceU, uv * 0.5 + 0.5).rgb; }
      else { uv = vec2(d.x, d.z) / ay; return texture2D(uFaceD, uv * 0.5 + 0.5).rgb; }
    } else {
      if (d.z > 0.0) { uv = vec2(-d.x, d.y) / az; return texture2D(uFaceB, uv * 0.5 + 0.5).rgb; }
      else { uv = vec2(d.x, d.y) / az; return texture2D(uFaceF, uv * 0.5 + 0.5).rgb; }
    }
  }

  void main() {
    vec2 uv = vNdc;
    uv.x *= uAspect;

    /* little planet: stereographic projection looking straight down at
       center, curling out to the horizon (and beyond) at the edges */
    float r = length(uv);
    float thetaLP = 2.0 * atan(r);
    float phiLP = atan(uv.y, uv.x);
    vec3 dirLP = vec3(sin(thetaLP) * cos(phiLP), -cos(thetaLP), sin(thetaLP) * sin(phiLP));

    /* normal look-around: standard rectilinear camera ray */
    float scale = tan(uFov * 0.5);
    vec3 dirRect = normalize(vec3(uv.x * scale, uv.y * scale, -1.0));

    vec3 dir = normalize(mix(dirLP, dirRect, uMorph));
    dir = rotateYawPitch(dir, uYaw, uPitch);

    gl_FragColor = vec4(sampleCube(dir), 1.0);
  }
`;

export default function InteriorsVRExperience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [entered, setEntered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [copied, setCopied] = useState(false);

  // enteredRef mirrors `entered` for the render loop (which reads it every
  // frame without wanting to re-run the whole effect on every toggle).
  const enteredRef = useRef(false);
  const morphTargetRef = useRef(0);
  const setEnteredBoth = (value: boolean) => {
    enteredRef.current = value;
    morphTargetRef.current = value ? 1 : 0;
    setEntered(value);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = stageRef.current;
    if (!canvas || !stage) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -1, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    const uniforms = {
      uFaceF: { value: null as THREE.Texture | null },
      uFaceB: { value: null as THREE.Texture | null },
      uFaceL: { value: null as THREE.Texture | null },
      uFaceR: { value: null as THREE.Texture | null },
      uFaceU: { value: null as THREE.Texture | null },
      uFaceD: { value: null as THREE.Texture | null },
      uAspect: { value: 1 },
      uMorph: { value: 0 },
      uYaw: { value: 0 },
      uPitch: { value: 0 },
      uFov: { value: THREE.MathUtils.degToRad(80) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const loader = new THREE.TextureLoader();
    const faceTextures: THREE.Texture[] = [];
    let loadedCount = 0;
    const faceEntries = Object.entries(FACE_SRC) as [keyof typeof FACE_SRC, string][];
    const uniformKey: Record<keyof typeof FACE_SRC, "uFaceF" | "uFaceB" | "uFaceL" | "uFaceR" | "uFaceU" | "uFaceD"> = {
      f: "uFaceF",
      b: "uFaceB",
      l: "uFaceL",
      r: "uFaceR",
      u: "uFaceU",
      d: "uFaceD",
    };
    // Intro: land on the little planet, hold briefly, then auto-zoom into
    // ground-level 360° — the button below just lets an impatient visitor
    // skip straight there.
    let introTimer: ReturnType<typeof setTimeout> | null = null;
    faceEntries.forEach(([key, src]) => {
      const tex = loader.load(src, () => {
        loadedCount += 1;
        if (loadedCount === faceEntries.length) {
          setLoaded(true);
          introTimer = setTimeout(() => setEnteredBoth(true), 900);
        }
      });
      tex.colorSpace = THREE.SRGBColorSpace;
      faceTextures.push(tex);
      uniforms[uniformKey[key]].value = tex;
    });

    const resize = () => {
      const w = stage.clientWidth;
      const h = stage.clientHeight;
      renderer.setSize(w, h, false);
      uniforms.uAspect.value = w / h;
    };
    resize();
    window.addEventListener("resize", resize);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let yaw = 0;
    let pitch = 0;
    let morph = 0;
    let dragging = false;
    let lastX = 0;
    let lastY = 0;
    let raf = 0;
    let lastTime = performance.now();

    const onPointerDown = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      canvas.setPointerCapture(e.pointerId);
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const sensitivity = THREE.MathUtils.lerp(0.006, 0.0018, morph);
      yaw -= dx * sensitivity;
      pitch = THREE.MathUtils.clamp(pitch - dy * sensitivity, -1.3, 1.3);
    };
    const stopDrag = () => {
      dragging = false;
    };

    // Drag is the only thing that moves the camera once inside — morph only
    // changes via the intro or the toolbar's planet toggle, never by scroll,
    // so the ground view can't be scrolled back into the little planet by
    // accident. Wheel is intentionally left unhandled so the page still
    // scrolls normally over the canvas.
    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", stopDrag);
    canvas.addEventListener("pointercancel", stopDrag);

    const tick = () => {
      const now = performance.now();
      // clamp dt so a stalled/backgrounded tab doesn't cause one giant jump
      // in yaw/morph when it resumes
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // idle spin fades out as the view unfurls into the room
      if (!dragging && !document.hidden && !reduceMotion) {
        yaw += 0.054 * dt * (1 - morph);
      }
      // slow, deliberate damping — reads as a cinematic zoom rather than a snap
      morph = THREE.MathUtils.damp(morph, morphTargetRef.current, 2.2, dt);
      uniforms.uYaw.value = yaw;
      uniforms.uPitch.value = pitch;
      uniforms.uMorph.value = morph;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (introTimer) clearTimeout(introTimer);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", stopDrag);
      canvas.removeEventListener("pointercancel", stopDrag);
      geometry.dispose();
      material.dispose();
      faceTextures.forEach((tex) => tex.dispose());
      renderer.dispose();
    };
  }, []);

  useEffect(() => {
    const onFsChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      stageRef.current?.requestFullscreen();
    }
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: "UCX 360° VR Walkthrough", url });
        return;
      } catch {
        /* user cancelled the share sheet — fall through to copy */
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable — nothing more we can do */
    }
  }

  return (
    <div className="ih-vr">
      <div className="ih-vr-stage" ref={stageRef}>
        <canvas className="ih-vr-canvas" ref={canvasRef}></canvas>
        <div className="ih-vr-veil"></div>

        {!loaded && <div className="ih-vr-loading">Loading Panorama&hellip;</div>}

        <a className="ih-vr-back" href="/design-interiors">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Design &amp; Interiors
        </a>
        <span className="ih-vr-badge">360&deg; View</span>

        <div className={`ih-vr-copy${entered ? " is-entered" : ""}`}>
          <span className="ih-vr-eyebrow">SpayceX &middot; 360&deg; Walkthrough</span>
          <h1 className="ih-vr-heading">Step Inside the Space</h1>
          <button type="button" className="ih-vr-enter" onClick={() => setEnteredBoth(true)}>
            Enter 360&deg; View
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
        </div>

        <div className="ih-vr-toolbar">
          <button
            type="button"
            className={`ih-vr-tool${entered ? "" : " is-active"}`}
            onClick={() => setEnteredBoth(!entered)}
            aria-label={entered ? "Back to little planet view" : "Enter 360° view"}
            title={entered ? "Little Planet View" : "Enter 360° View"}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <ellipse cx="12" cy="12" rx="9" ry="3.6" />
            </svg>
          </button>
          <button type="button" className="ih-vr-tool" onClick={share} aria-label="Share" title="Share">
            {copied ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6 9 17l-5-5" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <path d="M8.6 10.6 15.4 6.4M8.6 13.4l6.8 4.2" />
              </svg>
            )}
          </button>
          <button
            type="button"
            className="ih-vr-tool"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
          >
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
          <button
            type="button"
            className={`ih-vr-tool${showInfo ? " is-active" : ""}`}
            onClick={() => setShowInfo((v) => !v)}
            aria-label="Controls info"
            title="Controls"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
          </button>
        </div>

        {showInfo && (
          <div className="ih-vr-info">
            <p>Drag to look around.</p>
            <p>Tap the planet icon to revisit the little planet view.</p>
            <p>Use the fullscreen icon for an immersive view.</p>
          </div>
        )}

        {copied && <span className="ih-vr-toast">Link copied</span>}
      </div>

      <div className="ih-vr-closing">
        <p>
          A full 360&deg; walkthrough is the closest thing to standing in the finished space before a single wall
          goes up. This demo uses a placeholder panorama — swap it for a real capture of any UCX interior project.
        </p>
        <a className="ih-vr-cta" href="/contact">
          Start a Project
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h13M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </div>
  );
}
