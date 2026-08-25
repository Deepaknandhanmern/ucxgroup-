"use client";

import { useEffect, useMemo, useState } from "react";
import type { EnquiryRow, EnquiryStatus } from "@/lib/enquiries-db";

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact Form",
  careers: "Careers Application",
  "case-study-download": "Case Study Download",
  "resource-download": "Resource Download",
  "training-workshop": "Training & Workshop",
  "insight-lead": "Insight Article",
  "homepage-query": "Homepage Query",
  "interiors-enquiry": "Design & Interiors",
  "collaboration-challenge": "Collaboration Lab",
  "calendly-booking": "Calendly Booking",
};

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const STATUS_BADGE: Record<EnquiryStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  contacted: "bg-amber-100 text-amber-800",
  closed: "bg-neutral-200 text-neutral-600",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[] | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [readFilter, setReadFilter] = useState<"all" | "unread" | "read">("all");
  const [statusFilter, setStatusFilter] = useState<"all" | EnquiryStatus>("all");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [bulkWorking, setBulkWorking] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/enquiries")
      .then((r) => r.json())
      .then((data) => setEnquiries(data.enquiries));
  }, []);

  const sources = useMemo(
    () => Array.from(new Set((enquiries ?? []).map((e) => e.source))).sort(),
    [enquiries]
  );

  const filtered = useMemo(() => {
    if (!enquiries) return null;
    const q = search.trim().toLowerCase();
    return enquiries.filter((e) => {
      if (sourceFilter !== "all" && e.source !== sourceFilter) return false;
      if (readFilter === "unread" && e.read) return false;
      if (readFilter === "read" && !e.read) return false;
      if (statusFilter !== "all" && e.status !== statusFilter) return false;
      if (q) {
        const haystack = [e.name, e.email, e.subject, e.message].filter(Boolean).join(" ").toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [enquiries, search, sourceFilter, readFilter, statusFilter]);

  async function setRead(id: number, read: boolean) {
    setEnquiries((prev) => prev?.map((e) => (e.id === id ? { ...e, read: read ? 1 : 0 } : e)) ?? null);
    await fetch(`/api/dashboard/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
    });
  }

  async function setStatus(id: number, status: EnquiryStatus) {
    setEnquiries((prev) => prev?.map((e) => (e.id === id ? { ...e, status } : e)) ?? null);
    await fetch(`/api/dashboard/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function toggleExpand(e: EnquiryRow) {
    const expanding = expandedId !== e.id;
    setExpandedId(expanding ? e.id : null);
    if (expanding && !e.read) setRead(e.id, true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/dashboard/enquiries/${id}`, { method: "DELETE" });
    setEnquiries((prev) => prev?.filter((e) => e.id !== id) ?? null);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

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
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((e) => e.id))));
  }

  async function bulkSetRead(read: boolean) {
    setBulkWorking(true);
    const ids = Array.from(selected);
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/dashboard/enquiries/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ read }),
        })
      )
    );
    setEnquiries((prev) => prev?.map((e) => (selected.has(e.id) ? { ...e, read: read ? 1 : 0 } : e)) ?? null);
    setSelected(new Set());
    setBulkWorking(false);
  }

  async function bulkSetStatus(status: EnquiryStatus) {
    setBulkWorking(true);
    const ids = Array.from(selected);
    await Promise.all(
      ids.map((id) =>
        fetch(`/api/dashboard/enquiries/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status }),
        })
      )
    );
    setEnquiries((prev) => prev?.map((e) => (selected.has(e.id) ? { ...e, status } : e)) ?? null);
    setSelected(new Set());
    setBulkWorking(false);
  }

  async function bulkDelete() {
    if (!confirm(`Delete ${selected.size} enquir${selected.size === 1 ? "y" : "ies"}? This can't be undone.`)) return;
    setBulkWorking(true);
    const ids = Array.from(selected);
    await Promise.all(ids.map((id) => fetch(`/api/dashboard/enquiries/${id}`, { method: "DELETE" })));
    setEnquiries((prev) => prev?.filter((e) => !selected.has(e.id)) ?? null);
    setSelected(new Set());
    setBulkWorking(false);
  }

  const unreadCount = enquiries?.filter((e) => !e.read).length ?? 0;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-getho text-2xl font-bold text-neutral-900">Enquiries</h1>
          {unreadCount > 0 && <p className="mt-1 text-sm text-neutral-500">{unreadCount} unread</p>}
        </div>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- CSV file download, not a page */}
        <a
          href="/api/dashboard/enquiries/export"
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          Export CSV
        </a>
      </div>

      {enquiries !== null && enquiries.length > 0 && (
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <input
            type="text"
            value={search}
            onChange={(ev) => setSearch(ev.target.value)}
            placeholder="Search name, email, subject, message…"
            className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          />
          <select
            value={sourceFilter}
            onChange={(ev) => setSourceFilter(ev.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          >
            <option value="all">All sources</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {SOURCE_LABELS[s] ?? s}
              </option>
            ))}
          </select>
          <select
            value={readFilter}
            onChange={(ev) => setReadFilter(ev.target.value as "all" | "unread" | "read")}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <select
            value={statusFilter}
            onChange={(ev) => setStatusFilter(ev.target.value as "all" | EnquiryStatus)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-[#00352d] focus:outline-none"
          >
            <option value="all">All statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
          {filtered && filtered.length > 0 && (
            <label className="flex items-center gap-1.5 text-sm text-neutral-500">
              <input
                type="checkbox"
                checked={selected.size === filtered.length}
                onChange={toggleAll}
              />
              Select all
            </label>
          )}
          {filtered && <span className="text-sm text-neutral-500">{filtered.length} of {enquiries.length}</span>}
        </div>
      )}

      {selected.size > 0 && (
        <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#00352d]/20 bg-[#00352d]/[0.03] px-4 py-2.5">
          <span className="text-sm font-medium text-neutral-700">{selected.size} selected</span>
          <button
            type="button"
            disabled={bulkWorking}
            onClick={() => bulkSetRead(true)}
            className="text-sm font-medium text-[#00352d] hover:underline disabled:opacity-50"
          >
            Mark read
          </button>
          <button
            type="button"
            disabled={bulkWorking}
            onClick={() => bulkSetRead(false)}
            className="text-sm font-medium text-neutral-600 hover:underline disabled:opacity-50"
          >
            Mark unread
          </button>
          <select
            disabled={bulkWorking}
            defaultValue=""
            onChange={(ev) => {
              if (ev.target.value) bulkSetStatus(ev.target.value as EnquiryStatus);
              ev.target.value = "";
            }}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1 text-sm font-medium text-neutral-600 disabled:opacity-50"
          >
            <option value="" disabled>
              Set status…
            </option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="closed">Closed</option>
          </select>
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

      {enquiries === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : enquiries.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No enquiries yet.</p>
      ) : filtered && filtered.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No enquiries match your search/filters.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {(filtered ?? []).map((e) => {
            const data = JSON.parse(e.data) as Record<string, unknown>;
            const expanded = expandedId === e.id;
            const resumeUrl = typeof data.resume_url === "string" ? data.resume_url : null;
            return (
              <div
                key={e.id}
                className={`rounded-xl border bg-white p-4 ${e.read ? "border-neutral-200" : "border-[#00352d]/30 bg-[#00352d]/[0.02]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected.has(e.id)}
                      onChange={() => toggleOne(e.id)}
                      aria-label={`Select enquiry from ${e.name ?? e.email ?? "unknown"}`}
                      className="mt-1.5 flex-none"
                    />
                    <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!e.read && <span className="h-2 w-2 flex-none rounded-full bg-[#00352d]" aria-label="Unread" />}
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                        {SOURCE_LABELS[e.source] ?? e.source}
                      </span>
                      <select
                        value={e.status}
                        onChange={(ev) => setStatus(e.id, ev.target.value as EnquiryStatus)}
                        className={`rounded-full border-none px-2.5 py-0.5 text-xs font-semibold ${STATUS_BADGE[e.status]}`}
                      >
                        {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((s) => (
                          <option key={s} value={s}>
                            {STATUS_LABELS[s]}
                          </option>
                        ))}
                      </select>
                      <span className="text-xs text-neutral-400">
                        {new Date(e.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className={`mt-1.5 truncate ${e.read ? "font-medium" : "font-bold"} text-neutral-900`}>
                      {e.name ?? "—"} {e.email && <span className="font-normal text-neutral-500">· {e.email}</span>}
                    </p>
                    {e.subject && <p className="mt-0.5 text-sm text-neutral-600">{e.subject}</p>}
                    {e.message && <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{e.message}</p>}
                    </div>
                  </div>
                  <div className="flex flex-none items-center gap-3">
                    <button type="button" onClick={() => toggleExpand(e)} className="text-sm font-medium text-[#00352d] hover:underline">
                      {expanded ? "Hide details" : "View details"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setRead(e.id, !e.read)}
                      className="text-sm font-medium text-neutral-500 hover:underline"
                    >
                      {e.read ? "Mark unread" : "Mark read"}
                    </button>
                    <button type="button" onClick={() => handleDelete(e.id)} className="text-sm font-medium text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>

                {expanded && (
                  <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 border-t border-neutral-100 pt-4 text-sm">
                    {resumeUrl && (
                      <div className="col-span-2">
                        <a
                          href={resumeUrl}
                          download
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-lg bg-[#00352d] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#00473d]"
                        >
                          Download Resume
                        </a>
                      </div>
                    )}
                    {Object.entries(data)
                      .filter(([key]) => key !== "resume_url")
                      .map(([key, value]) => (
                        <div key={key} className="min-w-0">
                          <dt className="text-xs font-semibold uppercase tracking-wide text-neutral-400">{key}</dt>
                          <dd className="break-words text-neutral-700">{String(value)}</dd>
                        </div>
                      ))}
                  </dl>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
