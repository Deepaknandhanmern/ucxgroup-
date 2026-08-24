import { NextResponse } from "next/server";
import { listProjects, createProject, makeUniqueSlug, type ProjectInput } from "@/lib/projects-db";

export async function GET() {
  return NextResponse.json({ projects: listProjects() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<ProjectInput> | null;
  if (!body?.title || !body.summary) {
    return NextResponse.json({ error: "Title and summary are required." }, { status: 400 });
  }

  const slug = makeUniqueSlug(body.title);
  const project = createProject({
    slug,
    cat: body.cat ?? "commercial",
    interiorCategory: body.interiorCategory ?? null,
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

  return NextResponse.json({ project }, { status: 201 });
}
