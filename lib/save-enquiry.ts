// Submits a form straight into our own dashboard/database — this is now the
// only place a submission goes (previously also sent to SplitForms).
export async function submitEnquiry(
  source: string,
  payload: Record<string, unknown>
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("/api/enquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ source, ...payload }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
