import "server-only";
import db from "@/lib/db";

export interface ProjectRow {
  id: number;
  slug: string;
  cat: string;
  interior_category: string | null;
  digital_category: string | null;
  title: string;
  location: string;
  discipline: string;
  stage: string;
  technology: string; // JSON array string
  image: string;
  summary: string;
  body: string; // JSON array string (paragraphs)
  scope: string; // JSON array string
  created_at: string;
  updated_at: string;
}

export interface ProjectInput {
  slug: string;
  cat: string;
  interiorCategory: string | null;
  digitalCategory: string | null;
  title: string;
  location: string;
  discipline: string;
  stage: string;
  technology: string[];
  image: string;
  summary: string;
  body: string[];
  scope: string[];
}

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function listProjects(): ProjectRow[] {
  return db.prepare("SELECT * FROM projects ORDER BY created_at DESC, id DESC").all() as ProjectRow[];
}

export function getProjectById(id: number): ProjectRow | undefined {
  return db.prepare("SELECT * FROM projects WHERE id = ?").get(id) as ProjectRow | undefined;
}

export function getProjectBySlug(slug: string): ProjectRow | undefined {
  return db.prepare("SELECT * FROM projects WHERE slug = ?").get(slug) as ProjectRow | undefined;
}

export function makeUniqueSlug(title: string, ignoreId?: number): string {
  const base = slugify(title) || "project";
  let slug = base;
  let n = 2;
  while (true) {
    const existing = getProjectBySlug(slug);
    if (!existing || existing.id === ignoreId) return slug;
    slug = `${base}-${n}`;
    n += 1;
  }
}

export function createProject(input: ProjectInput): ProjectRow {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO projects (slug, cat, interior_category, digital_category, title, location, discipline, stage, technology, image, summary, body, scope, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.slug,
      input.cat,
      input.interiorCategory,
      input.digitalCategory,
      input.title,
      input.location,
      input.discipline,
      input.stage,
      JSON.stringify(input.technology),
      input.image,
      input.summary,
      JSON.stringify(input.body),
      JSON.stringify(input.scope),
      now,
      now
    );
  return getProjectById(Number(result.lastInsertRowid))!;
}

export function updateProject(id: number, input: ProjectInput): ProjectRow | undefined {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE projects SET slug = ?, cat = ?, interior_category = ?, digital_category = ?, title = ?, location = ?, discipline = ?, stage = ?, technology = ?, image = ?, summary = ?, body = ?, scope = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    input.slug,
    input.cat,
    input.interiorCategory,
    input.digitalCategory,
    input.title,
    input.location,
    input.discipline,
    input.stage,
    JSON.stringify(input.technology),
    input.image,
    input.summary,
    JSON.stringify(input.body),
    JSON.stringify(input.scope),
    now,
    id
  );
  return getProjectById(id);
}

export function deleteProject(id: number): void {
  db.prepare("DELETE FROM projects WHERE id = ?").run(id);
}
