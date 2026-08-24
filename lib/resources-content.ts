import "server-only";
import type { FileFormat } from "@/components/ui/FileCard";
import { RESOURCE_FILTERS, type ResourceItem, type ResourceCategory } from "@/lib/resources";
import { listResources } from "@/lib/resources-db";

const LABELS: Record<string, string> = Object.fromEntries(
  RESOURCE_FILTERS.filter((f) => f.cat !== "all").map((f) => [f.cat, f.label])
);

export function getAllResources(): ResourceItem[] {
  return listResources().map((row) => ({
    cat: row.cat as ResourceCategory,
    label: LABELS[row.cat] ?? row.cat,
    ref: row.ref,
    format: row.format as FileFormat,
    title: row.title,
    image: row.image ?? undefined,
    pdfUrl: row.pdf_url ?? undefined,
  }));
}
