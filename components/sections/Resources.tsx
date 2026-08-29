"use client";

import { useEffect, useRef, useState } from "react";
import { submitEnquiry } from "@/lib/save-enquiry";
import FileCard from "@/components/ui/FileCard";
import CardThumb from "@/components/ui/CardThumb";
import { RESOURCE_FILTERS, type ResourceItem } from "@/lib/resources";

const FILTERS = RESOURCE_FILTERS;

export default function Resources({ resources }: { resources: ResourceItem[] }) {
  const [activeCat, setActiveCat] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState<ResourceItem | null>(null);
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const lastFocusRef = useRef<HTMLElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);

  const list = activeCat === "all" ? resources : resources.filter((r) => r.cat === activeCat);

  // Header mega-menu category links land here as ?category=guides etc.
  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category");
    if (category && FILTERS.some((f) => f.cat === category)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- deferred to the client to avoid a hydration mismatch, same pattern as FeaturedProjects
      setActiveCat(category);
    }
  }, []);

  function openModal(item: ResourceItem, e: React.MouseEvent<HTMLButtonElement>) {
    lastFocusRef.current = e.currentTarget;
    setModalItem(item);
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

  const isLightGate = modalItem?.cat === "templates";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setSubmitError(false);

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      subject: `Resource notify request — ${modalItem?.ref ?? ""}`,
      resource_ref: modalItem?.ref ?? "",
      resource_title: modalItem?.title ?? "",
      resource_category: modalItem?.label ?? "",
    };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    const { ok } = await submitEnquiry("resource-download", payload);
    setSending(false);
    if (ok) {
      setSent(true);
      setTimeout(closeModal, 2600);
    } else {
      setSubmitError(true);
    }
  }

  return (
    <div className="ucxres-root">
      <div className="ucxres__bg" aria-hidden="true">
        <span className="ucxres__bg-wash"></span>
        <span className="ucxres__bg-wash two"></span>
        <span className="ucxres__bg-grid"></span>
        <span className="ucxres__bg-word">UCX</span>
        <svg className="ucxres__bg-rings" viewBox="0 0 520 520">
          <circle cx="260" cy="260" r="60" />
          <circle cx="260" cy="260" r="104" />
          <circle cx="260" cy="260" r="148" />
          <circle cx="260" cy="260" r="192" />
          <circle cx="260" cy="260" r="236" />
        </svg>
        <span className="ucxres__bg-mark m1"></span>
        <span className="ucxres__bg-mark m2"></span>
        <span className="ucxres__bg-mark m3"></span>
      </div>

      <section className="ucxres">
        <p className="ucxres__eyebrow">Resource library</p>
        <h1 className="ucxres__title">
          Practical tools &amp; <em>knowledge</em>
        </h1>
        <p className="ucxres__lede">
          Guides, templates and reports for project teams working with UCX — browse by type, then get notified
          the moment each one is ready to download.
        </p>

        <div className="ucxres__bar">
          {FILTERS.map((f) => (
            <button
              key={f.cat}
              className={`ucxres__chip${activeCat === f.cat ? " is-active" : ""}`}
              onClick={() => setActiveCat(f.cat)}
            >
              {f.label}
            </button>
          ))}
          <span className="ucxres__count">
            {list.length} {list.length === 1 ? "resource" : "resources"}
          </span>
        </div>

        <div className="ucxres__grid">
          {list.map((r, i) => (
            <article className="ucxres__card" style={{ animationDelay: `${i * 70}ms` }} key={r.ref}>
              <div className="ucxres__thumb">
                <div className="ucxres__row">
                  <span className="ucxres__ref">{r.ref}</span>
                  <span className="ucxres__pages">{r.format}</span>
                </div>
                <CardThumb src={r.image} alt={r.title} />
                <span className="ucxres__cat">{r.label}</span>
              </div>
              <div className="ucxres__body">
                <h3>{r.title}</h3>
                <button className="ucxres__dl" type="button" onClick={(e) => openModal(r, e)}>
                  Notify Me
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

      <div className={`ucxres__overlay${modalOpen ? " is-open" : ""}`} onClick={(e) => e.target === e.currentTarget && closeModal()}>
        <div className={`ucxres__modal${sent ? " is-sent" : ""}`}>
          <button className="ucxres__close" aria-label="Close" onClick={closeModal}>
            &#10005;
          </button>
          <div className="ucxres__side">
            <FileCard format={modalItem?.format ?? "pdf"} />
            <div>
              <span className="ucxres__cat">{modalItem?.label}</span>
              <h4>{modalItem?.title || "Resource title"}</h4>
            </div>
          </div>
          <div className="ucxres__form">
            <h2>{isLightGate ? "Quick unlock" : "Get notified when this is ready"}</h2>
            <p className="sub">
              {isLightGate
                ? "Templates are a fast, low-commitment download — just leave your email and we'll send it the moment it's ready."
                : "This resource is still in progress — leave your details and we’ll email you the moment it’s available to download."}
            </p>
            <form onSubmit={handleSubmit}>
              <div className="ucxres__fields">
                {isLightGate ? (
                  <div className="ucxres__field full">
                    <label>Work email*</label>
                    <input ref={firstFieldRef} required type="email" name="email" placeholder="jordan@acme.com" />
                  </div>
                ) : (
                  <>
                    <div className="ucxres__field">
                      <label>Full name*</label>
                      <input ref={firstFieldRef} required type="text" name="name" placeholder="Jordan Ellis" />
                    </div>
                    <div className="ucxres__field">
                      <label>Job title*</label>
                      <input required type="text" name="role" placeholder="Project manager" />
                    </div>
                    <div className="ucxres__field">
                      <label>Company*</label>
                      <input required type="text" name="company" placeholder="Acme Studio" />
                    </div>
                    <div className="ucxres__field">
                      <label>Work email*</label>
                      <input required type="email" name="email" placeholder="jordan@acme.com" />
                    </div>
                  </>
                )}
                <label className="ucxres__consent">
                  <input required type="checkbox" name="consent" />
                  <span>
                    I agree to be contacted about this request, as set out in the <a href="/privacy-policy">privacy policy</a>.
                  </span>
                </label>
                {submitError && (
                  <p className="ucxres__field full" style={{ color: "#b3261e", fontSize: 13 }}>
                    Something went wrong sending your request — please try again.
                  </p>
                )}
                <button className="ucxres__submit" type="submit" disabled={sending}>
                  {sending ? "Sending…" : "Notify Me"}
                </button>
              </div>
            </form>
            <div className="ucxres__done">
              <span>&#10003;</span>
              {modalItem?.pdfUrl ? (
                <>
                  <span>Thanks — your download is ready.</span>
                  <a className="ucxres__submit" href={modalItem.pdfUrl} download style={{ display: "inline-flex", marginTop: 14, textDecoration: "none" }}>
                    Download File
                  </a>
                </>
              ) : (
                <span>Thanks — we&apos;ll email you the moment this resource is ready to download.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
