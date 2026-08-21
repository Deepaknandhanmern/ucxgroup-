import type { Metadata } from "next";
import Resources from "@/components/sections/Resources";
import { getAllResources } from "@/lib/resources-content";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Guides, templates and reference material from UCX on BIM standards, digital delivery workflows and asset information requirements.",
};

export default function ResourcesPage() {
  return <Resources resources={getAllResources()} />;
}
