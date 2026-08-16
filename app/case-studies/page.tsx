import type { Metadata } from "next";
import CaseStudies from "@/components/sections/CaseStudies";

export const metadata: Metadata = {
  title: "Case Studies",
  description:
    "In-depth case studies on how UCX solves coordination, delivery and asset-information challenges across BIM, interiors, construction and handover.",
};

export default function CaseStudiesPage() {
  return <CaseStudies />;
}
