import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/terms" },
  title: "Terms of Use",
  description: "The terms that govern your use of the UCX Group website, ucx-group.com.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Use"
      updated="August 21, 2026"
      intro="These terms govern your use of ucx-group.com. By browsing this site or submitting a form, you agree to them. If you don't agree, please don't use the site."
      sections={[
        {
          heading: "Use of This Site",
          body: [
            "This website is provided to share information about UCX Group's capabilities, projects and services, and to let you get in touch with us. You agree to use it only for lawful purposes and not to attempt to disrupt, scrape at scale, or gain unauthorised access to it.",
          ],
        },
        {
          heading: "Content & Intellectual Property",
          body: [
            "The text, project descriptions, graphics, logos and layout on this site belong to UCX Group or are used with permission, and are protected by copyright. You may view and share pages for personal or informational use, but may not reproduce, redistribute or reuse our content commercially without written permission.",
          ],
        },
        {
          heading: "Project & Case Study Information",
          body: [
            "Project examples, case studies and figures shown on this site are illustrative of our work and delivery approach. Specific outcomes for your project will depend on its own scope, requirements and constraints, and should be confirmed directly with our team.",
          ],
        },
        {
          heading: "No Warranty",
          body: [
            "This site is provided 'as is'. While we try to keep information accurate and up to date, we make no warranty that the site will be error-free, uninterrupted, or that its content is complete or current at all times.",
          ],
        },
        {
          heading: "Limitation of Liability",
          body: [
            "To the extent permitted by law, UCX Group is not liable for any indirect, incidental or consequential loss arising from your use of this website. Nothing in these terms limits liability that cannot lawfully be excluded.",
          ],
        },
        {
          heading: "External Links & Services",
          body: [
            "This site links to and embeds third-party services, including Calendly for scheduling. Your use of those services is governed by their own terms, which we don't control.",
          ],
        },
        {
          heading: "Governing Law",
          body: [
            "These terms are governed by the laws of India, and any disputes will be subject to the exclusive jurisdiction of the courts in Coimbatore, Tamil Nadu.",
          ],
        },
        {
          heading: "Changes to These Terms",
          body: [
            "We may update these terms from time to time. Continued use of the site after a change means you accept the revised terms.",
          ],
        },
        {
          heading: "Contact",
          body: ["Questions about these terms can be sent to collaborate@ucx-group.com."],
        },
      ]}
    />
  );
}
