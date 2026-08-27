import type { Metadata } from "next";
import CaseStudies from "@/components/sections/CaseStudies";
import { getAllCaseStudies } from "@/lib/case-studies-content";

// Reads case studies straight from the dashboard's database on every
// request — never statically prerendered, so edits show up live.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  alternates: { canonical: "/case-studies" },
  title: "Case Studies",
  description:
    "In-depth case studies on how UCX solves coordination, delivery and asset-information challenges across BIM, interiors, construction and handover.",
  openGraph: {
    title: "Case Studies | UCX Group",
    description:
      "In-depth case studies on how UCX solves coordination, delivery and asset-information challenges across BIM, interiors, construction and handover.",
    url: "https://ucx-group.com/case-studies",
    type: "website",
  },
};

export default function CaseStudiesPage() {
  const cases = getAllCaseStudies();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: cases.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "CreativeWork",
        name: c.title,
        ...(c.image ? { image: c.image } : {}),
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CaseStudies cases={cases} />
    </>
  );
}
