"use client";

import { useRef, useState } from "react";

export default function UploadField({
  label,
  kind,
  value,
  onChange,
}: {
  label: string;
  kind: "image" | "document";
  value: string;
  onChange: (url: string) => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.set("file", file);
    formData.set("kind", kind);
    const res = await fetch("/api/dashboard/upload", { method: "POST", body: formData });
    const data = await res.json();

    if (res.ok) {
      onChange(data.url);
    } else {
      setError(data.error ?? "Upload failed.");
    }
    setUploading(false);
    e.target.value = "";
  }

  const accept = kind === "document" ? "application/pdf" : "image/jpeg,image/png,image/webp,image/gif";

  return (
    <div>
      <span className="block text-sm font-medium text-neutral-700">{label}</span>
      <div className="mt-1.5 flex items-center gap-3">
        {value ? (
          <a href={value} target="_blank" rel="noreferrer" className="max-w-[220px] truncate text-sm text-[#00352d] underline">
            {value.split("/").pop()}
          </a>
        ) : (
          <span className="text-sm text-neutral-400">No file yet</span>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 disabled:opacity-50"
        >
          {uploading ? "Uploading…" : value ? "Replace" : "Upload"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className="text-sm font-medium text-red-600 hover:underline"
          >
            Remove
          </button>
        )}
        <input ref={fileInputRef} type="file" accept={accept} onChange={handleUpload} className="hidden" />
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
