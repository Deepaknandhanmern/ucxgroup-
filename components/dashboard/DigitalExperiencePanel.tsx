"use client";

import { useEffect, useState } from "react";
import UploadField from "@/components/dashboard/UploadField";

interface Category {
  id: string;
  n: string;
  name: string;
  image: string;
}

export default function DigitalExperiencePanel() {
  const [categories, setCategories] = useState<Category[] | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  function load() {
    fetch("/api/dashboard/digital-experience")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories));
  }

  useEffect(load, []);

  async function saveImage(id: string, image: string) {
    setSavingId(id);
    await fetch(`/api/dashboard/digital-experience/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image }),
    });
    setCategories((prev) => prev?.map((c) => (c.id === id ? { ...c, image } : c)) ?? null);
    setSavingId(null);
  }

  return (
    <div>
      <p className="mt-4 text-sm text-neutral-500">
        These 5 categories are fixed — you can only replace each one&apos;s image below.
      </p>

      {categories === null ? (
        <p className="mt-8 text-sm text-neutral-500">Loading…</p>
      ) : (
        <div className="mt-6 space-y-3">
          {categories.map((c) => (
            <div key={c.id} className="flex items-center justify-between gap-6 rounded-xl border border-neutral-200 bg-white p-4">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={c.image} alt={c.name} className="h-16 w-24 flex-none rounded-lg object-cover" />
                <div>
                  <p className="font-medium text-neutral-900">{c.name}</p>
                  <p className="text-sm text-neutral-500">Category {c.n}</p>
                </div>
              </div>
              <div className="w-72">
                <UploadField
                  label={savingId === c.id ? "Saving…" : "Category image"}
                  kind="image"
                  value={c.image}
                  onChange={(url) => saveImage(c.id, url)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
