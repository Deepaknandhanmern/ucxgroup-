import { NextResponse } from "next/server";
import { listEnquiries } from "@/lib/enquiries-db";

export async function GET() {
  return NextResponse.json({ enquiries: listEnquiries() });
}
