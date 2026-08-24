"use client";

import { useEffect, useState } from "react";
import type { JobOpeningRow } from "@/lib/job-openings-db";

const EMPTY = { title: "", department: "", location: "", type: "Full-time", description: "" };

export default function CareersDashboardPage() {
  const [jobs, setJobs] = useState<JobOpeningRow[] | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function load() {
    fetch("/api/dashboard/jobs")
      .then((r) => r.json())
      .then((data) => setJobs(data.jobs));
  }

  useEffect(load, []);

  function startNew() {
    setForm(EMPTY);
    setEditingId("new");
    setError("");
  }

  function startEdit(job: JobOpeningRow) {
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      description: job.description,
    });
    setEditingId(job.id);
    setError("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(editingId === "new" ? "/api/dashboard/jobs" : `/api/dashboard/jobs/${editingId}`, {
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
    await fetch(`/api/dashboard/jobs/${id}`, { method: "DELETE" });
    load();
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#00352d] focus:ring-1 focus:ring-[#00352d]";
  const labelClass = "block text-sm font-medium text-neutral-700";

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-getho text-2xl font-bold text-neutral-900">Careers — Open Positions</h1>
        {editingId === null && (
          <button
            type="button"
            onClick={startNew}
            className="rounded-lg bg-[#00352d] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d]"
          >
            + Add Position
          </button>
        )}
      </div>

      {editingId !== null && (
        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
          <label className={labelClass}>
            Job title
            <input
              className={inputClass}
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </label>
          <div className="grid grid-cols-3 gap-4">
            <label className={labelClass}>
              Department
              <input
                className={inputClass}
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Location
              <input
                className={inputClass}
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </label>
            <label className={labelClass}>
              Type
              <input
                className={inputClass}
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                placeholder="Full-time"
              />
            </label>
          </div>
          <label className={labelClass}>
            Description
            <textarea
              className={inputClass}
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[#00352d] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#00473d] disabled:opacity-60"
            >
              {saving ? "Saving…" : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditingId(null)}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {jobs === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : jobs.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No open positions yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {jobs.map((job) => (
            <div key={job.id} className="flex items-start justify-between rounded-xl border border-neutral-200 bg-white p-4">
              <div>
                <p className="font-medium text-neutral-900">{job.title}</p>
                <p className="mt-0.5 text-sm text-neutral-500">
                  {job.department} · {job.location} · {job.type}
                </p>
              </div>
              <div className="flex flex-none items-center gap-3">
                <button type="button" onClick={() => startEdit(job)} className="text-sm font-medium text-[#00352d] hover:underline">
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(job.id, job.title)}
                  className="text-sm font-medium text-red-600 hover:underline"
                >
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
