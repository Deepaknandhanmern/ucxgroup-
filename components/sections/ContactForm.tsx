"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { submitEnquiry } from "@/lib/save-enquiry";
import { useMagnetic } from "@/components/ui/useMagnetic";
import Toast from "@/components/ui/Toast";
import ContactMap from "./ContactMap";

const CALENDLY_URL = "https://calendly.com/collaborate-ucx-group";
const DAY_NAMES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const CONTACT_EMAIL = "collaborate@ucx-group.com";

function EmailCard({ email }: { email: string }) {
  return (
    <a className="email-card" href={`mailto:${email}`}>
      <div className="email-grid" aria-hidden="true"></div>
      <div className="email-content">
        <div className="email-top">
          <svg className="email-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          <span className="email-live">
            <i></i>Get in Touch
          </span>
        </div>
        <div className="email-bottom">
          <h3>{email}</h3>
          <span className="email-underline"></span>
        </div>
      </div>
    </a>
  );
}

declare global {
  interface Window {
    Calendly?: { initPopupWidget: (opts: { url: string }) => void };
  }
}

function openCalendlyPopup(url: string) {
  if (typeof window !== "undefined" && window.Calendly) {
    window.Calendly.initPopupWidget({ url });
  } else {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}

function BookingCalendarCard({ url }: { url: string }) {
  const [openDays, setOpenDays] = useState<Set<number>>(new Set());

  const now = new Date();
  const month = now.toLocaleString("default", { month: "long" });
  const year = now.getFullYear();
  const firstWeekday = new Date(year, now.getMonth(), 1).getDay();
  const daysInMonth = new Date(year, now.getMonth() + 1, 0).getDate();

  // Populate "available" day highlights only after mount so server and
  // first client render match (avoids a hydration mismatch from Math.random()).
  useEffect(() => {
    const set = new Set<number>();
    for (let d = 1; d <= daysInMonth; d++) {
      if (Math.random() < 0.22) set.add(d);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally deferred to the client, see comment above
    setOpenDays(set);
  }, [daysInMonth]);

  return (
    <div className="booking-card">
      <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />

      <div className="booking-card-copy">
        <span className="office-label">Prefer to talk it through?</span>
        <h2>Any questions about your project?</h2>
        <p className="sub">Pick any date to book a free 30-minute call — you&rsquo;ll see real availability and get instant confirmation.</p>
        <button type="button" className="booking-card-cta" onClick={() => openCalendlyPopup(url)}>
          Book Now
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M7 17 17 7M8 7h9v9" />
          </svg>
        </button>
      </div>

      <div className="booking-mini-cal">
        <div className="booking-mini-cal-head">
          <span className="month">
            {month}, {year}
          </span>
          <span className="dot" aria-hidden="true" />
          <span className="duration">30 min call</span>
        </div>
        <div className="booking-mini-cal-grid">
          {DAY_NAMES.map((d) => (
            <span className="mc-cell mc-head" key={d}>
              {d}
            </span>
          ))}
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <span className="mc-cell mc-empty" key={`e${i}`} />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            return (
              <button
                type="button"
                className={`mc-cell${openDays.has(day) ? " is-open" : ""}`}
                key={day}
                onClick={() => openCalendlyPopup(url)}
                aria-label={`Book a call on ${month} ${day}, ${year}`}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

type QueryType = "bim" | "interior" | "training";

interface DynamicField {
  name: string;
  label: string;
  type: "select" | "text";
  options?: string[];
  placeholder?: string;
  required?: boolean;
}

interface TypeConfig {
  tag: string;
  title: string;
  desc: string;
  route: string;
  hint: string;
  emailLabel: string;
  companyLabel: string;
  phoneRequired: boolean;
  messageLabel: string;
  messagePlaceholder: string;
  messageRequired: boolean;
  submitLabel: string;
  fields: DynamicField[];
}

const CONFIG: Record<QueryType, TypeConfig> = {
  bim: {
    tag: "A",
    title: "BIM Support Desk",
    desc: "Get help with model coordination, clash detection, LOD, file exchange and BIM workflows.",
    route: "BIM Support Desk",
    hint: "A BIM specialist typically responds within 1 business day.",
    emailLabel: "Work email",
    companyLabel: "Company / project name",
    phoneRequired: false,
    messageLabel: "Tell us about your BIM requirement",
    messagePlaceholder: "Tell us what you're working on, what problem you're facing, and what outcome you need.",
    messageRequired: true,
    submitLabel: "Send request",
    fields: [
      { name: "bim_software", label: "BIM software used", type: "select", required: true, options: ["Revit", "Navisworks", "AutoCAD", "Archicad", "Tekla", "Other"] },
      { name: "query_category", label: "Query category", type: "select", required: true, options: ["BIM modelling", "Clash detection", "Model coordination", "File exchange (IFC / RVT / NWC / NWD)", "Model audit / quality check", "BIM workflow / automation", "Other"] },
      { name: "project_stage", label: "Project stage", type: "select", options: ["Concept", "Design development", "IFC", "Construction", "As-built"] },
      { name: "deadline", label: "Deadline / urgency", type: "select", required: true, options: ["Not urgent", "Within a week", "Within a month", "Urgent / immediate"] },
    ],
  },
  interior: {
    tag: "B",
    title: "Interior Design Desk",
    desc: "Get support with space planning, interior design, materials, styling, layouts, 3D visualisation and complete interior solutions.",
    route: "Interior Design Desk",
    hint: "An interior design specialist typically responds within 4–5 business hours.",
    emailLabel: "Email address",
    companyLabel: "Company / project name",
    phoneRequired: true,
    messageLabel: "Tell us about your interior requirement",
    messagePlaceholder: "Tell us about your space, current requirements, design expectations, challenges, preferred timeline, and the outcome you are looking for.",
    messageRequired: true,
    submitLabel: "Send request",
    fields: [
      { name: "project_type", label: "Project type", type: "select", required: true, options: ["Residential", "Commercial", "Retail", "Hospitality"] },
      { name: "service_required", label: "Service required", type: "select", required: true, options: ["Space planning", "Interior design", "Furniture & styling", "3D visualisation / renders", "Turnkey interior solutions", "Renovation / refurbishment", "Other"] },
      { name: "space_area", label: "Space area (sq. ft.)", type: "text", required: true, placeholder: "Enter approximate area" },
      { name: "budget_range", label: "Budget range", type: "select", options: ["Under ₹5L", "₹5L – ₹15L", "₹15L – ₹30L", "₹30L+"] },
    ],
  },
  training: {
    tag: "C",
    title: "Training Academy",
    desc: "Build practical BIM skills through structured, industry-focused online training designed for students, graduates and working professionals.",
    route: "Training Academy",
    hint: "An academy admissions specialist typically responds within 1 business day.",
    emailLabel: "Email address",
    companyLabel: "Current role / organisation",
    phoneRequired: true,
    messageLabel: "Anything specific you'd like to know?",
    messagePlaceholder: "Tell us about your current experience, career goals, the course you're interested in, or anything you'd like to know about the curriculum, batch schedule, fees or certification.",
    messageRequired: false,
    submitLabel: "Send enquiry",
    fields: [
      { name: "course", label: "Course of interest", type: "select", required: true, options: ["BIM fundamentals", "BIM advanced", "BIM professional"] },
      { name: "experience_level", label: "Experience level", type: "select", required: true, options: ["Complete beginner", "Some BIM experience", "Working professional"] },
      { name: "preferred_batch", label: "Preferred batch", type: "select", required: true, options: ["Next available batch", "Interested in upcoming batch", "Flexible"] },
      { name: "learning_goal", label: "Learning goal", type: "select", options: ["Start a career in BIM", "Upgrade my BIM skills", "Advance my professional skills", "Certification", "Other"] },
    ],
  },
};

const OPTIONS: { type: QueryType }[] = [{ type: "bim" }, { type: "interior" }, { type: "training" }];

type Status = "idle" | "submitting" | "error";

export default function ContactForm() {
  const [selected, setSelected] = useState<QueryType>("bim");
  const [status, setStatus] = useState<Status>("idle");
  const [toastShow, setToastShow] = useState(false);
  const cfg = CONFIG[selected];
  const submitBtnRef = useMagnetic<HTMLButtonElement>();

  // Cards elsewhere on the site (e.g. the homepage "Talk to the Right Team"
  // block) link here with ?type=bim|interior|training so the right panel is
  // already selected when the visitor lands, instead of always defaulting
  // to BIM. Read after mount (not in a lazy useState initializer) so the
  // server-rendered "bim" markup matches the client's first render and only
  // switches panels once hydration is safely past — same hydration-mismatch
  // avoidance as the booking calendar's day highlights above.
  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get("type");
    if (type === "bim" || type === "interior" || type === "training") {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- intentionally deferred to the client, see comment above
      setSelected(type);
    }
  }, []);

  // Calendly's embed posts a window message when a visitor completes a
  // booking — no server-side API token needed. We forward it into the same
  // enquiries pipeline as every other form so it shows up in the dashboard.
  useEffect(() => {
    function onCalendlyMessage(e: MessageEvent) {
      const data = e.data as { event?: string; payload?: { event?: { uri?: string }; invitee?: { uri?: string } } };
      if (data?.event !== "calendly.event_scheduled") return;
      submitEnquiry("calendly-booking", {
        subject: "New Calendly booking",
        message: "A visitor booked a call through the Calendly widget on the contact page.",
        event_uri: data.payload?.event?.uri ?? "",
        invitee_uri: data.payload?.invitee?.uri ?? "",
      });
    }
    window.addEventListener("message", onCalendlyMessage);
    return () => window.removeEventListener("message", onCalendlyMessage);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = {
      subject: `New contact request — ${cfg.title}`,
      query_type: cfg.title,
    };
    formData.forEach((value, key) => {
      payload[key] = String(value);
    });

    const { ok } = await submitEnquiry("contact", payload);
    if (ok) {
      form.reset();
      setStatus("idle");
      setToastShow(true);
    } else {
      setStatus("error");
    }
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
                <input type="text" name="name" placeholder="Your name" required />
              </div>
              <div className="field">
                <label>{cfg.emailLabel}</label>
                <input type="email" name="email" placeholder="you@company.com" required />
              </div>
              <div className="field">
                <label>Phone / WhatsApp</label>
                <input type="tel" name="phone" placeholder="+91 00000 00000" required={cfg.phoneRequired} />
              </div>
              <div className="field">
                <label>{cfg.companyLabel}</label>
                <input type="text" name="company" placeholder="Optional" />
              </div>

              <div className="dynamic-wrap" key={selected}>
                <div className="dynamic-section-label">Details for {cfg.title.toLowerCase()}</div>
                {cfg.fields.map((f) => (
                  <div className="field" key={f.name}>
                    <label>{f.label}</label>
                    {f.type === "select" ? (
                      <select name={f.name} defaultValue="" required={f.required}>
                        <option value="">Select an option</option>
                        {f.options!.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input type="text" name={f.name} placeholder={f.placeholder || ""} required={f.required} />
                    )}
                  </div>
                ))}
              </div>

              <div className="field full">
                <label>{cfg.messageLabel}</label>
                <textarea name="message" placeholder={cfg.messagePlaceholder} required={cfg.messageRequired}></textarea>
              </div>
            </div>

            <div className="actions">
              <span className="hint">
                {status === "error" ? "Something went wrong — please try again or email us directly." : cfg.hint}
              </span>
              <button type="submit" className="submit" disabled={status === "submitting"} ref={submitBtnRef}>
                {status === "submitting" ? "Sending…" : cfg.submitLabel}
              </button>
            </div>
          </div>
        </form>

        <div className="office-strip">
          <EmailCard email={CONTACT_EMAIL} />
          <ContactMap />
        </div>

        <BookingCalendarCard url={CALENDLY_URL} />
        <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="lazyOnload" />
      </div>

      <Toast
        show={toastShow}
        message={`Request sent — routed to the ${cfg.route}.`}
        onDismiss={() => setToastShow(false)}
      />
    </div>
  );
}
