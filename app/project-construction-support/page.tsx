import type { Metadata } from "next";
import CapabilityPage, { type CapabilityItem } from "@/components/sections/CapabilityPage";
import CapabilityTabs from "@/components/sections/CapabilityTabs";
import { IconDocument, IconGauge, IconBars, IconShieldCheck, IconWrench } from "@/components/sections/capabilityIcons";

export const metadata: Metadata = {
  alternates: { canonical: "/project-construction-support" },
  title: "Project & Construction Support",
  description:
    "Structured project documentation, QA/QC, project controls and execution support — helping teams manage demanding delivery schedules with coordinated information.",
};

const ITEMS: CapabilityItem[] = [
  {
    title: "Project Documentation",
    statement: "Structured Information for Project Delivery",
    desc: "Develop and manage coordinated project information for construction and delivery requirements.",
    deliverables: [
      "Construction documentation",
      "Drawing production",
      "Drawing management",
      "Model documentation",
      "Revision management",
      "Project information",
    ],
    icon: IconDocument,
    image: "/brand/capabilities/tabs/project-documentation.webp",
    noteLabel: "Ideal for",
    noteText: "Architects, consultants and contractors requiring accurate, coordinated and well-managed project information.",
  },
  {
    title: "Project Controls",
    statement: "Better Visibility Across Project Information",
    desc: "Support teams with structured tracking of project progress, information and deliverables.",
    deliverables: [
      "Progress tracking",
      "Information tracking",
      "Model and drawing status",
      "Coordination tracking",
      "Reporting",
      "Dashboard support",
    ],
    icon: IconGauge,
    image: "/brand/capabilities/tabs/project-controls.webp",
    noteLabel: "Client benefit",
    noteText: "Better visibility of project information, progress and deliverables for improved tracking and decision-making.",
  },
  {
    title: "Quantity & Data Extraction",
    statement: "Turning Digital Models Into Usable Project Data",
    desc: "Extract structured quantities and project information from digital models for informed decision-making.",
    deliverables: [
      "Quantity extraction",
      "Model-based quantities",
      "Schedules",
      "Data structuring",
      "Material information",
      "Reporting",
    ],
    icon: IconBars,
    image: "/brand/capabilities/tabs/quantity-data-extraction.webp",
    noteLabel: "Client benefit",
    noteText: "Reliable model-based quantities and structured data to support planning, cost visibility and informed decision-making.",
  },
  {
    title: "QA/QC",
    statement: "Quality Built Into the Delivery Workflow",
    desc: "Apply structured quality checks to improve accuracy, consistency and compliance across project outputs.",
    deliverables: [
      "BIM QA/QC",
      "Drawing checks",
      "Standards compliance",
      "Information validation",
      "Coordination checks",
      "Deliverable review",
    ],
    icon: IconShieldCheck,
    image: "/brand/capabilities/tabs/qa-qc.webp",
    noteLabel: "Client benefit",
    noteText: "Improved accuracy, consistency and compliance through structured quality checks and early issue identification.",
  },
  {
    title: "Execution & Coordination Support",
    statement: "Supporting Teams Beyond Documentation",
    desc: "Support project teams beyond documentation through coordinated execution and delivery workflows.",
    deliverables: [
      "Construction coordination",
      "Vendor coordination",
      "Procurement support",
      "Site information support",
      "Fabrication coordination",
      "Execution documentation",
    ],
    icon: IconWrench,
    image: "/brand/capabilities/tabs/execution-coordination-support.webp",
    noteLabel: "Client benefit",
    noteText: "Better coordination between design, procurement, fabrication and site teams for smoother project execution.",
  },
];

const FAQS = [
  {
    q: "What is Project & Construction Support?",
    a: "Structured project documentation, QA/QC, project controls and execution support — helping teams manage demanding delivery schedules with coordinated information.",
  },
  {
    q: "Does UCX handle quantity takeoffs from BIM models?",
    a: "Yes. Quantity & Data Extraction covers model-based quantities, schedules, material information and reporting, turning digital models into usable project data.",
  },
  {
    q: "What QA/QC processes does UCX apply?",
    a: "BIM QA/QC, drawing checks, standards compliance, information validation, coordination checks and deliverable review — quality built into the delivery workflow.",
  },
  {
    q: "Does UCX support site-level coordination, not just documentation?",
    a: "Yes. Execution & Coordination Support covers construction coordination, vendor coordination, procurement support, site information support and fabrication coordination.",
  },
];

export default function ProjectConstructionSupportPage() {
  return (
    <CapabilityPage
      index="03"
      eyebrow="Capabilities"
      title="Project & Construction Support"
      intro="Supporting teams with coordinated information and delivery capability. UCX provides structured project documentation, QA/QC, project controls and execution support to help teams manage demanding project requirements and delivery schedules."
      process={["Document", "Control", "Support"]}
      heroMotif={IconDocument}
      heroImage="/brand/capabilities/project-construction-support.webp"
      related={[
        { label: "BIM & Digital Delivery", href: "/bim-digital-delivery" },
        { label: "Asset & Digital Information", href: "/asset-digital-information" },
      ]}
      items={ITEMS}
      faqs={FAQS}
    >
      <CapabilityTabs
        embedded
        eyebrow="Project & Construction Support"
        heading="Explore Each Capability"
        description="Five coordinated workflows that keep documentation, controls and quality aligned through delivery."
        items={ITEMS}
      />
    </CapabilityPage>
  );
}
