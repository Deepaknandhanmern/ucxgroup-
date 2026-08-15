"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface CardItem {
  title: string;
  desc: string;
}

interface CardData {
  kicker: string;
  badge: string;
  name: string;
  image: string;
  alt: string;
  items: CardItem[];
  ctaLabel: string;
  link?: string;
  linkLabel?: string;
}

const CARDS: CardData[] = [
  {
    kicker: "Capability 01",
    badge: "Capability 01",
    name: "BIM and Digital Delivery",
    image: "https://picsum.photos/seed/nx-bim/900/620",
    alt: "Coordinated BIM model on screen",
    items: [
      { title: "Design Intelligence", desc: "Early-stage analysis and generative workflows" },
      { title: "BIM & VDC", desc: "Coordinated models and documentation" },
      { title: "Digital Construction", desc: "4D and 5D workflows with site integration" },
      { title: "Asset Intelligence", desc: "Digital twins and facility data systems" },
    ],
    ctaLabel: "Main BIM page",
    link: "#bim",
    linkLabel: "Main BIM page",
  },
  {
    kicker: "Capability 02",
    badge: "Capability 02",
    name: "Interior Solutions",
    image: "https://picsum.photos/seed/nx-interior/900/620",
    alt: "Finished interior space",
    items: [
      { title: "Spatial & Design Solutions", desc: "Planning and concept development" },
      { title: "BIM-Integrated Interiors", desc: "Coordinated interior models" },
      { title: "Custom Furniture Systems", desc: "Parametric and fabrication-ready design" },
      { title: "Modular & Scalable Interiors", desc: "Prefabricated and repeatable systems" },
    ],
    ctaLabel: "Interior page",
    link: "#interiors",
    linkLabel: "Interior page",
  },
  {
    kicker: "Capability 03",
    badge: "Capability 03",
    name: "Specialized Solutions",
    image: "https://picsum.photos/seed/nx-heritage/900/620",
    alt: "Heritage facade being surveyed",
    items: [
      { title: "Scan-to-BIM", desc: "Existing building modeling" },
      { title: "Heritage Projects", desc: "Documentation and restoration" },
      { title: "Prefabrication", desc: "BIM-to-fabrication workflows" },
    ],
    ctaLabel: "Read more",
  },
  {
    kicker: "Capability 04",
    badge: "Capability 04",
    name: "Nexform Academy",
    image: "https://picsum.photos/seed/nx-academy/900/620",
    alt: "Training session in progress",
    items: [
      { title: "Foundation Programs", desc: "Core BIM skills from the ground up" },
      { title: "Advanced Training", desc: "Coordination, automation and delivery" },
      { title: "Corporate Training", desc: "Team programs shaped around your workflow" },
    ],
    ctaLabel: "View programs",
    link: "#academy",
    linkLabel: "View programs",
  },
];

const SPEED = 0.42; // px per frame

