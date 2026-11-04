import type { MetadataRoute } from "next";

// Required by Next static exports, including the read-only nsite mirror.
export const dynamic = "force-static";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://maximotodev.vercel.app").replace(/\/$/, "");

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] }],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
