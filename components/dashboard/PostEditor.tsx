"use client";

import { useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { remark } from "remark";
import remarkHtml from "remark-html";
import type { BlogPostRow, PostStatus } from "@/lib/blog-posts-db";

const CATEGORIES = [
  { value: "bim-digital", label: "BIM & Digital" },
  { value: "design-delivery", label: "Design & Delivery" },
  { value: "technology-ai", label: "Technology & AI" },
];

const AUTHORS = [
  { value: "shangeeth", label: "Shangeeth Raju" },
  { value: "bhuvaneshwari", label: "Bhuvaneshwari" },
];

export default function PostEditor({ post }: { post?: BlogPostRow }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(post?.title ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [image, setImage] = useState(post?.image ?? "");
  const [team, setTeam] = useState(post?.team ?? "");
  const [category, setCategory] = useState(post?.category ?? "bim-digital");
  const [date, setDate] = useState(post?.date ?? new Date().toISOString().slice(0, 10));
  const [readTime, setReadTime] = useState(post?.read_time ?? "5 min read");
  const [tags, setTags] = useState(post ? (JSON.parse(post.tags) as string[]).join(", ") : "");
  const [authorKey, setAuthorKey] = useState(post?.author_key ?? "shangeeth");
  const [bodyMarkdown, setBodyMarkdown] = useState(post?.body_markdown ?? "");
  const [status, setStatus] = useState<PostStatus>(post?.status ?? "draft");

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      title,
      excerpt,
      image,
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
    };

    const res = await fetch(post ? `/api/dashboard/posts/${post.id}` : "/api/dashboard/posts", {
      method: post ? "PUT" : "POST",
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
          </div>
        </div>
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
          </div>
        </div>
      </div>

      <div>
        <span className={labelClass}>Content (Markdown)</span>
        <div className="mt-1.5 grid grid-cols-2 gap-4">
          <textarea
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
          {saving ? "Saving…" : status === "published" ? "Publish post" : "Save draft"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/posts")}
          className="rounded-lg px-5 py-2.5 text-sm font-medium text-neutral-500 hover:text-neutral-800"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
