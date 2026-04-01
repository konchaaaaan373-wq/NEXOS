import type { MetadataRoute } from "next";
import { clinics, jobPostings } from "@/data/seed";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nexos.necofindjob.com";

  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/jobs`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const clinicPages: MetadataRoute.Sitemap = clinics.map((clinic) => ({
    url: `${baseUrl}/clinics/${clinic.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const jobPages: MetadataRoute.Sitemap = jobPostings
    .filter((j) => j.isActive)
    .map((job) => ({
      url: `${baseUrl}/jobs/${job.id}`,
      lastModified: new Date(job.publishedAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

  return [...staticPages, ...clinicPages, ...jobPages];
}
