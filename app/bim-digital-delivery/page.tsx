import type { Metadata } from "next";
import CapabilityPage, { type CapabilityItem } from "@/components/sections/CapabilityPage";
import CapabilityTabs from "@/components/sections/CapabilityTabs";
import { IconCube, IconChip, IconNodes, IconCrane, IconAutomation } from "@/components/sections/capabilityIcons";

export const metadata: Metadata = {
  alternates: { canonical: "/bim-digital-delivery" },
  title: "BIM & Digital Delivery",
  description:
    "Coordinated BIM, digital engineering, clash-resolved coordination and 4D/5D automation — building coordinated digital environments for complex projects.",
};

const ITEMS: CapabilityItem[] = [
  {
    title: "BIM & VDC",
    statement: "Coordinated BIM for Multidisciplinary Projects",
    desc: "Develop coordinated Building Information Models that bring architectural, structural and MEP information together within a structured project environment.",
    deliverables: [
      "Architectural BIM",
      "Structural BIM",
      "MEP BIM",
      "Multidisciplinary coordination",
      "Model development",
      "BIM documentation",
      "Clash detection support",
    ],
    icon: IconCube,
    image: "/brand/capabilities/tabs/bim-vdc.webp",
    noteLabel: "Ideal for",
    noteText: "Architects, consultants, contractors and developers seeking accurate, coordinated project models.",
  },
  {
    title: "Digital Engineering",
    statement: "Engineering Information Connected Through Digital Workflows",
    desc: "Support engineering and project teams with structured digital models, coordinated information and documentation workflows designed around project requirements.",
    deliverables: [
      "Digital modelling",
      "Engineering documentation",
      "Model-based workflows",
      "Design coordination",
      "Information structuring",
      "Digital QA/QC",
    ],
    icon: IconChip,
    image: "/brand/capabilities/tabs/digital-engineering.webp",
    noteLabel: "Client benefit",
    noteText: "Better-connected engineering information, fewer coordination gaps and more reliable project documentation.",
  },
  {
    title: "BIM Coordination",
    statement: "Coordinate Before Construction",
    desc: "Identify and resolve design and spatial conflicts through structured BIM coordination before they become construction issues.",
    deliverables: [
      "Multidisciplinary coordination",
      "Clash detection",
      "Coordination meetings",
      "Issue tracking",
      "Model review",
      "Coordination reports",
      "Design review support",
    ],
    icon: IconNodes,
    image: "/brand/capabilities/tabs/bim-coordination.webp",
    noteLabel: "Client benefit",
    noteText: "Fewer site conflicts, reduced rework and greater confidence before construction begins.",
  },
  {
    title: "Digital Construction",
    statement: "Turning Models Into Construction Information",
    desc: "Connect BIM information with construction planning, sequencing and project delivery workflows.",
    deliverables: [
      "Construction modelling",
      "4D BIM",
      "5D BIM",
      "Quantity workflows",
      "Constructability support",
      "Site coordination",
      "Digital construction workflows",
    ],
    icon: IconCrane,
    image: "/brand/capabilities/tabs/digital-construction.webp",
    noteLabel: "Client benefit",
    noteText: "Better planning, improved quantity visibility and stronger coordination between design and site execution.",
  },
  {
    title: "Automation & 4D/5D",
    statement: "Making Project Information Work Harder",
    desc: "Use automation, structured data and visualisation to improve repetitive workflows, information quality and project decision-making.",
    deliverables: [
      "Dynamo workflows",
      "Python automation",
      "Quantity extraction",
      "Model-based data",
      "4D sequencing",
      "5D workflows",
      "Power BI dashboards",
      "AI-assisted workflows",
    ],
    icon: IconAutomation,
    image: "/brand/capabilities/tabs/automation-4d5d.webp",
    noteLabel: "Client benefit",
    noteText: "Faster processes, consistent project information and reduced repetitive work.",
  },
];

const FAQS = [
  {
    q: "What is BIM & Digital Delivery?",
    a: "It's UCX's core capability for building coordinated digital environments for complex projects — BIM services, digital engineering and VDC workflows that improve coordination, documentation and construction readiness.",
  },
  {
    q: "Who is BIM & Digital Delivery for?",
    a: "Architects, engineers, contractors and developers who need coordinated, multidisciplinary BIM models rather than siloed design files.",
  },
  {
    q: "What does BIM coordination involve?",
    a: "Identifying and resolving design and spatial conflicts through structured BIM coordination before they become construction issues — including clash detection, coordination meetings, issue tracking and coordination reports.",
  },
  {
    q: "Can UCX support 4D and 5D BIM?",
    a: "Yes. UCX's Automation & 4D/5D workflows cover Dynamo and Python automation, quantity extraction, 4D sequencing, 5D workflows, Power BI dashboards and AI-assisted workflows.",
  },
];

export default function BimDigitalDeliveryPage() {
  return (
    <CapabilityPage
      index="01"
      eyebrow="Capabilities"
      title="BIM & Digital Delivery"
      intro="Building coordinated digital environments for complex projects. UCX supports architects, engineers, contractors and developers with BIM services, digital engineering and VDC workflows that improve coordination, documentation and construction readiness."
      process={["Model", "Coordinate", "Deliver"]}
      heroMotif={IconCube}
      heroImage="/brand/capabilities/bim-digital-delivery.webp"
      related={[
        { label: "Design & Interiors", href: "/design-interiors" },
        { label: "Asset & Digital Information", href: "/asset-digital-information" },
        { label: "Specialist Solutions", href: "/specialist-solutions" },
      ]}
      items={ITEMS}
      faqs={FAQS}
    >
      <CapabilityTabs
        embedded
        eyebrow="BIM & Digital Delivery"
        heading="Explore Each Capability"
        description="Five connected workflows that take a project from coordinated model to construction-ready information."
        items={ITEMS}
      />
    </CapabilityPage>
  );
}
