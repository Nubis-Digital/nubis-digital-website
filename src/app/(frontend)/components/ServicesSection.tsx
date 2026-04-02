'use client'

import { useState, useRef, useEffect, Fragment } from 'react'
import { ArrowRight, Cpu, AlertTriangle } from 'lucide-react'
import type {
  Service,
  ServicesSection as ServicesSectionType,
} from '@/payload-types'
import { Icon } from './icons'
import OversightBadge from './OversightBadge'
import { uiStrings, type Locale } from '@/i18n'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

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
  const sectionRef = useRef<HTMLElement>(null)

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

  // Desktop-only pin: auto-advance tabs as user scrolls through 3×100vh
  useGSAP(
    () => {
      const section = sectionRef.current
      if (!section || services.length < 2) return

      const mm = gsap.matchMedia()
      mm.add('(min-width: 768px) and (prefers-reduced-motion: no-preference)', () => {
        const segmentHeight = window.innerHeight
        const totalScroll = segmentHeight * services.length

        ScrollTrigger.create({
          trigger: section,
          start: 'top top',
          end: `+=${totalScroll}`,
          pin: true,
          anticipatePin: 1,
          onUpdate(self) {
            const progress = self.progress
            const idx = Math.min(
              Math.floor(progress * services.length),
              services.length - 1,
            )
            const slug = services[idx]?.slug
            if (slug) setActiveSlug(slug)
          },
        })
      })

      return () => mm.revert()
    },
    { scope: sectionRef, dependencies: [services] },
  )

  if (!activeService) return null

  return (
    <section
      ref={sectionRef}
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
            {services.map((service) => {
              const isActive = activeSlug === service.slug
              return (
                <button
                  key={service.slug}
                  onClick={() => setActiveSlug(service.slug)}
                  className={`tab-ink-fill${isActive ? ' tab-ink-fill--active' : ''} p-5 flex items-center justify-between border-b border-[#101417] font-sans text-sm uppercase tracking-wider font-semibold`}
                  style={{ color: isActive ? '#F0EEE9' : '#101417' }}
                >
                  {/* Ink fill layer */}
                  <span className="tab-ink-fill__bg" />
                  {/* Content above fill */}
                  <span className="relative z-10 flex items-center gap-3 transition-colors duration-100">
                    <Icon name={service.icon} size={18} />
                    {service.label}
                  </span>
                  <ArrowRight
                    size={16}
                    className={`relative z-10 transition-all duration-300 ${
                      isActive
                        ? 'text-[#00F5D4] opacity-100 translate-x-0'
                        : 'opacity-0 -translate-x-2'
                    }`}
                  />
                </button>
              )
            })}
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
                {t['services.architectureProfile']}
              </span>
            </div>

            <h3 className="font-serif text-4xl text-[#101417] mb-2">
              {activeService.title}
            </h3>
            <h4 className="font-sans text-lg text-[#00F5D4] bg-[#101417] self-start px-3 py-1 mb-8">
              {activeService.subtitle}
            </h4>

            {/* Umbraco: pain signal tags */}
            {activeService.slug === 'umbraco' && (
              <div className="flex flex-wrap gap-2 mb-8 -mt-2">
                {(locale === 'es'
                  ? ['Umbraco v7/v8/v10: fin de vida', 'Carga > 4 segundos', 'Sin parches de seguridad']
                  : ['Umbraco v7/v8/v10 end-of-life', 'Page load > 4 seconds', 'No security patches']
                ).map((signal) => (
                  <span
                    key={signal}
                    className="inline-flex items-center gap-1.5 border border-orange-500/30 bg-orange-500/5 text-orange-600 font-mono text-[10px] px-2.5 py-1 uppercase tracking-wider"
                  >
                    <AlertTriangle size={9} />
                    {signal}
                  </span>
                ))}
              </div>
            )}

            <p className="font-sans text-[#101417]/80 text-lg leading-relaxed mb-10 max-w-2xl">
              {activeService.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10 w-full max-w-3xl">
              <div className="border border-[#101417] p-6 bg-white/50 backdrop-blur-sm">
                <h5 className="font-sans text-xs uppercase tracking-widest text-[#101417]/50 mb-4 border-b border-[#101417]/20 pb-2">
                  {t['services.deploymentSpecs']}
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
                  {t['services.agenticEdge']}
                </h5>
                <p className="font-sans text-sm leading-relaxed text-[#F0EEE9]/80">
                  {activeService.agenticEdge}
                </p>
              </div>
            </div>

            <div className="border-t border-[#101417] pt-8 opacity-60 group-hover:opacity-100 transition-opacity duration-700">
              <h5 className="font-sans text-sm uppercase tracking-widest text-[#101417] mb-4 font-semibold">
                {t['services.pluginsTitle']}
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

            {/* Umbraco: version migration path */}
            {activeService.slug === 'umbraco' && (
              <div className="mt-6 mb-2 border border-[#101417]/10 bg-[#101417]/[0.02] px-6 py-4">
                <p className="font-sans text-[10px] uppercase tracking-widest text-[#101417]/30 mb-3">
                  {locale === 'es' ? 'Ruta de migración' : 'Migration path'}
                </p>
                <div className="flex items-center gap-3 font-mono text-sm">
                  {['v7', 'v8', 'v10'].map((v) => (
                    <Fragment key={v}>
                      <span className="line-through text-[#101417]/25">{v}</span>
                      <span className="text-[#101417]/15 text-xs">→</span>
                    </Fragment>
                  ))}
                  <span className="font-bold text-[#00F5D4] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#00F5D4] inline-block" />
                    v14 LTS
                  </span>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-[#101417]/20">
              <a
                href={`/services/${activeService.slug}`}
                className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-widest text-[#00F5D4] bg-[#101417] px-6 py-3 hover:bg-[#B9A7FF] hover:text-[#101417] transition-all duration-500"
              >
                {t['services.learnMore']}
                <ArrowRight size={14} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
