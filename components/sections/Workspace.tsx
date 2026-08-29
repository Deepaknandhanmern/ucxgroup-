"use client";

import { useEffect, useRef } from "react";
import CardThumb from "@/components/ui/CardThumb";

const TAGS = ["Project Delivery", "Team Collaboration", "Knowledge Sharing"];

const SPACES = [
  { n: "01", label: "Meeting Room", img: "/brand/workspace/meeting.webp" },
  { n: "02", label: "Lounge", img: "/brand/workspace/lounge.webp" },
  { n: "03", label: "Workstation", img: "/brand/workspace/workstation.webp" },
  { n: "04", label: "Library", img: "/brand/workspace/library.webp" },
  { n: "05", label: "Pantry", img: "/brand/workspace/pantry.webp" },
];

export default function Workspace() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;

    let pending = false;
    let px = 0;
    let py = 0;

    function onPointerMove(e: PointerEvent) {
      const b = sect!.getBoundingClientRect();
      px = e.clientX - b.left;
      py = e.clientY - b.top;
      if (!pending) {
        pending = true;
        requestAnimationFrame(() => {
          sect!.style.setProperty("--mx", px + "px");
          sect!.style.setProperty("--my", py + "px");
          pending = false;
        });
      }
    }
    function onPointerEnter() {
      sect!.classList.add("is-hot");
    }
    function onPointerLeave() {
      sect!.classList.remove("is-hot");
    }

    sect.addEventListener("pointermove", onPointerMove, { passive: true });
    sect.addEventListener("pointerenter", onPointerEnter);
    sect.addEventListener("pointerleave", onPointerLeave);
    return () => {
      sect.removeEventListener("pointermove", onPointerMove);
      sect.removeEventListener("pointerenter", onPointerEnter);
      sect.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div className="ucx-workspace" id="workspace" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <h2 className="heading">Where People, Projects &amp; Ideas Connect</h2>
        <p className="intro">
          UCX operates from an India-based collaborative workspace that supports focused project delivery, team
          interaction and professional collaboration.
        </p>
        <div className="tags">
          {TAGS.map((t) => (
            <span key={t}>{t}</span>
          ))}
        </div>

        <div className="gallery">
          {SPACES.map((p) => (
            <div className="ph" key={p.n}>
              <CardThumb src={p.img} alt={p.label} />
              <span className="ph-scrim" aria-hidden="true"></span>
              <span className="ph-index">{p.n}</span>
              <span className="ph-label">{p.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
