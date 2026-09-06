// Mechanical SEO helpers for the blog editor — the client writes in plain
// Markdown and never has to think about meta descriptions or read-time math;
// these derive both straight from the body so good defaults show up
// automatically as they type.

export function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ") // fenced code blocks
    .replace(/`[^`]*`/g, " ") // inline code
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ") // images
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1") // links -> link text
    .replace(/^#{1,6}\s+/gm, "") // headings
    .replace(/^>\s?/gm, "") // blockquotes
    .replace(/^[-*+]\s+/gm, "") // bullet lists
    .replace(/^\d+\.\s+/gm, "") // numbered lists
    .replace(/(\*\*|__)(.*?)\1/g, "$2") // bold
    .replace(/(\*|_)(.*?)\1/g, "$2") // italic
    .replace(/^-{3,}\s*$/gm, " ") // horizontal rules
    .replace(/\s+/g, " ")
    .trim();
}

// Google truncates meta descriptions somewhere around 155-160 characters —
// cutting at the last whole word keeps it from ending mid-word.
export function deriveExcerpt(body: string, maxLen = 155): string {
  const text = stripMarkdown(body);
  if (text.length <= maxLen) return text;
  const cut = text.slice(0, maxLen + 1);
  const lastSpace = cut.lastIndexOf(" ");
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : maxLen).trimEnd()}…`;
}

// Standard ~200wpm reading-speed estimate, same math most blogs use.
export function estimateReadTime(body: string, wordsPerMinute = 200): string {
  const words = stripMarkdown(body).split(/\s+/).filter(Boolean).length;
  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  return `${minutes} min read`;
}

// Mirrors the slugify() in lib/blog-posts-db.ts (server-only, so it can't be
// imported from the client editor) — kept here purely to preview what the
// URL will look like before saving. The real slug is decided server-side
// and may get a numeric suffix for uniqueness; this preview doesn't need to
// predict that.
export function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export type SeoLengthStatus = "empty" | "short" | "good" | "long";

// Shared thresholds for the title/excerpt character-count hints in the
// editor — green means it'll display cleanly in a Google result, amber
// means usable but not ideal, red means it'll get cut off.
export function seoLengthStatus(length: number, min: number, max: number): SeoLengthStatus {
  if (length === 0) return "empty";
  if (length < min) return "short";
  if (length > max) return "long";
  return "good";
}
