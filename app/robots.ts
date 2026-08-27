import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/maintenance", "/dashboard"],
    },
    sitemap: "https://ucx-group.com/sitemap.xml",
  };
}
