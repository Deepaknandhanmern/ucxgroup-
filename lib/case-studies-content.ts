import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { CaseStudy } from "@/lib/case-studies";

const CONTENT_DIR = path.join(process.cwd(), "content", "case-studies");

let cache: CaseStudy[] | null = null;

export function getAllCaseStudies(): CaseStudy[] {
  if (cache) return cache;

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const studies = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    return data as CaseStudy;
  });

  studies.sort((a, b) => a.ref.localeCompare(b.ref));
  cache = studies;
  return studies;
}
