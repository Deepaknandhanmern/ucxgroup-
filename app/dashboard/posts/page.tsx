"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { BlogPostRow, PostStatus } from "@/lib/blog-posts-db";

const STATUS_BADGE: Record<PostStatus, string> = {
  published: "bg-emerald-100 text-emerald-800",
  draft: "bg-amber-100 text-amber-800",
  scheduled: "bg-blue-100 text-blue-800",
};

const STATUS_LABEL: Record<PostStatus, string> = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
};

export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPostRow[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | PostStatus>("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/posts")
      .then((r) => r.json())
      .then((data) => setPosts(data.posts));
  }, []);

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeletingId(id);
    await fetch(`/api/dashboard/posts/${id}`, { method: "DELETE" });
    setPosts((prev) => prev?.filter((p) => p.id !== id) ?? null);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setDeletingId(null);
  }

  const categories = useMemo(
    () => Array.from(new Set((posts ?? []).map((p) => p.category))).sort(),
    [posts]
  );

  const filtered = useMemo(() => {
    if (!posts) return null;
    const q = search.trim().toLowerCase();
    return posts.filter((p) => {
      if (statusFilter !== "all" && p.status !== statusFilter) return false;
      if (categoryFilter !== "all" && p.category !== categoryFilter) return false;
      if (q && !p.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [posts, search, statusFilter, categoryFilter]);

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

  async function bulkSetStatus(status: "draft" | "published") {
    setBulkWorking(true);
    const ids = Array.from(selected);
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/dashboard/posts/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      )
    );
    setPosts((prev) => prev?.map((p) => (selected.has(p.id) ? { ...p, status } : p)) ?? null);
    setSelected(new Set());
    setBulkWorking(false);
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.size} post${selected.size === 1 ? "" : "s"}? This can't be undone.`)) return;
    setBulkWorking(true);
    const ids = Array.from(selected);
    await Promise.all(ids.map((id) => fetch(`/api/dashboard/posts/${id}`, { method: "DELETE" })));
    setPosts((prev) => prev?.filter((p) => !selected.has(p.id)) ?? null);
    setSelected(new Set());
    setBulkWorking(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-getho text-2xl font-bold text-neutral-900">Blog Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="rounded-lg bg-[#00352d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d]"
        >
          + New Post
        </Link>
      </div>

      {posts !== null && posts.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title…"
            className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as "all" | PostStatus)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="scheduled">Scheduled</option>
          </select>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          >
            <option value="all">All categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {filtered && <span className="text-sm text-neutral-500">{filtered.length} of {posts.length}</span>}
        </div>
      )}

      {selected.size > 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#00352d]/20 bg-[#00352d]/[0.03] px-4 py-2.5">
          <span className="text-sm font-medium text-neutral-700">{selected.size} selected</span>
          <button
            type="button"
            disabled={bulkWorking}
            onClick={() => bulkSetStatus("published")}
            className="text-sm font-medium text-emerald-700 hover:underline disabled:opacity-50"
          >
            Publish
          </button>
          <button
            type="button"
            disabled={bulkWorking}
            onClick={() => bulkSetStatus("draft")}
            className="text-sm font-medium text-amber-700 hover:underline disabled:opacity-50"
          >
            Unpublish
          </button>
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

      {posts === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No posts yet — create the first one.</p>
      ) : filtered && filtered.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No posts match your search/filters.</p>
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
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
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
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${STATUS_BADGE[p.status]}`}>
                      {STATUS_LABEL[p.status]}
                      {p.status === "scheduled" && p.publish_at && (
                        <span className="font-normal"> · {new Date(p.publish_at).toLocaleString()}</span>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{p.category}</td>
                  <td className="px-4 py-3 text-neutral-500">{p.date}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/dashboard/posts/${p.id}`}
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
