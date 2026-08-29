import "server-only";
import db from "@/lib/db";

export type PostStatus = "draft" | "published" | "scheduled";

export interface BlogPostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  images: string; // JSON array string — additional gallery images for the article carousel
  team: string;
  category: string;
  date: string;
  read_time: string;
  tags: string; // JSON array string
  author_key: string;
  body_markdown: string;
  status: PostStatus;
  publish_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  images: string[];
  team: string;
  category: string;
  date: string;
  readTime: string;
  tags: string[];
  authorKey: string;
  bodyMarkdown: string;
  status: PostStatus;
  publishAt: string | null;
}

// Scheduled posts flip to published as soon as their publish_at time has
// passed. There's no persistent cron/worker in this deployment, so instead
// every read path calls this first — the flip happens lazily on the next
// visit to a post-reading page rather than on a timer.
function promoteScheduledPosts(): void {
  const now = new Date().toISOString();
  db.prepare(
    "UPDATE blog_posts SET status = 'published', updated_at = ? WHERE status = 'scheduled' AND publish_at IS NOT NULL AND publish_at <= ?"
  ).run(now, now);
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function listPosts(): BlogPostRow[] {
  promoteScheduledPosts();
  return db.prepare("SELECT * FROM blog_posts ORDER BY date DESC, id DESC").all() as BlogPostRow[];
}

export function listPublishedPosts(): BlogPostRow[] {
  promoteScheduledPosts();
  return db
    .prepare("SELECT * FROM blog_posts WHERE status = 'published' ORDER BY date DESC, id DESC")
    .all() as BlogPostRow[];
}

export function getPostById(id: number): BlogPostRow | undefined {
  promoteScheduledPosts();
  return db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id) as BlogPostRow | undefined;
}

export function getPostBySlug(slug: string): BlogPostRow | undefined {
  promoteScheduledPosts();
  return db.prepare("SELECT * FROM blog_posts WHERE slug = ?").get(slug) as BlogPostRow | undefined;
}

export function getPublishedPostBySlug(slug: string): BlogPostRow | undefined {
  promoteScheduledPosts();
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
      `INSERT INTO blog_posts (slug, title, excerpt, image, images, team, category, date, read_time, tags, author_key, body_markdown, status, publish_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.slug,
      input.title,
      input.excerpt,
      input.image,
      JSON.stringify(input.images),
      input.team,
      input.category,
      input.date,
      input.readTime,
      JSON.stringify(input.tags),
      input.authorKey,
      input.bodyMarkdown,
      input.status,
      input.publishAt,
      now,
      now
    );
  return getPostById(Number(result.lastInsertRowid))!;
}

export function updatePost(id: number, input: BlogPostInput): BlogPostRow | undefined {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE blog_posts SET slug = ?, title = ?, excerpt = ?, image = ?, images = ?, team = ?, category = ?, date = ?, read_time = ?, tags = ?, author_key = ?, body_markdown = ?, status = ?, publish_at = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.slug,
    input.title,
    input.excerpt,
    input.image,
    JSON.stringify(input.images),
    input.team,
    input.category,
    input.date,
    input.readTime,
    JSON.stringify(input.tags),
    input.authorKey,
    input.bodyMarkdown,
    input.status,
    input.publishAt,
    now,
    id
  );
  return getPostById(id);
}

// Status-only update, for bulk actions in the dashboard list where re-sending
// every field of a post just to flip its status would be wasteful.
export function updatePostStatus(id: number, status: PostStatus): void {
  db.prepare("UPDATE blog_posts SET status = ?, updated_at = ? WHERE id = ?").run(
    status,
    new Date().toISOString(),
    id
  );
}

export function deletePost(id: number): void {
  db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
}
