"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectRow } from "@/lib/projects-db";
import {
  CAT_LABELS,
  INTERIOR_CAT_LABELS,
  DIGITAL_CAT_LABELS,
  type Cat,
  type InteriorCat,
  type DigitalCat,
} from "@/lib/projects";

type Tab = "built" | "interiors" | "digital";

function ProjectTable({
  rows,
  categoryLabel,
  selected,
  toggleOne,
  toggleAll,
  deletingId,
  onDelete,
}: {
  rows: ProjectRow[];
  categoryLabel: (row: ProjectRow) => string;
  selected: Set<number>;
  toggleOne: (id: number) => void;
  toggleAll: () => void;
  deletingId: number | null;
  onDelete: (id: number, title: string) => void;
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
          <tr>
            <th className="w-10 px-4 py-3">
              <input
                type="checkbox"
                checked={rows.length > 0 && selected.size === rows.length}
                onChange={toggleAll}
                aria-label="Select all"
              />
            </th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Category</th>
            <th className="px-4 py-3">Location</th>
            <th className="px-4 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {rows.map((p) => (
            <tr key={p.id} className="border-b border-neutral-100 last:border-0">
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.has(p.id)}
                  onChange={() => toggleOne(p.id)}
                  aria-label={`Select ${p.title}`}
                />
              </td>
              <td className="px-4 py-3 font-medium text-neutral-900">{p.title}</td>
              <td className="px-4 py-3 text-neutral-500">{categoryLabel(p)}</td>
              <td className="px-4 py-3 text-neutral-500">{p.location}</td>
              <td className="px-4 py-3 text-right">
                <Link href={`/dashboard/projects/${p.id}`} className="mr-3 font-medium text-[#00352d] hover:underline">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => onDelete(p.id, p.title)}
                  disabled={deletingId === p.id}
                  className="font-medium text-red-600 hover:underline disabled:opacity-50"
                >
                  {deletingId === p.id ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ProjectsListPage() {
  const [tab, setTab] = useState<Tab>("built");
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | Cat>("all");
  const [interiorCatFilter, setInteriorCatFilter] = useState<"all" | InteriorCat>("all");
  const [digitalCatFilter, setDigitalCatFilter] = useState<"all" | DigitalCat>("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects));
  }, []);

  function switchTab(next: Tab) {
    setTab(next);
    setSelected(new Set());
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/dashboard/projects/${id}`, { method: "DELETE" });
    setProjects((prev) => prev?.filter((p) => p.id !== id) ?? null);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDeletingId(null);
  }

  // Interiors and Digital Project Experience aren't separate lists — they're
  // subsets of Projects that also carry an interior_category / digital_category,
  // same as the site's own /projects?filter=interiors view and the
  // /digital-project-experience page.
  const interiorProjects = useMemo(() => (projects ?? []).filter((p) => p.interior_category), [projects]);
  const digitalProjects = useMemo(() => (projects ?? []).filter((p) => p.digital_category), [projects]);

  const filtered = useMemo(() => {
    if (!projects) return null;
    const q = search.trim().toLowerCase();
    const source = tab === "interiors" ? interiorProjects : tab === "digital" ? digitalProjects : projects;
    return source.filter((p) => {
      if (tab === "interiors") {
        if (interiorCatFilter !== "all" && p.interior_category !== interiorCatFilter) return false;
      } else if (tab === "digital") {
        if (digitalCatFilter !== "all" && p.digital_category !== digitalCatFilter) return false;
      } else {
        if (catFilter !== "all" && p.cat !== catFilter) return false;
      }
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [projects, interiorProjects, digitalProjects, tab, search, catFilter, interiorCatFilter, digitalCatFilter]);

  const totalForTab =
    tab === "interiors" ? interiorProjects.length : tab === "digital" ? digitalProjects.length : projects?.length ?? 0;

  function toggleOne(id: number) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (!filtered) return;
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((p) => p.id))));
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.size} project${selected.size === 1 ? "" : "s"}? This can't be undone.`)) return;
    setBulkWorking(true);
    const ids = Array.from(selected);
    await Promise.all(ids.map((id) => fetch(`/api/dashboard/projects/${id}`, { method: "DELETE" })));
    setProjects((prev) => prev?.filter((p) => !selected.has(p.id)) ?? null);
    setSelected(new Set());
    setBulkWorking(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-getho text-2xl font-bold text-neutral-900">Projects</h1>
          <p className="mt-1 text-sm text-neutral-500">
            One shared list — a project shows on the Interiors or Digital Project Experience tab whenever it&apos;s tagged with that category.
          </p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-[#00352d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d]"
        >
          + New Project
        </Link>
      </div>

      <div className="mt-5 flex overflow-hidden rounded-lg border border-neutral-300 w-fit">
        <button
          type="button"
          onClick={() => switchTab("built")}
          className={`px-4 py-2 text-sm font-medium transition ${
            tab === "built" ? "bg-[#00352d] text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Built Environment
        </button>
        <button
          type="button"
          onClick={() => switchTab("interiors")}
          className={`px-4 py-2 text-sm font-medium transition ${
            tab === "interiors" ? "bg-[#00352d] text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Interiors
        </button>
        <button
          type="button"
          onClick={() => switchTab("digital")}
          className={`px-4 py-2 text-sm font-medium transition ${
            tab === "digital" ? "bg-[#00352d] text-white" : "bg-white text-neutral-600 hover:bg-neutral-50"
          }`}
        >
          Digital Project Experience
        </button>
      </div>

      {projects !== null && totalForTab > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          />
          {tab === "built" && (
            <select
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value as "all" | Cat)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
            >
              <option value="all">All categories</option>
              {(Object.keys(CAT_LABELS) as Cat[]).map((c) => (
                <option key={c} value={c}>
                  {CAT_LABELS[c]}
                </option>
              ))}
            </select>
          )}
          {tab === "interiors" && (
            <select
              value={interiorCatFilter}
              onChange={(e) => setInteriorCatFilter(e.target.value as "all" | InteriorCat)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
            >
              <option value="all">All interior categories</option>
              {(Object.keys(INTERIOR_CAT_LABELS) as InteriorCat[]).map((c) => (
                <option key={c} value={c}>
                  {INTERIOR_CAT_LABELS[c]}
                </option>
              ))}
            </select>
          )}
          {tab === "digital" && (
            <select
              value={digitalCatFilter}
              onChange={(e) => setDigitalCatFilter(e.target.value as "all" | DigitalCat)}
              className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
            >
              <option value="all">All digital categories</option>
              {(Object.keys(DIGITAL_CAT_LABELS) as DigitalCat[]).map((c) => (
                <option key={c} value={c}>
                  {DIGITAL_CAT_LABELS[c]}
                </option>
              ))}
            </select>
          )}
          {filtered && (
            <span className="text-sm text-neutral-500">
              {filtered.length} of {totalForTab}
            </span>
          )}
        </div>
      )}

      {selected.size > 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#00352d]/20 bg-[#00352d]/[0.03] px-4 py-2.5">
          <span className="text-sm font-medium text-neutral-700">{selected.size} selected</span>
          <button
            type="button"
            disabled={bulkWorking}
            onClick={bulkDelete}
            className="text-sm font-medium text-red-600 hover:underline disabled:opacity-50"
          >
            Delete
          </button>
          <button
            type="button"
            onClick={() => setSelected(new Set())}
            className="ml-auto text-sm font-medium text-neutral-400 hover:text-neutral-700"
          >
            Clear
          </button>
        </div>
      )}

      {projects === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : totalForTab === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">
          {tab === "interiors"
            ? "No projects tagged with an interiors category yet — set one when editing a project."
            : tab === "digital"
              ? "No projects tagged with a digital experience category yet — set one when editing a project."
              : "No projects yet — add the first one."}
        </p>
      ) : filtered && filtered.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No projects match your search/filters.</p>
      ) : (
        <ProjectTable
          rows={filtered ?? []}
          categoryLabel={(p) =>
            tab === "interiors"
              ? (INTERIOR_CAT_LABELS[p.interior_category as InteriorCat] ?? p.interior_category ?? "")
              : tab === "digital"
                ? (DIGITAL_CAT_LABELS[p.digital_category as DigitalCat] ?? p.digital_category ?? "")
                : (CAT_LABELS[p.cat as Cat] ?? p.cat)
          }
          selected={selected}
          toggleOne={toggleOne}
          toggleAll={toggleAll}
          deletingId={deletingId}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
