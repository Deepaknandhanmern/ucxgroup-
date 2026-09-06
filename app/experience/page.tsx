import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";
import ProjectLifecycle from "@/components/sections/ProjectLifecycle";

const TITLE = "Experience";
const DESCRIPTION =
  "How UCX moves a project from concept to handover — the disciplines, project lifecycle and delivery commitment behind every engagement.";

export const metadata: Metadata = {
  alternates: { canonical: "/experience" },
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    url: "https://ucx-group.com/experience",
    type: "website",
    images: ["/brand/social.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: `${TITLE} | UCX Group`,
    description: DESCRIPTION,
    images: ["/brand/social.png"],
  },
};

export default function ExperiencePage() {
  return (
    <>
      <Experience />
      <ProjectLifecycle />
    </>
  );
}
