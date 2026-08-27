import type { Metadata } from "next";
import CapabilityPage, { type CapabilityItem } from "@/components/sections/CapabilityPage";
import CapabilityTabs from "@/components/sections/CapabilityTabs";
import { IconCube, IconChip, IconNodes, IconCrane, IconAutomation } from "@/components/sections/capabilityIcons";

export const metadata: Metadata = {
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
