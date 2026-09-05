"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { BlogPostRow, PostStatus } from "@/lib/blog-posts-db";

const AUTOSAVE_INTERVAL_MS = 20_000;

const CATEGORIES = [
  { value: "bim-digital", label: "BIM & Digital" },
  { value: "design-delivery", label: "Design & Delivery" },
  { value: "technology-ai", label: "Technology & AI" },
];

const AUTHORS = [
  { value: "shangeeth", label: "Shangeeth Raju" },
  { value: "bhuvaneshwari", label: "Bhuvaneshwari" },
];

// <input type="datetime-local"> both reads and writes local time with no
// timezone info, while the DB stores/compares UTC ISO strings — these
// convert between the two so a picked time actually fires at that wall-clock
// moment instead of drifting by the browser's UTC offset.
function isoToDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function datetimeLocalToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

export default function PostEditor({ post }: { post?: BlogPostRow }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  const [postId, setPostId] = useState<number | undefined>(post?.id);
  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [image, setImage] = useState(post?.image ?? "");
  const [images, setImages] = useState<string[]>(post?.images ? (JSON.parse(post.images) as string[]) : []);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [team, setTeam] = useState(post?.team ?? "");
  const [category, setCategory] = useState(post?.category ?? "bim-digital");
  const [date, setDate] = useState(post?.date ?? new Date().toISOString().slice(0, 10));
  const [readTime, setReadTime] = useState(post?.read_time ?? "5 min read");
  const [tags, setTags] = useState(post ? (JSON.parse(post.tags) as string[]).join(", ") : "");
  const [authorKey, setAuthorKey] = useState(post?.author_key ?? "shangeeth");
  const [bodyMarkdown, setBodyMarkdown] = useState(post?.body_markdown ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");
  const [publishAt, setPublishAt] = useState(post?.publish_at ? isoToDatetimeLocal(post.publish_at) : "");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [lastAutosaved, setLastAutosaved] = useState<Date | null>(null);
  const [autosaving, setAutosaving] = useState(false);
  const lastSavedSnapshot = useRef("");

  const previewHtml = useMemo(() => {
    try {
      return remark().use(remarkHtml).processSync(bodyMarkdown).toString();
    } catch {
      return "<p><em>Couldn't render preview.</em></p>";
    }
  }, [bodyMarkdown]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.set("file", file);
    const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      setImage(data.url);
    } else {
      setError(data.error ?? "Upload failed.");
    }
    setUploading(false);
  }

  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setGalleryUploading(true);
    setError("");

    const uploaded: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.set("file", file);
      const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (res.ok) {
        uploaded.push(data.url);
      } else {
        setError(data.error ?? "Upload failed.");
        break;
      }
    }
    if (uploaded.length > 0) setImages((prev) => [...prev, ...uploaded]);
    setGalleryUploading(false);
    if (galleryInputRef.current) galleryInputRef.current.value = "";
  }

  // Wraps (or replaces) the current textarea selection with markdown syntax,
  // then restores focus and re-selects the wrapped text so the toolbar
  // behaves like a normal rich-text bold/link button instead of just
  // dumping the syntax at the end of the field.
  function wrapSelection(before: string, after: string, placeholder: string) {
    const el = bodyRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = el.value.slice(start, end) || placeholder;
    const next = el.value.slice(0, start) + before + selected + after + el.value.slice(end);
    setBodyMarkdown(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function applyBold() {
    wrapSelection("**", "**", "bold text");
  }

  function applyLink() {
    const url = window.prompt("Link URL", "https://");
    if (!url) return;
    wrapSelection("[", `](${url})`, "link text");
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
      excerpt,
      image,
      images,
      team,
      category,
      date,
      readTime,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      authorKey,
      bodyMarkdown,
      status,
      publishAt: status === "scheduled" ? datetimeLocalToIso(publishAt) : null,
    };
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = buildPayload();
    const res = await fetch(postId ? `/api/dashboard/posts/${postId}` : "/api/dashboard/posts", {
      method: postId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/dashboard/posts");
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong saving this post.");
      setSaving(false);
    }
  }

  // Kept in sync after every render (in an effect, not during render itself —
  // writing to a ref mid-render isn't safe) so the interval below always sees
  // the latest form state without needing to reset itself on every keystroke.
  const latestRef = useRef({ postId, status, title, bodyMarkdown, buildPayload });
  useEffect(() => {
    latestRef.current = { postId, status, title, bodyMarkdown, buildPayload };
  });

  // Autosave: only while working on a draft, and only if something actually
  // changed since the last save — so it never fires on an untouched post or
  // silently overwrites a post someone has already published.
  useEffect(() => {
    const interval = setInterval(async () => {
      const { postId: currentPostId, status: currentStatus, title: currentTitle, bodyMarkdown: currentBody, buildPayload: currentBuildPayload } =
        latestRef.current;
      if (currentStatus !== "draft") return;
      if (!currentTitle.trim() || !currentBody.trim()) return;

      const snapshot = JSON.stringify(currentBuildPayload());
      if (snapshot === lastSavedSnapshot.current) return;

      setAutosaving(true);
      const res = await fetch(currentPostId ? `/api/dashboard/posts/${currentPostId}` : "/api/dashboard/posts", {
        method: currentPostId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: snapshot,
      });

      if (res.ok) {
        const data = await res.json();
        if (!currentPostId) {
          setPostId(data.post.id);
          router.replace(`/dashboard/posts/${data.post.id}`);
        }
        lastSavedSnapshot.current = snapshot;
        setLastAutosaved(new Date());
      }
      setAutosaving(false);
    }, AUTOSAVE_INTERVAL_MS);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- interval reads state via latestRef, not deps
  }, []);

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#00352d] focus:ring-1 focus:ring-[#00352d]";
  const labelClass = "block text-sm font-medium text-neutral-700";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <label className={labelClass}>
        Title
        <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} required />
      </label>

      <label className={labelClass}>
        Excerpt
        <textarea
          className={inputClass}
          rows={2}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="One or two sentences shown on the blog card"
        />
      </label>

      <div>
        <span className={labelClass}>Cover image</span>
        <div className="mt-1.5 flex items-center gap-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="Cover preview" className="h-20 w-32 rounded-lg object-cover" />
          ) : (
            <div className="flex h-20 w-32 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-xs text-neutral-400">
              No image
            </div>
          )}
          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
            >
              {uploading ? "Uploading…" : image ? "Replace image" : "Upload image"}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleUpload}
              className="hidden"
            />
            <p className="mt-1.5 text-xs text-neutral-400">Recommended: landscape 16:9, at least 1600×900px. JPG, PNG, WEBP or GIF, under 8MB.</p>
          </div>
        </div>
      </div>

      <div>
        <span className={labelClass}>Gallery images</span>
        <p className="mt-1 text-xs text-neutral-400">
          Shown as a carousel on the article page, below the cover image. Optional — with none added, the article just shows the cover image.
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
      </div>

      <div className="grid grid-cols-2 gap-5">
        <label className={labelClass}>
          Category
          <select className={inputClass} value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className={labelClass}>
          Author
          <select className={inputClass} value={authorKey} onChange={(e) => setAuthorKey(e.target.value)}>
            {AUTHORS.map((a) => (
              <option key={a.value} value={a.value}>
                {a.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <label className={labelClass}>
          Date
          <input type="date" className={inputClass} value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
        <label className={labelClass}>
          Read time
          <input className={inputClass} value={readTime} onChange={(e) => setReadTime(e.target.value)} placeholder="5 min read" />
        </label>
        <label className={labelClass}>
          Team
          <input className={inputClass} value={team} onChange={(e) => setTeam(e.target.value)} placeholder="BIM & Digital Delivery" />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <label className={labelClass}>
          Tags (comma-separated)
          <input className={inputClass} value={tags} onChange={(e) => setTags(e.target.value)} placeholder="BIM, Coordination" />
        </label>
        <div>
          <span className={labelClass}>Status</span>
          <div className="mt-1.5 flex overflow-hidden rounded-lg border border-neutral-300">
            <button
              type="button"
              onClick={() => setStatus("draft")}
              className={`flex-1 py-2 text-sm font-medium transition ${
                status === "draft" ? "bg-amber-100 text-amber-800" : "bg-white text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              Draft
            </button>
            <button
              type="button"
              onClick={() => setStatus("published")}
              className={`flex-1 py-2 text-sm font-medium transition ${
                status === "published" ? "bg-emerald-100 text-emerald-800" : "bg-white text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              Published
            </button>
            <button
              type="button"
              onClick={() => setStatus("scheduled")}
              className={`flex-1 py-2 text-sm font-medium transition ${
                status === "scheduled" ? "bg-blue-100 text-blue-800" : "bg-white text-neutral-500 hover:bg-neutral-50"
              }`}
            >
              Scheduled
            </button>
          </div>
          {status === "scheduled" && (
            <input
              type="datetime-local"
              className={`${inputClass} mt-2`}
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              required
            />
          )}
        </div>
      </div>

      <div>
        <span className={labelClass}>Content (Markdown)</span>
        <div className="mt-1.5 flex items-center gap-2">
          <button
            type="button"
            onClick={applyBold}
            title="Bold"
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-bold text-neutral-700 hover:bg-neutral-50"
          >
            B
          </button>
          <button
            type="button"
            onClick={applyLink}
            title="Insert link"
            className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 underline hover:bg-neutral-50"
          >
            Link
          </button>
        </div>
        <div className="mt-1.5 grid grid-cols-2 gap-4">
          <textarea
            ref={bodyRef}
            className={`${inputClass} mt-0 font-mono`}
            rows={20}
            value={bodyMarkdown}
            onChange={(e) => setBodyMarkdown(e.target.value)}
            required
            placeholder="Write the post body in Markdown — paragraphs, **bold**, *italic*, etc."
          />
          <div
            className="space-y-3 overflow-y-auto rounded-lg border border-neutral-200 bg-neutral-50 p-4 text-sm leading-relaxed text-neutral-800 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:text-base [&_h2]:font-bold [&_strong]:font-semibold [&_a]:text-[#00352d] [&_a]:underline"
            style={{ maxHeight: 420 }}
          >
            {bodyMarkdown.trim() ? (
              <div dangerouslySetInnerHTML={{ __html: previewHtml }} />
            ) : (
              <span className="text-neutral-400">Preview will appear here as you type…</span>
            )}
          </div>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-[#00352d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00473d] disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : status === "published"
              ? "Publish post"
              : status === "scheduled"
                ? "Schedule post"
                : "Save draft"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/posts")}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          Cancel
        </button>
        {status === "draft" && (
          <span className="text-xs text-neutral-400">
            {autosaving ? "Autosaving…" : lastAutosaved ? `Autosaved at ${lastAutosaved.toLocaleTimeString()}` : ""}
          </span>
        )}
      </div>
    </form>
  );
}
