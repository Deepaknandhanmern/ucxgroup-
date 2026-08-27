import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
        ],
      },
      // _next/static chunks are content-hashed and genuinely immutable —
      // safe to cache forever, and new deploys get new filenames anyway.
      {
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      // Everything else (page HTML) must NOT be cached by Hostinger's CDN.
      // A cached page from a previous deploy references JS chunk files by
      // hash — once a new deploy replaces those chunk files, a stale
      // cached HTML page 404s trying to load its old chunks, and hydration
      // breaks with a "Refused to execute script" MIME-type error. This
      // explicit no-store forces the CDN to always re-fetch fresh HTML.
      {
        source: "/:path((?!_next/static|_next/image|models|brand).*)",
        headers: [{ key: "Cache-Control", value: "no-store, must-revalidate" }],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: "/interiors",
        destination: "/design-interiors",
        permanent: true,
      },
      {
        source: "/interiors/:path*",
        destination: "/design-interiors/:path*",
        permanent: true,
      },
      // Leftover from the previous WordPress site (which used /home as its
      // homepage path) — Google's index still has it from before the
      // domain switch, and it 404s otherwise since this site's homepage
      // only lives at /.
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
