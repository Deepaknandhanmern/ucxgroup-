import { notFound } from "next/navigation";
import PostEditor from "@/components/dashboard/PostEditor";
import { getPostById } from "@/lib/blog-posts-db";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const row = getPostById(Number(id));
  if (!row) notFound();

  // node:sqlite rows aren't plain objects, which the Server → Client
  // Component boundary can't serialize — spread into a plain literal first.
  const post = { ...row };

  return (
    <div>
      <h1 className="mb-6 font-getho text-2xl font-bold text-neutral-900">Edit Post</h1>
      <PostEditor post={post} />
    </div>
  );
}
