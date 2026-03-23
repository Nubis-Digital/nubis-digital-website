import type { GlobalConfig } from 'payload'

export const TransparencyPanel: GlobalConfig = {
  slug: 'transparency-panel',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'message',
      type: 'text',
      required: true,
      localized: true,
      defaultValue:
        'Agentic Insight: Our internal AI optimized this layout in 12ms to prioritize readability based on your device metrics.',
      admin: {
        description: 'The typewriter message shown in the transparency bar',
      },
    },
    {
      name: 'linkText',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: '[View Optimization Log]',
    },
    {
      name: 'linkUrl',
      type: 'text',
      required: true,
      defaultValue: '#',
    },
  ],
}
