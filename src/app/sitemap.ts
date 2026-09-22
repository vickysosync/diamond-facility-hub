import { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://diamondifs.com";

  const staticRoutes = [
    "",
    "/about",
    "/services",
    "/industries",
    "/portfolio",
    "/pricing-estimator",
    "/gallery",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1.0 : 0.8,
  }));

  const official11Slugs = [
    "security-guard-services",
    "housekeeping-services",
    "property-management",
    "pest-control-services",
    "bouncer-services",
    "man-power-supply",
    "tank-cleaning-gardening-landscaping",
    "facility-management-solutions",
    "cctv-installation-maintenance",
    "plumbing-electrical-painting-waterproofing",
    "repair-maintenance-services",
  ];

  const serviceRoutes = official11Slugs.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...serviceRoutes];
}
