// SplitForms access key — public by design (identifies the form/inbox, not a secret credential)
export const SPLITFORMS_ACCESS_KEY = "96ce3dfdd5fb445485af725b9133398b";

export async function submitToSplitForms(
  payload: Record<string, string>
): Promise<{ ok: boolean }> {
  try {
    const res = await fetch("https://splitforms.com/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_key: SPLITFORMS_ACCESS_KEY, ...payload }),
    });
    return { ok: res.ok };
  } catch {
    return { ok: false };
  }
}
