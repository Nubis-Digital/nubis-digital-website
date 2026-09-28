import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/data/machineReadable'

export const dynamic = 'force-static'

/** AI crawlers are welcome: being read is the whole point of this site. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
