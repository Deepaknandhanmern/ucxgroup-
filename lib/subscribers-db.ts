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
// on their existing token, rather than creating a duplicate row. Returns
// the row (with its token) so the caller can send a confirmation email —
// and whether one should actually be sent, so a duplicate submission from
// an already-active subscriber doesn't get confirmed again.
export function addSubscriber(email: string): { subscriber: Subscriber; shouldConfirm: boolean } | null {
  const normalized = normalizeEmail(email);
  if (!normalized) return null;

  const now = new Date().toISOString();
  const existing = db.prepare("SELECT * FROM subscribers WHERE email = ?").get(normalized) as
    | Subscriber
    | undefined;

  if (existing) {
    const wasInactive = existing.active === 0;
    db.prepare("UPDATE subscribers SET active = 1, updated_at = ? WHERE id = ?").run(now, existing.id);
    return { subscriber: { ...existing, active: 1, updated_at: now }, shouldConfirm: wasInactive };
  }

  const token = crypto.randomBytes(24).toString("hex");
  const result = db
    .prepare("INSERT INTO subscribers (email, token, active, created_at, updated_at) VALUES (?, ?, 1, ?, ?)")
    .run(normalized, token, now, now);
  const subscriber = db.prepare("SELECT * FROM subscribers WHERE id = ?").get(Number(result.lastInsertRowid)) as Subscriber;
  return { subscriber, shouldConfirm: true };
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
