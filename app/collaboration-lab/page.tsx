import type { Metadata } from "next";
import LabHero from "@/components/sections/LabHero";
import LabExplore from "@/components/sections/LabExplore";
import CollaborationLab from "@/components/sections/CollaborationLab";
import SectionRail from "@/components/ui/SectionRail";

export const metadata: Metadata = {
  alternates: { canonical: "/collaboration-lab" },
  title: "Collaboration Lab",
  description:
    "UCX's Collaboration Lab is where firms, technology partners and specialists co-create solutions across BIM, AI, prefabrication and smart assets — see what we're building together.",
};

const RAIL_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "domains", label: "Collaboration Domains" },
  { id: "open-challenges", label: "Open Challenges" },
  { id: "ways-to-collaborate", label: "Ways to Collaborate" },
  { id: "get-started", label: "Get Started" },
];

export default function CollaborationLabPage() {
  return (
    <>
      <SectionRail sections={RAIL_SECTIONS} />
      <LabHero />
      <LabExplore />
      <CollaborationLab />
    </>
  );
}
