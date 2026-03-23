import { getPayload } from 'payload'
import config from '@payload-config'
import type { Page } from '@/payload-types'
import ServicesBlockClient from './ServicesBlockClient'

type ServicesOverviewBlockData = Extract<
  NonNullable<Page['layout']>[number],
  { blockType: 'services-overview-block' }
>

export default async function ServicesOverviewBlockComponent({
  block,
}: {
  block: ServicesOverviewBlockData
}) {
  const payload = await getPayload({ config })

  const servicesResult = await payload.find({
    collection: 'services',
    sort: 'order',
    limit: 20,
  })

  return (
    <ServicesBlockClient
      heading={block.heading || ''}
      intro={block.intro || ''}
      showDetailLinks={block.showDetailLinks ?? true}
      services={servicesResult.docs}
    />
  )
}
