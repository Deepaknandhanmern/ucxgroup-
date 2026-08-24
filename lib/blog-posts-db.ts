import "server-only";
import db from "@/lib/db";

export type PostStatus = "draft" | "published";

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  team: string;
  category: string;
  date: string;
  read_time: string;
  tags: string; // JSON array string
  author_key: string;
  body_markdown: string;
  status: PostStatus;
  created_at: string;
  updated_at: string;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  team: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  authorKey: string;
  bodyMarkdown: string;
  status: PostStatus;
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function listPosts(): BlogPostRow[] {
  return db.prepare("SELECT * FROM blog_posts ORDER BY date DESC, id DESC").all() as BlogPostRow[];
}

export function listPublishedPosts(): BlogPostRow[] {
  return db
    .prepare("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY date DESC, id DESC")
    .all() as BlogPostRow[];
}

export function getPostById(id: number): BlogPostRow | undefined {
  return db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id) as BlogPostRow | undefined;
}

export function getPostBySlug(slug: string): BlogPostRow | undefined {
  return db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(slug) as BlogPostRow | undefined;
}

export function getPublishedPostBySlug(slug: string): BlogPostRow | undefined {
  return db.prepare("SELECT * FROM blog_posts WHERE slug = ? AND status = 'published'").get(slug) as
    | BlogPostRow
    | undefined;
}

export function makeUniqueSlug(title: string, ignoreId?: number): string {
  const base = slugify(title) || "post";
  let slug = base;
  let n = 2;
  while (true) {
    const existing = getPostBySlug(slug);
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export function createPost(input: BlogPostInput): BlogPostRow {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO blog_posts (slug, title, excerpt, image, team, category, date, read_time, tags, author_key, body_markdown, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.slug,
      input.title,
      input.excerpt,
      input.image,
      input.team,
      input.category,
      input.date,
      input.readTime,
      JSON.stringify(input.tags),
      input.authorKey,
      input.bodyMarkdown,
      input.status,
      now,
      now
    );
  return getPostById(Number(result.lastInsertRowid))!;
}

export function updatePost(id: number, input: BlogPostInput): BlogPostRow | undefined {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE blog_posts SET slug = ?, title = ?, excerpt = ?, image = ?, team = ?, category = ?, date = ?, read_time = ?, tags = ?, author_key = ?, body_markdown = ?, status = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.slug,
    input.title,
    input.excerpt,
    input.image,
    input.team,
    input.category,
    input.date,
    input.readTime,
    JSON.stringify(input.tags),
    input.authorKey,
    input.bodyMarkdown,
    input.status,
    now,
    id
  );
  return getPostById(id);
}

export function deletePost(id: number): void {
  db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
}
