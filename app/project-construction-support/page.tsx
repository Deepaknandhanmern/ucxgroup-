import type { Metadata } from "next";
import CapabilityPage from "@/components/sections/CapabilityPage";
import { IconDocument, IconGauge, IconBars, IconShieldCheck, IconWrench } from "@/components/sections/capabilityIcons";

export const metadata: Metadata = {
  title: "Project & Construction Support",
  description:
    "Structured project documentation, QA/QC, project controls and execution support — helping teams manage demanding delivery schedules with coordinated information.",
};

export default function ProjectConstructionSupportPage() {
  return (
    <CapabilityPage
      index="03"
      eyebrow="Capabilities"
      title="Project & Construction Support"
      intro="Supporting teams with coordinated information and delivery capability. UCX provides structured project documentation, QA/QC, project controls and execution support to help teams manage demanding project requirements and delivery schedules."
      process={["Document", "Control", "Support"]}
      heroMotif={IconDocument}
      heroImage="/brand/capabilities/project-construction-support.jpg"
      items={[
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
        },
      ]}
    />
  );
}
