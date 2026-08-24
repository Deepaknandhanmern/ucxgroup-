import "server-only";
import { CASE_STUDY_FILTERS, type CaseStudy, type CaseStudyCategory } from "@/lib/case-studies";
import { listCaseStudies } from "@/lib/case-studies-db";

const LABELS: Record<string, string> = Object.fromEntries(
  CASE_STUDY_FILTERS.filter((f) => f.cat !== "all").map((f) => [f.cat, f.label])
);

export function getAllCaseStudies(): CaseStudy[] {
  return listCaseStudies().map((row) => ({
    cat: row.cat as CaseStudyCategory,
    label: LABELS[row.cat] ?? row.cat,
    ref: row.ref,
    pages: row.pages,
    title: row.title,
    image: row.image ?? undefined,
  }));
}
