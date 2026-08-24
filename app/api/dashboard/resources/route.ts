import { NextResponse } from "next/server";
import { listResources, createResource, type ResourceInput } from "@/lib/resources-db";

export async function GET() {
  return NextResponse.json({ resources: listResources() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<ResourceInput> | null;
  if (!body?.title || !body.ref || !body.cat) {
    return NextResponse.json({ error: "Title, reference and category are required." }, { status: 400 });
  }
  const resource = createResource({
    ref: body.ref,
    cat: body.cat,
    format: body.format ?? "pdf",
    title: body.title,
    image: body.image,
    pdfUrl: body.pdfUrl,
  });
  return NextResponse.json({ resource }, { status: 201 });
}
