import type { Metadata } from "next";
import CompanyHero from "@/components/sections/CompanyHero";
import OurApproach from "@/components/sections/OurApproach";
import EngineeringPurpose from "@/components/sections/EngineeringPurpose";
import StudioInterlude from "@/components/sections/StudioInterlude";
import Founders from "@/components/sections/Founders";
import BuildingEcosystem from "@/components/sections/BuildingEcosystem";
import Workspace from "@/components/sections/Workspace";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "UCX is an engineering-led delivery ecosystem built around design, digital engineering, project delivery and asset information — meet the studio and the founders behind it.",
};

export default function AboutUsPage() {
  return (
    <>
      <CompanyHero />
      <OurApproach />
      <EngineeringPurpose />
      <StudioInterlude />
      <Founders />
      <BuildingEcosystem />
      <Workspace />
    </>
  );
}
