"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { BlogPostRow } from "@/lib/blog-posts-db";

export default function PostsListPage() {
  const [posts, setPosts] = useState<BlogPostRow[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

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
    setDeletingId(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-900">Blog Posts</h1>
        <Link
          href="/dashboard/posts/new"
          className="rounded-lg bg-[#00352d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d]"
        >
          + New Post
        </Link>
      </div>

      {posts === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : posts.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No posts yet — create the first one.</p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-xl border border-neutral-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-200 bg-neutral-50 text-xs uppercase tracking-wide text-neutral-500">
              <tr>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-neutral-100 last:border-0">
                  <td className="px-4 py-3 font-medium text-neutral-900">{p.title}</td>
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
