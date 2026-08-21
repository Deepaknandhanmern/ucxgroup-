"use client";

import { useState } from "react";
import Script from "next/script";
import { submitToSplitForms } from "@/lib/splitforms";
import ContactMap from "./ContactMap";

const CALENDLY_URL = "https://calendly.com/deepaknandhan25/30min";

type QueryType = "bim" | "interior" | "training";

interface DynamicField {
  name: string;
  label: string;
  type: "select" | "text";
  options?: string[];
  placeholder?: string;
}

interface TypeConfig {
  tag: string;
  title: string;
  desc: string;
  route: string;
  hint: string;
  messageLabel: string;
  messagePlaceholder: string;
  fields: DynamicField[];
}

const CONFIG: Record<QueryType, TypeConfig> = {
  bim: {
    tag: "A",
    title: "BIM related query",
    desc: "Model coordination, clash detection, LOD, file exchange.",
    route: "BIM support desk",
    hint: "A BIM specialist typically replies within 2–4 hours.",
    messageLabel: "Describe the BIM issue",
    messagePlaceholder: "e.g. clash between MEP and structural model on level 3...",
    fields: [
      { name: "bim_software", label: "BIM software used", type: "select", options: ["Revit", "Navisworks", "AutoCAD", "ArchiCAD", "Tekla", "Other"] },
      { name: "query_category", label: "Query category", type: "select", options: ["Clash detection", "Model coordination", "LOD / standards", "File exchange (IFC/RVT)", "Other"] },
      { name: "model_file_size", label: "Model file size", type: "text", placeholder: "e.g. 180 MB" },
      { name: "deadline", label: "Deadline / urgency", type: "select", options: ["Not urgent", "Within a week", "Within 48 hours", "Urgent"] },
    ],
  },
  interior: {
    tag: "B",
    title: "Interior related",
    desc: "Space planning, materials, styling, renders and layouts.",
    route: "Interior design desk",
    hint: "Our design team typically replies within 1 business day.",
    messageLabel: "Describe your space and requirement",
    messagePlaceholder: "e.g. 2BHK apartment, need modern minimalist layout...",
    fields: [
      { name: "project_type", label: "Project type", type: "select", options: ["Residential", "Commercial", "Retail", "Hospitality"] },
      { name: "space_area", label: "Space area (sq. ft)", type: "text", placeholder: "e.g. 1200" },
      { name: "preferred_style", label: "Preferred style", type: "select", options: ["Modern minimalist", "Contemporary", "Industrial", "Traditional", "Scandinavian", "Not sure yet"] },
      { name: "budget_range", label: "Budget range", type: "select", options: ["Under ₹5L", "₹5L – ₹15L", "₹15L – ₹30L", "₹30L+"] },
    ],
  },
  training: {
    tag: "C",
    title: "Training academy",
    desc: "Courses, certifications, batches and enrolment.",
    route: "Academy admissions",
    hint: "Admissions typically respond within 1 business day.",
    messageLabel: "Anything specific you'd like to know",
    messagePlaceholder: "e.g. is this course suitable for a working professional...",
    fields: [
      { name: "course", label: "Course of interest", type: "select", options: ["BIM fundamentals", "Revit MEP", "Navisworks coordination", "Interior design bootcamp", "Site management"] },
      { name: "experience_level", label: "Experience level", type: "select", options: ["Complete beginner", "Some experience", "Working professional"] },
      { name: "preferred_batch", label: "Preferred batch", type: "select", options: ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible / self-paced"] },
      { name: "learning_mode", label: "Mode of learning", type: "select", options: ["Online", "In-person", "Hybrid"] },
    ],
  },
};

const OPTIONS: { type: QueryType }[] = [{ type: "bim" }, { type: "interior" }, { type: "training" }];

type Status = "idle" | "submitting" | "success" | "error";

export default function ContactForm() {
  const [selected, setSelected] = useState<QueryType>("bim");
  const [status, setStatus] = useState<Status>("idle");
  const cfg = CONFIG[selected];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const formData = new FormData(e.currentTarget);
    const payload: Record<string, string> = {
      subject: `New contact request — ${cfg.title}`,
      query_type: cfg.title,
    };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    const { ok } = await submitToSplitForms(payload);
    setStatus(ok ? "success" : "error");
  }

  return (
    <div className="ucx-contact" id="contact-form">
      <div className="ucx-bg-grid"></div>
      <div className="ucx-bg-aurora">
        <span className="b1"></span>
        <span className="b2"></span>
        <span className="b3"></span>
      </div>

      <div className="wrap">
        <span className="eyebrow">Support</span>
        <h1>Which team should we route you to?</h1>
        <p className="sub">
          Pick a query type below and the form reshapes itself to ask exactly what that team needs, so your request
          lands with the right expert straight away.
        </p>

        <div className="office-strip">
          <div className="office-item">
            <span className="office-label">Visit us</span>
            <p>
              Door No. 653, Part LCC Compound, 1-3, Trichy Rd, opposite Srivari Trisara, Singanallur,
              Coimbatore, Tamil Nadu 641005
            </p>
          </div>
          <div className="office-item">
            <span className="office-label">Email</span>
            <p><a href="mailto:collaborate@ucx-group.com">collaborate@ucx-group.com</a></p>
          </div>
        </div>

        <ContactMap />

        <div className="schedule-block">
          <div className="schedule-copy">
            <span className="office-label">Prefer to talk it through?</span>
            <h2>Book a 30-minute call directly</h2>
            <p className="sub">Skip the form below and grab a slot on our calendar — no back-and-forth over email.</p>
          </div>
          <div className="calendly-inline-widget" data-url={CALENDLY_URL} />
        </div>
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />

        <div className="selector-label">1. Choose your query type</div>
        <div className="selector">
          {OPTIONS.map(({ type }) => {
            const c = CONFIG[type];
            return (
              <label className={`opt${selected === type ? " active" : ""}`} key={type}>
                <input
                  type="radio"
                  name="qtype"
                  value={type}
                  checked={selected === type}
                  onChange={() => setSelected(type)}
                />
                <span className="check"></span>
                <span className="tag">{c.tag}</span>
                <h3>{c.title}</h3>
                <p>{c.desc}</p>
              </label>
            );
          })}
        </div>

        <form className="panel" onSubmit={handleSubmit}>
          <div className="corner-blob"></div>
          <div className="panel-inner">
            {status === "success" ? (
              <div className="field full" style={{ textAlign: "center", padding: "20px 0" }}>
                <h2 style={{ marginBottom: 8 }}>Request sent</h2>
                <p className="sub" style={{ margin: "0 auto" }}>
                  Thanks — your request has been routed to the {cfg.route}. They&apos;ll be in touch shortly.
                </p>
              </div>
            ) : (
              <>
                <div className="panel-head">
                  <h2>{cfg.title}</h2>
                  <div className="route">
                    Routing to <b>{cfg.route}</b>
                  </div>
                </div>

                <div className="field-grid">
                  <div className="field">
                    <label>Full name</label>
                    <input type="text" name="name" placeholder="Your name" required />
                  </div>
                  <div className="field">
                    <label>Email address</label>
                    <input type="email" name="email" placeholder="you@company.com" required />
                  </div>
                  <div className="field">
                    <label>Phone number</label>
                    <input type="tel" name="phone" placeholder="+91 00000 00000" />
                  </div>
                  <div className="field">
                    <label>Company / project name</label>
                    <input type="text" name="company" placeholder="Optional" />
                  </div>

                  <div className="dynamic-wrap" key={selected}>
                    <div className="dynamic-section-label">Details for {cfg.title.toLowerCase()}</div>
                    {cfg.fields.map((f) => (
                      <div className="field" key={f.name}>
                        <label>{f.label}</label>
                        {f.type === "select" ? (
                          <select name={f.name} defaultValue="">
                            <option value="">Select an option</option>
                            {f.options!.map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input type="text" name={f.name} placeholder={f.placeholder || ""} />
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="field full">
                    <label>{cfg.messageLabel}</label>
                    <textarea name="message" placeholder={cfg.messagePlaceholder}></textarea>
                  </div>
                </div>

                <div className="actions">
                  <span className="hint">
                    {status === "error" ? "Something went wrong — please try again or email us directly." : cfg.hint}
                  </span>
                  <button type="submit" className="submit" disabled={status === "submitting"}>
                    {status === "submitting" ? "Sending…" : "Send request"}
                  </button>
                </div>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
