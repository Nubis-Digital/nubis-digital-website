import type { GlobalConfig } from 'payload'

export const AgenticAdvantageSection: GlobalConfig = {
  slug: 'agentic-advantage-section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headline',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'The Agentic Advantage',
    },
    {
      name: 'headlineEmphasis',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'What agent-ready architecture delivers.',
    },
    {
      name: 'metrics',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'value',
          type: 'text',
          required: true,
          admin: { description: 'The metric value, e.g. "3x", "60%", "< 200ms"' },
        },
        {
          name: 'label',
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
    {
      name: 'governanceHeadline',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: '100% Human-Governed. Zero Concessions.',
    },
    {
      name: 'governanceBody',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'ctaText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Start Your Agentic Project',
    },
    {
      name: 'ctaUrl',
      type: 'text',
      required: true,
      defaultValue: '#contact',
    },
  ],
}
