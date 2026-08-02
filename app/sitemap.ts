import type { MetadataRoute } from "next";
import { ARTICLES } from "@/lib/journal";
import { getProducts } from "@/lib/shopify";

const SITE_URL = "https://katachi-blond.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/collectie`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/filosofie`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/journal`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.4 },
    { url: `${SITE_URL}/shipping-returns`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  const journalRoutes: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
    url: `${SITE_URL}/journal/${a.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  let productRoutes: MetadataRoute.Sitemap = [];
  try {
    const products = await getProducts(100);
    productRoutes = products.map((p) => ({
      url: `${SITE_URL}/collectie/${p.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    // Sitemap still serves static routes if Shopify is unreachable
  }

  return [...staticRoutes, ...journalRoutes, ...productRoutes];
}
