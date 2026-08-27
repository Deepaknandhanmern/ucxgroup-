import type { MetadataRoute } from "next";
import { getAllProjects } from "@/lib/projects-content";
import { getAllInsightPosts } from "@/lib/insights-content";
import { TEAM } from "@/lib/team";

// Reads posts from the dashboard's database — force-dynamic keeps this out
// of Next's static generation pass entirely (sitemap.ts can otherwise be
// prerendered at build time like a page).
export const dynamic = "force-dynamic";

const BASE_URL = "https://ucx-group.com";

const STATIC_ROUTES = [
  { path: "/", priority: 1, changeFrequency: "monthly" as const },
  { path: "/about-us", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/capabilities", priority: 0.8, changeFrequency: "monthly" as const },
  { path: "/bim-digital-delivery", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/design-interiors", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/project-construction-support", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/asset-digital-information", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/specialist-solutions", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/experience", priority: 0.7, changeFrequency: "monthly" as const },
  { path: "/projects", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/digital-project-experience", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/collaboration-lab", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/case-studies", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/insights", priority: 0.7, changeFrequency: "weekly" as const },
  { path: "/blogs", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/resources", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/global-delivery", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/careers", priority: 0.6, changeFrequency: "weekly" as const },
  { path: "/team", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/training-workshop", priority: 0.5, changeFrequency: "monthly" as const },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" as const },
  { path: "/privacy-policy", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/terms", priority: 0.2, changeFrequency: "yearly" as const },
  { path: "/cookies", priority: 0.2, changeFrequency: "yearly" as const },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${BASE_URL}${route.path}`,
    lastModified: now,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const projectEntries: MetadataRoute.Sitemap = getAllProjects().map((p) => ({
    url: `${BASE_URL}/projects/${p.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const insightEntries: MetadataRoute.Sitemap = getAllInsightPosts().map((p) => ({
    url: `${BASE_URL}/insights/${p.slug}`,
    lastModified: p.date,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const teamEntries: MetadataRoute.Sitemap = TEAM.map((m) => ({
    url: `${BASE_URL}/team/${m.slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.4,
  }));

  return [...staticEntries, ...projectEntries, ...insightEntries, ...teamEntries];
}
