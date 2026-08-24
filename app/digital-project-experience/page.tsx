import type { Metadata } from "next";
import DigitalProjectExperience from "@/components/sections/DigitalProjectExperience";
import { getAllProjects } from "@/lib/projects-content";

// Reads projects straight from the dashboard's database on every request —
// never statically prerendered, so edits show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Digital Project Experience",
  description:
    "Technology-led delivery for complex project requirements — BIM, digital engineering, coordination, automation and structured information workflows across UCX's project experience.",
};

export default function DigitalProjectExperiencePage() {
  return <DigitalProjectExperience projects={getAllProjects()} />;
}
