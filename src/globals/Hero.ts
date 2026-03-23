import type { GlobalConfig } from 'payload'

export const Hero: GlobalConfig = {
  slug: 'hero',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'headlinePart1',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Architectural Resilience for the',
    },
    {
      name: 'headlineEmphasis',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Agentic Web.',
      admin: {
        description: 'The italic portion of the headline rendered on a second line',
      },
    },
    {
      name: 'bodyText',
      type: 'textarea',
      required: true,
      localized: true,
      defaultValue:
        'We engineer Digital Content Hubs where human intent and AI execution meet seamlessly. Moving beyond static pages into dynamic, RAG-ready ecosystems.',
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'See How We Work',
    },
    {
      name: 'ctaButtonUrl',
      type: 'text',
      required: true,
      defaultValue: '#',
    },
  ],
}
