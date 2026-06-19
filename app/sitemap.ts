import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const domain = process.env.DOMAIN || "https://kenantomfie.site";
  
  // Public routes to index
  const routes = ["", "/about", "/projects", "/contact", "/achievements"];
  const locales = ["en", "id"];
  
  const sitemapEntries: MetadataRoute.Sitemap = [];

  // Generate sitemap for each locale and route
  locales.forEach((locale) => {
    routes.forEach((route) => {
      sitemapEntries.push({
        url: `${domain}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === "" ? "weekly" : "monthly",
        priority: route === "" ? 1.0 : 0.8,
      });
    });
  });

  return sitemapEntries;
}
