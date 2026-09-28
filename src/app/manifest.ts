import type { MetadataRoute } from 'next'

import { SITE_NAME } from '@/data/machineReadable'

export const dynamic = 'force-static'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'Nubis',
    description: 'Be the business AI recommends.',
    start_url: '/',
    display: 'browser',
    background_color: '#F0EEE9',
    theme_color: '#101417',
    icons: [
      { src: '/icon.svg', type: 'image/svg+xml', sizes: 'any' },
      { src: '/assets/icon-512.png', type: 'image/png', sizes: '512x512' },
    ],
  }
}
