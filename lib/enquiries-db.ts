import "server-only";
import db from "@/lib/db";

export interface EnquiryRow {
  id: number;
  created_at: string;
  source: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  subject: string | null;
  message: string | null;
  data: string; // JSON blob of the full submitted payload
}

export interface EnquiryInput {
  source: string;
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
  data: Record<string, unknown>;
}

export function listEnquiries(): EnquiryRow[] {
  return db.prepare("SELECT * FROM enquiries ORDER BY created_at DESC, id DESC").all() as EnquiryRow[];
}

export function createEnquiry(input: EnquiryInput): void {
  db.prepare(
    `INSERT INTO enquiries (created_at, source, name, email, phone, subject, message, data)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    new Date().toISOString(),
    input.source,
    input.name ?? null,
    input.email ?? null,
    input.phone ?? null,
    input.subject ?? null,
    input.message ?? null,
    JSON.stringify(input.data)
  );
}

export function deleteEnquiry(id: number): void {
  db.prepare("DELETE FROM enquiries WHERE id = ?").run(id);
}
