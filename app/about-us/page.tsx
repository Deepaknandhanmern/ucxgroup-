import type { Metadata } from "next";
import CompanyHero from "@/components/sections/CompanyHero";
import OurApproach from "@/components/sections/OurApproach";
import EngineeringPurpose from "@/components/sections/EngineeringPurpose";
import Founders from "@/components/sections/Founders";
import BuildingEcosystem from "@/components/sections/BuildingEcosystem";
import Workspace from "@/components/sections/Workspace";
import SectionRail from "@/components/ui/SectionRail";

const TITLE = "About Us";
const DESCRIPTION =
  "UCX is an engineering-led delivery ecosystem built around design, digital engineering, project delivery and asset information — meet the studio and the founders behind it.";

export const metadata: Metadata = {
  alternates: { canonical: "/about-us" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    url: "https://ucx-group.com/about-us",
    type: "website",
    images: ["/brand/social.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    images: ["/brand/social.png"],
  },
};

const RAIL_SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "approach", label: "Our Approach" },
  { id: "purpose", label: "Our Purpose" },
  { id: "founders", label: "Leadership & Team" },
  { id: "ecosystem", label: "Ecosystem" },
  { id: "workspace", label: "Our Workspace" },
];

export default function AboutUsPage() {
  return (
    <>
      <SectionRail sections={RAIL_SECTIONS} />
      <CompanyHero />
      <OurApproach />
      <EngineeringPurpose />
      <Founders />
      <BuildingEcosystem />
      <Workspace />
    </>
  );
}
