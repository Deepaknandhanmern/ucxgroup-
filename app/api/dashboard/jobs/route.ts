import { NextResponse } from "next/server";
import { listJobOpenings, createJobOpening, type JobOpeningInput } from "@/lib/job-openings-db";

export async function GET() {
  return NextResponse.json({ jobs: listJobOpenings() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<JobOpeningInput> | null;
  if (!body?.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const job = createJobOpening({
    title: body.title,
    department: body.department ?? "",
    location: body.location ?? "",
    type: body.type ?? "Full-time",
    description: body.description ?? "",
  });
  return NextResponse.json({ job }, { status: 201 });
}
