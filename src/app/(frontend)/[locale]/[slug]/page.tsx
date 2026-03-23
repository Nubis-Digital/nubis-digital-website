import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { Metadata } from 'next'
import RenderBlocks from '../../components/RenderBlocks'

type Args = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const payload = await getPayload({ config })
  const pages = await payload.find({
    collection: 'pages',
    limit: 100,
    select: { slug: true },
  })

  return pages.docs.map((page) => ({
    slug: page.slug,
  }))
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]

  if (!page) {
    return { title: 'Page Not Found | Nubis Digital' }
  }

  return {
    title: page.meta?.metaTitle || `${page.title} | Nubis Digital`,
    description: page.meta?.metaDescription || undefined,
  }
}

export default async function PageRoute({ params }: Args) {
  const { slug } = await params
  const payload = await getPayload({ config })

  const result = await payload.find({
    collection: 'pages',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const page = result.docs[0]

  if (!page) {
    notFound()
  }

  return (
    <main className="pt-[73px]">
      <RenderBlocks blocks={page.layout || []} />
    </main>
  )
}
