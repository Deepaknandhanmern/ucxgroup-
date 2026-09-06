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
    keywords: [project.location, project.discipline, ...project.technology],
    alternates: { canonical: `/projects/${project.slug}` },
    openGraph: {
      type: "article",
      title: project.title,
      description: project.summary,
      images: [project.image],
      publishedTime: project.createdAt,
      modifiedTime: project.updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.summary,
      images: [project.image],
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const more = getAllProjects()
    .filter((p) => p.slug !== project.slug)
    .slice(0, 3);

  const projectJsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.summary,
    image: project.image,
    dateCreated: project.createdAt,
    dateModified: project.updatedAt,
    locationCreated: { "@type": "Place", name: project.location },
    keywords: project.technology.join(", "),
    creator: { "@type": "Organization", name: "UCX Group" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(projectJsonLd) }} />
      <ProjectDetail project={project} more={more} />
    </>
  );
}
