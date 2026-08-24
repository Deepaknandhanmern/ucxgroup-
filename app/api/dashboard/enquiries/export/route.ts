import { listEnquiries } from "@/lib/enquiries-db";

function csvEscape(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export async function GET() {
  const rows = listEnquiries();
  const headers = ["ID", "Date", "Source", "Read", "Name", "Email", "Phone", "Subject", "Message", "Full Data"];
  const lines = [headers.join(",")];

  for (const r of rows) {
    lines.push(
      [
        String(r.id),
        r.created_at,
        r.source,
        r.read ? "Yes" : "No",
        r.name ?? "",
        r.email ?? "",
        r.phone ?? "",
        r.subject ?? "",
        r.message ?? "",
        r.data,
      ]
        .map(csvEscape)
        .join(",")
    );
  }

  const csv = lines.join("\n");
  const filename = `ucx-enquiries-${new Date().toISOString().slice(0, 10)}.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
