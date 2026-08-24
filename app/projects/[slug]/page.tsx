import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProjects, getProject } from "@/lib/projects-content";
import ProjectDetail from "@/components/sections/ProjectDetail";

// Reads the project straight from the dashboard's database on every request
// — never statically prerendered (no generateStaticParams), so a newly
// added or edited project is live immediately without a rebuild.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  return {
    title: project.title,
    description: project.summary,
    openGraph: { title: project.title, description: project.summary, images: [project.image] },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const more = getAllProjects()
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  return <ProjectDetail project={project} more={more} />;
}
