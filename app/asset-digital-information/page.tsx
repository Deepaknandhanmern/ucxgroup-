import type { Metadata } from "next";
import CapabilityPage, { type CapabilityItem } from "@/components/sections/CapabilityPage";
import CapabilityTabs from "@/components/sections/CapabilityTabs";
import { IconCube, IconTag, IconDatabase, IconBuildingGear, IconHandover } from "@/components/sections/capabilityIcons";

export const metadata: Metadata = {
  title: "Asset & Digital Information",
  description:
    "As-built BIM, COBie data, FM-ready models and digital twin workflows — turning project information into long-term asset value beyond construction.",
};

const ITEMS: CapabilityItem[] = [
  {
    title: "As-Built BIM",
    statement: "A Digital Record of the Built Asset",
    desc: "Develop as-built BIM models that reflect project conditions and provide structured information for downstream use.",
    deliverables: [
      "As-built BIM modelling",
      "Existing-condition updates",
      "Record documentation",
      "Model verification",
      "Asset-ready information",
    ],
    icon: IconCube,
  },
  {
    title: "Asset Information",
    statement: "From Model to Asset Data",
    desc: "Structure information about building components, systems and assets to support handover and operational requirements.",
    deliverables: [
      "Asset data structuring",
      "Equipment information",
      "Component data",
      "Information classification",
      "Asset registers",
    ],
    icon: IconTag,
  },
  {
    title: "COBie & Data",
    statement: "Structured Information for Handover",
    desc: "Support structured asset information and COBie-based workflows where required by project standards and client requirements.",
    deliverables: [
      "COBie data preparation",
      "Asset data mapping",
      "Information validation",
      "Data structuring",
      "Handover requirements",
    ],
    icon: IconDatabase,
  },
  {
    title: "FM Models",
    statement: "Digital Information for Facility Management",
    desc: "Prepare BIM and asset information workflows that support facility management and operational use.",
    deliverables: [
      "FM-ready BIM models",
      "Asset identification",
      "Space & equipment data",
      "Maintenance information",
      "Operational workflows",
    ],
    icon: IconBuildingGear,
  },
  {
    title: "Digital Handover & Digital Twin",
    statement: "Connecting Project Information With the Future Asset",
    desc: "Support digital handover and digital twin workflows by connecting geometry, asset information and structured project data.",
    deliverables: [
      "Digital handover",
      "Structured project data",
      "Asset information integration",
      "Lifecycle information",
      "Digital twin workflows",
    ],
    icon: IconHandover,
  },
];

export default function AssetDigitalInformationPage() {
  return (
    <CapabilityPage
      index="04"
      eyebrow="Capabilities"
      title="Asset & Digital Information"
      intro="Turning project information into long-term asset value. UCX structures digital information beyond construction to support as-built documentation, digital handover, facilities management and asset operations."
      process={["Capture", "Structure", "Handover"]}
      heroMotif={IconDatabase}
      heroImage="/brand/capabilities/asset-digital-information.webp"
      related={[
        { label: "BIM & Digital Delivery", href: "/bim-digital-delivery" },
        { label: "Project & Construction Support", href: "/project-construction-support" },
      ]}
      items={ITEMS}
    >
      <CapabilityTabs
        embedded
        eyebrow="Asset & Digital Information"
        heading="Explore Each Capability"
        description="Five connected workflows that turn project information into structured, handover-ready asset data."
        items={ITEMS}
      />
    </CapabilityPage>
  );
}
