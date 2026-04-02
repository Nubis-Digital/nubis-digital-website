'use client'

import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
import { useRef, useState, useEffect } from 'react'
import type { MouseEvent } from 'react'
import type { Hero as HeroType } from '@/payload-types'
import { uiStrings, type Locale } from '@/i18n'
import OversightBadge from './OversightBadge'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const ThreePrism = dynamic(() => import('./ThreePrism'), { ssr: false })

interface Props {
  data: HeroType
  locale: Locale
}

export default function Hero({ data, locale }: Props) {
  const t = uiStrings[locale]
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const containerRef = useRef<HTMLElement>(null)
  const prismPanelRef = useRef<HTMLDivElement>(null)
  const [ctaTranslate, setCtaTranslate] = useState({ x: 0, y: 0 })
  const reducedMotion = useRef(false)

  useEffect(() => {
    reducedMotion.current =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.documentElement.classList.contains('nubis-reduced-motion')
  }, [])

  // Entry timeline: headline → body → CTA cascade in on page load
  useGSAP(
    () => {
      if (reducedMotion.current) return
      const tl = gsap.timeline({ delay: 0.1 })
      tl.from('[data-hero-headline]', {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
      })
        .from(
          '[data-hero-body]',
          { opacity: 0, y: 24, duration: 0.7, ease: 'power2.out' },
          '-=0.5',
        )
        .from(
          '[data-hero-cta]',
          { opacity: 0, y: 16, duration: 0.6, ease: 'power2.out' },
          '-=0.4',
        )
    },
    { scope: containerRef },
  )

  // Parallax: prism panel moves at 0.3× scroll speed (subtle depth)
  useGSAP(
    () => {
      const panel = prismPanelRef.current
      if (!panel || reducedMotion.current) return
      gsap.to(panel, {
        yPercent: -15,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: containerRef },
  )

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
    <section
      ref={containerRef}
      className="grid grid-cols-1 md:grid-cols-2 min-h-[75vh] border-b border-[#101417]"
    >
      <div className="relative p-8 md:p-16 flex flex-col justify-center border-b md:border-b-0 md:border-r border-[#101417]">
        <h1 data-hero-headline className="font-serif text-5xl md:text-7xl text-[#101417] leading-tight mb-8">
          {data.headlinePart1} <br />
          <span className="italic text-[#101417]/80">{data.headlineEmphasis}</span>
        </h1>
        <p data-hero-body className="font-sans text-lg md:text-xl text-[#101417]/70 leading-relaxed mb-12 max-w-xl">
          {data.bodyText}
        </p>
        <div data-hero-cta className="flex items-center gap-6">
          <a
            ref={ctaRef}
            href={data.ctaButtonUrl}
            onMouseMove={handleCtaMouseMove}
            onMouseLeave={handleCtaMouseLeave}
            style={{
              transform: `translate(${ctaTranslate.x}px, ${ctaTranslate.y}px)`,
              transition:
                ctaTranslate.x === 0 && ctaTranslate.y === 0
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

      <div
        ref={prismPanelRef}
        className="relative h-[50vh] md:h-auto overflow-hidden bg-gradient-to-br from-[#F0EEE9] to-[#F0EEE9]/50"
      >
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
        <OversightBadge note={t['oversight.heroBadge']} position="bottom-right" />
      </div>
    </section>
  )
}
