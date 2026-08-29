import { NextResponse } from "next/server";
import { createEnquiry } from "@/lib/enquiries-db";
import { notifyNewEnquiry } from "@/lib/mail";
import { addSubscriber } from "@/lib/subscribers-db";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  const { source, ...data } = body as { source?: string } & Record<string, unknown>;

  const enquiry = {
    source: source ?? "unknown",
    name: typeof data.name === "string" ? data.name : undefined,
    email: typeof data.email === "string" ? data.email : undefined,
    phone: typeof data.phone === "string" ? data.phone : undefined,
    subject: typeof data.subject === "string" ? data.subject : undefined,
    message: typeof data.message === "string" ? data.message : undefined,
    data,
  };

  createEnquiry(enquiry);

  // Fire-and-forget — a slow or failing mail server should never delay or
  // break the enquiry response the visitor is waiting on.
  void notifyNewEnquiry(enquiry);

  // Newsletter signups also join the persistent subscriber list, notified
  // by email whenever a post is published — separate from this per-enquiry
  // admin notification above.
  if (enquiry.source === "newsletter-signup" && enquiry.email) {
    addSubscriber(enquiry.email);
  }

  return NextResponse.json({ ok: true });
}
