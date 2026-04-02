'use client'

import { useRef } from 'react'
import type { ProcessSection as ProcessSectionType } from '@/payload-types'
import { Icon } from './icons'
import ScrollReveal from './ScrollReveal'
import CharReveal from './CharReveal'
import { uiStrings, type Locale } from '@/i18n'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(useGSAP, ScrollTrigger)

interface StepCardProps {
  step: NonNullable<ProcessSectionType['steps']>[number]
  idx: number
  total: number
}

function StepCard({ step, idx, total }: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const el = cardRef.current
      if (!el) return

      // Card entry animation
      gsap.from(el, {
        opacity: 0,
        y: 32,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      })

      // Connector line scrub
      if (idx < total - 1) {
        const line = el.querySelector<HTMLElement>('[data-connector]')
        if (line) {
          gsap.fromTo(
            line,
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: el,
                start: 'top 80%',
                end: 'top 40%',
                scrub: 0.6,
              },
            },
          )
        }
      }
    },
    { scope: cardRef },
  )

  return (
    <div
      ref={cardRef}
      className="relative border border-[#F0EEE9]/10 p-8 group hover:bg-[#F0EEE9]/5 transition-all duration-500 h-full"
    >
      {/* Connector line — scrubs from left to right as card scrolls into view */}
      {idx < total - 1 && (
        <div
          data-connector
          className="hidden lg:block absolute top-1/2 -right-px h-px bg-[#00F5D4]/50 z-10"
          style={{ width: '32px', transformOrigin: 'left', transform: 'scaleX(0)' }}
        />
      )}

      <div className="flex items-center justify-between mb-6">
        <span className="font-mono text-3xl font-bold text-[#00F5D4]/20 group-hover:text-[#00F5D4]/40 transition-colors duration-500">
          {step.number}
        </span>
        <div className="w-10 h-10 border border-[#F0EEE9]/20 flex items-center justify-center group-hover:border-[#00F5D4]/40 transition-colors duration-500">
          <Icon
            name={step.icon}
            size={18}
            className="text-[#F0EEE9]/50 group-hover:text-[#00F5D4] transition-colors duration-500"
          />
        </div>
      </div>

      <h3 className="font-sans text-sm uppercase tracking-widest font-semibold text-[#F0EEE9] mb-4">
        {step.title}
      </h3>
      <p className="font-sans text-sm text-[#F0EEE9]/50 leading-relaxed">
        {step.description}
      </p>
    </div>
  )
}

interface Props {
  data: ProcessSectionType
  locale: Locale
}

export default function ProcessSection({ data, locale }: Props) {
  const t = uiStrings[locale]
  const total = data.steps?.length ?? 0

  return (
    <section className="bg-[#101417] text-[#F0EEE9] border-b border-[#F0EEE9]/10 py-20 md:py-28 px-8 md:px-16">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[1px] w-12 bg-[#00F5D4]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/50">
              {t['process.label']}
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-[#F0EEE9] mb-3 leading-tight">
            <CharReveal text={data.headline} delay={200} stagger={7} />
          </h2>
          <p className="font-serif text-xl md:text-2xl italic text-[#F0EEE9]/50 mb-16 max-w-xl">
            {data.headlineEmphasis}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0">
          {data.steps?.map((step, idx) => (
            <StepCard key={step.id || idx} step={step} idx={idx} total={total} />
          ))}
        </div>
      </div>
    </section>
  )
}
