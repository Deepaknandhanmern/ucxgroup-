import type { Metadata } from "next";
import CapabilityPage, { type CapabilityItem } from "@/components/sections/CapabilityPage";
import CapabilityTabs from "@/components/sections/CapabilityTabs";
import { IconScan, IconPrefab, IconHeritage, IconSpark, IconParametric } from "@/components/sections/capabilityIcons";

export const metadata: Metadata = {
  alternates: { canonical: "/specialist-solutions" },
  title: "Specialist Solutions",
  description:
    "Scan-to-BIM, prefabrication, heritage & restoration, BIM automation & AI, and parametric systems — engineering beyond the standard delivery scope.",
};

const ITEMS: CapabilityItem[] = [
  {
    title: "Scan-to-BIM",
    statement: "Reality Capture → Digital Model",
    desc: "Transform existing buildings and assets into accurate, structured BIM environments.",
    deliverables: [
      "Reality capture integration",
      "Existing-condition modelling",
      "Point cloud to BIM",
      "As-built documentation",
      "BIM-ready asset information",
    ],
    icon: IconScan,
    image: "/brand/capabilities/tabs/scan-to-bim.webp",
  },
  {
    title: "Prefabrication",
    statement: "BIM → Fabrication → Assembly",
    desc: "Connect digital design with fabrication and modular construction workflows.",
    deliverables: [
      "BIM-to-fabrication workflows",
      "Fabrication-ready modelling",
      "Modular design systems",
      "Shop drawing support",
      "Assembly coordination",
    ],
    icon: IconPrefab,
    image: "/brand/capabilities/tabs/prefabrication.webp",
  },
  {
    title: "Heritage & Restoration Projects",
    statement: "Document → Understand → Preserve",
    desc: "Digitally document and model complex existing and heritage assets for informed restoration and preservation.",
    deliverables: [
      "Heritage documentation",
      "Existing-condition modelling",
      "Scan-based documentation",
      "Restoration support",
      "Digital asset records",
    ],
    icon: IconHeritage,
    image: "/brand/capabilities/tabs/heritage-restoration.webp",
  },
  {
    title: "BIM Automation & AI",
    statement: "Data → Automation → Better Decisions",
    desc: "Technology-assisted workflows designed to improve productivity, consistency and information management.",
    deliverables: [
      "BIM workflow automation",
      "Automated documentation",
      "Data extraction & processing",
      "AI-assisted workflows",
      "Quality & productivity enhancement",
    ],
    icon: IconSpark,
    image: "/brand/capabilities/tabs/bim-automation-ai.webp",
  },
  {
    title: "Parametric Systems",
    statement: "Design → Logic → Adaptability",
    desc: "Data-driven design systems that create flexible, repeatable and fabrication-ready solutions across projects.",
    deliverables: [
      "Parametric design systems",
      "Rule-based modelling",
      "Configurable components",
      "Custom furniture systems",
      "Fabrication-ready solutions",
    ],
    icon: IconParametric,
    image: "/brand/capabilities/tabs/parametric-systems.webp",
  },
];

const FAQS = [
  {
    q: "What specialist solutions does UCX offer?",
    a: "Scan-to-BIM, prefabrication, heritage & restoration, BIM automation & AI, and parametric systems — engineering beyond the standard delivery scope for project challenges that need specialised workflows.",
  },
  {
    q: "What is Scan-to-BIM?",
    a: "Transforming existing buildings and assets into accurate, structured BIM environments through reality capture integration, point-cloud-to-BIM conversion and as-built documentation.",
  },
  {
    q: "Can UCX digitally document heritage buildings?",
    a: "Yes. Heritage & Restoration Projects digitally document and model complex existing and heritage assets — existing-condition modelling, scan-based documentation and restoration support — for informed preservation.",
  },
  {
    q: "Does UCX use AI in BIM workflows?",
    a: "Yes. BIM Automation & AI applies technology-assisted workflows — automated documentation, data extraction & processing and AI-assisted workflows — to improve productivity, consistency and information management.",
  },
];

export default function SpecialistSolutionsPage() {
  return (
    <CapabilityPage
      index="05"
      eyebrow="Specialist Solutions"
      title="Engineering Beyond the Standard"
      intro="Some project challenges require specialised workflows. UCX applies BIM, digital engineering and design technology to address specific delivery requirements."
      process={["Identify", "Apply", "Deliver"]}
      heroMotif={IconScan}
      heroImage="/brand/capabilities/specialist-solutions.webp"
      related={[
        { label: "BIM & Digital Delivery", href: "/bim-digital-delivery" },
        { label: "Design & Interiors", href: "/design-interiors" },
        { label: "Asset & Digital Information", href: "/asset-digital-information" },
      ]}
      items={ITEMS}
      faqs={FAQS}
    >
      <CapabilityTabs
        embedded
        eyebrow="Specialist Solutions"
        heading="Explore Each Capability"
        description="Five specialised workflows that extend standard BIM and digital delivery to address specific project challenges."
        items={ITEMS}
      />
    </CapabilityPage>
  );
}
