import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content-block',
  labels: {
    singular: 'Content',
    plural: 'Content Blocks',
  },
  fields: [
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
  ],
}
