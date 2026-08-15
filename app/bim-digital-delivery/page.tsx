import CapabilityPage from "@/components/sections/CapabilityPage";
import { IconCube, IconChip, IconNodes, IconCrane, IconAutomation } from "@/components/sections/capabilityIcons";

export default function BimDigitalDeliveryPage() {
  return (
    <CapabilityPage
      index="01"
      eyebrow="Capabilities"
      title="BIM & Digital Delivery"
      intro="Digital engineering from design through construction — connected models, coordinated teams and data that carries through every stage of delivery."
      process={["Model", "Coordinate", "Deliver"]}
      heroMotif={IconCube}
      heroImage="/brand/capabilities/bim-digital-delivery.jpg"
      items={[
        { title: "BIM & VDC", desc: "Coordinated, model-based design and virtual construction.", icon: IconCube },
        { title: "Digital Engineering", desc: "Technology-led workflows across the project lifecycle.", icon: IconChip },
        { title: "BIM Coordination", desc: "Clash detection and cross-discipline model coordination.", icon: IconNodes },
        { title: "Digital Construction", desc: "Model-driven support through construction on site.", icon: IconCrane },
        { title: "Automation & 4D/5D", desc: "Scheduling and cost simulation linked to the model.", icon: IconAutomation },
      ]}
    />
  );
}
