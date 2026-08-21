import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
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
    ];
  },
};

export default nextConfig;
