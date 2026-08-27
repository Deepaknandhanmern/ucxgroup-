import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/cookies" },
  title: "Cookie Policy",
  description: "What cookies and similar local storage this website uses, and why.",
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookie Policy"
      updated="August 27, 2026"
      intro="This page explains what cookies and similar local storage ucx-group.com uses, and why. We keep this deliberately minimal — the only tracking cookie is Google Analytics, and it only runs if you accept it in the cookie banner shown on your first visit."
      sections={[
        {
          heading: "Analytics Cookies (Opt-In)",
          body: [
            "With your consent, we use Google Analytics (GA4) to understand how visitors use this site — which pages are viewed, general location, and device type. This helps us improve the site. Google Analytics does not run until you accept it via the cookie banner.",
            "We don't set advertising cookies, and we don't use tracking for any purpose beyond this.",
          ],
        },
        {
          heading: "Local Storage We Do Use",
          body: [
            "This site uses your browser's localStorage to remember your cookie consent choice, and sessionStorage — neither is a cookie, and neither is sent to our servers — to remember, for the current browser tab session only, that you've already seen the one-time intro animation on load, so it doesn't repeat every time you navigate.",
          ],
        },
        {
          heading: "Third-Party Cookies",
          body: [
            "If you open the Calendly booking widget on our Contact page, Calendly may set its own cookies to run the scheduling flow. Those are set and controlled by Calendly, not by UCX — see Calendly's own privacy and cookie policy for details.",
          ],
        },
        {
          heading: "Managing Cookies",
          body: [
            "You can clear or block cookies at any time through your browser settings. Since we don't rely on tracking cookies for this site to function, doing so won't affect your ability to browse or use the contact form.",
            "To change your consent choice, clear this site's data in your browser (or clear your cookies/site storage) — the consent banner will reappear on your next visit.",
          ],
        },
        {
          heading: "Contact",
          body: ["Questions about this policy can be sent to collaborate@ucx-group.com."],
        },
      ]}
    />
  );
}
