import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";
import SectionRail from "@/components/ui/SectionRail";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with UCX — reach our Coimbatore studio to discuss BIM, design, delivery or asset information support for your next project.",
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
