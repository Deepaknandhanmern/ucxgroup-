import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Toggle maintenance mode by setting MAINTENANCE_MODE=true in your hosting
// panel's environment variables and restarting the app — no redeploy needed.
//
// Optional: set MAINTENANCE_BYPASS_TOKEN to a secret string, then visit
// https://yourdomain.com/?bypass=<that-secret> once to unlock the real site
// for yourself (via a cookie) while everyone else still sees the
// maintenance page.
const BYPASS_COOKIE = "ucx_maintenance_bypass";

export function proxy(request: NextRequest) {
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
    "/((?!api|_next/static|_next/image|favicon.ico|icon.png|sitemap.xml|robots.txt|brand/|.*\\.(?:png|jpg|jpeg|gif|svg|ico|webp|woff2?|mp4|css|js|map)$).*)",
  ],
};
