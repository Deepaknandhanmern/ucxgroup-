"use client";

import { useEffect, useState } from "react";
import type { EnquiryRow } from "@/lib/enquiries-db";

const SOURCE_LABELS: Record<string, string> = {
  contact: "Contact Form",
  careers: "Careers Application",
  "case-study-download": "Case Study Download",
  "resource-download": "Resource Download",
};

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<EnquiryRow[] | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/dashboard/enquiries")
      .then((r) => r.json())
      .then((data) => setEnquiries(data.enquiries));
  }, []);

  async function setRead(id: number, read: boolean) {
    setEnquiries((prev) => prev?.map((e) => (e.id === id ? { ...e, read: read ? 1 : 0 } : e)) ?? null);
    await fetch(`/api/dashboard/enquiries/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ read }),
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

      {enquiries === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : enquiries.length === 0 ? (
        <p className="mt-8 text-sm text-neutral-500">No enquiries yet.</p>
      ) : (
        <div className="mt-6 space-y-3">
          {enquiries.map((e) => {
            const data = JSON.parse(e.data) as Record<string, unknown>;
            const expanded = expandedId === e.id;
            return (
              <div
                key={e.id}
                className={`rounded-xl border bg-white p-4 ${e.read ? "border-neutral-200" : "border-[#00352d]/30 bg-[#00352d]/[0.02]"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {!e.read && <span className="h-2 w-2 flex-none rounded-full bg-[#00352d]" aria-label="Unread" />}
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                        {SOURCE_LABELS[e.source] ?? e.source}
                      </span>
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
                    {Object.entries(data).map(([key, value]) => (
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
