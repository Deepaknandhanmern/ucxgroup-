import { NextResponse } from "next/server";
import { getResourceById, updateResource, deleteResource, type ResourceInput } from "@/lib/resources-db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const resourceId = Number(id);
  if (!getResourceById(resourceId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Partial<ResourceInput> | null;
  if (!body?.title || !body.ref || !body.cat) {
    return NextResponse.json({ error: "Title, reference and category are required." }, { status: 400 });
  }
  const resource = updateResource(resourceId, {
    ref: body.ref,
    cat: body.cat,
    format: body.format ?? "pdf",
    title: body.title,
    image: body.image,
    pdfUrl: body.pdfUrl,
  });
  return NextResponse.json({ resource });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteResource(Number(id));
  return NextResponse.json({ ok: true });
}
