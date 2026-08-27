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
      updated="August 21, 2026"
      intro="This page explains what cookies and similar local storage ucx-group.com currently uses. We keep this deliberately minimal — this site does not run advertising or analytics tracking at this time."
      sections={[
        {
          heading: "What We Don't Use",
          body: [
            "We don't set advertising cookies, and we don't currently run any analytics or visitor-tracking cookies. If that changes in the future, this page will be updated and, where required, we'll ask for your consent first.",
          ],
        },
        {
          heading: "Local Storage We Do Use",
          body: [
            "This site uses your browser's sessionStorage — not a cookie, and never sent to our servers — to remember, for the current browser tab session only, that you've already seen the one-time intro animation on load, so it doesn't repeat every time you navigate.",
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
