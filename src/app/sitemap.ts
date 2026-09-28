import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/data/machineReadable'

export const dynamic = 'force-static'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/umbraco`, changeFrequency: 'monthly', priority: 0.7 },
  ]
}
