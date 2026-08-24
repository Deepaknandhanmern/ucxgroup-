import { NextResponse } from "next/server";
import { getAllProjects } from "@/lib/projects-content";

// Public, read-only — used by the homepage's project gallery, which fetches
// client-side so the homepage itself can stay statically generated instead
// of becoming force-dynamic just for this one decorative section. This
// route itself still needs force-dynamic so Next doesn't try to statically
// optimize (and read the DB at build time) a GET handler with no other
// dynamic API usage.
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({ projects: getAllProjects() });
}
