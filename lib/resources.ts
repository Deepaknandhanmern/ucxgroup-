import type { FileFormat } from "@/components/ui/FileCard";

export type ResourceCategory = "guides" | "templates" | "reports";

export interface ResourceItem {
  cat: ResourceCategory;
  label: string;
  ref: string;
  format: FileFormat;
  title: string;
  /** Optional thumbnail — falls back to a placeholder until real cover images exist. */
  image?: string;
}

export const RESOURCE_FILTERS: { cat: ResourceCategory | "all"; label: string }[] = [
  { cat: "all", label: "All" },
  { cat: "guides", label: "Guides" },
  { cat: "templates", label: "Templates" },
  { cat: "reports", label: "Reports" },
];
