'use client'

import { usePathname } from 'next/navigation'
import type { Locale } from '@/i18n'

interface Props {
  locale: Locale
}

export default function LanguageSwitcher({ locale }: Props) {
  const pathname = usePathname()

  function switchedPath(targetLocale: Locale): string {
    // Replace /en/... or /es/... with the target locale
    const segments = pathname.split('/')
    if (segments[1] === 'en' || segments[1] === 'es') {
      segments[1] = targetLocale
    }
    return segments.join('/') || `/${targetLocale}`
  }

  const otherLocale: Locale = locale === 'en' ? 'es' : 'en'

  return (
    <a
      href={switchedPath(otherLocale)}
      className="font-mono text-xs uppercase tracking-widest text-[#101417]/60 hover:text-[#00F5D4] transition-colors duration-300 border border-[#101417]/20 px-2 py-1 hover:border-[#00F5D4]/40"
    >
      {otherLocale === 'es' ? 'ES' : 'EN'}
    </a>
  )
}
