import type { Metadata } from "next";
import Insights from "@/components/sections/Insights";
import { getAllInsightPosts } from "@/lib/insights-content";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Perspectives on BIM & digital engineering, design & delivery, and technology & AI from the teams delivering UCX's projects.",
  alternates: {
    types: { "application/rss+xml": "/insights/feed.xml" },
  },
};

export default function InsightsPage() {
  return <Insights posts={getAllInsightPosts()} />;
}
