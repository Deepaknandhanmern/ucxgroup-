"use client";

import { useState } from "react";

type QueryType = "bim" | "interior" | "training";

interface DynamicField {
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
      { label: "BIM software used", type: "select", options: ["Revit", "Navisworks", "AutoCAD", "ArchiCAD", "Tekla", "Other"] },
      { label: "Query category", type: "select", options: ["Clash detection", "Model coordination", "LOD / standards", "File exchange (IFC/RVT)", "Other"] },
      { label: "Model file size", type: "text", placeholder: "e.g. 180 MB" },
      { label: "Deadline / urgency", type: "select", options: ["Not urgent", "Within a week", "Within 48 hours", "Urgent"] },
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
      { label: "Project type", type: "select", options: ["Residential", "Commercial", "Retail", "Hospitality"] },
      { label: "Space area (sq. ft)", type: "text", placeholder: "e.g. 1200" },
      { label: "Preferred style", type: "select", options: ["Modern minimalist", "Contemporary", "Industrial", "Traditional", "Scandinavian", "Not sure yet"] },
      { label: "Budget range", type: "select", options: ["Under ₹5L", "₹5L – ₹15L", "₹15L – ₹30L", "₹30L+"] },
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
      { label: "Course of interest", type: "select", options: ["BIM fundamentals", "Revit MEP", "Navisworks coordination", "Interior design bootcamp", "Site management"] },
      { label: "Experience level", type: "select", options: ["Complete beginner", "Some experience", "Working professional"] },
      { label: "Preferred batch", type: "select", options: ["Weekday mornings", "Weekday evenings", "Weekends", "Flexible / self-paced"] },
      { label: "Mode of learning", type: "select", options: ["Online", "In-person", "Hybrid"] },
    ],
  },
};

const OPTIONS: { type: QueryType }[] = [{ type: "bim" }, { type: "interior" }, { type: "training" }];

export default function ContactForm() {
  const [selected, setSelected] = useState<QueryType>("bim");
  const cfg = CONFIG[selected];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert("Thanks — your request has been routed. This is a front-end demo, so nothing was actually sent.");
  }

  return (
    <div className="ucx-contact" id="contact-form">
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>

      <div className="wrap">
        <span className="eyebrow">Support</span>
        <h1>Which team should we route you to?</h1>
        <p className="sub">
          Pick a query type below and the form reshapes itself to ask exactly what that team needs, so your request
          lands with the right expert straight away.
        </p>

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
            <div className="panel-head">
              <h2>{cfg.title}</h2>
              <div className="route">
                Routing to <b>{cfg.route}</b>
              </div>
            </div>

            <div className="field-grid">
              <div className="field">
                <label>Full name</label>
                <input type="text" placeholder="Your name" required />
              </div>
              <div className="field">
                <label>Email address</label>
                <input type="email" placeholder="you@company.com" required />
              </div>
              <div className="field">
                <label>Phone number</label>
                <input type="tel" placeholder="+91 00000 00000" />
              </div>
              <div className="field">
                <label>Company / project name</label>
                <input type="text" placeholder="Optional" />
              </div>

              <div className="dynamic-wrap" key={selected}>
                <div className="dynamic-section-label">Details for {cfg.title.toLowerCase()}</div>
                {cfg.fields.map((f) => (
                  <div className="field" key={f.label}>
                    <label>{f.label}</label>
                    {f.type === "select" ? (
                      <select defaultValue="">
                        <option value="">Select an option</option>
                        {f.options!.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" placeholder={f.placeholder || ""} />
                    )}
                  </div>
                ))}
              </div>

              <div className="field full">
                <label>{cfg.messageLabel}</label>
                <textarea placeholder={cfg.messagePlaceholder}></textarea>
              </div>
            </div>

            <div className="actions">
              <span className="hint">{cfg.hint}</span>
              <button type="submit" className="submit">
                Send request
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
