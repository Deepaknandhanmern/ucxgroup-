import { NextResponse } from "next/server";
import { DIGITAL_EXPERIENCE_CATEGORIES } from "@/lib/digital-experience";
import { getDigitalExperienceImages } from "@/lib/digital-experience-db";

export async function GET() {
  const images = getDigitalExperienceImages();
  const categories = DIGITAL_EXPERIENCE_CATEGORIES.map((c) => ({
    id: c.id,
    n: c.n,
    name: c.name,
    image: images[c.id],
  }));
  return NextResponse.json({ categories });
}
