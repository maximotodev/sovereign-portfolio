import type { MetadataRoute } from "next";
import { POSTS } from "@/lib/data";

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "https://maximotodev.vercel.app").replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl + "/", changeFrequency: "monthly", priority: 1 },
    { url: siteUrl + "/systems", changeFrequency: "monthly", priority: 0.8 },
    { url: siteUrl + "/newsletter", changeFrequency: "weekly", priority: 0.9 },
  ];
  const essays: MetadataRoute.Sitemap = POSTS.filter(p => p.isPublished).map(post => ({
    url: `${siteUrl}/newsletter/essay/${encodeURIComponent(post.slug)}`,
    lastModified: new Date(post.publishedDate),
    changeFrequency: "yearly",
    priority: 0.5,
  }));
  return [...staticRoutes, ...essays];
}
