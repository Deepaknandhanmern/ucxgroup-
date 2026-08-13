"use client";

import { useEffect, useRef } from "react";

const WORDS = ["Designed.", "Connected.", "Delivered."];
const RADAR_WORDS = ["Concept", "Design", "BIM", "Detailing", "Execution", "Handover"];
const SWEEP_MS = 6000; // must match .radar-sweep animation-duration
const MARQUEE_ITEMS = [
  "BIM & Digital Delivery",
  "Design & Interiors",
  "Project Support",
  "Asset Information",
  "Scalable Delivery Teams",
  "Global Collaboration",
];

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const rotorRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const radarWrapRef = useRef<HTMLDivElement>(null);
  const blipsHostRef = useRef<HTMLDivElement>(null);
  const ticksHostRef = useRef<HTMLDivElement>(null);
  const linkRef = useRef<HTMLDivElement>(null);
  const readRef = useRef<HTMLElement>(null);
  const scrollBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    const rotor = rotorRef.current;
    const radarWrap = radarWrapRef.current;
    const blipsHost = blipsHostRef.current;
    const ticksHost = ticksHostRef.current;
    const link = linkRef.current;
    const read = readRef.current;
    const clock = clockRef.current;
    if (!hero || !rotor || !radarWrap || !blipsHost || !ticksHost || !link || !read || !clock) return;

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(hover:hover) and (pointer:fine)").matches;

    // ============ rotating word ============
    let wi = 0;
    let rTimer: ReturnType<typeof setInterval> | null = null;
    let busy = false;

    const meter = document.createElement("b");
    meter.className = "ghostw";
    meter.setAttribute("aria-hidden", "true");
    rotor.appendChild(meter);

    function widthOf(word: string) {
      meter.textContent = word;
      return meter.getBoundingClientRect().width;
    }

    function setInitialWidth() {
      rotor!.style.setProperty("--rw", widthOf(WORDS[wi]).toFixed(2) + "px");
    }

    function rotate() {
      if (busy) return;
      busy = true;

      const outgoing = rotor!.querySelector("b:not(.ghostw)") as HTMLElement | null;
      const next = WORDS[(wi + 1) % WORDS.length];

      const incoming = document.createElement("b");
      incoming.textContent = next;
      incoming.className = "below";
      rotor!.appendChild(incoming);

      rotor!.style.setProperty("--rw", widthOf(next).toFixed(2) + "px");

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          incoming.classList.add("anim");
          outgoing?.classList.add("anim");
          incoming.classList.remove("below");
          outgoing?.classList.add("above");
        });
      });

      setTimeout(() => {
        if (outgoing?.parentNode) outgoing.parentNode.removeChild(outgoing);
        incoming.classList.remove("anim");
        wi = (wi + 1) % WORDS.length;
        busy = false;
      }, 780);
    }

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(setInitialWidth);
    }
    setInitialWidth();

    let wrt: ReturnType<typeof setTimeout>;
    function onResizeWidth() {
      clearTimeout(wrt);
      wrt = setTimeout(setInitialWidth, 160);
    }
    window.addEventListener("resize", onResizeWidth);

    // ============ studio clock (IST) ============
    function tickClock() {
      try {
        const t = new Date().toLocaleTimeString("en-GB", {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
        });
        clock!.textContent = t + " IST";
      } catch {
        clock!.textContent = "IST";
      }
    }
    tickClock();
    const clockInterval = setInterval(tickClock, 20000);

    // ============ radar ============
    let blipEls: HTMLElement[] = [];
    let activeBlip: HTMLElement | null = null;
    let hoverLock = false;

    function buildTicks() {
      ticksHost!.innerHTML = "";
      for (let i = 0; i < 48; i++) {
        const angle = i * 7.5;
        const el = document.createElement("i");
        if (i % 6 === 0) el.className = "major";
        el.dataset.angle = String(angle);
        ticksHost!.appendChild(el);
      }
    }

    function buildBlips() {
      blipsHost!.innerHTML = "";
      blipEls = [];
      const n = RADAR_WORDS.length;
      RADAR_WORDS.forEach((word, i) => {
        const angle = (360 / n) * i - 90;
        const el = document.createElement("div");
        el.className = "blip";
        el.dataset.angle = String(angle);
        el.dataset.word = word;
        el.innerHTML = `<span class="dot"></span><span class="label">${word}</span>`;
        blipsHost!.appendChild(el);
        blipEls.push(el);
      });
      layoutRadar();
    }

    function radarRadius() {
      const r = radarWrap!.getBoundingClientRect();
      return Math.min(r.width, r.height) * 0.4;
    }

    function layoutRadar() {
      const radius = radarRadius();
      const tickRadius = radius * 1.075;

      blipEls.forEach((el) => {
        const angle = parseFloat(el.dataset.angle!);
        el.style.transform = `rotate(${angle}deg) translate(${radius}px) rotate(${-angle}deg)`;
      });

      ticksHost!.querySelectorAll("i").forEach((el) => {
        const a = (parseFloat((el as HTMLElement).dataset.angle!) * Math.PI) / 180;
        const x = Math.sin(a) * tickRadius;
        const y = -Math.cos(a) * tickRadius;
        (el as HTMLElement).style.transform = `translate(${x}px,${y}px)`;
      });

      if (activeBlip) pointLinkAt(activeBlip);
    }

    function pointLinkAt(el: HTMLElement) {
      const angleDeg = parseFloat(el.dataset.angle!);
      const radius = radarRadius();
      link!.style.width = radius + "px";
      link!.style.transform = `rotate(${angleDeg}deg)`;
    }

    function setActive(el: HTMLElement | null) {
      if (activeBlip === el) return;
      activeBlip?.classList.remove("active");
      activeBlip = el;
      if (activeBlip) {
        activeBlip.classList.add("active");
        pointLinkAt(activeBlip);
        link!.classList.add("on");
        read!.textContent = activeBlip.dataset.word!.toLowerCase();
      } else {
        link!.classList.remove("on");
        read!.textContent = "scanning";
      }
    }

    buildTicks();
    buildBlips();

    let rt2: ReturnType<typeof setTimeout>;
    function onResizeLayout() {
      clearTimeout(rt2);
      rt2 = setTimeout(layoutRadar, 140);
    }
    window.addEventListener("resize", onResizeLayout);

    function onRadarMouseMove(e: MouseEvent) {
      hoverLock = true;
      const r = radarWrap!.getBoundingClientRect();
      const mx = e.clientX - (r.left + r.width / 2);
      const my = e.clientY - (r.top + r.height / 2);
      const radius = radarRadius();
      let best: HTMLElement | null = null;
      let bestD = Infinity;

      blipEls.forEach((el) => {
        const a = (parseFloat(el.dataset.angle!) * Math.PI) / 180;
        const bx = Math.cos(a) * radius;
        const by = Math.sin(a) * radius;
        const d = Math.hypot(mx - bx, my - by);
        if (d < bestD) {
          bestD = d;
          best = el;
        }
      });

      setActive(bestD < radius * 0.55 ? best : null);
    }
    function onRadarMouseLeave() {
      hoverLock = false;
      setActive(null);
    }
    if (fine) {
      radarWrap.addEventListener("mousemove", onRadarMouseMove);
      radarWrap.addEventListener("mouseleave", onRadarMouseLeave);
    }

    // sweep line "finds" each stage as it rotates past
    let sweepRaf: number | null = null;
    if (!reduce) {
      const sweepStart = performance.now();
      const sweepTick = (now: number) => {
        const elapsed = (now - sweepStart) % SWEEP_MS;
        const sweepAngle = (elapsed / SWEEP_MS) * 360;

        let freshHit: HTMLElement | null = null;
        blipEls.forEach((el) => {
          const a = ((parseFloat(el.dataset.angle!) + 90) % 360 + 360) % 360;
          let diff = Math.abs(sweepAngle - a);
          diff = Math.min(diff, 360 - diff);
          const isHit = diff < 8;
          el.classList.toggle("hit", isHit);
          if (isHit) freshHit = el;
        });

        if (!hoverLock) {
          read!.textContent = freshHit ? (freshHit as HTMLElement).dataset.word!.toLowerCase() : "scanning";
        }

        sweepRaf = requestAnimationFrame(sweepTick);
      };
      sweepRaf = requestAnimationFrame(sweepTick);
    }

    // ============ scroll cue ============
    function onScrollClick() {
      const next = hero!.nextElementSibling;
      if (next) next.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
      else window.scrollTo({ top: hero!.offsetHeight, behavior: reduce ? "auto" : "smooth" });
    }
    scrollBtnRef.current?.addEventListener("click", onScrollClick);

    // ============ run rotor only while on screen ============
    let observer: IntersectionObserver | null = null;
    function startRotor() {
      if (!rTimer) rTimer = setInterval(rotate, 2000);
    }
    function stopRotor() {
      if (rTimer) clearInterval(rTimer);
      rTimer = null;
    }
    function onVisibilityChange() {
      if (document.hidden) stopRotor();
      else startRotor();
    }
    if (!reduce) {
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((e) => {
              if (e.isIntersecting) startRotor();
              else stopRotor();
            });
          },
          { threshold: 0.2 }
        );
        observer.observe(hero);
      } else {
        startRotor();
      }
      document.addEventListener("visibilitychange", onVisibilityChange);
    }

    return () => {
      window.removeEventListener("resize", onResizeWidth);
      window.removeEventListener("resize", onResizeLayout);
      if (fine) {
        radarWrap.removeEventListener("mousemove", onRadarMouseMove);
        radarWrap.removeEventListener("mouseleave", onRadarMouseLeave);
      }
      scrollBtnRef.current?.removeEventListener("click", onScrollClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer?.disconnect();
      stopRotor();
      clearInterval(clockInterval);
      clearTimeout(wrt);
      clearTimeout(rt2);
      if (sweepRaf !== null) cancelAnimationFrame(sweepRaf);
    };
  }, []);

  return (
    <div className="ucx-hero" ref={heroRef}>
      <div className="grid-overlay"></div>
      <div className="aura"></div>
      <div className="vignette"></div>
      <div className="noise"></div>

      {/* ============ top bar ============ */}
      <div className="topbar">
        <span className="live">
          <i></i> Studio open / taking 2026 projects
        </span>
        <span className="coords num-font">11.006&deg; N / 77.017&deg; E</span>
        <span className="clock num-font" ref={clockRef}>
          IST
        </span>
      </div>

      {/* ============ main ============ */}
      <div className="inner">
        <div className="copy">
          <span className="eyebrow">Unconventional Collaboration</span>

          <h1>
            <span className="ln">
              <em>Reimagining</em>
            </span>
            <span className="ln">
              <em className="out">How Projects Are</em>
            </span>
            <span className="ln">
              <em>
                <span className="rotor" ref={rotorRef}>
                  <b>Designed.</b>
                </span>
              </em>
            </span>
          </h1>

          <p className="sub">
            An architecture and interiors studio building for people who want something more considered than the
            plot next door. Twelve years, four cities, one continuous line of thinking.
          </p>

          <div className="actions">
            <a className="btn solid" href="#work">
              <span>View our work</span>
              <svg viewBox="0 0 24 24">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <a className="btn ghost" href="/contact">
              <span>Start a project</span>
              <svg viewBox="0 0 24 24">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
          </div>
        </div>

        <div className="field" ref={radarWrapRef} aria-hidden="true">
          <div className="radar-rings">
            <span className="ring r1"></span>
            <span className="ring r2"></span>
            <span className="ring r3"></span>
            <span className="ring r4"></span>
          </div>
          <div className="radar-cross"></div>
          <div className="radar-ticks" ref={ticksHostRef}></div>
          <div className="radar-sweep"></div>
          <div className="radar-link" ref={linkRef}></div>
          <div className="radar-core"></div>
          <div className="radar-blips" ref={blipsHostRef}></div>
          <span className="readout">
            Radar / <b ref={readRef}>scanning</b>
          </span>
        </div>
      </div>

      {/* ============ bottom bar ============ */}
      <div className="botbar">
        <div className="marquee" aria-hidden="true">
          <div className="marquee-track">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </div>
        <button className="scroll" type="button" ref={scrollBtnRef}>
          <span>Scroll</span>
          <span className="bar"></span>
        </button>
      </div>
    </div>
  );
}
