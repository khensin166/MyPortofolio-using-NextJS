import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const domain = process.env.DOMAIN || "https://kenantomfie.site";
  
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/dashboard/"], // Prevent Google from indexing internal APIs and private dashboard
    },
    sitemap: `${domain}/sitemap.xml`,
  };
}
