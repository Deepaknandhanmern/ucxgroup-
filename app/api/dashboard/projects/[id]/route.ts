import { NextResponse } from "next/server";
import { getProjectById, updateProject, deleteProject, makeUniqueSlug, type ProjectInput } from "@/lib/projects-db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = getProjectById(Number(id));
  if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ project });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  const existing = getProjectById(projectId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Partial<ProjectInput> | null;
  if (!body?.title || !body.summary) {
    return NextResponse.json({ error: "Title and summary are required." }, { status: 400 });
  }

  // Re-slug only if the title actually changed, so existing links to the project keep working.
  const slug = body.title !== existing.title ? makeUniqueSlug(body.title, projectId) : existing.slug;

  const project = updateProject(projectId, {
    slug,
    cat: body.cat ?? existing.cat,
    interiorCategory: body.interiorCategory ?? null,
    digitalCategory: body.digitalCategory ?? null,
    title: body.title,
    location: body.location ?? "",
    discipline: body.discipline ?? "",
    stage: body.stage ?? "",
    technology: Array.isArray(body.technology) ? body.technology : [],
    image: body.image ?? "",
    summary: body.summary,
    body: Array.isArray(body.body) ? body.body : [],
    scope: Array.isArray(body.scope) ? body.scope : [],
  });

  return NextResponse.json({ project });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const projectId = Number(id);
  if (!getProjectById(projectId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  deleteProject(projectId);
  return NextResponse.json({ ok: true });
}
