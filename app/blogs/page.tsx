import type { Metadata } from "next";
import Blogs from "@/components/sections/Blogs";
import { getAllInsightPosts } from "@/lib/insights-content";

export const metadata: Metadata = {
  title: "Blogs",
  description:
    "Every UCX blog post on BIM & digital engineering, design & delivery, and technology & AI — browse the full archive.",
};

export default function BlogsPage() {
  return <Blogs posts={getAllInsightPosts()} />;
}
