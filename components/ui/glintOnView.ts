"use client";

// A one-shot diagonal light sweep — the same cinematic glint motif used in
// the Lab promo scene — played once across an element the first time it
// scrolls into view on touch. Desktop cards already get motion feedback
// from their :hover image-zoom/veil; this is the mobile/tablet equivalent
// for the entrance itself, since a tap never triggers that hover state.
export function attachGlintOnView(el: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};
  if (!window.matchMedia("(pointer: coarse)").matches) return () => {};
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return () => {};
  if (!("IntersectionObserver" in window)) return () => {};

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        playGlint(el);
      });
    },
    { threshold: 0.4 }
  );
  io.observe(el);
  return () => io.disconnect();
}

function playGlint(host: HTMLElement) {
  if (getComputedStyle(host).position === "static") host.style.position = "relative";

  const sweep = document.createElement("div");
  Object.assign(sweep.style, {
    position: "absolute",
    inset: "0",
    pointerEvents: "none",
    overflow: "hidden",
    zIndex: "3",
  });
  const bar = document.createElement("div");
  Object.assign(bar.style, {
    position: "absolute",
    top: "-40%",
    bottom: "-40%",
    left: "-30%",
    width: "34%",
    background:
      "linear-gradient(115deg, transparent, rgba(255,255,255,.28) 45%, rgba(255,255,255,.5) 50%, rgba(255,255,255,.28) 55%, transparent)",
    transform: "translateX(-40%) rotate(8deg)",
    filter: "blur(1px)",
  });
  sweep.appendChild(bar);
  host.appendChild(sweep);

  const anim = bar.animate(
    [{ transform: "translateX(-40%) rotate(8deg)" }, { transform: "translateX(360%) rotate(8deg)" }],
    { duration: 900, easing: "cubic-bezier(.4,0,.2,1)" }
  );
  anim.onfinish = () => sweep.remove();
}
