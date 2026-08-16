import { notFound } from "next/navigation";
import { POSTS, getPost } from "@/lib/insights";
import InsightArticle from "@/components/sections/InsightArticle";

export function generateStaticParams() {
  return POSTS.map((p) => ({ slug: p.slug }));
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const more = POSTS.filter((p) => p.slug !== post.slug).slice(0, 3);

  return <InsightArticle post={post} more={more} />;
}
