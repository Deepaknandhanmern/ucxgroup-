import type { Metadata } from "next";
import Careers from "@/components/sections/Careers";
import { listJobOpenings } from "@/lib/job-openings-db";

export const metadata: Metadata = {
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
