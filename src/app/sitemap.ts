import type { MetadataRoute } from "next";
import { shippedApps, siteUrl } from "@/lib/apps";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const apps: MetadataRoute.Sitemap = shippedApps.map((app) => ({
    url: `${siteUrl}/apps/${app.slug}/`,
    lastModified: app.shippedAt ? new Date(app.shippedAt) : undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/about/`, changeFrequency: "yearly", priority: 0.4 },
    ...apps,
  ];
}
