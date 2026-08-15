import CapabilityPage from "@/components/sections/CapabilityPage";
import { IconDocument, IconGauge, IconBars, IconShieldCheck, IconWrench } from "@/components/sections/capabilityIcons";

export default function ProjectConstructionSupportPage() {
  return (
    <CapabilityPage
      index="03"
      eyebrow="Capabilities"
      title="Project & Construction Support"
      intro="Coordinated support for project delivery — documentation, controls and quality management that keep every stage of a project on track."
      process={["Document", "Control", "Support"]}
      heroMotif={IconDocument}
      items={[
        { title: "Project Documentation", desc: "Structured, accurate documentation across project stages.", icon: IconDocument },
        { title: "Project Controls", desc: "Tracking scope, schedule and progress against plan.", icon: IconGauge },
        { title: "Quantity & Data", desc: "Reliable quantities and data extracted from the model.", icon: IconBars },
        { title: "QA/QC", desc: "Quality assurance and control across deliverables.", icon: IconShieldCheck },
        { title: "Execution Support", desc: "Hands-on support through delivery and construction.", icon: IconWrench },
      ]}
    />
  );
}
