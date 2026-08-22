"use client";

import { useEffect, useRef, useState } from "react";
import { submitFormDataToSplitForms } from "@/lib/splitforms";

interface ChallengeRow {
  challenge: string;
  domain: string;
  status: "Open" | "Exploring" | "Pilot";
}

const CHALLENGES: ChallengeRow[] = [
  { challenge: "BIM-based facility dashboards", domain: "Smart Assets", status: "Open" },
  { challenge: "Automated prefab shop drawings", domain: "Prefabrication", status: "Exploring" },
  { challenge: "AI-assisted project documentation", domain: "AI & Automation", status: "Open" },
  { challenge: "BIM-linked site progress", domain: "Construction", status: "Pilot" },
];

interface WayToCollaborate {
  index: string;
  title: string;
  desc: string;
}

const WAYS: WayToCollaborate[] = [
  { index: "01", title: "Project Collaboration", desc: "Solve a defined project challenge together." },
  { index: "02", title: "Co-Innovation", desc: "Develop and test a new idea or workflow." },
  { index: "03", title: "Pilot Project", desc: "Take a promising concept into a real project environment." },
  { index: "04", title: "Strategic Partnership", desc: "Build a longer-term technology or delivery relationship." },
  { index: "05", title: "Specialist Collaboration", desc: "Combine complementary expertise around a specific opportunity." },
];

const PARTNER_TYPES = [
  "Architects",
  "Developers",
  "Engineers",
  "Contractors",
  "Manufacturers",
  "Technology Companies",
  "Facility Teams",
  "Researchers",
];

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function CollaborationLab() {
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");

  function openForm() {
    setStatus("idle");
    setFormOpen(true);
  }
  function closeForm() {
    setFormOpen(false);
  }

  useEffect(() => {
    if (formOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => closeBtnRef.current?.focus(), 60);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
    }
  }, [formOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && formOpen) closeForm();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [formOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.currentTarget);
    formData.set("subject", "New Challenge Submission");
    const { ok } = await submitFormDataToSplitForms(formData);
    setStatus(ok ? "sent" : "error");
  }

  return (
    <div className="ucx-lab">
      <div className="ucx-bg-grid"></div>
      <div className="ucx-bg-aurora">
        <span className="b1"></span>
        <span className="b2"></span>
        <span className="b3"></span>
      </div>

      <div className="wrapper">
        <div className="head" id="open-challenges">
          <h2 className="heading">Open Challenges</h2>
          <p className="intro">
            Industry problems looking for the right expertise, technology or collaboration.
          </p>
        </div>

        <div className="table-wrap">
          <table className="challenges">
            <thead>
              <tr>
                <th>Challenge</th>
                <th>Domain</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CHALLENGES.map((row) => (
                <tr key={row.challenge}>
                  <td className="c-challenge">{row.challenge}</td>
                  <td className="c-domain">{row.domain}</td>
                  <td>
                    <span className={`status status-${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="actions">
          <button className="submit-cta" type="button" onClick={openForm}>
            Submit a Challenge
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </button>
          <a className="approach-link" href="/contact">
            Have an Approach or Technology That Could Help?
            <span>&rarr;</span>
          </a>
        </div>

        {/* ---------- ways to collaborate ---------- */}
        <div className="ways" id="ways-to-collaborate">
          <h2 className="heading">Ways to Collaborate</h2>
          <div className="ways-list">
            {WAYS.map((w) => (
              <div className="way-row" key={w.index}>
                <span className="way-index">{w.index}</span>
                <h3 className="way-title">{w.title}</h3>
                <p className="way-desc">{w.desc}</p>
              </div>
            ))}
          </div>
          <a className="approach-link" href="/collaboration-lab#domains">
            Explore Collaboration Models
            <span>&rarr;</span>
          </a>
        </div>

        {/* ---------- built through collaboration / closing ---------- */}
        <div className="lab-closing" id="get-started">
          <span className="lab-closing-kicker">Built Through Collaboration</span>
          <p className="lab-closing-lede">
            We collaborate with individuals, organisations and technology partners across the built environment.
          </p>
          <div className="partner-types">
            {PARTNER_TYPES.map((p) => (
              <span key={p}>{p}</span>
            ))}
          </div>

          <h2 className="lab-closing-heading">The Future of AEC Won&apos;t Be Built Alone.</h2>
          <p className="lab-closing-sub">
            Have a problem worth solving? Bring us a challenge, idea or technology. Let&apos;s explore what we can
            build together.
          </p>
          <div className="lab-closing-actions">
            <a className="submit-cta" href="/contact">
              Start a Collaboration
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </a>
            <button className="submit-cta submit-cta--ghost" type="button" onClick={openForm}>
              Share an Idea
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h13M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* ---------- submit-a-challenge modal ---------- */}
      <div
        className={`lab-overlay${formOpen ? " is-open" : ""}`}
        onClick={(e) => e.target === e.currentTarget && closeForm()}
      >
        <div className="lab-modal">
          <button className="lab-close" aria-label="Close" ref={closeBtnRef} onClick={closeForm}>
            &#10005;
          </button>

          {status === "sent" ? (
            <div className="lab-sent">
              <span className="check">&#10003;</span>
              <h3>Challenge submitted</h3>
              <p>Thanks for sharing this with us. We&rsquo;ll review it and get back to you if there&rsquo;s a fit.</p>
            </div>
          ) : (
            <>
              <span className="lab-kicker">Open Challenges</span>
              <h3 className="lab-title">Submit a Challenge</h3>
              <p className="lab-sub">Tell us about the problem and, if you have one, the approach or technology you have in mind.</p>

              <form onSubmit={handleSubmit}>
                <div className="lab-fields">
                  <div className="lab-field">
                    <label>Name*</label>
                    <input required type="text" name="name" placeholder="Your name" />
                  </div>
                  <div className="lab-field">
                    <label>Email*</label>
                    <input required type="email" name="email" placeholder="you@email.com" />
                  </div>
                  <div className="lab-field">
                    <label>Company / Organization</label>
                    <input type="text" name="company" placeholder="Optional" />
                  </div>
                  <div className="lab-field">
                    <label>Domain</label>
                    <input type="text" name="domain" placeholder="e.g. Smart Assets, AI & Automation" />
                  </div>
                  <div className="lab-field full">
                    <label>Challenge title*</label>
                    <input required type="text" name="challenge_title" placeholder="A short name for the challenge" />
                  </div>
                  <div className="lab-field full">
                    <label>Description*</label>
                    <textarea required name="description" placeholder="What's the problem, and what approach or technology could help?"></textarea>
                  </div>
                </div>

                {status === "error" && (
                  <p className="lab-error">Something went wrong sending this, please try again.</p>
                )}

                <button className="lab-submit" type="submit" disabled={status === "sending"}>
                  {status === "sending" ? "Sending…" : "Submit Challenge"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
