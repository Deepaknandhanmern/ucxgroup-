import { getAllInsightPosts } from "@/lib/insights-content";

const BASE_URL = "https://ucx-group.com";

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const posts = getAllInsightPosts();

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${BASE_URL}/insights/${p.slug}</link>
      <guid>${BASE_URL}/insights/${p.slug}</guid>
      <pubDate>${new Date(`${p.date}T00:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      <author>${escapeXml(p.author.name)}</author>
      <category>${escapeXml(p.category)}</category>
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>UCX Group — Insights</title>
    <link>${BASE_URL}/insights</link>
    <description>Perspectives on BIM &amp; digital engineering, design &amp; delivery, and technology &amp; AI from the teams delivering UCX's projects.</description>
    <language>en-us</language>${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
