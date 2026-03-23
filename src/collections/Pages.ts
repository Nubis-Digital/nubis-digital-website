import type { CollectionConfig } from 'payload'
import { HeroBlock } from '../blocks/HeroBlock'
import { ContentBlock } from '../blocks/ContentBlock'
import { CTABlock } from '../blocks/CTABlock'
import { CardGridBlock } from '../blocks/CardGridBlock'
import { ServicesOverviewBlock } from '../blocks/ServicesOverviewBlock'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL path for this page, e.g. "about" becomes /about',
      },
    },
    {
      name: 'meta',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Override the page title for SEO (defaults to page title)',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Meta description for search engines',
          },
        },
      ],
    },
    {
      name: 'layout',
      type: 'blocks',
      blocks: [HeroBlock, ContentBlock, CTABlock, CardGridBlock, ServicesOverviewBlock],
    },
  ],
}
