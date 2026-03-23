import type { GlobalConfig } from 'payload'

export const ServicesSection: GlobalConfig = {
  slug: 'services-section',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'sectionHeadlinePart1',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: "We don't just build websites.",
    },
    {
      name: 'sectionHeadlineEmphasis',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'We train Digital Hubs.',
      admin: {
        description: 'Italic line shown below the main headline',
      },
    },
    {
      name: 'sectionIntroText',
      type: 'textarea',
      required: true,
      localized: true,
      defaultValue:
        'Select an infrastructure paradigm below to view our architectural approach and custom plugin capabilities.',
    },
  ],
}
