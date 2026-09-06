"use client";

interface Action {
  label: string;
  savingLabel?: string;
  onClick: () => void;
  variant?: "solid" | "outline";
}

// The "you have unsaved changes" prompt shown by every dashboard editor via
// useLeaveGuard — one or two primary actions (e.g. "Save", or "Save as
// Draft" + "Publish" where a status choice makes sense), plus the two
// options every variant needs: leave without saving, or keep editing.
export default function UnsavedChangesCard({
  saving,
  error,
  actions,
  onDiscard,
  onKeepEditing,
}: {
  saving: boolean;
  error?: string;
  actions: Action[];
  onDiscard: () => void;
  onKeepEditing: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
        <h2 className="font-getho text-lg font-bold text-neutral-900">You have unsaved changes</h2>
        <p className="mt-1.5 text-sm text-neutral-500">Save before you go, or leave without saving.</p>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        <div className="mt-5 flex flex-col gap-2">
          {actions.map((a) => (
            <button
              key={a.label}
              type="button"
              disabled={saving}
              onClick={a.onClick}
              className={
                a.variant === "outline"
                  ? "rounded-lg border border-[#00352d] px-4 py-2.5 text-sm font-semibold text-[#00352d] transition hover:bg-neutral-50 disabled:opacity-60"
                  : "rounded-lg bg-[#00352d] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00473d] disabled:opacity-60"
              }
            >
              {saving ? (a.savingLabel ?? "Saving…") : a.label}
            </button>
          ))}
          <button
            type="button"
            disabled={saving}
            onClick={onDiscard}
            className="rounded-lg px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-60"
          >
            Leave without saving
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={onKeepEditing}
            className="mt-1 text-sm font-medium text-neutral-400 hover:text-neutral-700"
          >
            Keep editing
          </button>
        </div>
      </div>
    </div>
  );
}
