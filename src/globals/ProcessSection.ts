import type { GlobalConfig } from 'payload'

export const ProcessSection: GlobalConfig = {
  slug: 'process-section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'How We Work',
    },
    {
      name: 'headlineEmphasis',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Human intent meets AI execution.',
    },
    {
      name: 'steps',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          admin: { description: 'Step number, e.g. "01"' },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
          localized: true,
        },
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: { description: 'Lucide icon name' },
        },
      ],
    },
  ],
}
