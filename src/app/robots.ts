import type { MetadataRoute } from 'next'

import { AI_CRAWLERS, SITE_URL } from '@/data/machineReadable'

export const dynamic = 'force-static'

/**
 * AI-first: every named AI crawler is explicitly allowed everywhere, and the
 * sitemap lists the machine-readable twins (llms.txt, Markdown pages) next
 * to the HTML. `/_next/` is build output with nothing to read.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: [...AI_CRAWLERS], allow: '/' },
      { userAgent: '*', allow: '/', disallow: '/_next/' },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
