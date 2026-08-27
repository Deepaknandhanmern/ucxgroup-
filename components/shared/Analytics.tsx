"use client";

import { useEffect, useState } from "react";
import Script from "next/script";
import { CONSENT_EVENT, CONSENT_KEY } from "@/components/ui/CookieConsent";

// Renders nothing until NEXT_PUBLIC_GA_ID is set (locally in .env.local, or
// as an env var on the host) — so dev and any environment without a real
// GA4 property never sends traffic to Google — and, separately, nothing
// until the visitor has accepted the cookie consent banner.
export default function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    try {
      setConsented(localStorage.getItem(CONSENT_KEY) === "accepted");
    } catch {
      // localStorage unavailable — stay opted out
    }

    function onConsentChange(e: Event) {
      setConsented((e as CustomEvent<string>).detail === "accepted");
    }
    window.addEventListener(CONSENT_EVENT, onConsentChange);
    return () => window.removeEventListener(CONSENT_EVENT, onConsentChange);
  }, []);

  if (!gaId || !consented) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </Script>
    </>
  );
}
