"use client";

import Link from "next/link";
import { useCursorGlow } from "@/components/ui/useCursorGlow";

export default function StatCard({
  href,
  label,
  value,
  detail,
  highlight,
}: {
  href: string;
  label: string;
  value: number;
  detail: string;
  highlight?: boolean;
}) {
  const glowRef = useCursorGlow<HTMLAnchorElement>();

  return (
    <Link
      ref={glowRef}
      href={href}
      className={`group relative overflow-hidden rounded-xl border bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md ${
        highlight ? "border-[#00352d]/40" : "border-neutral-200"
      }`}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: "radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(145,242,181,.35), transparent 70%)",
        }}
      />
      <div className="relative">
        <p className="text-sm font-medium text-neutral-500">{label}</p>
        <p className="mt-1 text-3xl font-bold text-neutral-900">{value}</p>
        <p className="mt-1 text-xs text-neutral-400">{detail}</p>
      </div>
    </Link>
  );
}
