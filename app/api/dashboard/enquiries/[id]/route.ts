import { NextResponse } from "next/server";
import { deleteEnquiry, markEnquiryRead, setEnquiryStatus, type EnquiryStatus } from "@/lib/enquiries-db";

const VALID_STATUSES: EnquiryStatus[] = ["new", "contacted", "closed"];

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { read?: boolean; status?: string };

  if (typeof body.read === "boolean") {
    markEnquiryRead(Number(id), body.read);
  }
  if (body.status && VALID_STATUSES.includes(body.status as EnquiryStatus)) {
    setEnquiryStatus(Number(id), body.status as EnquiryStatus);
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteEnquiry(Number(id));
  return NextResponse.json({ ok: true });
}
