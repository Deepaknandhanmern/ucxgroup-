export type CaseStudyCategory = "institutional" | "infrastructural" | "hospitality" | "healthcare" | "retail";

export interface CaseStudy {
  cat: CaseStudyCategory;
  label: string;
  ref: string;
  pages: string;
  title: string;
}

export const CASE_STUDY_FILTERS: { cat: CaseStudyCategory | "all"; label: string }[] = [
  { cat: "all", label: "All" },
  { cat: "institutional", label: "Institutional" },
  { cat: "infrastructural", label: "Infrastructural" },
  { cat: "hospitality", label: "Hospitality" },
  { cat: "healthcare", label: "Healthcare" },
  { cat: "retail", label: "Retail" },
];
