"use client";

import { useEffect, useState } from "react";
import type { ResourceRow } from "@/lib/resources-db";
import UploadField from "@/components/dashboard/UploadField";

const CATEGORIES = ["guides", "templates", "reports"];
const FORMATS = ["pdf", "doc", "xlsx", "csv", "zip", "pptx"];
const EMPTY = { ref: "", cat: "guides", format: "pdf", title: "", image: "", pdfUrl: "" };

export default function ResourcesDashboardPage() {
  const [items, setItems] = useState<ResourceRow[] | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/dashboard/resources")
      .then((r) => r.json())
      .then((data) => setItems(data.resources));
  }

  useEffect(load, []);

  function startNew() {
    setForm(EMPTY);
    setEditingId("new");
    setError("");
  }

  function startEdit(item: ResourceRow) {
    setForm({ ref: item.ref, cat: item.cat, format: item.format, title: item.title, image: item.image ?? "", pdfUrl: item.pdf_url ?? "" });
    setEditingId(item.id);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(editingId === "new" ? "/api/dashboard/resources" : `/api/dashboard/resources/${editingId}`, {
      method: editingId === "new" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setEditingId(null);
      load();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
    }
    setSaving(false);
  }

  async function handleDelete(id: number, title: string) {
    if (!confirm(`Delete "${title}"?`)) return;
    await fetch(`/api/dashboard/resources/${id}`, { method: "DELETE" });
    load();
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#00352d] focus:ring-1 focus:ring-[#00352d]";
  const labelClass = "block text-sm font-medium text-neutral-700";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-getho text-2xl font-bold text-neutral-900">Resources</h1>
        {editingId === null && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-lg bg-[#00352d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d]"
          >
            + Add Resource
          </button>
        )}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
          <label className={labelClass}>
            Title
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label className={labelClass}>
              Reference
              <input className={inputClass} value={form.ref} onChange={(e) => setForm({ ...form, ref: e.target.value })} placeholder="RS-10" required />
            </label>
            <label className={labelClass}>
              Category
              <select className={inputClass} value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label className={labelClass}>
              Format
              <select className={inputClass} value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })}>
                {FORMATS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <UploadField label="Cover image" kind="image" value={form.image} onChange={(url) => setForm({ ...form, image: url })} />
            <UploadField label="File" kind="document" value={form.pdfUrl} onChange={(url) => setForm({ ...form, pdfUrl: url })} />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#00352d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button type="button" onClick={() => setEditingId(null)} className="text-sm font-medium text-neutral-500 hover:text-neutral-800">
              Cancel
            </button>
          </div>
        </form>
      )}

      {items === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : items.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No resources yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex items-start justify-between rounded-xl border border-neutral-200 bg-white p-4">
              <div>
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {item.ref} · {item.cat} · {item.format}
                  {item.pdf_url ? " · file attached" : ""}
                </p>
              </div>
              <div className="flex flex-none items-center gap-3">
                <button type="button" onClick={() => startEdit(item)} className="text-sm font-medium text-[#00352d] hover:underline">
                  Edit
                </button>
                <button type="button" onClick={() => handleDelete(item.id, item.title)} className="text-sm font-medium text-red-600 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
