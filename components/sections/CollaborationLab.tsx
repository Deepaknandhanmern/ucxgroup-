"use client";

import { useEffect, useRef, useState } from "react";
import { submitFormDataToSplitForms } from "@/lib/splitforms";

interface ChallengeRow {
  challenge: string;
  domain: string;
  status: "Open" | "Exploring";
}

const CHALLENGES: ChallengeRow[] = [
  { challenge: "BIM-based facility dashboards", domain: "Smart Assets", status: "Open" },
  { challenge: "Automated prefab shop drawings", domain: "Prefabrication", status: "Exploring" },
  { challenge: "AI-assisted project documentation", domain: "AI & Automation", status: "Open" },
  { challenge: "BIM-linked site progress", domain: "Construction", status: "Exploring" },
];

type FormStatus = "idle" | "sending" | "sent" | "error";

export default function CollaborationLab() {
  const sectRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [status, setStatus] = useState<FormStatus>("idle");

  // cursor spotlight (same pattern as other sections)
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
    <div className="ucx-lab" id="open-challenges" ref={sectRef}>
      <div className="grid-overlay"></div>
      <div className="grid-glow"></div>
      <div className="cursor-haze"></div>

      <div className="wrapper">
        <div className="head">
          <span className="eyebrow">Collaboration Lab</span>
          <h1 className="heading">Open Challenges</h1>
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
                  <p className="lab-error">Something went wrong sending this &mdash; please try again.</p>
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
