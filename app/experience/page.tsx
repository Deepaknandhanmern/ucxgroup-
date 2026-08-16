import type { Metadata } from "next";
import Experience from "@/components/sections/Experience";
import ProjectLifecycle from "@/components/sections/ProjectLifecycle";

export const metadata: Metadata = {
  title: "Experience",
  description:
    "How UCX moves a project from concept to handover — the disciplines, project lifecycle and delivery commitment behind every engagement.",
};

export default function ExperiencePage() {
  return (
    <>
      <Experience />
      <ProjectLifecycle />
    </>
  );
}
