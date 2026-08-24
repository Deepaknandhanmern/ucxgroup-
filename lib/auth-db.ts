import "server-only";
import crypto from "crypto";
import db from "@/lib/db";
import { checkPassword as checkEnvPassword } from "@/lib/auth";

// Kept separate from lib/auth.ts (rather than adding a DB import there)
// because proxy.ts imports from that file too, and shouldn't end up
// pulling in node:sqlite just to verify a signed session cookie.

interface StoredAuth {
  password_hash: string;
  salt: string;
}

function getStoredAuth(): StoredAuth | undefined {
  return db.prepare("SELECT password_hash, salt FROM dashboard_auth WHERE id = 1").get() as
    | StoredAuth
    | undefined;
}

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString("hex");
}

// Checks the DB-stored password first; falls back to DASHBOARD_PASSWORD
// (env var) if the client has never changed it via the dashboard yet.
export function verifyPassword(password: string): boolean {
  const stored = getStoredAuth();
  if (!stored) return checkEnvPassword(password);

  const hash = hashPassword(password, stored.salt);
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(stored.password_hash, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function changePassword(currentPassword: string, newPassword: string): boolean {
  if (!verifyPassword(currentPassword)) return false;

  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword(newPassword, salt);
  const now = new Date().toISOString();
  db.prepare(
    `INSERT INTO dashboard_auth (id, password_hash, salt, updated_at) VALUES (1, ?, ?, ?)
     ON CONFLICT(id) DO UPDATE SET password_hash = excluded.password_hash, salt = excluded.salt, updated_at = excluded.updated_at`
  ).run(hash, salt, now);
  return true;
}
