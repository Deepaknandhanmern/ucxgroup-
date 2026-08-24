import type { Metadata } from "next";
import Blogs from "@/components/sections/Blogs";
import { getAllInsightPosts } from "@/lib/insights-content";

// Reads posts straight from the dashboard's database on every request —
// never statically prerendered, so new/edited posts show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Every UCX blog post on BIM & digital engineering, design & delivery, and technology & AI — browse the full archive.",
};

export default function BlogsPage() {
  return <Blogs posts={getAllInsightPosts()} />;
}
