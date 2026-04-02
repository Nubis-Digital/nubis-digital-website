import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import { locales, type Locale } from '@/i18n'
import ServiceDetail from '../../../components/ServiceDetail'

type Args = {
  params: Promise<{ locale: Locale; slug: string }>
}

export function generateStaticParams() {
  return locales.flatMap((locale) =>
    ['payload', 'umbraco', 'wordpress'].map((slug) => ({ locale, slug })),
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug, locale } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
  })

  const service = result.docs[0]

  if (!service) return { title: 'Service Not Found | Nubis Digital' }

  return {
    title: `${service.label} — ${service.title} | Nubis Digital`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: Args) {
  const { slug, locale } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    locale,
    limit: 1,
  })

  const service = result.docs[0]

  if (!service) notFound()

  return <ServiceDetail service={service} locale={locale} />
}
