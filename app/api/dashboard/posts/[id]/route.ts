import { NextResponse } from "next/server";
import {
  getPostById,
  updatePost,
  updatePostStatus,
  deletePost,
  makeUniqueSlug,
  type BlogPostInput,
  type PostStatus,
} from "@/lib/blog-posts-db";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = getPostById(Number(id));
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  const existing = getPostById(postId);
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Partial<BlogPostInput> | null;
  if (!body?.title || !body.bodyMarkdown) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  // Re-slug only if the title actually changed, so existing links to the post keep working.
  const slug = body.title !== existing.title ? makeUniqueSlug(body.title, postId) : existing.slug;
  const status: BlogPostInput["status"] =
    body.status === "published" || body.status === "scheduled" ? body.status : "draft";

  const post = updatePost(postId, {
    slug,
    title: body.title,
    excerpt: body.excerpt ?? "",
    image: body.image ?? "",
    team: body.team ?? "",
    category: (body.category as string) ?? "bim-digital",
    date: body.date ?? existing.date,
    readTime: body.readTime ?? existing.read_time,
    tags: Array.isArray(body.tags) ? body.tags : [],
    authorKey: body.authorKey ?? existing.author_key,
    bodyMarkdown: body.bodyMarkdown,
    status,
    publishAt: status === "scheduled" ? body.publishAt ?? null : null,
  });

  return NextResponse.json({ post });
}

// Status-only update, used by the dashboard's bulk-select actions (publish /
// unpublish several posts at once) without resending the full post body.
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!getPostById(postId)) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = (await req.json().catch(() => ({}))) as { status?: PostStatus };
  if (body.status !== "draft" && body.status !== "published") {
    return NextResponse.json({ error: "status must be 'draft' or 'published'." }, { status: 400 });
  }

  updatePostStatus(postId, body.status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const postId = Number(id);
  if (!getPostById(postId)) return NextResponse.json({ error: "Not found" }, { status: 404 });
  deletePost(postId);
  return NextResponse.json({ ok: true });
}
