import { notFound } from "next/navigation";
import { PROJECTS, getProject } from "@/lib/projects";
import ProjectDetail from "@/components/sections/ProjectDetail";

export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const more = PROJECTS.filter((p) => p.slug !== project.slug).slice(0, 3);

  return <ProjectDetail project={project} more={more} />;
}
