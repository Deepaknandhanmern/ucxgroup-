import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const IMAGE_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};
const DOCUMENT_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
};
const MAX_BYTES = 15 * 1024 * 1024; // 15MB — covers cover images and PDF downloads

export async function POST(req: Request) {
  const formData = await req.formData().catch(() => null);
  const file = formData?.get("file");
  const kind = formData?.get("kind") === "document" ? "document" : "image";

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided." }, { status: 400 });
  }

  const allowed = kind === "document" ? DOCUMENT_TYPES : IMAGE_TYPES;
  const ext = allowed[file.type];
  if (!ext) {
    const label = kind === "document" ? "PDF" : "JPG, PNG, WEBP or GIF";
    return NextResponse.json({ error: `Unsupported file type. Use ${label}.` }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is too large (max 15MB)." }, { status: 400 });
  }

  const subfolder = kind === "document" ? "documents" : "blog";
  const uploadDir = path.join(process.cwd(), "public", "uploads", subfolder);
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filename = `${Date.now()}-${crypto.randomBytes(4).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(path.join(uploadDir, filename), buffer);

  return NextResponse.json({ url: `/uploads/${subfolder}/${filename}` });
}
