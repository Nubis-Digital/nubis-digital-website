import type { GlobalConfig } from 'payload'

export const Header: GlobalConfig = {
  slug: 'header',
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
      admin: {
        description: 'The accent character rendered in plasma teal after logoText',
      },
    },
    {
      name: 'navLinks',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'linkType',
          type: 'select',
          defaultValue: 'custom',
          options: [
            { label: 'Custom URL', value: 'custom' },
            { label: 'Internal Page', value: 'page' },
          ],
        },
        {
          name: 'href',
          type: 'text',
          admin: {
            description: 'URL or anchor link (e.g. #services, /contact)',
            condition: (_, siblingData) => siblingData?.linkType !== 'page',
          },
        },
        {
          name: 'page',
          type: 'relationship',
          relationTo: 'pages',
          admin: {
            description: 'Select an internal page',
            condition: (_, siblingData) => siblingData?.linkType === 'page',
          },
        },
      ],
    },
    {
      name: 'oversightLabel',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Human Oversight',
    },
    {
      name: 'oversightActiveText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Active',
    },
    {
      name: 'oversightDisabledText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Disabled',
    },
    {
      name: 'oversightTooltip',
      type: 'textarea',
      required: true,
      localized: true,
      defaultValue:
        'All Nubis AI workflows are monitored and governable by our senior human architects.',
    },
    {
      name: 'ctaButtonText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Start Project',
    },
  ],
}
