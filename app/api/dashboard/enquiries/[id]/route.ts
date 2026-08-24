import { NextResponse } from "next/server";
import { deleteEnquiry, markEnquiryRead } from "@/lib/enquiries-db";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as { read?: boolean };
  markEnquiryRead(Number(id), body.read !== false);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteEnquiry(Number(id));
  return NextResponse.json({ ok: true });
}
