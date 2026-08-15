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
    quote: "UCX demonstrated strong commitment and attention to detail throughout our as-built conversion project, helping maintain quality and delivery requirements.",
  },
  {
    name: "Abdul Ashif",
    location: "Saudi Arabia",
    role: "Project Management & Delivery",
    quote: "UCX's clear communication, organised project management and understanding of our requirements made the collaboration smooth and effective.",
  },
  {
    name: "Imraan Sherrief",
    location: "India",
    role: "BIM Coordination & Workflows",
    quote: "UCX brought a structured approach to coordination and project workflow, helping us achieve a more efficient and coordinated delivery.",
  },
  {
    name: "Gajapathy",
    location: "India",
    role: "Project Delivery & Documentation",
    quote: "UCX's efficient project delivery and commitment to meeting submission schedules made the overall process reliable and seamless.",
  },
  {
    name: "Mohammed Mohideen",
    location: "India",
    role: "Collaborative Delivery",
    quote: "UCX's collaborative approach, flexibility and clear communication made it easy to work together and deliver projects effectively.",
  },
  {
    name: "Abishek",
    location: "Singapore",
    role: "Interior Design",
    quote: "UCX delivered an outstanding interior design solution with a strong understanding of our requirements, professionalism and commitment to quality.",
  },
  {
    name: "Ilayaraja",
    location: "India",
    role: "BIM & Digital Engineering",
    quote: "UCX's collaborative approach and technical coordination helped us achieve the expected outcome for our BIM project.",
  },
  {
    name: "Sankar",
    location: "Dubai",
    role: "Resource & Delivery Coordination",
    quote: "UCX's clear communication and resource coordination have built strong confidence for future project collaboration.",
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

  return (
    <div className="ucx-testimonials" ref={sectRef}>
      <div className="grid-overlay"></div>

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
