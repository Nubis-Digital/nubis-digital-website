'use client'

import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Cpu } from 'lucide-react'
import type {
  Service,
  ServicesSection as ServicesSectionType,
} from '@/payload-types'
import { Icon } from './icons'
import OversightBadge from './OversightBadge'
import { uiStrings, type Locale } from '@/i18n'

const ACCENT_COLOR_MAP: Record<string, string> = {
  'deep-ink': 'text-[#101417]',
  'plasma-teal': 'text-[#00F5D4]',
  'holo-lilac': 'text-[#B9A7FF]',
}

interface Props {
  sectionData: ServicesSectionType
  services: Service[]
  locale: Locale
}

export default function ServicesSection({ sectionData, services, locale }: Props) {
  const t = uiStrings[locale]
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug ?? '')
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [displayedSlug, setDisplayedSlug] = useState(activeSlug)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const activeService =
    services.find((s) => s.slug === displayedSlug) ?? services[0]

  useEffect(() => {
    if (activeSlug === displayedSlug) return

    setIsTransitioning(true)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setDisplayedSlug(activeSlug)
      setIsTransitioning(false)
    }, 250)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [activeSlug, displayedSlug])

  if (!activeService) return null

  return (
    <section
      id="services"
      className="bg-[#F0EEE9] border-b border-[#101417] relative"
    >
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,#B9A7FF_0%,transparent_50%)]"
        style={{
          animation: 'pulse 8s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row">
        {/* Left: Tab Navigation */}
        <div className="w-full md:w-1/3 border-b md:border-b-0 md:border-r border-[#101417] p-8 md:p-12">
          <h2 className="font-serif text-3xl md:text-5xl text-[#101417] mb-6 leading-tight">
            {sectionData.sectionHeadlinePart1} <br />
            <span className="italic opacity-70">
              {sectionData.sectionHeadlineEmphasis}
            </span>
          </h2>
          <p className="font-sans text-sm text-[#101417]/60 mb-12 max-w-xs leading-relaxed">
            {sectionData.sectionIntroText}
          </p>

          <div className="flex flex-col gap-0 border-t border-l border-r border-[#101417]">
            {services.map((service) => (
              <button
                key={service.slug}
                onClick={() => setActiveSlug(service.slug)}
                className={`p-5 flex items-center justify-between border-b border-[#101417] font-sans text-sm transition-all duration-300 uppercase tracking-wider font-semibold
                  ${
                    activeSlug === service.slug
                      ? 'bg-[#101417] text-[#F0EEE9]'
                      : 'bg-[#F0EEE9] text-[#101417] hover:bg-[#B9A7FF]/10'
                  }`}
              >
                <div className="flex items-center gap-3">
                  <Icon name={service.icon} size={18} />
                  {service.label}
                </div>
                <ArrowRight
                  size={16}
                  className={`transition-all duration-300 ${
                    activeSlug === service.slug
                      ? 'text-[#00F5D4] opacity-100 translate-x-0'
                      : 'opacity-0 -translate-x-2'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Content Panel */}
        <div className="relative w-full md:w-2/3 p-8 md:p-16 flex flex-col justify-center min-h-[600px] overflow-hidden group">
          <OversightBadge
            note={t['oversight.servicesBadge']}
            position="top-right"
          />

          <div
            className={`transition-all duration-300 ${
              isTransitioning
                ? 'opacity-0 translate-y-3'
                : 'opacity-100 translate-y-0'
            }`}
          >
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[1px] w-12 bg-[#101417]" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#101417]/50">
                Architecture Profile
              </span>
            </div>

            <h3 className="font-serif text-4xl text-[#101417] mb-2">
              {activeService.title}
            </h3>
            <h4 className="font-sans text-lg text-[#00F5D4] bg-[#101417] self-start px-3 py-1 mb-8">
              {activeService.subtitle}
            </h4>

            <p className="font-sans text-[#101417]/80 text-lg leading-relaxed mb-10 max-w-2xl">
              {activeService.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full max-w-3xl">
              <div className="border border-[#101417] p-6 bg-white/50 backdrop-blur-sm">
                <h5 className="font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-4 border-b border-[#101417]/20 pb-2">
                  Deployment Specs
                </h5>
                <div className="space-y-4">
                  {activeService.specs?.map((spec, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between font-sans text-sm"
                    >
                      <span className="text-[#101417]/70">{spec.label}</span>
                      <span
                        className={`flex items-center gap-2 font-mono font-medium ${ACCENT_COLOR_MAP[spec.accentColor] || 'text-[#101417]'}`}
                      >
                        <Icon name={spec.icon} size={14} />
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border border-[#101417] p-6 bg-[#101417] text-[#F0EEE9] hover:border-[#B9A7FF]/40 hover:shadow-lg hover:shadow-[#B9A7FF]/5 transition-all duration-500">
                <h5 className="font-sans text-xs uppercase tracking-widest text-[#00F5D4] mb-4 border-b border-[#F0EEE9]/20 pb-2 flex items-center gap-2">
                  <Cpu
                    size={14}
                    className="animate-pulse"
                    style={{ animationDuration: '3s' }}
                  />
                  The Agentic Edge
                </h5>
                <p className="font-sans text-sm leading-relaxed text-[#F0EEE9]/80">
                  {activeService.agenticEdge}
                </p>
              </div>
            </div>

            <div className="border-t border-[#101417] pt-8 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
              <h5 className="font-sans text-sm uppercase tracking-widest text-[#101417] mb-4 font-semibold">
                Bespoke Plugins & Integrations
              </h5>
              <ul className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {activeService.plugins?.map((plugin, idx) => (
                  <li
                    key={idx}
                    className="font-sans text-xs text-[#101417] flex items-start gap-2"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-[#B9A7FF] mt-1 shrink-0" />
                    {plugin.text}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 pt-6 border-t border-[#101417]/20">
              <a
                href={`/services/${activeService.slug}`}
                className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-[#00F5D4] bg-[#101417] px-6 py-3 hover:bg-[#B9A7FF] hover:text-[#101417] transition-all duration-500"
              >
                Learn More
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
