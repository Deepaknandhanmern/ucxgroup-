import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "UCX Group — Unconventional Collaboration",
    short_name: "UCX",
    description: "Design, digital engineering, project delivery and asset information — one connected delivery ecosystem.",
    start_url: "/",
    display: "standalone",
    background_color: "#F3F1E6",
    theme_color: "#00352D",
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
