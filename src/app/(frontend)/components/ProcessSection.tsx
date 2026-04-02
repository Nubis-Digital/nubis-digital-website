'use client'

import { useEffect, useRef, useState } from 'react'
import type { ProcessSection as ProcessSectionType } from '@/payload-types'
import { Icon } from './icons'
import ScrollReveal from './ScrollReveal'
import CharReveal from './CharReveal'
import { uiStrings, type Locale } from '@/i18n'

interface StepCardProps {
  step: NonNullable<ProcessSectionType['steps']>[number]
  idx: number
  total: number
}

function StepCard({ step, idx, total }: StepCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.unobserve(el) } },
      { threshold: 0.2 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={cardRef}
      className="relative border border-[#F0EEE9]/10 p-8 group hover:bg-[#F0EEE9]/5 transition-all duration-500 h-full"
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 700ms ease-out ${idx * 150}ms, transform 700ms ease-out ${idx * 150}ms`,
      }}
    >
      {/* Connector line — draws from left to right after card enters view */}
      {idx < total - 1 && (
        <div
          className="hidden lg:block absolute top-1/2 -right-px h-px bg-[#00F5D4]/50 z-10"
          style={{
            width: '32px',
            transformOrigin: 'left',
            transform: inView ? 'scaleX(1)' : 'scaleX(0)',
            transition: `transform 400ms ease-out ${idx * 150 + 350}ms`,
          }}
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
