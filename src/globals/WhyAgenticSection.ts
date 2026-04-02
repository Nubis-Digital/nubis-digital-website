import type { GlobalConfig } from 'payload'

export const WhyAgenticSection: GlobalConfig = {
  slug: 'why-agentic-section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Why Agentic Matters',
    },
    {
      name: 'headlineEmphasis',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'AI agents are becoming your most important visitors.',
    },
    {
      name: 'introText',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'benefits',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'text',
          required: true,
          admin: { description: 'Lucide icon name' },
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
      ],
    },
  ],
}
