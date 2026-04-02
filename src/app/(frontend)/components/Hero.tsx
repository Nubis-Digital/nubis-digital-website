'use client'

import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
import { useRef, useState, useEffect, type MouseEvent } from 'react'
import type { Hero as HeroType } from '@/payload-types'
import { uiStrings, type Locale } from '@/i18n'
import OversightBadge from './OversightBadge'

const ThreePrism = dynamic(() => import('./ThreePrism'), { ssr: false })

interface Props {
  data: HeroType
  locale: Locale
}

export default function Hero({ data, locale }: Props) {
  const t = uiStrings[locale]
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const [ctaTranslate, setCtaTranslate] = useState({ x: 0, y: 0 })
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('nubis-reduced-motion')
  }, [])

  function handleCtaMouseMove(e: MouseEvent<HTMLAnchorElement>) {
    if (reducedMotion.current || !ctaRef.current) return
    const rect = ctaRef.current.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const dist = Math.sqrt(dx * dx + dy * dy)
    if (dist < 80) {
      setCtaTranslate({ x: dx * 0.22, y: dy * 0.22 })
    }
  }

  function handleCtaMouseLeave() {
    setCtaTranslate({ x: 0, y: 0 })
  }

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 min-h-[75vh] border-b border-[#101417]">
      <div className="relative p-8 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#101417]">
        <h1 className="font-serif text-5xl md:text-7xl text-[#101417] leading-tight mb-8">
          {data.headlinePart1} <br />
          <span className="italic text-[#101417]/80">{data.headlineEmphasis}</span>
        </h1>
        <p className="font-sans text-lg md:text-xl text-[#101417]/70 leading-relaxed mb-12 max-w-xl">
          {data.bodyText}
        </p>
        <div className="flex items-center gap-6">
          <a
            ref={ctaRef}
            href={data.ctaButtonUrl}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            style={{
              transform: `translate(${ctaTranslate.x}px, ${ctaTranslate.y}px)`,
              transition: ctaTranslate.x === 0 && ctaTranslate.y === 0
                ? 'transform 300ms ease-out, background-color 500ms, color 500ms'
                : 'background-color 500ms, color 500ms',
            }}
            className="bg-[#101417] text-[#00F5D4] hover:bg-[#00F5D4] hover:text-[#101417] font-sans text-sm px-8 py-4 tracking-wider uppercase font-semibold flex items-center gap-3"
          >
            {data.ctaButtonText}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="relative h-[50vh] md:h-auto overflow-hidden bg-gradient-to-br from-[#F0EEE9] to-[#F0EEE9]/50">
        {/* Architectural grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#101417 1px, transparent 1px), linear-gradient(90deg, #101417 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Scan line A */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-[#00F5D4] opacity-[0.35] pointer-events-none"
          style={{ animation: 'nubis-scan 7s linear infinite' }}
        />
        {/* Scan line B (offset by 3.5s = half cycle) */}
        <div
          className="absolute inset-x-0 top-0 h-px bg-[#00F5D4] opacity-[0.18] pointer-events-none"
          style={{ animation: 'nubis-scan 7s linear infinite', animationDelay: '-3.5s' }}
        />

        <ThreePrism />
        <OversightBadge
          note={t['oversight.heroBadge']}
          position="bottom-right"
        />
      </div>
    </section>
  )
}
