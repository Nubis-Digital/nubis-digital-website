import type { Block } from 'payload'

export const HeroBlock: Block = {
  slug: 'hero-block',
  labels: {
    singular: 'Hero',
    plural: 'Heroes',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      required: true,
    },
    {
      name: 'body',
      type: 'textarea',
      required: true,
    },
    {
      name: 'ctaText',
      type: 'text',
      admin: {
        description: 'Call-to-action button label',
      },
    },
    {
      name: 'ctaLink',
      type: 'text',
      admin: {
        description: 'URL or path for the CTA button',
      },
    },
    {
      name: 'showPrism',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Show the 3D prism animation',
      },
    },
  ],
}
