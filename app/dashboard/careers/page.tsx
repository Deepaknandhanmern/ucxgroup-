"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { JobOpeningRow } from "@/lib/job-openings-db";
import { useLeaveGuard } from "@/components/dashboard/useLeaveGuard";
import UnsavedChangesCard from "@/components/dashboard/UnsavedChangesCard";

// Sentinel leaveTarget meaning "just close the inline form" rather than
// navigate to a real URL — used when Cancel is clicked with unsaved changes.
const CLOSE_FORM = "__close__";

const EMPTY = { title: "", department: "", location: "", type: "Full-time", experience: "Entry Level (0-2 yrs)", description: "" };

const EXPERIENCE_LEVELS = [
  "Entry Level (0-2 yrs)",
  "Mid Level (2-5 yrs)",
  "Senior Level (5-8 yrs)",
  "Lead / Principal (8+ yrs)",
];

export default function CareersDashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobOpeningRow[] | null>(null);
  const [editingId, setEditingId] = useState<number | "new" | null>(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const savedFormRef = useRef<string | null>(null);

  function load() {
    fetch("/api/dashboard/jobs")
      .then((r) => r.json())
      .then((data) => setJobs(data.jobs));
  }

  useEffect(load, []);

  function startNew() {
    setForm(EMPTY);
    savedFormRef.current = JSON.stringify(EMPTY);
    setEditingId("new");
    setError("");
  }

  function startEdit(job: JobOpeningRow) {
    const next = {
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience || EXPERIENCE_LEVELS[0],
      description: job.description,
    };
    setForm(next);
    savedFormRef.current = JSON.stringify(next);
    setEditingId(job.id);
    setError("");
  }

  async function saveJob(): Promise<boolean> {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(editingId === "new" ? "/api/dashboard/jobs" : `/api/dashboard/jobs/${editingId}`, {
        method: editingId === "new" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong.");
        setSaving(false);
        return false;
      }
      savedFormRef.current = JSON.stringify(form);
      setSaving(false);
      return true;
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
      setSaving(false);
      return false;
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const ok = await saveJob();
    if (ok) {
      setEditingId(null);
      load();
    }
  }

  const isDirty = editingId !== null && savedFormRef.current !== null && JSON.stringify(form) !== savedFormRef.current;
  const { leaveTarget, setLeaveTarget } = useLeaveGuard(isDirty);

  function closeOrNavigate(target: string) {
    setLeaveTarget(null);
    if (target === CLOSE_FORM) setEditingId(null);
    else router.push(target);
  }

  async function saveAndLeave() {
    const ok = await saveJob();
    if (ok) {
      load();
      closeOrNavigate(leaveTarget ?? CLOSE_FORM);
    }
  }

  function discardAndLeave() {
    closeOrNavigate(leaveTarget ?? CLOSE_FORM);
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
            Experience level
            <select
              className={inputClass}
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>
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
              onClick={() => (isDirty ? setLeaveTarget(CLOSE_FORM) : setEditingId(null))}
              className="text-sm font-medium text-neutral-500 hover:text-neutral-800"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {leaveTarget !== null && (
        <UnsavedChangesCard
          saving={saving}
          error={error}
          actions={[{ label: "Save", onClick: saveAndLeave }]}
          onDiscard={discardAndLeave}
          onKeepEditing={() => setLeaveTarget(null)}
        />
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
                  {job.experience ? ` · ${job.experience}` : ""}
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
