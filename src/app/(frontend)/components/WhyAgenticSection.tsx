'use client'

import type { WhyAgenticSection as WhyAgenticSectionType } from '@/payload-types'
import { Icon } from './icons'
import ScrollReveal from './ScrollReveal'
import CharReveal from './CharReveal'
import { uiStrings, type Locale } from '@/i18n'

interface Props {
  data: WhyAgenticSectionType
  locale: Locale
}

export default function WhyAgenticSection({ data, locale }: Props) {
  const t = uiStrings[locale]

  return (
    <section id="why-agentic" className="bg-[#101417] text-[#F0EEE9] py-20 md:py-28 px-8 md:px-16 border-b border-[#F0EEE9]/10">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="mb-4 flex items-center gap-3">
            <div className="h-[1px] w-12 bg-[#00F5D4]" />
            <span className="font-sans text-xs uppercase tracking-widest text-[#F0EEE9]/50">
              {t['whyAgentic.label']}
            </span>
          </div>

          <h2 className="font-serif text-3xl md:text-5xl text-[#F0EEE9] mb-3 leading-tight">
            <CharReveal text={data.headline} delay={100} stagger={7} />
          </h2>
          <p className="font-serif text-xl md:text-2xl italic text-[#F0EEE9]/50 mb-8 max-w-2xl">
            {data.headlineEmphasis}
          </p>
          <p className="font-sans text-lg text-[#F0EEE9]/70 leading-relaxed mb-16 max-w-3xl">
            {data.introText}
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {data.benefits?.map((benefit, idx) => (
            <ScrollReveal key={benefit.id || idx} delay={idx * 150}>
              <div className="relative border border-[#F0EEE9]/10 p-8 group hover:bg-[#F0EEE9]/5 transition-colors duration-500 h-full">
                <div className="w-10 h-10 border border-[#F0EEE9]/20 flex items-center justify-center mb-6 group-hover:border-[#00F5D4]/40 transition-colors duration-500">
                  <Icon
                    name={benefit.icon}
                    size={18}
                    className="text-[#F0EEE9]/50 group-hover:text-[#00F5D4] transition-colors duration-500"
                  />
                </div>

                <h3 className="font-sans text-sm uppercase tracking-widest font-semibold text-[#F0EEE9] mb-4">
                  {benefit.title}
                </h3>
                <p className="font-sans text-sm text-[#F0EEE9]/50 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
