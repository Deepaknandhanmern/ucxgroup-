"use client";

import { useEffect, useRef, useState } from "react";
import { submitToSplitForms } from "@/lib/splitforms";
import FileCard from "@/components/ui/FileCard";
import { CASE_STUDY_FILTERS, type CaseStudy } from "@/lib/case-studies";

type CaseItem = CaseStudy;

const FILTERS = CASE_STUDY_FILTERS;

export default function CaseStudies({ cases }: { cases: CaseItem[] }) {
  const [activeCat, setActiveCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalCase, setModalCase] = useState<CaseItem | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const list = activeCat === "all" ? cases : cases.filter((c) => c.cat === activeCat);

  function openModal(c: CaseItem, e: React.MouseEvent<HTMLButtonElement>) {
    lastFocusRef.current = e.currentTarget;
    setModalCase(c);
    setSent(false);
    setSubmitError(false);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    lastFocusRef.current?.focus();
  }

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
      const t = setTimeout(() => firstFieldRef.current?.focus(), 300);
      return () => clearTimeout(t);
    } else {
      document.body.style.overflow = "";
    }
  }, [modalOpen]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && modalOpen) closeModal();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modalOpen]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSubmitError(false);

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      subject: `Case study download — ${modalCase?.ref ?? ""}`,
      case_study_ref: modalCase?.ref ?? "",
      case_study_title: modalCase?.title ?? "",
      case_study_category: modalCase?.label ?? "",
    };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    const { ok } = await submitToSplitForms(payload);
    setSending(false);
    if (ok) {
      setSent(true);
      setTimeout(closeModal, 2600);
    } else {
      setSubmitError(true);
    }
  }

  return (
    <div className="ucxcs-root">
      <div className="ucxcs__bg" aria-hidden="true">
        <span className="ucxcs__bg-wash"></span>
        <span className="ucxcs__bg-wash two"></span>
        <span className="ucxcs__bg-grid"></span>
        <span className="ucxcs__bg-word">UCX</span>
        <svg className="ucxcs__bg-rings" viewBox="0 0 520 520">
          <circle cx="260" cy="260" r="60" />
          <circle cx="260" cy="260" r="104" />
          <circle cx="260" cy="260" r="148" />
          <circle cx="260" cy="260" r="192" />
          <circle cx="260" cy="260" r="236" />
        </svg>
        <span className="ucxcs__bg-mark m1"></span>
        <span className="ucxcs__bg-mark m2"></span>
        <span className="ucxcs__bg-mark m3"></span>
      </div>

      <section className="ucxcs">
        <p className="ucxcs__eyebrow">Resource library</p>
        <h1 className="ucxcs__title">
          Case studies, filed by <em>discipline</em>
        </h1>
        <p className="ucxcs__lede">
          A working archive of project documentation from the UCX studio floor — browse by sector, then download the
          full write-up as a PDF.
        </p>

        <div className="ucxcs__bar">
          {FILTERS.map((f) => (
            <button
              key={f.cat}
              className={`ucxcs__chip${activeCat === f.cat ? " is-active" : ""}`}
              onClick={() => setActiveCat(f.cat)}
            >
              {f.label}
            </button>
          ))}
          <span className="ucxcs__count">
            {list.length} {list.length === 1 ? "study" : "studies"}
          </span>
        </div>

        <div className="ucxcs__grid">
          {list.map((c, i) => (
            <article className="ucxcs__card" style={{ animationDelay: `${i * 70}ms` }} key={c.ref}>
              <div className="ucxcs__thumb">
                <div className="ucxcs__row">
                  <span className="ucxcs__ref">{c.ref}</span>
                  <span className="ucxcs__pages">{c.pages}</span>
                </div>
                <div className="ucxcs__filewrap ucxcs__filewrap--locked">
                  <FileCard format="pdf" />
                </div>
                <span className="ucxcs__lock" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="11" width="14" height="9" rx="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                  </svg>
                  Preview locked
                </span>
                <span className="ucxcs__cat">{c.label}</span>
              </div>
              <div className="ucxcs__body">
                <h3>{c.title}</h3>
                <button className="ucxcs__dl" type="button" onClick={(e) => openModal(c, e)}>
                  Download PDF
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v12" />
                    <path d="M7 11l5 5 5-5" />
                    <path d="M4 21h16" />
                  </svg>
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <div className={`ucxcs__overlay${modalOpen ? " is-open" : ""}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className={`ucxcs__modal${sent ? " is-sent" : ""}`}>
          <button className="ucxcs__close" aria-label="Close" onClick={closeModal}>
            &#10005;
          </button>
          <div className="ucxcs__side">
            <FileCard format="pdf" />
            <div>
              <span className="ucxcs__cat">{modalCase?.label}</span>
              <h4>{modalCase?.title || "Case study title"}</h4>
            </div>
          </div>
          <div className="ucxcs__form">
            <h2>Download this case study</h2>
            <p className="sub">Add your details and the PDF lands in your inbox within a minute.</p>
            <form onSubmit={handleSubmit}>
              <div className="ucxcs__fields">
                <div className="ucxcs__field">
                  <label>Full name*</label>
                  <input ref={firstFieldRef} required type="text" name="name" placeholder="Jordan Ellis" />
                </div>
                <div className="ucxcs__field">
                  <label>Job title*</label>
                  <input required type="text" name="role" placeholder="Project manager" />
                </div>
                <div className="ucxcs__field">
                  <label>Company*</label>
                  <input required type="text" name="company" placeholder="Acme Studio" />
                </div>
                <div className="ucxcs__field">
                  <label>Work email*</label>
                  <input required type="email" name="email" placeholder="jordan@acme.com" />
                </div>
                <div className="ucxcs__field full">
                  <label>Phone</label>
                  <input type="tel" name="phone" placeholder="Optional" />
                </div>
                <div className="ucxcs__field full">
                  <label>Message</label>
                  <textarea name="message" placeholder="Optional — tell us what you're working on"></textarea>
                </div>
                <label className="ucxcs__consent">
                  <input required type="checkbox" name="consent" />
                  <span>
                    I agree to be contacted about this request, as set out in the <a href="/privacy-policy/">privacy policy</a>.
                  </span>
                </label>
                {submitError && (
                  <p className="ucxcs__field full" style={{ color: "#b3261e", fontSize: 13 }}>
                    Something went wrong sending your request — please try again.
                  </p>
                )}
                <button className="ucxcs__submit" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Send me the PDF"}
                </button>
              </div>
            </form>
            <div className="ucxcs__done">
              <span>&#10003;</span>
              <span>Thanks — the PDF is on its way to your inbox. Check spam if it hasn&apos;t landed in a few minutes.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
