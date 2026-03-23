'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import type { Header, Page } from '@/payload-types'
import type { Locale } from '@/i18n'

function getNavHref(link: NonNullable<Header['navLinks']>[number], locale: Locale): string {
  if (link.linkType === 'page' && link.page) {
    const page = link.page as Page
    return `/${locale}/${page.slug}`
  }
  const href = link.href || '#'
  if (href.startsWith('/') && !href.startsWith('#')) {
    return `/${locale}${href}`
  }
  return href
}

interface Props {
  navLinks: Header['navLinks']
  ctaButtonText: string
  locale: Locale
}

export default function MobileMenu({ navLinks, ctaButtonText, locale }: Props) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  const otherLocale: Locale = locale === 'en' ? 'es' : 'en'

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  function switchedPath(): string {
    const segments = pathname.split('/')
    if (segments[1] === 'en' || segments[1] === 'es') {
      segments[1] = otherLocale
    }
    return segments.join('/') || `/${otherLocale}`
  }

  const overlay = (
    <div
      className={`fixed inset-0 z-[999] bg-[#101417] flex flex-col items-center justify-center gap-12 transition-all duration-500 ease-in-out md:hidden ${
        open
          ? 'opacity-100 pointer-events-auto'
          : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Close button inside overlay */}
      <button
        onClick={() => setOpen(false)}
        className="absolute top-5 right-6 w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
        aria-label="Close menu"
      >
        <span className="block w-6 h-[2px] rounded-full bg-[#F0EEE9] rotate-45 translate-y-[4px]" />
        <span className="block w-6 h-[2px] rounded-full bg-[#F0EEE9] -rotate-45 -translate-y-[4px]" />
      </button>

      <nav className="flex flex-col items-center gap-8">
        {navLinks?.map((link, i) => (
          <a
            key={i}
            href={getNavHref(link, locale)}
            onClick={() => setOpen(false)}
            className={`font-serif text-4xl text-[#F0EEE9] hover:text-[#00F5D4] transition-all duration-500 ${
              open
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
            }`}
            style={{ transitionDelay: open ? `${150 + i * 75}ms` : '0ms' }}
          >
            {link.label}
          </a>
        ))}
      </nav>

      <div
        className={`flex flex-col items-center gap-6 transition-all duration-500 ${
          open ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
        style={{ transitionDelay: open ? '400ms' : '0ms' }}
      >
        <button
          onClick={() => setOpen(false)}
          className="bg-[#00F5D4] text-[#101417] font-sans text-sm px-8 py-4 tracking-wider uppercase font-semibold hover:bg-[#F0EEE9] transition-colors duration-300"
        >
          {ctaButtonText}
        </button>

        <a
          href={switchedPath()}
          className="font-mono text-sm uppercase tracking-widest text-[#F0EEE9]/50 hover:text-[#00F5D4] transition-colors border border-[#F0EEE9]/20 px-4 py-2"
        >
          {otherLocale === 'es' ? 'Español' : 'English'}
        </a>
      </div>
    </div>
  )

  return (
    <div className="md:hidden">
      {/* Hamburger button */}
      <button
        onClick={() => setOpen(true)}
        className="relative z-[51] w-10 h-10 flex flex-col items-center justify-center gap-[6px]"
        aria-label="Open menu"
      >
        <span className="block w-6 h-[2px] rounded-full bg-[#101417]" />
        <span className="block w-6 h-[2px] rounded-full bg-[#101417]" />
        <span className="block w-6 h-[2px] rounded-full bg-[#101417]" />
      </button>

      {/* Portal the overlay to body so it escapes the header stacking context */}
      {mounted && createPortal(overlay, document.body)}
    </div>
  )
}
