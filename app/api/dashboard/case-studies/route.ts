import { NextResponse } from "next/server";
import { listCaseStudies, createCaseStudy, type CaseStudyInput } from "@/lib/case-studies-db";

export async function GET() {
  return NextResponse.json({ caseStudies: listCaseStudies() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<CaseStudyInput> | null;
  if (!body?.title || !body.ref || !body.cat) {
    return NextResponse.json({ error: "Title, reference and category are required." }, { status: 400 });
  }
  const caseStudy = createCaseStudy({
    ref: body.ref,
    cat: body.cat,
    pages: body.pages ?? "",
    title: body.title,
    image: body.image,
    pdfUrl: body.pdfUrl,
  });
  return NextResponse.json({ caseStudy }, { status: 201 });
}
