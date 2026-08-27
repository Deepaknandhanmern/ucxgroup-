import type { Metadata } from "next";
import Resources from "@/components/sections/Resources";
import { getAllResources } from "@/lib/resources-content";

// Reads resources straight from the dashboard's database on every request —
// never statically prerendered, so edits show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/resources" },
  title: "Resources",
  description:
    "Guides, templates and reference material from UCX on BIM standards, digital delivery workflows and asset information requirements.",
  openGraph: {
    title: "Resources | UCX Group",
    description:
      "Guides, templates and reference material from UCX on BIM standards, digital delivery workflows and asset information requirements.",
    url: "https://ucx-group.com/resources",
    type: "website",
  },
};

export default function ResourcesPage() {
  const resources = getAllResources();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: resources.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: r.title,
        ...(r.image ? { image: r.image } : {}),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Resources resources={resources} />
    </>
  );
}
