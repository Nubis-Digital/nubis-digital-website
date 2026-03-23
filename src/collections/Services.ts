import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'order', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL-safe identifier, e.g. "payload", "umbraco", "wordpress"',
      },
    },
    {
      name: 'label',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Tab label shown to users, e.g. "Payload CMS"',
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      options: [
        { label: 'Database', value: 'Database' },
        { label: 'Layers', value: 'Layers' },
        { label: 'Code', value: 'Code' },
        { label: 'Server', value: 'Server' },
        { label: 'Activity', value: 'Activity' },
        { label: 'Cpu', value: 'Cpu' },
      ],
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Heading inside the content panel',
      },
    },
    {
      name: 'subtitle',
      type: 'text',
      required: true,
      localized: true,
      admin: {
        description: 'Accent subtitle shown in teal highlight bar',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      localized: true,
    },
    {
      name: 'agenticEdge',
      type: 'textarea',
      required: true,
      localized: true,
      admin: {
        description: 'Text shown in the dark "Agentic Edge" panel',
      },
    },
    {
      name: 'specs',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: {
        description: 'Rows in the "Deployment Specs" table',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'value',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Server', value: 'Server' },
            { label: 'Activity', value: 'Activity' },
            { label: 'ShieldCheck', value: 'ShieldCheck' },
            { label: 'Database', value: 'Database' },
          ],
        },
        {
          name: 'accentColor',
          type: 'select',
          required: true,
          options: [
            { label: 'Deep Ink (Black)', value: 'deep-ink' },
            { label: 'Plasma Teal', value: 'plasma-teal' },
            { label: 'Holo Lilac', value: 'holo-lilac' },
          ],
        },
      ],
    },
    {
      name: 'plugins',
      type: 'array',
      minRows: 1,
      admin: {
        description: 'List items shown in "Bespoke Plugins & Integrations"',
      },
      fields: [
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
        },
      ],
    },
    {
      name: 'order',
      type: 'number',
      required: true,
      admin: {
        description: 'Controls tab display order (lower numbers appear first)',
      },
    },
    {
      name: 'featuredImage',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hero image shown on the service detail page',
      },
    },
    {
      name: 'detailContent',
      type: 'richText',
      admin: {
        description: 'Extended content shown on the individual service page (/services/[slug])',
      },
    },
  ],
}
