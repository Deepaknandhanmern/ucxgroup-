import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import SectionRail from "@/components/ui/SectionRail";

const TITLE = "Contact";
const DESCRIPTION =
  "Start a conversation with UCX — reach our Coimbatore studio to discuss BIM, design, delivery or asset information support for your next project.";

export const metadata: Metadata = {
  alternates: { canonical: "/contact" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    url: "https://ucx-group.com/contact",
    type: "website",
    images: ["/brand/social.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    images: ["/brand/social.png"],
  },
};

const RAIL_SECTIONS = [
  { id: "contact-form", label: "Get in Touch" },
  { id: "faq", label: "FAQ" },
];

export default function ContactPage() {
  return (
    <>
      <SectionRail sections={RAIL_SECTIONS} />
      <ContactForm />
      <FAQ />
    </>
  );
}
