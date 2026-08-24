import { NextResponse } from "next/server";
import { getJobOpeningById, updateJobOpening, deleteJobOpening, type JobOpeningInput } from "@/lib/job-openings-db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const jobId = Number(id);
  if (!getJobOpeningById(jobId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Partial<JobOpeningInput> | null;
  if (!body?.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  const job = updateJobOpening(jobId, {
    title: body.title,
    department: body.department ?? "",
    location: body.location ?? "",
    type: body.type ?? "Full-time",
    description: body.description ?? "",
  });
  return NextResponse.json({ job });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteJobOpening(Number(id));
  return NextResponse.json({ ok: true });
}
