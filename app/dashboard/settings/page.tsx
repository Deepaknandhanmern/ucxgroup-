"use client";

import { useState } from "react";

type Status = "idle" | "saving" | "saved" | "error";

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New password and confirmation don't match.");
      return;
    }

    setStatus("saving");
    const res = await fetch("/api/dashboard/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ currentPassword, newPassword }),
    });

    if (res.ok) {
      setStatus("saved");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Something went wrong.");
      setStatus("error");
    }
  }

  const inputClass =
    "mt-1.5 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-[#00352d] focus:ring-1 focus:ring-[#00352d]";
  const labelClass = "block text-sm font-medium text-neutral-700";

  return (
    <div>
      <h1 className="font-getho text-2xl font-bold text-neutral-900">Settings</h1>

      <div className="mt-6 max-w-md rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-sm font-semibold text-neutral-900">Change Dashboard Password</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Changes the password used to log into this dashboard. Take note of it — there&apos;s no reset link.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <label className={labelClass}>
            Current password
            <input
              type="password"
              className={inputClass}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <label className={labelClass}>
            New password
            <input
              type="password"
              className={inputClass}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>
          <label className={labelClass}>
            Confirm new password
            <input
              type="password"
              className={inputClass}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </label>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {status === "saved" && <p className="text-sm text-emerald-700">Password updated.</p>}

          <button
            type="submit"
            disabled={status === "saving"}
            className="rounded-lg bg-[#00352d] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00473d] disabled:opacity-60"
          >
            {status === "saving" ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
