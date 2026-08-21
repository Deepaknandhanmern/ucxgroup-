import "server-only";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ResourceItem } from "@/lib/resources";

const CONTENT_DIR = path.join(process.cwd(), "content", "resources");

let cache: ResourceItem[] | null = null;

export function getAllResources(): ResourceItem[] {
  if (cache) return cache;

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md"));

  const resources = files.map((file) => {
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf8");
    const { data } = matter(raw);
    return data as ResourceItem;
  });

  resources.sort((a, b) => a.ref.localeCompare(b.ref));
  cache = resources;
  return resources;
}
