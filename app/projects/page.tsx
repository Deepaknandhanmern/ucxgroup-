import type { Metadata } from "next";
import FeaturedProjects from "@/components/sections/FeaturedProjects";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Selected project experience across BIM coordination, interiors, construction support and asset information — real delivery across sectors and geographies.",
};

export default function ProjectsPage() {
  return <FeaturedProjects />;
}
