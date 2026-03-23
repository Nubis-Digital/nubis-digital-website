'use client'

import dynamic from 'next/dynamic'
import { ArrowRight } from 'lucide-react'
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
            href={data.ctaButtonUrl}
            className="bg-[#101417] text-[#00F5D4] hover:bg-[#00F5D4] hover:text-[#101417] transition-all duration-500 font-sans text-sm px-8 py-4 tracking-wider uppercase font-semibold flex items-center gap-3"
          >
            {data.ctaButtonText}
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      <div className="relative h-[50vh] md:h-auto overflow-hidden bg-gradient-to-br from-[#F0EEE9] to-[#F0EEE9]/50">
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(#101417 1px, transparent 1px), linear-gradient(90deg, #101417 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
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
