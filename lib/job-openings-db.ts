import "server-only";
import db from "@/lib/db";

export interface JobOpeningRow {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface JobOpeningInput {
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
}

export function listJobOpenings(): JobOpeningRow[] {
  return db.prepare("SELECT * FROM job_openings ORDER BY id DESC").all() as JobOpeningRow[];
}

export function getJobOpeningById(id: number): JobOpeningRow | undefined {
  return db.prepare("SELECT * FROM job_openings WHERE id = ?").get(id) as JobOpeningRow | undefined;
}

export function createJobOpening(input: JobOpeningInput): JobOpeningRow {
  const now = new Date().toISOString();
  const result = db
    .prepare(
      `INSERT INTO job_openings (title, department, location, type, description, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`
    )
    .run(input.title, input.department, input.location, input.type, input.description, now, now);
  return getJobOpeningById(Number(result.lastInsertRowid))!;
}

export function updateJobOpening(id: number, input: JobOpeningInput): JobOpeningRow | undefined {
  const now = new Date().toISOString();
  db.prepare(
    `UPDATE job_openings SET title = ?, department = ?, location = ?, type = ?, description = ?, updated_at = ?
     WHERE id = ?`
  ).run(input.title, input.department, input.location, input.type, input.description, now, id);
  return getJobOpeningById(id);
}

export function deleteJobOpening(id: number): void {
  db.prepare("DELETE FROM job_openings WHERE id = ?").run(id);
}
