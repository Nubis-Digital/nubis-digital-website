import type { Block } from 'payload'

export const ServicesOverviewBlock: Block = {
  slug: 'services-overview-block',
  labels: {
    singular: 'Services Overview',
    plural: 'Services Overviews',
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      defaultValue: "We don't just build websites.",
    },
    {
      name: 'intro',
      type: 'textarea',
      defaultValue:
        'Select an infrastructure paradigm below to view our architectural approach and custom plugin capabilities.',
    },
    {
      name: 'showDetailLinks',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Show "Learn More" links to individual service pages',
      },
    },
  ],
}
