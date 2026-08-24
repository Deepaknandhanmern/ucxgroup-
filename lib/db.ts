import "server-only";
import { DatabaseSync } from "node:sqlite";
import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "dashboard.db");

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

const db = new DatabaseSync(DB_PATH);

db.exec(`
  CREATE TABLE IF NOT EXISTS blog_posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    image TEXT NOT NULL,
    team TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    read_time TEXT NOT NULL,
    tags TEXT NOT NULL,
    author_key TEXT NOT NULL,
    body_markdown TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS enquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL,
    source TEXT NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    subject TEXT,
    message TEXT,
    data TEXT NOT NULL
  );
`);

// One-time migration: seed the DB from the existing markdown posts the
// first time this ever runs, so the switchover to DB-backed content
// doesn't lose the posts that already shipped.
const postCount = db.prepare("SELECT COUNT(*) as n FROM blog_posts").get() as { n: number };
if (postCount.n === 0) {
  const contentDir = path.join(process.cwd(), "content", "insights");
  if (fs.existsSync(contentDir)) {
    const files = fs.readdirSync(contentDir).filter((f) => f.endsWith(".md"));
    const insert = db.prepare(`
      INSERT INTO blog_posts (slug, title, excerpt, image, team, category, date, read_time, tags, author_key, body_markdown, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const now = new Date().toISOString();
    for (const file of files) {
      const slug = file.replace(/\.md$/, "");
      const raw = fs.readFileSync(path.join(contentDir, file), "utf8");
      const { data, content } = matter(raw);
      insert.run(
        slug,
        String(data.title ?? ""),
        String(data.excerpt ?? ""),
        String(data.image ?? ""),
        String(data.team ?? ""),
        String(data.category ?? ""),
        String(data.date ?? now.slice(0, 10)),
        String(data.readTime ?? ""),
        JSON.stringify(data.tags ?? []),
        String(data.author ?? "shangeeth"),
        content.trim(),
        now,
        now
      );
    }
  }
}

export default db;
