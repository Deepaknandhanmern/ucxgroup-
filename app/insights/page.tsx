import type { Metadata } from "next";
import Insights from "@/components/sections/Insights";
import { getAllInsightPosts } from "@/lib/insights-content";
import { getAllCaseStudies } from "@/lib/case-studies-content";
import { getAllResources } from "@/lib/resources-content";

// Reads posts/case studies/resources straight from the dashboard's database
// on every request — never statically prerendered, so edits show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Perspectives on BIM & digital engineering, design & delivery, and technology & AI from the teams delivering UCX's projects.",
  alternates: {
    types: { "application/rss+xml": "/insights/feed.xml" },
  },
};

export default function InsightsPage() {
  return (
    <Insights posts={getAllInsightPosts()} caseStudies={getAllCaseStudies()} resources={getAllResources()} />
  );
}
