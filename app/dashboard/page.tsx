import Link from "next/link";
import { listPosts } from "@/lib/blog-posts-db";
import { listJobOpenings } from "@/lib/job-openings-db";
import { listCaseStudies } from "@/lib/case-studies-db";
import { listResources } from "@/lib/resources-db";
import { listEnquiries } from "@/lib/enquiries-db";

export default function DashboardHome() {
  const posts = listPosts();
  const published = posts.filter((p) => p.status === "published").length;
  const drafts = posts.filter((p) => p.status === "draft").length;
  const jobs = listJobOpenings().length;
  const caseStudies = listCaseStudies().length;
  const resources = listResources().length;
  const enquiries = listEnquiries();
  const unread = enquiries.filter((e) => !e.read).length;

  const cards = [
    { href: "/dashboard/posts", label: "Blog Posts", value: posts.length, detail: `${published} published · ${drafts} draft` },
    { href: "/dashboard/case-studies", label: "Case Studies", value: caseStudies, detail: "in Project Knowledge" },
    { href: "/dashboard/resources", label: "Resources", value: resources, detail: "guides, templates, reports" },
    { href: "/dashboard/careers", label: "Open Positions", value: jobs, detail: "on the careers page" },
    {
      href: "/dashboard/enquiries",
      label: "Enquiries",
      value: enquiries.length,
      detail: unread > 0 ? `${unread} unread` : "all read",
      highlight: unread > 0,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Overview</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className={`rounded-xl border bg-white p-5 transition hover:shadow-sm ${
              c.highlight ? "border-[#00352d]/40" : "border-neutral-200"
            }`}
          >
            <p className="text-sm font-medium text-neutral-500">{c.label}</p>
            <p className="mt-1 text-3xl font-bold text-neutral-900">{c.value}</p>
            <p className="mt-1 text-xs text-neutral-400">{c.detail}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
