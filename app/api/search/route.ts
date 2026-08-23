import { NextResponse } from "next/server";
import { getAllInsightPosts } from "@/lib/insights-content";
import { getAllResources } from "@/lib/resources-content";
import { getAllCaseStudies } from "@/lib/case-studies-content";
import { TEAM } from "@/lib/team";

export interface SearchItem {
  type: "page" | "insight" | "resource" | "case-study" | "team";
  title: string;
  excerpt: string;
  href: string;
  category: string;
}

// Core site destinations — not covered by a content library, so listed
// directly rather than derived from a data source.
const PAGES: SearchItem[] = [
  { type: "page", title: "Home", excerpt: "UCX Group — Unconventional Collaboration.", href: "/", category: "Page" },
  { type: "page", title: "Capabilities", excerpt: "Everything UCX delivers, in one place.", href: "/capabilities", category: "Page" },
  { type: "page", title: "BIM & Digital Delivery", excerpt: "Coordinated BIM, digital engineering and VDC workflows.", href: "/bim-digital-delivery", category: "Capability" },
  { type: "page", title: "Design & Interiors", excerpt: "Integrated interior design and delivery — SpayceX.", href: "/design-interiors", category: "Capability" },
  { type: "page", title: "Project & Construction Support", excerpt: "Documentation, QA/QC, controls and execution support.", href: "/project-construction-support", category: "Capability" },
  { type: "page", title: "Asset & Digital Information", excerpt: "As-built BIM, COBie data and digital handover.", href: "/asset-digital-information", category: "Capability" },
  { type: "page", title: "Specialist Solutions", excerpt: "Scan-to-BIM, prefabrication, heritage and parametric systems.", href: "/specialist-solutions", category: "Capability" },
  { type: "page", title: "Training & Workshop", excerpt: "Industry-focused BIM and digital delivery training programs.", href: "/training-workshop", category: "Capability" },
  { type: "page", title: "Experience", excerpt: "Projects spanning buildings, developments and infrastructure.", href: "/experience", category: "Page" },
  { type: "page", title: "Digital Project Experience", excerpt: "Technology-led delivery for complex project requirements.", href: "/digital-project-experience", category: "Page" },
  { type: "page", title: "Projects", excerpt: "Selected project experience across sectors.", href: "/projects", category: "Page" },
  { type: "page", title: "Collaboration Lab", excerpt: "Co-creating solutions with firms, partners and specialists.", href: "/collaboration-lab", category: "Page" },
  { type: "page", title: "Insights", excerpt: "Perspectives on BIM, digital delivery and design technology.", href: "/insights", category: "Page" },
  { type: "page", title: "Case Studies", excerpt: "Real project outcomes across sectors.", href: "/case-studies", category: "Page" },
  { type: "page", title: "Resources", excerpt: "Guides, templates and reports.", href: "/resources", category: "Page" },
  { type: "page", title: "About Us", excerpt: "The studio and founders behind UCX.", href: "/about-us", category: "Company" },
  { type: "page", title: "Team", excerpt: "Meet the people behind UCX.", href: "/team", category: "Company" },
  { type: "page", title: "Careers", excerpt: "Build your career with a collaborative digital delivery team.", href: "/careers", category: "Company" },
  { type: "page", title: "Global Delivery", excerpt: "India-based delivery supporting international project teams.", href: "/global-delivery", category: "Company" },
  { type: "page", title: "Contact", excerpt: "Get in touch or book a call with our team.", href: "/contact", category: "Page" },
];

export async function GET() {
  const posts = getAllInsightPosts();
  const resources = getAllResources();
  const caseStudies = getAllCaseStudies();

  const items: SearchItem[] = [
    ...PAGES,
    ...posts.map((p) => ({
      type: "insight" as const,
      title: p.title,
      excerpt: p.excerpt,
      href: `/insights/${p.slug}`,
      category: p.category,
    })),
    ...resources.map((r) => ({
      type: "resource" as const,
      title: r.title,
      excerpt: r.label,
      href: "/resources",
      category: r.cat,
    })),
    ...caseStudies.map((c) => ({
      type: "case-study" as const,
      title: c.title,
      excerpt: c.label,
      href: "/case-studies",
      category: c.cat,
    })),
    ...TEAM.map((m) => ({
      type: "team" as const,
      title: m.name,
      excerpt: m.role,
      href: `/team/${m.slug}`,
      category: "Team",
    })),
  ];

  return NextResponse.json(items);
}
