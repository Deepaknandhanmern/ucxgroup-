"use client";

import { useEffect, useState } from "react";

export const CONSENT_KEY = "ucx-cookie-consent";
export const CONSENT_EVENT = "ucx-cookie-consent-changed";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setVisible(true);
    } catch {
      // localStorage unavailable — skip the banner rather than block rendering
    }
  }, []);

  function choose(value: "accepted" | "rejected") {
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      // ignore — worst case the banner reappears next visit
    }
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: value }));
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="ucx-cookies" role="dialog" aria-label="Cookie consent">
      <p className="ucx-cookies-text">
        We use analytics cookies to understand how visitors use this site. See our{" "}
        <a href="/cookies">Cookie Policy</a>.
      </p>
      <div className="ucx-cookies-actions">
        <button type="button" className="ucx-cookies-decline" onClick={() => choose("rejected")}>
          Decline
        </button>
        <button type="button" className="ucx-cookies-accept" onClick={() => choose("accepted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
