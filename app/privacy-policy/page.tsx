import type { Metadata } from "next";
import LegalPage from "@/components/sections/LegalPage";

export const metadata: Metadata = {
  alternates: { canonical: "/privacy-policy" },
  title: "Privacy Policy",
  description: "How UCX Group collects, uses and protects information submitted through this website.",
};

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="August 21, 2026"
      intro="This policy explains what information UCX Group ('UCX', 'we', 'us') collects through ucx-group.com, how it's used, and the choices you have. It applies to this website only."
      sections={[
        {
          heading: "Information We Collect",
          body: [
            "Contact and enquiry details you submit through our forms — name, email address, phone number, company name, and the message or project details you provide — on the Contact, Case Studies, Resources and Careers pages.",
            "Scheduling information if you book a call through our Calendly integration, which is handled directly by Calendly under its own privacy policy.",
            "Basic technical information any website receives automatically, such as your browser type and general usage of the site, which we do not currently combine with analytics or advertising tracking.",
          ],
        },
        {
          heading: "How We Use Information",
          body: [
            "To respond to enquiries, route your request to the right team, and follow up on project discussions or job applications.",
            "To send you requested materials, such as a case study or resource you asked to download.",
            "We do not sell your information, and we do not use it for advertising or share it with third parties for their own marketing purposes.",
          ],
        },
        {
          heading: "Third-Party Services",
          body: [
            "Call scheduling is handled through Calendly. When you open the booking widget or complete a booking, Calendly may set its own cookies and process your information under its own privacy policy.",
          ],
        },
        {
          heading: "Data Retention",
          body: [
            "We retain enquiry and application information for as long as reasonably necessary to respond to your request, maintain business records, or comply with legal obligations, and then delete or anonymise it.",
          ],
        },
        {
          heading: "Your Rights",
          body: [
            "You can ask us what information we hold about you, request a correction, or ask us to delete it, by emailing collaborate@ucx-group.com. We'll respond within a reasonable time.",
          ],
        },
        {
          heading: "Changes to This Policy",
          body: [
            "We may update this policy from time to time. The date at the top of this page reflects the most recent revision.",
          ],
        },
        {
          heading: "Contact",
          body: [
            "UCX Engineering Technologies, Part LCC Compound, 1-3, Trichy Rd, opposite Srivari Trisara, Singanallur, Coimbatore, Tamil Nadu 641005, India.",
            "Email: collaborate@ucx-group.com",
          ],
        },
      ]}
    />
  );
}
