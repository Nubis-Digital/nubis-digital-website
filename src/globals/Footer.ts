import type { GlobalConfig } from 'payload'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'logoText',
      type: 'text',
      required: true,
      defaultValue: 'Nubis',
    },
    {
      name: 'logoAccent',
      type: 'text',
      required: true,
      defaultValue: '.',
    },
    {
      name: 'tagline',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Architectural Resilience \u2022 2026',
    },
    {
      name: 'footerLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'href',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
