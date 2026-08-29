import { NextResponse } from "next/server";
import { listPosts, createPost, makeUniqueSlug, type BlogPostInput } from "@/lib/blog-posts-db";
import { notifySubscribersOfNewPost } from "@/lib/mail";

export async function GET() {
  return NextResponse.json({ posts: listPosts() });
}

export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Partial<BlogPostInput> | null;
  if (!body?.title || !body.bodyMarkdown) {
    return NextResponse.json({ error: "Title and content are required." }, { status: 400 });
  }

  const slug = makeUniqueSlug(body.title);
  const status: BlogPostInput["status"] =
    body.status === "published" || body.status === "scheduled" ? body.status : "draft";
  const post = createPost({
    slug,
    title: body.title,
    excerpt: body.excerpt ?? "",
    image: body.image ?? "",
    images: Array.isArray(body.images) ? body.images : [],
    team: body.team ?? "",
    category: (body.category as string) ?? "bim-digital",
    date: body.date ?? new Date().toISOString().slice(0, 10),
    readTime: body.readTime ?? "5 min read",
    tags: Array.isArray(body.tags) ? body.tags : [],
    authorKey: body.authorKey ?? "shangeeth",
    bodyMarkdown: body.bodyMarkdown,
    status,
    publishAt: status === "scheduled" ? body.publishAt ?? null : null,
  });

  if (post.status === "published") {
    void notifySubscribersOfNewPost(post);
  }

  return NextResponse.json({ post }, { status: 201 });
}
