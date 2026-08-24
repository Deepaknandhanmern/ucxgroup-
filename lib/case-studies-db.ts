import "server-only";
import db from "@/lib/db";

export interface CaseStudyRow {
  id: number;
  ref: string;
  cat: string;
  pages: string;
  title: string;
  image: string | null;
  pdf_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface CaseStudyInput {
  ref: string;
  cat: string;
  pages: string;
  title: string;
  image?: string;
  pdfUrl?: string;
}

export function listCaseStudies(): CaseStudyRow[] {
  return db.prepare("SELECT * FROM case_studies ORDER BY ref ASC").all() as CaseStudyRow[];
}

export function getCaseStudyById(id: number): CaseStudyRow | undefined {
  return db.prepare("SELECT * FROM case_studies WHERE id = ?").get(id) as CaseStudyRow | undefined;
}

export function createCaseStudy(input: CaseStudyInput): CaseStudyRow {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO case_studies (ref, cat, pages, title, image, pdf_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(input.ref, input.cat, input.pages, input.title, input.image ?? null, input.pdfUrl ?? null, now, now);
  return getCaseStudyById(Number(result.lastInsertRowid))!;
}

export function updateCaseStudy(id: number, input: CaseStudyInput): CaseStudyRow | undefined {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE case_studies SET ref = ?, cat = ?, pages = ?, title = ?, image = ?, pdf_url = ?, updated_at = ?
     WHERE id = ?`
  ).run(input.ref, input.cat, input.pages, input.title, input.image ?? null, input.pdfUrl ?? null, now, id);
  return getCaseStudyById(id);
}

export function deleteCaseStudy(id: number): void {
  db.prepare("DELETE FROM case_studies WHERE id = ?").run(id);
}
