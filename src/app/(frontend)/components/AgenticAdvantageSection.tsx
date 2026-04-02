'use client'

import { ArrowRight, ShieldCheck } from 'lucide-react'
import type { AgenticAdvantageSection as AgenticAdvantageSectionType } from '@/payload-types'
import ScrollReveal from './ScrollReveal'
import { uiStrings, type Locale } from '@/i18n'
import { useStartProjectModal } from './StartProjectModalContext'

interface Props {
  data: AgenticAdvantageSectionType
  locale: Locale
}

export default function AgenticAdvantageSection({ data, locale }: Props) {
  const t = uiStrings[locale]
  const { openModal } = useStartProjectModal()

  return (
    <section className="bg-[#F0EEE9] border-b border-[#101417]">
      <div className="py-20 md:py-28 px-8 md:px-16">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="mb-4 flex items-center gap-3">
              <div className="h-[1px] w-12 bg-[#101417]" />
              <span className="font-sans text-xs uppercase tracking-widest text-[#101417]/50">
                {t['agenticAdvantage.label']}
              </span>
            </div>

            <h2 className="font-serif text-3xl md:text-5xl text-[#101417] mb-3 leading-tight">
              {data.headline}
            </h2>
            <p className="font-serif text-xl md:text-2xl italic text-[#101417]/50 mb-16 max-w-xl">
              {data.headlineEmphasis}
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 mb-16">
            {data.metrics?.map((metric, idx) => (
              <ScrollReveal key={metric.id || idx} delay={idx * 150}>
                <div className="border border-[#101417] p-8 group hover:bg-[#101417] hover:text-[#F0EEE9] transition-all duration-500 h-full">
                  <span className="block font-mono text-4xl md:text-5xl font-bold text-[#00F5D4] mb-4 group-hover:text-[#00F5D4]">
                    {metric.value}
                  </span>
                  <h3 className="font-sans text-sm uppercase tracking-widest font-semibold text-[#101417] mb-3 group-hover:text-[#F0EEE9] transition-colors duration-500">
                    {metric.label}
                  </h3>
                  <p className="font-sans text-sm text-[#101417]/60 leading-relaxed group-hover:text-[#F0EEE9]/60 transition-colors duration-500">
                    {metric.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>

      {/* Governance Callout — full-width dark banner */}
      <ScrollReveal>
        <div className="bg-[#101417] text-[#F0EEE9] px-8 md:px-16 py-12 md:py-16">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="w-14 h-14 border border-[#00F5D4]/40 flex items-center justify-center shrink-0">
              <ShieldCheck size={24} className="text-[#00F5D4]" />
            </div>
            <div>
              <h3 className="font-serif text-2xl md:text-3xl text-[#F0EEE9] mb-3">
                {data.governanceHeadline}
              </h3>
              <p className="font-sans text-[#F0EEE9]/60 leading-relaxed max-w-2xl">
                {data.governanceBody}
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* CTA */}
      <div className="px-8 md:px-16 py-12 flex justify-center">
        <ScrollReveal>
          {data.ctaUrl === '#contact' ? (
            <button
              onClick={openModal}
              className="bg-[#101417] text-[#00F5D4] hover:bg-[#00F5D4] hover:text-[#101417] transition-all duration-500 font-sans text-sm px-8 py-4 tracking-wider uppercase font-semibold inline-flex items-center gap-3"
            >
              {data.ctaText}
              <ArrowRight size={16} />
            </button>
          ) : (
            <a
              href={data.ctaUrl}
              className="bg-[#101417] text-[#00F5D4] hover:bg-[#00F5D4] hover:text-[#101417] transition-all duration-500 font-sans text-sm px-8 py-4 tracking-wider uppercase font-semibold inline-flex items-center gap-3"
            >
              {data.ctaText}
              <ArrowRight size={16} />
            </a>
          )}
        </ScrollReveal>
      </div>
    </section>
  )
}
