import type { Metadata } from "next";
import Careers from "@/components/sections/Careers";
import { listJobOpenings } from "@/lib/job-openings-db";

// Reads job openings straight from the dashboard's database on every
// request — never statically prerendered, so edits show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/careers" },
  title: "Careers",
  description:
    "Join UCX's team of BIM, digital engineering, design and delivery specialists — open roles and what it's like to build with us.",
};

export default function CareersPage() {
  const positions = listJobOpenings().map((row) => ({
    title: row.title,
    department: row.department,
    location: row.location,
    type: row.type,
    desc: row.description,
  }));

  return <Careers positions={positions} />;
}
