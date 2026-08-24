import { NextResponse } from "next/server";
import { deleteEnquiry } from "@/lib/enquiries-db";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  deleteEnquiry(Number(id));
  return NextResponse.json({ ok: true });
}
