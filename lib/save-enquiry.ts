/**
 * Fire-and-forget copy of a form submission into our own dashboard, in
 * addition to the SplitForms send. Never blocks or fails the user-facing
 * submit flow — if this fails, the SplitForms copy (the one the user sees
 * confirmation for) still went through fine.
 */
export function saveEnquiryCopy(source: string, payload: Record<string, unknown>) {
  fetch("/api/enquiries", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ source, ...payload }),
  }).catch(() => {
    /* best-effort only */
  });
}
