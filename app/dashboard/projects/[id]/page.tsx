import { notFound } from "next/navigation";
import ProjectEditor from "@/components/dashboard/ProjectEditor";
import { getProjectById } from "@/lib/projects-db";

// No generateStaticParams here, so this is already an on-demand dynamic
// route by default — force-dynamic just makes that explicit.
export const dynamic = "force-dynamic";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = getProjectById(Number(id));
  if (!row) notFound();

  // node:sqlite rows aren't plain objects, which the Server → Client
  // Component boundary can't serialize — spread into a plain literal first.
  const project = { ...row };

  return (
    <div>
      <h1 className="mb-6 font-getho text-2xl font-bold text-neutral-900">Edit Project</h1>
      <ProjectEditor project={project} />
    </div>
  );
}
