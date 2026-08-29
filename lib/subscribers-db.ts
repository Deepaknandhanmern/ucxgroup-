import "server-only";
import crypto from "crypto";
import db from "@/lib/db";

export interface Subscriber {
  id: number;
  email: string;
  token: string;
  active: number;
  created_at: string;
  updated_at: string;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Upsert: a brand-new address gets a fresh token and is active; someone
// who'd previously unsubscribed and signs up again is simply reactivated
// on their existing token, rather than creating a duplicate row.
export function addSubscriber(email: string): void {
  const normalized = normalizeEmail(email);
  if (!normalized) return;

  const now = new Date().toISOString();
  const existing = db.prepare("SELECT id FROM subscribers WHERE email = ?").get(normalized) as
    | { id: number }
    | undefined;

  if (existing) {
    db.prepare("UPDATE subscribers SET active = 1, updated_at = ? WHERE id = ?").run(now, existing.id);
    return;
  }

  const token = crypto.randomBytes(24).toString("hex");
  db.prepare(
    "INSERT INTO subscribers (email, token, active, created_at, updated_at) VALUES (?, ?, 1, ?, ?)"
  ).run(normalized, token, now, now);
}

export function listActiveSubscribers(): Subscriber[] {
  return db.prepare("SELECT * FROM subscribers WHERE active = 1").all() as Subscriber[];
}

// Returns true if a matching active subscription was found and deactivated.
export function unsubscribeByToken(token: string): boolean {
  const row = db.prepare("SELECT id FROM subscribers WHERE token = ? AND active = 1").get(token) as
    | { id: number }
    | undefined;
  if (!row) return false;
  db.prepare("UPDATE subscribers SET active = 0, updated_at = ? WHERE id = ?").run(new Date().toISOString(), row.id);
  return true;
}
