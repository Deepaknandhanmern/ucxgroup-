import type { Metadata } from "next";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import { getAllProjects } from "@/lib/projects-content";

// Reads projects straight from the dashboard's database on every request —
// never statically prerendered, so edits show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Built Environment",
  description:
    "Selected project experience across BIM coordination, interiors, construction support and asset information — real delivery across sectors and geographies.",
  openGraph: {
    title: "Built Environment | UCX Group",
    description:
      "Selected project experience across BIM coordination, interiors, construction support and asset information — real delivery across sectors and geographies.",
    url: "https://ucx-group.com/projects",
    type: "website",
  },
};

export default function ProjectsPage() {
  return <FeaturedProjects projects={getAllProjects()} />;
}
