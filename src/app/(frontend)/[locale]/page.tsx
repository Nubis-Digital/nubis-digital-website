import { getPayload } from 'payload'
import config from '@payload-config'
import { locales, type Locale } from '@/i18n'

import TransparencyPanel from '../components/TransparencyPanel'
import Hero from '../components/Hero'
import WhyAgenticSection from '../components/WhyAgenticSection'
import ServicesSection from '../components/ServicesSection'
import ProcessSection from '../components/ProcessSection'
import AgenticAdvantageSection from '../components/AgenticAdvantageSection'
import ContactSection from '../components/ContactSection'
import ScrollReveal from '../components/ScrollReveal'

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

interface Props {
  params: Promise<{ locale: Locale }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  const payload = await getPayload({ config })

  const [
    transparencyPanel,
    hero,
    whyAgenticSection,
    servicesSection,
    servicesResult,
    processSection,
    agenticAdvantageSection,
  ] = await Promise.all([
    payload.findGlobal({ slug: 'transparency-panel', locale }),
    payload.findGlobal({ slug: 'hero', locale }),
    payload.findGlobal({ slug: 'why-agentic-section', locale }),
    payload.findGlobal({ slug: 'services-section', locale }),
    payload.find({
      collection: 'services',
      sort: 'order',
      limit: 20,
      locale,
    }),
    payload.findGlobal({ slug: 'process-section', locale }),
    payload.findGlobal({ slug: 'agentic-advantage-section', locale }),
  ])

  return (
    <div>
      <TransparencyPanel data={transparencyPanel} locale={locale} />
      <main>
        <Hero data={hero} locale={locale} />
        <WhyAgenticSection data={whyAgenticSection} locale={locale} />
        <ScrollReveal>
          <ServicesSection
            sectionData={servicesSection}
            services={servicesResult.docs}
            locale={locale}
          />
        </ScrollReveal>
        <ProcessSection data={processSection} locale={locale} />
        <AgenticAdvantageSection data={agenticAdvantageSection} locale={locale} />
        <ContactSection locale={locale} />
      </main>
    </div>
  )
}
