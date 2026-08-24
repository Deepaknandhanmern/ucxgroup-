import { NextResponse } from "next/server";
import { getCaseStudyById, updateCaseStudy, deleteCaseStudy, type CaseStudyInput } from "@/lib/case-studies-db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const caseId = Number(id);
  if (!getCaseStudyById(caseId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Partial<CaseStudyInput> | null;
  if (!body?.title || !body.ref || !body.cat) {
    return NextResponse.json({ error: "Title, reference and category are required." }, { status: 400 });
  }
  const caseStudy = updateCaseStudy(caseId, {
    ref: body.ref,
    cat: body.cat,
    pages: body.pages ?? "",
    title: body.title,
    image: body.image,
    pdfUrl: body.pdfUrl,
  });
  return NextResponse.json({ caseStudy });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteCaseStudy(Number(id));
  return NextResponse.json({ ok: true });
}
