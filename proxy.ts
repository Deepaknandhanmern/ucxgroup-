import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE, verifySessionToken } from "@/lib/auth";

// Toggle maintenance mode by setting MAINTENANCE_MODE=true in your hosting
// panel's environment variables and restarting the app — no redeploy needed.
//
// Optional: set MAINTENANCE_BYPASS_TOKEN to a secret string, then visit
// https://yourdomain.com/?bypass=<that-secret> once to unlock the real site
// for yourself (via a cookie) while everyone else still sees the
// maintenance page.
const BYPASS_COOKIE = "ucx_maintenance_bypass";

function guardDashboard(request: NextRequest): NextResponse | null {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/dashboard") && !pathname.startsWith("/api/dashboard")) return null;
  if (pathname.startsWith("/dashboard/login")) return NextResponse.next();

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) return NextResponse.next();

  if (pathname.startsWith("/api/dashboard")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return NextResponse.redirect(new URL("/dashboard/login", request.url));
}

export function proxy(request: NextRequest) {
  // Dashboard auth runs independently of maintenance mode, so the client can
  // still manage the site while the public pages show the maintenance page.
  const dashboardResult = guardDashboard(request);
  if (dashboardResult) return dashboardResult;

  if (process.env.MAINTENANCE_MODE !== "true") {
    return NextResponse.next();
  }

  const { pathname, searchParams } = request.nextUrl;

  if (pathname === "/maintenance") {
    return NextResponse.next();
  }

  const bypassToken = process.env.MAINTENANCE_BYPASS_TOKEN;
  const queryToken = searchParams.get("bypass");

  if (bypassToken && queryToken === bypassToken) {
    const response = NextResponse.next();
    response.cookies.set(BYPASS_COOKIE, bypassToken, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
    });
    return response;
  }

  if (bypassToken && request.cookies.get(BYPASS_COOKIE)?.value === bypassToken) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt|brand/|models/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|mp4|css|js|map|frag)$).*)",
    "/api/dashboard/:path*",
  ],
};
