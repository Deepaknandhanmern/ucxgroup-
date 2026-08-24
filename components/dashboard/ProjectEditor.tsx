"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FILTERS, INTERIOR_FILTERS } from "@/lib/projects";
import type { ProjectRow } from "@/lib/projects-db";
import UploadField from "@/components/dashboard/UploadField";

const CATEGORIES = FILTERS.filter((f) => f.cat !== "all");
const INTERIOR_CATEGORIES = INTERIOR_FILTERS.filter((f) => f.cat !== "all");

export default function ProjectEditor({ project }: { project?: ProjectRow }) {
  const router = useRouter();

  const [title, setTitle] = useState(project?.title ?? "");
  const [image, setImage] = useState(project?.image ?? "");
  const [cat, setCat] = useState(project?.cat ?? "commercial");
  const [interiorCategory, setInteriorCategory] = useState(project?.interior_category ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [discipline, setDiscipline] = useState(project?.discipline ?? "");
  const [stage, setStage] = useState(project?.stage ?? "");
  const [technology, setTechnology] = useState(project ? (JSON.parse(project.technology) as string[]).join(", ") : "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [bodyText, setBodyText] = useState(project ? (JSON.parse(project.body) as string[]).join("\n\n") : "");
  const [scope, setScope] = useState(project ? (JSON.parse(project.scope) as string[]).join(", ") : "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      image,
      cat,
      interiorCategory: interiorCategory || null,
      location,
      discipline,
      stage,
      technology: technology
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      summary,
      body: bodyText
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean),
      scope: scope
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };

    const res = await fetch(project ? `/api/dashboard/projects/${project.id}` : "/api/dashboard/projects", {
      method: project ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/dashboard/projects");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong saving this project.");
      setSaving(false);
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#00352d] focus:ring-1 focus:ring-[#00352d]";
  const labelClass = "block text-sm font-medium text-neutral-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className={labelClass}>
        Title
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <UploadField label="Cover image" kind="image" value={image} onChange={setImage} />

      <div className="grid grid-cols-2 gap-5">
        <label className={labelClass}>
          Category
          <select className={inputClass} value={cat} onChange={(e) => setCat(e.target.value as typeof cat)}>
            {CATEGORIES.map((c) => (
              <option key={c.cat} value={c.cat}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-neutral-400">Controls where this project shows under Built Environment.</p>
        </label>
        <label className={labelClass}>
          Interiors category (optional)
          <select className={inputClass} value={interiorCategory} onChange={(e) => setInteriorCategory(e.target.value)}>
            <option value="">Not an interiors project</option>
            {INTERIOR_CATEGORIES.map((c) => (
              <option key={c.cat} value={c.cat}>
                {c.label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-neutral-400">Set this too if it should also show under Interiors.</p>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <label className={labelClass}>
          Location
          <input className={inputClass} value={location} onChange={(e) => setLocation(e.target.value)} placeholder="India" />
        </label>
        <label className={labelClass}>
          Discipline
          <input className={inputClass} value={discipline} onChange={(e) => setDiscipline(e.target.value)} placeholder="BIM & VDC" />
        </label>
        <label className={labelClass}>
          Project stage
          <input className={inputClass} value={stage} onChange={(e) => setStage(e.target.value)} placeholder="As-Built" />
        </label>
      </div>

      <label className={labelClass}>
        Technology (comma-separated)
        <input className={inputClass} value={technology} onChange={(e) => setTechnology(e.target.value)} placeholder="Revit, Navisworks, ACC" />
      </label>

      <label className={labelClass}>
        Summary
        <textarea
          className={inputClass}
          rows={2}
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          placeholder="One or two sentences shown on the project card"
          required
        />
      </label>

      <label className={labelClass}>
        Body
        <textarea
          className={`${inputClass} font-mono`}
          rows={10}
          value={bodyText}
          onChange={(e) => setBodyText(e.target.value)}
          placeholder={"First paragraph.\n\nSecond paragraph — leave a blank line between paragraphs."}
        />
      </label>

      <label className={labelClass}>
        Scope (comma-separated)
        <input className={inputClass} value={scope} onChange={(e) => setScope(e.target.value)} placeholder="Federated BIM coordination, Clash detection & resolution" />
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#00352d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00473d] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save project"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/projects")}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
