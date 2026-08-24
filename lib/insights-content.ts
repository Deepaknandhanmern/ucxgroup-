import "server-only";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { Author, InsightCategory, Post } from "@/lib/insights";
import { listPosts, getPostBySlug, type BlogPostRow } from "@/lib/blog-posts-db";

const AUTHORS: Record<string, Author> = {
  shangeeth: {
    name: "Shangeeth Raju",
    role: "Associate, Digital Engineering",
    photo: "/brand/founders/shangeeth-raju.png",
  },
  bhuvaneshwari: {
    name: "Bhuvaneshwari",
    role: "Associate, Project & Construction Support",
    photo: "/brand/founders/bhuvaneshwari.png",
  },
};

function toPost(row: BlogPostRow): Post {
  const author = AUTHORS[row.author_key];
  if (!author) throw new Error(`Unknown author "${row.author_key}" on post "${row.slug}"`);

  const bodyHtml = remark().use(remarkHtml).processSync(row.body_markdown).toString();

  return {
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt,
    image: row.image,
    team: row.team,
    category: row.category as InsightCategory,
    date: row.date,
    readTime: row.read_time,
    tags: JSON.parse(row.tags) as string[],
    author,
    bodyHtml,
  };
}

export function getAllInsightPosts(): Post[] {
  return listPosts().map(toPost);
}

export function getInsightPost(slug: string): Post | undefined {
  const row = getPostBySlug(slug);
  return row ? toPost(row) : undefined;
}
