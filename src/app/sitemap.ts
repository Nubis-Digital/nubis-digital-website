import type { MetadataRoute } from 'next'

import { SITE_URL, SITE_URLS } from '@/data/machineReadable'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  // Static export: "last modified" is the build that published it.
  const lastModified = new Date()
  return SITE_URLS.map(({ path, priority, changeFrequency }) => ({ url: `${SITE_URL}${path}`, lastModified, changeFrequency, priority }))
}
