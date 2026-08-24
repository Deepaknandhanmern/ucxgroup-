import "server-only";
import db from "@/lib/db";

export interface ResourceRow {
  id: number;
  ref: string;
  cat: string;
  format: string;
  title: string;
  image: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface ResourceInput {
  ref: string;
  cat: string;
  format: string;
  title: string;
  image?: string;
  pdfUrl?: string;
}

export function listResources(): ResourceRow[] {
  return db.prepare("SELECT * FROM resources ORDER BY ref ASC").all() as ResourceRow[];
}

export function getResourceById(id: number): ResourceRow | undefined {
  return db.prepare("SELECT * FROM resources WHERE id = ?").get(id) as ResourceRow | undefined;
}

export function createResource(input: ResourceInput): ResourceRow {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO resources (ref, cat, format, title, image, pdf_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(input.ref, input.cat, input.format, input.title, input.image ?? null, input.pdfUrl ?? null, now, now);
  return getResourceById(Number(result.lastInsertRowid))!;
}

export function updateResource(id: number, input: ResourceInput): ResourceRow | undefined {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE resources SET ref = ?, cat = ?, format = ?, title = ?, image = ?, pdf_url = ?, updated_at = ?
     WHERE id = ?`
  ).run(input.ref, input.cat, input.format, input.title, input.image ?? null, input.pdfUrl ?? null, now, id);
  return getResourceById(id);
}

export function deleteResource(id: number): void {
  db.prepare("DELETE FROM resources WHERE id = ?").run(id);
}
