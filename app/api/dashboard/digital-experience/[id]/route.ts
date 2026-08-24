import { NextResponse } from "next/server";
import { DIGITAL_EXPERIENCE_CATEGORIES } from "@/lib/digital-experience";
import { setDigitalExperienceImage } from "@/lib/digital-experience-db";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!DIGITAL_EXPERIENCE_CATEGORIES.some((c) => c.id === id)) {
    return NextResponse.json({ error: "Unknown category." }, { status: 404 });
  }

  const body = (await req.json().catch(() => ({}))) as { image?: string };
  if (!body.image) {
    return NextResponse.json({ error: "image is required." }, { status: 400 });
  }

  setDigitalExperienceImage(id, body.image);
  return NextResponse.json({ ok: true });
}
