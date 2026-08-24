import { NextResponse } from "next/server";
import { changePassword } from "@/lib/auth-db";

export async function POST(req: Request) {
  const { currentPassword, newPassword } = (await req.json().catch(() => ({}))) as {
    currentPassword?: string;
    newPassword?: string;
  };

  if (!currentPassword || !newPassword) {
    return NextResponse.json({ error: "Current and new password are required." }, { status: 400 });
  }
  if (newPassword.length < 8) {
    return NextResponse.json({ error: "New password must be at least 8 characters." }, { status: 400 });
  }

  const ok = changePassword(currentPassword, newPassword);
  if (!ok) {
    return NextResponse.json({ error: "Current password is incorrect." }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
