import type { Metadata } from "next";
import ContactForm from "@/components/sections/ContactForm";
import FAQ from "@/components/sections/FAQ";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Start a conversation with UCX — reach our Coimbatore studio to discuss BIM, design, delivery or asset information support for your next project.",
};

export default function ContactPage() {
  return (
    <>
      <ContactForm />
      <FAQ />
    </>
  );
}
