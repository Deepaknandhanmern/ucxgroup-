"use client";

import { useEffect, useRef, useState } from "react";
import { submitFormDataToSplitForms } from "@/lib/splitforms";
import { saveEnquiryCopy } from "@/lib/save-enquiry";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

interface Position {
  title: string;
  department: string;
  location: string;
  type: string;
  desc: string;
}

type ApplyStatus = "idle" | "sending" | "sent" | "error";

export default function Careers({ positions }: { positions: Position[] }) {
  const POSITIONS = positions;
  const sectRef = useRef<HTMLDivElement>(null);
  const bodyGlowRef = useCursorGlow<HTMLDivElement>();
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocusRef = useRef<HTMLElement | null>(null);

  const [applyPosition, setApplyPosition] = useState<Position | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);
  const [status, setStatus] = useState<ApplyStatus>("idle");

  function openApply(p: Position, e: React.MouseEvent<HTMLButtonElement>) {
    lastFocusRef.current = e.currentTarget;
    setApplyPosition(p);
    setStatus("idle");
    setApplyOpen(true);
  }

  function closeApply() {
    setApplyOpen(false);
    lastFocusRef.current?.focus();
  }

  useEffect(() => {
    if (applyOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => closeBtnRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
    }
  }, [applyOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && applyOpen) closeApply();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [applyOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    const formData = new FormData(e.currentTarget);
    formData.set("subject", `Application: ${applyPosition?.title ?? ""}`);
    formData.set("position", applyPosition?.title ?? "");
    formData.set("department", applyPosition?.department ?? "");

    const { ok } = await submitFormDataToSplitForms(formData);
    if (ok) {
      const fields: Record<string, string> = {};
      formData.forEach((value, key) => {
        if (typeof value === "string") fields[key] = value;
      });
      saveEnquiryCopy("careers", fields);
    }
    setStatus(ok ? "sent" : "error");
  }

  return (
    <div className="ucx-careers" ref={sectRef}>
      {/* ---------- hero: its own dark band, matching Hero.css ---------- */}
      <div className="hero-band">
        <div className="grid-overlay"></div>
        <div className="head">
          <span className="eyebrow">Careers</span>
          <h1 className="heading">Build What Comes Next.</h1>
          <p className="intro">
            Join a multidisciplinary team working across BIM, digital engineering, architecture, interiors and the
            future of project delivery.
          </p>
          <a className="head-cta" href="#open-positions">
            View Open Positions
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      <div className="cap-body" ref={bodyGlowRef}>
        <div className="grid-overlay"></div>
        <div className="grid-glow"></div>
        <div className="cursor-haze"></div>

        <div className="wrapper">
        <div className="life">
          <h2>Life at UCX</h2>
          <div className="body">
            <p>
              UCX operates from an India-based collaborative workspace that supports focused project delivery, team
              interaction and professional collaboration.
            </p>
            <p>
              We work across disciplines rather than in silos &mdash; BIM, digital engineering, architecture and interiors
              sit in one connected team, not separate departments.
            </p>
            <div className="tags">
              <span>Project Delivery</span>
              <span>Team Collaboration</span>
              <span>Knowledge Sharing</span>
            </div>
          </div>
        </div>

        <div id="open-positions">
          <div className="positions-head">
            <h2>Open Positions</h2>
            <span className="count">{POSITIONS.length} roles open</span>
          </div>

          <div className="positions">
            {POSITIONS.map((p) => (
              <div className="position" key={p.title}>
                <div>
                  <div className="role-title">{p.title}</div>
                  <div className="meta">
                    <span>{p.department}</span>
                    <span>{p.location}</span>
                    <span>{p.type}</span>
                  </div>
                  <p className="desc">{p.desc}</p>
                </div>
                <button className="apply" type="button" onClick={(e) => openApply(p, e)}>
                  Apply Now
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h13M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="closing">
          <p>Don&rsquo;t see a role that fits? We&rsquo;re always open to hearing from people who want to build something different.</p>
          <a href="/contact">Get in touch &rarr;</a>
        </div>
        </div>
      </div>

      {/* ---------- Apply modal ---------- */}
      <div
        className={`apply-overlay${applyOpen ? " is-open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeApply()}
      >
        <div className="apply-modal">
          <button className="apply-close" aria-label="Close" ref={closeBtnRef} onClick={closeApply}>
            &#10005;
          </button>

          {status === "sent" ? (
            <div className="apply-sent">
              <span className="check">&#10003;</span>
              <h3>Application sent</h3>
              <p>
                Thanks for applying to {applyPosition?.title}. We&rsquo;ll review your details and get back to you
                shortly.
              </p>
            </div>
          ) : (
            <>
              <span className="apply-kicker">{applyPosition?.department}</span>
              <h3 className="apply-title">Apply &mdash; {applyPosition?.title}</h3>
              <p className="apply-sub">Tell us a bit about yourself and attach your resume.</p>

              <form onSubmit={handleSubmit}>
                <div className="apply-fields">
                  <div className="apply-field">
                    <label>Full name*</label>
                    <input required type="text" name="name" placeholder="Your name" />
                  </div>
                  <div className="apply-field">
                    <label>Email*</label>
                    <input required type="email" name="email" placeholder="you@email.com" />
                  </div>
                  <div className="apply-field">
                    <label>Phone</label>
                    <input type="tel" name="phone" placeholder="+91 00000 00000" />
                  </div>
                  <div className="apply-field">
                    <label>Current / most recent role</label>
                    <input type="text" name="current_role" placeholder="Optional" />
                  </div>
                  <div className="apply-field full">
                    <label>Resume / CV</label>
                    <input type="file" name="resume" accept=".pdf,.doc,.docx" />
                  </div>
                  <div className="apply-field full">
                    <label>Anything you&rsquo;d like to add</label>
                    <textarea name="message" placeholder="Optional"></textarea>
                  </div>
                </div>

                {status === "error" && (
                  <p className="apply-error">Something went wrong sending your application &mdash; please try again.</p>
                )}

                <button className="apply-submit" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Submit Application"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
