import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/about", "/blog", "/pricing", "/contact", "/privacy", "/terms"],
        disallow: [
          "/dashboard/",
          "/settings/",
          "/profile/",
          "/billing/",
          "/notifications/",
          "/auth/",
          "/api/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
