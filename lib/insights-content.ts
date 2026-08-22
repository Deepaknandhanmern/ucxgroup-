import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { Author, InsightCategory, Post } from "@/lib/insights";

const CONTENT_DIR = path.join(process.cwd(), "content", "insights");

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

interface Frontmatter {
  title: string;
  excerpt: string;
  image: string;
  team: string;
  category: InsightCategory;
  date: string;
  readTime: string;
  tags: string[];
  author: string;
}

let cache: Post[] | null = null;

export function getAllInsightPosts(): Post[] {
  if (cache) return cache;

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data, content } = matter(raw);
    const fm = data as Frontmatter;
    const author = AUTHORS[fm.author];
    if (!author) throw new Error(`Unknown author "${fm.author}" in content/insights/${file}`);

    const bodyHtml = remark().use(remarkHtml).processSync(content).toString();

    return {
      slug,
      title: fm.title,
      excerpt: fm.excerpt,
      image: fm.image,
      team: fm.team,
      category: fm.category,
      date: fm.date,
      readTime: fm.readTime,
      tags: fm.tags,
      author,
      bodyHtml,
    };
  });

  posts.sort((a, b) => (a.date < b.date ? 1 : -1));
  cache = posts;
  return posts;
}

export function getInsightPost(slug: string): Post | undefined {
  return getAllInsightPosts().find((p) => p.slug === slug);
}
