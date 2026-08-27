import { NextResponse } from "next/server";

// Lets whoever is logged into /dashboard confirm production env vars are
// actually set on the host, without ever exposing the secret values
// themselves. Gated by the same dashboard session check as every other
// /api/dashboard/* route (see proxy.ts).
export async function GET() {
  return NextResponse.json({
    NEXT_PUBLIC_GA_ID: Boolean(process.env.NEXT_PUBLIC_GA_ID),
    SMTP_HOST: Boolean(process.env.SMTP_HOST),
    SMTP_USER: Boolean(process.env.SMTP_USER),
    SMTP_PASS: Boolean(process.env.SMTP_PASS),
    DASHBOARD_SESSION_SECRET: Boolean(process.env.DASHBOARD_SESSION_SECRET),
    DASHBOARD_PASSWORD: Boolean(process.env.DASHBOARD_PASSWORD),
    MAINTENANCE_MODE: process.env.MAINTENANCE_MODE ?? null,
    DASHBOARD_DATA_DIR: process.env.DASHBOARD_DATA_DIR ?? null,
  });
}
