import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/enquiries-db";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { source, ...data } = body as { source?: string } & Record<string, unknown>;

  createEnquiry({
    source: source ?? "unknown",
    name: typeof data.name === "string" ? data.name : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
    phone: typeof data.phone === "string" ? data.phone : undefined,
    subject: typeof data.subject === "string" ? data.subject : undefined,
    message: typeof data.message === "string" ? data.message : undefined,
    data,
  });

  return NextResponse.json({ ok: true });
}
