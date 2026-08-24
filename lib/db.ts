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

  CREATE TABLE IF NOT EXISTS job_openings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS case_studies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref TEXT UNIQUE NOT NULL,
    cat TEXT NOT NULL,
    pages TEXT NOT NULL,
    title TEXT NOT NULL,
    image TEXT,
    pdf_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ref TEXT UNIQUE NOT NULL,
    cat TEXT NOT NULL,
    format TEXT NOT NULL,
    title TEXT NOT NULL,
    image TEXT,
    pdf_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
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

// One-time migration: seed the one job opening that was still hardcoded in
// the component, so switching Careers to DB-backed data doesn't drop it.
const jobCount = db.prepare("SELECT COUNT(*) as n FROM job_openings").get() as { n: number };
if (jobCount.n === 0) {
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO job_openings (title, department, location, type, description, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    "Interior Designer",
    "Design & Interiors",
    "Coimbatore / Remote",
    "Full-time",
    "Develop interior design solutions from concept through construction documentation, working closely with our BIM-integrated workflow.",
    now,
    now
  );
}

// One-time migration: seed case studies and resources from their existing
// markdown content the first time this runs.
const caseStudyCount = db.prepare("SELECT COUNT(*) as n FROM case_studies").get() as { n: number };
if (caseStudyCount.n === 0) {
  const dir = path.join(process.cwd(), "content", "case-studies");
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    const insert = db.prepare(
      `INSERT INTO case_studies (ref, cat, pages, title, image, pdf_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const now = new Date().toISOString();
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      insert.run(
        String(data.ref ?? ""),
        String(data.cat ?? ""),
        String(data.pages ?? ""),
        String(data.title ?? ""),
        data.image ? String(data.image) : null,
        null,
        now,
        now
      );
    }
  }
}

const resourceCount = db.prepare("SELECT COUNT(*) as n FROM resources").get() as { n: number };
if (resourceCount.n === 0) {
  const dir = path.join(process.cwd(), "content", "resources");
  if (fs.existsSync(dir)) {
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));
    const insert = db.prepare(
      `INSERT INTO resources (ref, cat, format, title, image, pdf_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    );
    const now = new Date().toISOString();
    for (const file of files) {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      const { data } = matter(raw);
      insert.run(
        String(data.ref ?? ""),
        String(data.cat ?? ""),
        String(data.format ?? "pdf"),
        String(data.title ?? ""),
        data.image ? String(data.image) : null,
        null,
        now,
        now
      );
    }
  }
}

export default db;
