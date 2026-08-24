"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { ProjectRow } from "@/lib/projects-db";
import { CAT_LABELS, type Cat } from "@/lib/projects";

export default function ProjectsListPage() {
  const [projects, setProjects] = useState<ProjectRow[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<"all" | Cat>("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/projects")
      .then((r) => r.json())
      .then((data) => setProjects(data.projects));
  }, []);

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

  const filtered = useMemo(() => {
    if (!projects) return null;
    const q = search.trim().toLowerCase();
    return projects.filter((p) => {
      if (catFilter !== "all" && p.cat !== catFilter) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [projects, search, catFilter]);

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
          <p className="mt-1 text-sm text-neutral-500">Shows under both Built Environment and Interiors on the site.</p>
        </div>
        <Link
          href="/dashboard/projects/new"
          className="rounded-lg bg-[#00352d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d]"
        >
          + New Project
        </Link>
      </div>

      {projects !== null && projects.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          />
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
          {filtered && <span className="text-sm text-neutral-500">{filtered.length} of {projects.length}</span>}
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
      ) : projects.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No projects yet — add the first one.</p>
      ) : filtered && filtered.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No projects match your search/filters.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={filtered !== null && filtered.length > 0 && selected.size === filtered.length}
                    onChange={toggleAll}
                    aria-label="Select all"
                  />
                </th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Interiors</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {(filtered ?? []).map((p) => (
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
                  <td className="px-4 py-3 text-neutral-500">{CAT_LABELS[p.cat as Cat] ?? p.cat}</td>
                  <td className="px-4 py-3 text-neutral-500">{p.interior_category ? "Yes" : "—"}</td>
                  <td className="px-4 py-3 text-neutral-500">{p.location}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      className="mr-3 font-medium text-[#00352d] hover:underline"
                    >
                      Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(p.id, p.title)}
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
      )}
    </div>
  );
}
