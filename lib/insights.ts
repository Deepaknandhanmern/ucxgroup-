export interface Author {
  name: string;
  role: string;
  photo: string;
}

export type InsightCategory = "bim-digital" | "design-delivery" | "technology-ai";

export const INSIGHT_FILTERS: { cat: InsightCategory | "all"; label: string }[] = [
  { cat: "all", label: "All Insights" },
  { cat: "bim-digital", label: "BIM & Digital" },
  { cat: "design-delivery", label: "Design & Delivery" },
  { cat: "technology-ai", label: "Technology & AI" },
];

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  /** Additional gallery images shown as a carousel below the cover image. */
  images: string[];
  team: string;
  category: InsightCategory;
  /** ISO date string, e.g. "2026-08-16" */
  date: string;
  readTime: string;
  tags: string[];
  author: Author;
  /** Pre-rendered HTML from the post's Markdown body. */
  bodyHtml: string;
}

export function formatPostDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00Z`);
  if (Number.isNaN(d.getTime())) return iso;
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(d);
}
