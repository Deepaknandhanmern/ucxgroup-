import type { Metadata } from "next";
import CaseStudies from "@/components/sections/CaseStudies";
import { getAllCaseStudies } from "@/lib/case-studies-content";

// Reads case studies straight from the dashboard's database on every
// request — never statically prerendered, so edits show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "In-depth case studies on how UCX solves coordination, delivery and asset-information challenges across BIM, interiors, construction and handover.",
};

export default function CaseStudiesPage() {
  return <CaseStudies cases={getAllCaseStudies()} />;
}
