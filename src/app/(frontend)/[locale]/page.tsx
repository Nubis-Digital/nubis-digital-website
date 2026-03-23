import { getPayload } from 'payload'
import config from '@payload-config'
import { locales, type Locale } from '@/i18n'

import TransparencyPanel from '../components/TransparencyPanel'
import Hero from '../components/Hero'
import ServicesSection from '../components/ServicesSection'
import ProcessSection from '../components/ProcessSection'
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

  const [transparencyPanel, hero, servicesSection, servicesResult, processSection] =
    await Promise.all([
      payload.findGlobal({ slug: 'transparency-panel', locale }),
      payload.findGlobal({ slug: 'hero', locale }),
      payload.findGlobal({ slug: 'services-section', locale }),
      payload.find({
        collection: 'services',
        sort: 'order',
        limit: 20,
        locale,
      }),
      payload.findGlobal({ slug: 'process-section', locale }),
    ])

  return (
    <div>
      <TransparencyPanel data={transparencyPanel} />
      <main>
        <Hero data={hero} locale={locale} />
        <ScrollReveal>
          <ServicesSection
            sectionData={servicesSection}
            services={servicesResult.docs}
            locale={locale}
          />
        </ScrollReveal>
        <ProcessSection data={processSection} locale={locale} />
        <ContactSection locale={locale} />
      </main>
    </div>
  )
}
