import "server-only";
import type { Cat, InteriorCat, Project } from "@/lib/projects";
import { listProjects, getProjectBySlug, type ProjectRow } from "@/lib/projects-db";

function toProject(row: ProjectRow): Project {
  return {
    slug: row.slug,
    cat: row.cat as Cat,
    interiorCategory: row.interior_category ? (row.interior_category as InteriorCat) : undefined,
    title: row.title,
    location: row.location,
    discipline: row.discipline,
    stage: row.stage,
    technology: JSON.parse(row.technology) as string[],
    image: row.image,
    summary: row.summary,
    body: JSON.parse(row.body) as string[],
    scope: JSON.parse(row.scope) as string[],
  };
}

export function getAllProjects(): Project[] {
  return listProjects().map(toProject);
}

export function getProject(slug: string): Project | undefined {
  const row = getProjectBySlug(slug);
  return row ? toProject(row) : undefined;
}
