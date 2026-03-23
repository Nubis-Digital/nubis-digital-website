import type { Page } from '@/payload-types'
import HeroBlockComponent from './blocks/HeroBlockComponent'
import ContentBlockComponent from './blocks/ContentBlockComponent'
import CTABlockComponent from './blocks/CTABlockComponent'
import CardGridBlockComponent from './blocks/CardGridBlockComponent'
import ServicesOverviewBlockComponent from './blocks/ServicesOverviewBlockComponent'

type LayoutBlock = NonNullable<Page['layout']>[number]

export default function RenderBlocks({ blocks }: { blocks: LayoutBlock[] }) {
  if (!blocks || blocks.length === 0) return null

  return (
    <>
      {blocks.map((block, index) => {
        switch (block.blockType) {
          case 'hero-block':
            return <HeroBlockComponent key={index} block={block} />
          case 'content-block':
            return <ContentBlockComponent key={index} block={block} />
          case 'cta-block':
            return <CTABlockComponent key={index} block={block} />
          case 'card-grid-block':
            return <CardGridBlockComponent key={index} block={block} />
          case 'services-overview-block':
            return <ServicesOverviewBlockComponent key={index} block={block} />
          default:
            return null
        }
      })}
    </>
  )
}
