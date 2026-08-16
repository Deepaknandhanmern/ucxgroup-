import type { Metadata } from "next";
import LabHero from "@/components/sections/LabHero";
import LabExplore from "@/components/sections/LabExplore";
import CollaborationLab from "@/components/sections/CollaborationLab";

export const metadata: Metadata = {
  title: "Collaboration Lab",
  description:
    "UCX's Collaboration Lab is where firms, technology partners and specialists co-create solutions across BIM, AI, prefabrication and smart assets — see what we're building together.",
};

export default function CollaborationLabPage() {
  return (
    <>
      <LabHero />
      <LabExplore />
      <CollaborationLab />
    </>
  );
}
