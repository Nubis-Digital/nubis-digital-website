import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import ServiceDetail from '../../../components/ServiceDetail'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const services = await payload.find({
    collection: 'services',
    limit: 100,
    select: { slug: true },
  })

  return services.docs.map((service) => ({
    slug: service.slug,
  }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const service = result.docs[0]

  if (!service) {
    return { title: 'Service Not Found | Nubis Digital' }
  }

  return {
    title: `${service.label} — ${service.title} | Nubis Digital`,
    description: service.description,
  }
}

export default async function ServicePage({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'services',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const service = result.docs[0]

  if (!service) {
    notFound()
  }

  return <ServiceDetail service={service} />
}
