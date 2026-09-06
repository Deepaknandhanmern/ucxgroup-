"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FILTERS, INTERIOR_FILTERS, DIGITAL_FILTERS } from "@/lib/projects";
import type { ProjectRow } from "@/lib/projects-db";
import UploadField from "@/components/dashboard/UploadField";
import { useLeaveGuard } from "@/components/dashboard/useLeaveGuard";
import UnsavedChangesCard from "@/components/dashboard/UnsavedChangesCard";

const CATEGORIES = FILTERS.filter((f) => f.cat !== "all");
const INTERIOR_CATEGORIES = INTERIOR_FILTERS.filter((f) => f.cat !== "all");
const DIGITAL_CATEGORIES = DIGITAL_FILTERS.filter((f) => f.cat !== "all");

export default function ProjectEditor({ project }: { project?: ProjectRow }) {
  const router = useRouter();

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryError, setGalleryError] = useState("");

  const [title, setTitle] = useState(project?.title ?? "");
  const [image, setImage] = useState(project?.image ?? "");
  const [images, setImages] = useState<string[]>(project?.images ? (JSON.parse(project.images) as string[]) : []);
  const [cat, setCat] = useState(project?.cat ?? "commercial");
  const [interiorCategory, setInteriorCategory] = useState(project?.interior_category ?? "");
  const [digitalCategory, setDigitalCategory] = useState(project?.digital_category ?? "");
  const [location, setLocation] = useState(project?.location ?? "");
  const [discipline, setDiscipline] = useState(project?.discipline ?? "");
  const [stage, setStage] = useState(project?.stage ?? "");
  const [technology, setTechnology] = useState(project ? (JSON.parse(project.technology) as string[]).join(", ") : "");
  const [summary, setSummary] = useState(project?.summary ?? "");
  const [bodyText, setBodyText] = useState(project ? (JSON.parse(project.body) as string[]).join("\n\n") : "");
  const [scope, setScope] = useState(project ? (JSON.parse(project.scope) as string[]).join(", ") : "");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const lastSavedSnapshot = useRef("");

  const interiorsEnabled = interiorCategory !== "";
  const digitalEnabled = digitalCategory !== "";

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setGalleryUploading(true);
    setGalleryError("");

    const uploaded: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.set("file", file);
      formData.set("kind", "image");
      const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        uploaded.push(data.url);
      } else {
        setGalleryError(data.error ?? "Upload failed.");
        break;
      }
    }
    if (uploaded.length > 0) setImages((prev) => [...prev, ...uploaded]);
    setGalleryUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  function removeGalleryImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveGalleryImage(index: number, dir: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function buildPayload() {
    return {
      title,
      image,
      images,
      cat,
      interiorCategory: interiorCategory || null,
      digitalCategory: digitalCategory || null,
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
  }

  async function savePost(): Promise<boolean> {
    setSaving(true);
    setError("");
    try {
      const payload = buildPayload();
      const res = await fetch(project ? `/api/dashboard/projects/${project.id}` : "/api/dashboard/projects", {
        method: project ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Something went wrong saving this project.");
        setSaving(false);
        return false;
      }

      lastSavedSnapshot.current = JSON.stringify(payload);
      setSaving(false);
      return true;
    } catch {
      setError("Couldn't reach the server — check your connection and try again.");
      setSaving(false);
      return false;
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await savePost();
    // No router.refresh() here — /dashboard/projects is a client component
    // that fetches its own list on mount, and calling refresh() immediately
    // after push() can cancel the pending navigation in the App Router,
    // which is why this used to sometimes just sit on the form after a
    // successful save.
    if (ok) router.push("/dashboard/projects");
  }

  // Baseline for the dirty-check, built from buildPayload() itself so it's
  // guaranteed to match what an unmodified save would produce.
  useEffect(() => {
    if (project) lastSavedSnapshot.current = JSON.stringify(buildPayload());
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only ever runs once, on mount
  }, []);

  const isDirty = JSON.stringify(buildPayload()) !== lastSavedSnapshot.current;
  const { leaveTarget, setLeaveTarget } = useLeaveGuard(isDirty);

  async function saveAndLeave() {
    const ok = await savePost();
    if (ok) router.push(leaveTarget ?? "/dashboard/projects");
  }

  function discardAndLeave() {
    const target = leaveTarget ?? "/dashboard/projects";
    setLeaveTarget(null);
    router.push(target);
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

      <div>
        <span className={labelClass}>Gallery images</span>
        <p className="mt-1 text-xs text-neutral-400">
          Shown as a carousel on the project detail page, below the cover image. Optional — with none added, the project just shows the cover image.
        </p>
        {images.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {images.map((src, i) => (
              <div key={src + i} className="relative w-28">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Gallery ${i + 1}`} className="h-20 w-28 rounded-lg object-cover" />
                <div className="mt-1 flex items-center justify-between gap-1">
                  <button
                    type="button"
                    onClick={() => moveGalleryImage(i, -1)}
                    disabled={i === 0}
                    className="rounded border border-neutral-300 px-1.5 py-0.5 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-30"
                    aria-label="Move earlier"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(i)}
                    className="rounded border border-red-200 px-1.5 py-0.5 text-xs text-red-600 hover:bg-red-50"
                    aria-label="Remove image"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={() => moveGalleryImage(i, 1)}
                    disabled={i === images.length - 1}
                    className="rounded border border-neutral-300 px-1.5 py-0.5 text-xs text-neutral-600 hover:bg-neutral-50 disabled:opacity-30"
                    aria-label="Move later"
                  >
                    →
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={() => galleryInputRef.current?.click()}
          disabled={galleryUploading}
          className="mt-3 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          {galleryUploading ? "Uploading…" : "Add gallery images"}
        </button>
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={handleGalleryUpload}
          className="hidden"
        />
        {galleryError && <p className="mt-1 text-sm text-red-600">{galleryError}</p>}
      </div>

      <div>
        <span className={labelClass}>Which pages should this project show on?</span>
        <p className="mt-1 text-xs text-neutral-400">
          Every project shows on Built Environment. Tick Interiors and/or Digital Project Experience too if it
          belongs on those pages as well — a project can be on more than one.
        </p>
        <div className="mt-3 grid grid-cols-3 gap-4">
          <div className="rounded-lg border border-neutral-200 p-4">
            <div className="flex items-center gap-2">
              <input type="checkbox" checked disabled className="h-4 w-4" />
              <span className="text-sm font-semibold text-neutral-800">Built Environment</span>
            </div>
            <p className="mt-1 text-xs text-neutral-400">Always shown — every project needs a category here.</p>
            <select
              className={`${inputClass} mt-3`}
              value={cat}
              onChange={(e) => setCat(e.target.value as typeof cat)}
            >
              {CATEGORIES.map((c) => (
                <option key={c.cat} value={c.cat}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={interiorsEnabled}
                onChange={(e) => setInteriorCategory(e.target.checked ? INTERIOR_CATEGORIES[0].cat : "")}
              />
              <span className="text-sm font-semibold text-neutral-800">Interiors</span>
            </label>
            <p className="mt-1 text-xs text-neutral-400">Also show this project on the Interiors page.</p>
            {interiorsEnabled && (
              <select
                className={`${inputClass} mt-3`}
                value={interiorCategory}
                onChange={(e) => setInteriorCategory(e.target.value)}
              >
                {INTERIOR_CATEGORIES.map((c) => (
                  <option key={c.cat} value={c.cat}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="rounded-lg border border-neutral-200 p-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={digitalEnabled}
                onChange={(e) => setDigitalCategory(e.target.checked ? DIGITAL_CATEGORIES[0].cat : "")}
              />
              <span className="text-sm font-semibold text-neutral-800">Digital Project Experience</span>
            </label>
            <p className="mt-1 text-xs text-neutral-400">Also show this project on the Digital Project Experience page.</p>
            {digitalEnabled && (
              <select
                className={`${inputClass} mt-3`}
                value={digitalCategory}
                onChange={(e) => setDigitalCategory(e.target.value)}
              >
                {DIGITAL_CATEGORIES.map((c) => (
                  <option key={c.cat} value={c.cat}>
                    {c.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
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
          onClick={() => (isDirty ? setLeaveTarget("/dashboard/projects") : router.push("/dashboard/projects"))}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          Cancel
        </button>
      </div>

      {leaveTarget !== null && (
        <UnsavedChangesCard
          saving={saving}
          error={error}
          actions={[{ label: "Save project", onClick: saveAndLeave }]}
          onDiscard={discardAndLeave}
          onKeepEditing={() => setLeaveTarget(null)}
        />
      )}
    </form>
  );
}
