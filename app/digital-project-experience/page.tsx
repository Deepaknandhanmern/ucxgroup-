import type { Metadata } from "next";
import DigitalProjectExperience from "@/components/sections/DigitalProjectExperience";

export const metadata: Metadata = {
  title: "Digital Project Experience",
  description:
    "Technology-led delivery for complex project requirements — BIM, digital engineering, coordination, automation and structured information workflows across UCX's project experience.",
};

export default function DigitalProjectExperiencePage() {
  return <DigitalProjectExperience />;
}
