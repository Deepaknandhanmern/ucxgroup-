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

  async function handleDelete(id: number) {
    if (!confirm("Delete this enquiry?")) return;
    await fetch(`/api/dashboard/enquiries/${id}`, { method: "DELETE" });
    setEnquiries((prev) => prev?.filter((e) => e.id !== id) ?? null);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-neutral-900">Enquiries</h1>

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
              <div key={e.id} className="rounded-xl border border-neutral-200 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600">
                        {SOURCE_LABELS[e.source] ?? e.source}
                      </span>
                      <span className="text-xs text-neutral-400">
                        {new Date(e.created_at).toLocaleString()}
                      </span>
                    </div>
                    <p className="mt-1.5 truncate font-medium text-neutral-900">
                      {e.name ?? "—"} {e.email && <span className="font-normal text-neutral-500">· {e.email}</span>}
                    </p>
                    {e.subject && <p className="mt-0.5 text-sm text-neutral-600">{e.subject}</p>}
                    {e.message && <p className="mt-1 line-clamp-2 text-sm text-neutral-500">{e.message}</p>}
                  </div>
                  <div className="flex flex-none items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedId(expanded ? null : e.id)}
                      className="text-sm font-medium text-[#00352d] hover:underline"
                    >
                      {expanded ? "Hide details" : "View details"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(e.id)}
                      className="text-sm font-medium text-red-600 hover:underline"
                    >
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
