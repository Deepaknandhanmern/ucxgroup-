export type Cat = "commercial" | "residential" | "industrial" | "infrastructure" | "specialized";

export type InteriorCat =
  | "workplace-office"
  | "hospitality-retail"
  | "residential-interiors"
  | "custom-furniture"
  | "modular-interiors";

export interface Project {
  slug: string;
  cat: Cat;
  interiorCategory?: InteriorCat;
  title: string;
  location: string;
  discipline: string;
  stage: string;
  technology: string[];
  image: string;
  summary: string;
  body: string[];
  scope: string[];
}

export const FILTERS: { cat: Cat | "all"; label: string }[] = [
  { cat: "all", label: "All Projects" },
  { cat: "commercial", label: "Commercial & Mixed-Use" },
  { cat: "residential", label: "Residential" },
  { cat: "industrial", label: "Industrial" },
  { cat: "infrastructure", label: "Infrastructure" },
  { cat: "specialized", label: "Specialized Projects" },
];

export const CAT_LABELS: Record<Cat, string> = {
  commercial: "Commercial & Mixed-Use",
  residential: "Residential",
  industrial: "Industrial",
  infrastructure: "Infrastructure",
  specialized: "Specialized Projects",
};

export const INTERIOR_FILTERS: { cat: InteriorCat | "all"; label: string }[] = [
  { cat: "all", label: "All Categories" },
  { cat: "workplace-office", label: "Workplace & Office" },
  { cat: "hospitality-retail", label: "Hospitality & Retail" },
  { cat: "residential-interiors", label: "Residential Interiors" },
  { cat: "custom-furniture", label: "Custom Furniture" },
  { cat: "modular-interiors", label: "Modular Interiors" },
];

export const INTERIOR_CAT_LABELS: Record<InteriorCat, string> = {
  "workplace-office": "Workplace & Office",
  "hospitality-retail": "Hospitality & Retail",
  "residential-interiors": "Residential Interiors",
  "custom-furniture": "Custom Furniture",
  "modular-interiors": "Modular Interiors",
};

// Individual project data now lives in the dashboard's database (see
// lib/projects-db.ts / lib/projects-content.ts) so the client can add, edit
// and remove portfolio entries without a code change. This file keeps only
// the shared types and the fixed category taxonomy, which are still safe to
// import from a client component (no DB access).
