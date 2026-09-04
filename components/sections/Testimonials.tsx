"use client";

import { useEffect, useRef } from "react";

interface Testimonial {
  name: string;
  location: string;
  role: string;
  quote: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Fahd Abdullah",
    location: "Saudi Arabia",
    role: "As-Built BIM & Digital Delivery",
    quote: "The UCX team was very detail-oriented throughout the project. They understood the requirements well and stayed focused on maintaining the quality we expected.",
  },
  {
    name: "Abdul Ashif",
    location: "Saudi Arabia",
    role: "Project Management & Delivery",
    quote: "Communication was clear from the beginning, and the team understood what we needed. That made the collaboration straightforward and easy to manage.",
  },
  {
    name: "Imraan Sherrief",
    location: "India",
    role: "BIM Coordination & Workflows",
    quote: "UCX brought a much more structured approach to the coordination process. It helped the team stay organised and made the overall workflow more efficient.",
  },
  {
    name: "Gajapathy",
    location: "India",
    role: "Project Delivery & Documentation",
    quote: "The team was reliable with the deliverables and kept the submission schedule on track. That consistency gave us confidence throughout the project.",
  },
  {
    name: "Mohammed Mohideen",
    location: "India",
    role: "Collaborative Delivery",
    quote: "Working with UCX was easy because the team was flexible, responsive and open to discussion. We were able to work through things together and keep the project moving.",
  },
  {
    name: "Abishek",
    location: "Singapore",
    role: "Interior Design",
    quote: "They understood what we were looking for and translated it well into the design. The team was professional throughout, and we were very happy with the quality of the result.",
  },
  {
    name: "Ilayaraja",
    location: "India",
    role: "BIM & Digital Engineering",
    quote: "UCX brought good technical coordination and a collaborative approach to the BIM work. The team stayed focused on the requirements and delivered what was expected.",
  },
  {
    name: "Sankar",
    location: "Dubai",
    role: "Resource & Delivery Coordination",
    quote: "The communication was clear and the resource coordination was handled well. It gave us confidence that UCX could support us on future projects too.",
  },
];

export default function Testimonials() {
  const sectRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sect = sectRef.current;
    if (!sect) return;
    const targets = Array.from(sect.querySelectorAll<HTMLElement>("[data-reveal]"));
    targets.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 8) * 55}ms`;
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
    <div className="ucx-testimonials" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head" data-reveal>
          <span className="eyebrow">Testimonials</span>
          <h2 className="heading">
            Trusted through collaboration.
            <br />
            Proven through delivery.
          </h2>
        </div>

        <div className="t-grid">
          {TESTIMONIALS.map((t) => (
            <div className="t-card" key={t.name} data-reveal>
              <svg className="t-quote" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M7.17 6C4.87 6 3 7.87 3 10.17c0 2.02 1.44 3.7 3.35 4.08-.13.9-.6 1.7-1.35 2.25a.5.5 0 00.3.9c2.9 0 5.3-2.34 5.3-5.5V10.17C10.6 7.87 8.73 6 7.17 6zm10 0c-2.3 0-4.17 1.87-4.17 4.17 0 2.02 1.44 3.7 3.35 4.08-.13.9-.6 1.7-1.35 2.25a.5.5 0 00.3.9c2.9 0 5.3-2.34 5.3-5.5V10.17C20.6 7.87 18.73 6 17.17 6z" />
              </svg>
              <p className="t-quote-text">&ldquo;{t.quote}&rdquo;</p>
              <div className="t-meta">
                <span className="t-name">{t.name}</span>
                <span className="t-role">{t.role}</span>
                <span className="t-loc">{t.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
