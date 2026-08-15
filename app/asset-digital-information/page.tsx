import CapabilityPage from "@/components/sections/CapabilityPage";
import { IconCube, IconTag, IconDatabase, IconBuildingGear, IconHandover } from "@/components/sections/capabilityIcons";

export default function AssetDigitalInformationPage() {
  return (
    <CapabilityPage
      index="04"
      eyebrow="Capabilities"
      title="Asset & Digital Information"
      intro="Structured information for handover and operations — models and data built to stay useful long after construction is complete."
      process={["Capture", "Structure", "Handover"]}
      heroMotif={IconDatabase}
      items={[
        { title: "As-Built BIM", desc: "Models updated to reflect what was actually built.", icon: IconCube },
        { title: "Asset Information", desc: "Structured asset data aligned to client requirements.", icon: IconTag },
        { title: "COBie & Data", desc: "Standards-based data exchange for handover.", icon: IconDatabase },
        { title: "FM Models", desc: "Models structured for facilities management use.", icon: IconBuildingGear },
        { title: "Digital Handover & Twin", desc: "Connected information ready for operational use.", icon: IconHandover },
      ]}
    />
  );
}
