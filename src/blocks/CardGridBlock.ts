import type { Block } from 'payload'

export const CardGridBlock: Block = {
  slug: 'card-grid-block',
  labels: {
    singular: 'Card Grid',
    plural: 'Card Grids',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
    },
    {
      name: 'cards',
      type: 'array',
      minRows: 1,
      maxRows: 12,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Database', value: 'Database' },
            { label: 'Layers', value: 'Layers' },
            { label: 'Code', value: 'Code' },
            { label: 'Server', value: 'Server' },
            { label: 'Activity', value: 'Activity' },
            { label: 'ShieldCheck', value: 'ShieldCheck' },
            { label: 'Cpu', value: 'Cpu' },
          ],
        },
        {
          name: 'link',
          type: 'text',
          admin: {
            description: 'Optional URL or path',
          },
        },
      ],
    },
  ],
}