export default function CapabilitiesRail() {
  const rootRef = useRef<HTMLElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pauseBtnRef = useRef<HTMLButtonElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const [paused, setPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<CardData | null>(null);
  const [mounted, setMounted] = useState(false);

  const stateRef = useRef({
    x: 0,
    half: 0,
    hovering: false,
    visible: true,
    paused: false,
    modalOpen: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    stateRef.current.paused = paused;
  }, [paused]);
  useEffect(() => {
    stateRef.current.modalOpen = modalOpen;
  }, [modalOpen]);

  useEffect(() => {
    const root = rootRef.current;
    const vp = vpRef.current;
    const track = trackRef.current;
    if (!root || !vp || !track) return;

    const originals = Array.from(track.children) as HTMLElement[];
    let raf: number | null = null;
    const st = stateRef.current;

    function apply() {
      if (st.x <= -st.half) st.x += st.half;
      if (st.x > 0) st.x -= st.half;
      track!.style.transform = `translate3d(${st.x}px,0,0)`;
      lit();
    }

    function lit() {
      const mid = vp!.getBoundingClientRect().left + vp!.clientWidth / 2;
      let best: HTMLElement | null = null;
      let bd = Infinity;
      Array.from(track!.children).forEach((c) => {
        const el = c as HTMLElement;
        const r = el.getBoundingClientRect();
        const d = Math.abs(r.left + r.width / 2 - mid);
        if (d < bd) {
          bd = d;
          best = el;
        }
        el.setAttribute("data-lit", "false");
      });
      if (best) (best as HTMLElement).setAttribute("data-lit", "true");
    }

    function bind() {
      Array.from(track!.children).forEach((c) => {
        const card = c as HTMLElement & { __bound?: boolean };
        if (card.__bound) return;
        card.__bound = true;
        card.addEventListener("click", () => {
          if (drag.moved < 8) openModal(card);
        });
        card.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openModal(card);
          }
        });
      });
    }

    function build() {
      Array.from(track!.querySelectorAll("[data-clone]")).forEach((c) => c.remove());
      const vw = vp!.clientWidth;
      let need = 2;
      const w = originals.reduce((a, c) => a + c.offsetWidth + 22, 0);
      while (w * need < vw * 2 + w) need++;
      for (let r = 1; r < need; r++) {
        originals.forEach((c) => {
          const cl = c.cloneNode(true) as HTMLElement;
          cl.setAttribute("data-clone", "1");
          cl.setAttribute("aria-hidden", "true");
          cl.tabIndex = -1;
          track!.appendChild(cl);
        });
      }
      st.half = track!.scrollWidth / need;
      bind();
    }

    function openModal(card: HTMLElement) {
      const idx = Number(card.dataset.idx);
      setModalData(CARDS[idx]);
      setModalOpen(true);
    }

    function frame() {
      if (!st.paused && !st.hovering && st.visible && !st.modalOpen && !drag.on) {
        st.x -= SPEED;
        apply();
      }
      raf = requestAnimationFrame(frame);
    }

    // controls
    function onPrev() {
      const w = originals[0].offsetWidth + 22;
      st.x += w;
      apply();
    }
    function onNext() {
      const w = originals[0].offsetWidth + 22;
      st.x -= w;
      apply();
    }
    const prevBtn = root.querySelector<HTMLButtonElement>("#nxPrev");
    const nextBtn = root.querySelector<HTMLButtonElement>("#nxNext");
    prevBtn?.addEventListener("click", onPrev);
    nextBtn?.addEventListener("click", onNext);

    function onMouseEnter() {
      st.hovering = true;
    }
    function onMouseLeave() {
      st.hovering = false;
    }
    vp.addEventListener("mouseenter", onMouseEnter);
    vp.addEventListener("mouseleave", onMouseLeave);
    root.addEventListener("focusin", onMouseEnter);
    root.addEventListener("focusout", onMouseLeave);

    function onVisibilityChange() {
      st.visible = !document.hidden;
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    let io: IntersectionObserver | null = null;
    if ("IntersectionObserver" in window) {
      io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            st.visible = e.isIntersecting && !document.hidden;
          });
        },
        { threshold: 0.05 }
      );
      io.observe(root);
    }

    // drag / swipe
    const drag = { on: false, sx: 0, ox: 0, moved: 0 };
    function down(px: number) {
      drag.on = true;
      drag.sx = px;
      drag.ox = st.x;
      drag.moved = 0;
      vp!.classList.add("is-drag");
    }
    function move(px: number) {
      if (!drag.on) return;
      const d = px - drag.sx;
      drag.moved = Math.abs(d);
      st.x = drag.ox + d;
      apply();
    }
    function up() {
      drag.on = false;
      vp!.classList.remove("is-drag");
    }
    function onMouseDown(e: MouseEvent) {
      down(e.clientX);
      e.preventDefault();
    }
    function onWindowMouseMove(e: MouseEvent) {
      move(e.clientX);
    }
    function onTouchStart(e: TouchEvent) {
      down(e.touches[0].clientX);
    }
    function onTouchMove(e: TouchEvent) {
      move(e.touches[0].clientX);
    }
    vp.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mousemove", onWindowMouseMove);
    window.addEventListener("mouseup", up);
    vp.addEventListener("touchstart", onTouchStart, { passive: true });
    vp.addEventListener("touchmove", onTouchMove, { passive: true });
    vp.addEventListener("touchend", up);

    let rt: ReturnType<typeof setTimeout>;
    function onResize() {
      clearTimeout(rt);
      rt = setTimeout(() => {
        st.x = 0;
        build();
        apply();
      }, 160);
    }
    window.addEventListener("resize", onResize);

    build();
    apply();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      st.paused = true;
      setPaused(true);
    }
    raf = requestAnimationFrame(frame);

    return () => {
      if (raf) cancelAnimationFrame(raf);
      prevBtn?.removeEventListener("click", onPrev);
      nextBtn?.removeEventListener("click", onNext);
      vp.removeEventListener("mouseenter", onMouseEnter);
      vp.removeEventListener("mouseleave", onMouseLeave);
      root.removeEventListener("focusin", onMouseEnter);
      root.removeEventListener("focusout", onMouseLeave);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      io?.disconnect();
      vp.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mousemove", onWindowMouseMove);
      window.removeEventListener("mouseup", up);
      vp.removeEventListener("touchstart", onTouchStart);
      vp.removeEventListener("touchmove", onTouchMove);
      vp.removeEventListener("touchend", up);
      window.removeEventListener("resize", onResize);
      clearTimeout(rt);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // modal open/close side effects
  useEffect(() => {
    if (modalOpen) {
      document.body.classList.add("nx-locked");
      const t = setTimeout(() => closeBtnRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      document.body.classList.remove("nx-locked");
    }
  }, [modalOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && modalOpen) setModalOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [modalOpen]);

  function handleModalTabTrap(e: React.KeyboardEvent) {
    if (e.key !== "Tab" || !panelRef.current) return;
    const focusables = panelRef.current.querySelectorAll<HTMLElement>(
      'button, a[href]:not([style*="none"]), [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  const modal = modalData && (
    <div
      className={`nxm${modalOpen ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="nxmTitle"
      onClick={(e) => {
        if (e.target === e.currentTarget) setModalOpen(false);
      }}
      onKeyDown={handleModalTabTrap}
    >
      <div className="nxm__panel" ref={panelRef}>
        <div className="nxm__media">
          <img src={modalData.image} alt={modalData.alt} />
        </div>
        <button className="nxm__close" type="button" aria-label="Close" ref={closeBtnRef} onClick={() => setModalOpen(false)}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
            <path d="M5 5l14 14M19 5L5 19" />
          </svg>
        </button>
        <div className="nxm__top">
          <p className="nxm__kicker">{modalData.kicker}</p>
          <h3 className="nxm__title" id="nxmTitle">
            {modalData.name}
          </h3>
        </div>
        <div className="nxm__scroll">
          <div>
            {modalData.items.map((it) => (
              <div className="nxm__row" key={it.title}>
                <h4>{it.title}</h4>
                <p>{it.desc}</p>
              </div>
            ))}
          </div>
          {modalData.link && (
            <a className="nxm__link" href={modalData.link}>
              <span>{modalData.linkLabel || "Learn more"}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <section className="nx" id="capabilities" ref={rootRef} aria-label="Capabilities">
      <div className="nx__head">
        <div>
          <p className="nx__eyebrow">What we do</p>
          <h2 className="nx__title">
            Capabilities across
            <br />
            the project lifecycle.
          </h2>
        </div>
        <div className="nx__ctrl">
          <button className="nx__btn" type="button" id="nxPrev" aria-label="Scroll left">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M15 4 7 12l8 8" />
            </svg>
          </button>
          <button
            className="nx__btn"
            type="button"
            id="nxPause"
            ref={pauseBtnRef}
            data-paused={paused}
            aria-label={paused ? "Resume scrolling" : "Pause scrolling"}
            onClick={() => setPaused((p) => !p)}
          >
            <svg className="ic-pause" viewBox="0 0 24 24" fill="currentColor">
              <rect x="7" y="5" width="3.5" height="14" />
              <rect x="13.5" y="5" width="3.5" height="14" />
            </svg>
            <svg className="ic-play" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5l11 7-11 7z" />
            </svg>
          </button>
          <button className="nx__btn" type="button" id="nxNext" aria-label="Scroll right">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path d="M9 4l8 8-8 8" />
            </svg>
          </button>
        </div>
      </div>

      <div className="nx__viewport" ref={vpRef}>
        <div className="nx__track" ref={trackRef}>
          {CARDS.map((card, i) => (
            <article className="nx__card" tabIndex={0} data-idx={i} key={card.name}>
              <div className="nx__thumb">
                <img src={card.image} alt={card.alt} loading="lazy" />
                <span className="nx__badge">{card.badge}</span>
              </div>
              <div className="nx__cardin">
                <div className="nx__card__bar"></div>
                <h3 className="nx__card__name">{card.name}</h3>
                <ul className="nx__list">
                  {card.items.map((it) => (
                    <li key={it.title}>
                      <p className="nx__item">{it.title}</p>
                      <p className="nx__desc">{it.desc}</p>
                    </li>
                  ))}
                </ul>
                <span className="nx__cta">
                  {card.ctaLabel}
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 12h15M13 6l6 6-6 6" />
                  </svg>
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>

      {mounted && createPortal(modal, document.body)}
    </section>
  );
}
