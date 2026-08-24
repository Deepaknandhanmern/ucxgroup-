import "server-only";
import db from "@/lib/db";
import { DIGITAL_EXPERIENCE_CATEGORIES } from "@/lib/digital-experience";

// Only holds a row per category the client has actually customized — every
// read here merges in each category's built-in default image for any
// category with no row, so callers always get a full, valid mapping.
export function getDigitalExperienceImages(): Record<string, string> {
  const rows = db.prepare("SELECT category_id, image FROM digital_experience_images").all() as {
    category_id: string;
    image: string;
  }[];
  const overrides = Object.fromEntries(rows.map((r) => [r.category_id, r.image]));

  return Object.fromEntries(
    DIGITAL_EXPERIENCE_CATEGORIES.map((c) => [c.id, overrides[c.id] ?? c.defaultImage])
  );
}

export function setDigitalExperienceImage(categoryId: string, image: string): void {
  db.prepare(
    `INSERT INTO digital_experience_images (category_id, image, updated_at) VALUES (?, ?, ?)
     ON CONFLICT(category_id) DO UPDATE SET image = excluded.image, updated_at = excluded.updated_at`
  ).run(categoryId, image, new Date().toISOString());
}
