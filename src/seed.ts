import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding Transparency Panel global...')
  await payload.updateGlobal({
    slug: 'transparency-panel',
    data: {
      message:
        'Agentic Insight: Our internal AI optimized this layout in 12ms to prioritize readability based on your device metrics.',
      linkText: '[View Optimization Log]',
      linkUrl: '#',
    },
  })

  console.log('Seeding Hero global...')
  await payload.updateGlobal({
    slug: 'hero',
    data: {
      headlinePart1: 'Architectural Resilience for the',
      headlineEmphasis: 'Agentic Web.',
      bodyText:
        'We engineer Digital Content Hubs where human intent and AI execution meet seamlessly. Moving beyond static pages into dynamic, RAG-ready ecosystems.',
      ctaButtonText: 'See How We Work',
      ctaButtonUrl: '#',
    },
  })

  console.log('Seeding Services Section global...')
  await payload.updateGlobal({
    slug: 'services-section',
    data: {
      sectionHeadlinePart1: "We don't just build websites.",
      sectionHeadlineEmphasis: 'We train Digital Hubs.',
      sectionIntroText:
        'Select an infrastructure paradigm below to view our architectural approach and custom plugin capabilities.',
    },
  })

  console.log('Seeding Process Section global...')
  await payload.updateGlobal({
    slug: 'process-section',
    data: {
      headline: 'How We Work',
      headlineEmphasis: 'Human intent meets AI execution.',
      steps: [
        {
          number: '01',
          title: 'Discovery',
          description:
            'We audit your existing digital infrastructure, map content workflows, and identify architectural bottlenecks before writing a single line of code.',
          icon: 'Search',
        },
        {
          number: '02',
          title: 'AI-Assisted Design',
          description:
            'Our AI tools generate structural prototypes and content schemas, accelerating the design phase while our architects validate every decision.',
          icon: 'Sparkles',
        },
        {
          number: '03',
          title: 'Human-Led Development',
          description:
            'Senior engineers build your digital hub with full test coverage, accessibility compliance, and performance budgets baked into every sprint.',
          icon: 'Users',
        },
        {
          number: '04',
          title: 'Launch & Evolve',
          description:
            'We deploy to edge networks with zero-downtime rollouts, then continuously optimize through AI-driven analytics and quarterly architecture reviews.',
          icon: 'Rocket',
        },
      ],
    },
  })

  console.log('Seeding Footer global...')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      logoText: 'Nubis',
      logoAccent: '.',
      tagline: 'Architectural Resilience \u2022 2026',
      footerLinks: [
        { label: 'Privacy & Data Governance', href: '#' },
        { label: 'AI Ethics Statement', href: '#' },
        { label: 'Client Portal', href: '#' },
      ],
    },
  })

  // --- Seed Pages collection ---
  console.log('Seeding Pages collection...')
  const existingPages = await payload.find({ collection: 'pages', limit: 1 })
  let aboutPageId: number | null = null

  if (existingPages.totalDocs === 0) {
    const aboutPage = await payload.create({
      collection: 'pages',
      data: {
        title: 'About',
        slug: 'about',
        meta: {
          metaTitle: 'About Nubis Digital \u2014 Architectural Resilience',
          metaDescription:
            'Learn how Nubis Digital engineers AI-ready digital ecosystems with human oversight at every layer.',
        },
        layout: [
          {
            blockType: 'hero-block',
            heading: 'We Build the Nervous System of Your Digital Presence.',
            body: 'Nubis Digital engineers content hubs where human creativity and AI execution converge \u2014 producing resilient, RAG-ready architectures that scale with your ambition.',
            ctaText: 'View Our Services',
            ctaLink: '/#services',
            showPrism: false,
          },
          {
            blockType: 'cta-block',
            heading: 'Ready to Build Something Resilient?',
            body: 'Let us engineer your next digital content hub with AI-native architecture and human oversight built in.',
            buttonText: 'Start Your Project',
            buttonLink: '#',
            style: 'dark',
          },
        ],
      },
    })
    aboutPageId = aboutPage.id
    console.log('Created About page')
  } else {
    const existingAbout = await payload.find({
      collection: 'pages',
      where: { slug: { equals: 'about' } },
      limit: 1,
    })
    aboutPageId = existingAbout.docs[0]?.id || null
  }

  // --- Seed Header with nav links ---
  console.log('Seeding Header global...')
  const navLinks: Record<string, unknown>[] = [
    { label: 'Services', linkType: 'custom', href: '/#services' },
  ]

  if (aboutPageId) {
    navLinks.push({ label: 'About', linkType: 'page', page: aboutPageId })
  } else {
    navLinks.push({ label: 'About', linkType: 'custom', href: '/about' })
  }

  await payload.updateGlobal({
    slug: 'header',
    data: {
      logoText: 'Nubis',
      logoAccent: '.',
      navLinks,
      oversightLabel: 'Human Oversight',
      oversightActiveText: 'Active',
      oversightDisabledText: 'Disabled',
      oversightTooltip:
        'All Nubis AI workflows are monitored and governable by our senior human architects.',
      ctaButtonText: 'Start Project',
    },
  })

  // --- Seed Services collection ---
  console.log('Seeding Services collection...')

  const existingServices = await payload.find({ collection: 'services', limit: 1 })
  if (existingServices.totalDocs > 0) {
    console.log('Services already seeded, skipping.')
    console.log('Seed complete!')
    process.exit(0)
  }

  await payload.create({
    collection: 'services',
    data: {
      slug: 'payload',
      label: 'Payload CMS',
      icon: 'Database',
      title: 'RAG-Ready Architecture',
      subtitle: 'Headless velocity engineered for the AI-first future.',
      description:
        "We deploy Payload CMS natively on Edge networks, creating clean JSON APIs structurally optimized for Large Language Models (LLMs) and Retrieval-Augmented Generation (RAG). We don't just build your CMS; we build your data's nervous system.",
      specs: [
        {
          label: 'Deployment',
          value: 'Vercel Edge Network',
          icon: 'Server',
          accentColor: 'deep-ink',
        },
        {
          label: 'Data Structure',
          value: 'Strict Semantic JSON',
          icon: 'Activity',
          accentColor: 'plasma-teal',
        },
      ],
      agenticEdge:
        'Our custom AI plugins automate real-time SEO taxonomy, multilingual translation at the edge, and auto-generate structured schema for instant crawler ingestion.',
      plugins: [
        { text: 'LLM Crawler Endpoints (Agent.txt ready)' },
        { text: 'Edge-Cached Personalization Middleware' },
        { text: 'Automated Content Taxonomy Engine' },
      ],
      order: 1,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      slug: 'umbraco',
      label: 'Umbraco',
      icon: 'Layers',
      title: 'Enterprise Synergy & Migration',
      subtitle: 'Robust security and seamless internal systems integration.',
      description:
        'We transition bloated, monolithic architectures into streamlined, Azure-hosted Umbraco environments. Our custom Line-of-Business (LoB) plugins bridge the gap between your marketing site and complex internal ERPs, ensuring absolute data integrity.',
      specs: [
        {
          label: 'Deployment',
          value: 'Microsoft Azure Core',
          icon: 'Server',
          accentColor: 'deep-ink',
        },
        {
          label: 'Security',
          value: 'Enterprise Grade / SSO',
          icon: 'ShieldCheck',
          accentColor: 'holo-lilac',
        },
      ],
      agenticEdge:
        'Proprietary AI migration agents map legacy SQL databases to Umbraco nodes automatically, reducing structural migration timelines by up to 60%.',
      plugins: [
        { text: 'ERP / CRM Bi-directional Sync' },
        { text: 'Azure Active Directory (SSO) Integration' },
        { text: 'Automated Legacy Data Mappers' },
      ],
      order: 2,
    },
  })

  await payload.create({
    collection: 'services',
    data: {
      slug: 'wordpress',
      label: 'WordPress',
      icon: 'Code',
      title: 'Hyper-Velocity Scaling',
      subtitle: 'Marketing agility without the technical debt.',
      description:
        'We strip WordPress down to its essential core, decoupling the frontend to run as a lightning-fast React application. This provides marketing teams with the familiar Gutenberg interface while delivering enterprise-grade performance to the end user.',
      specs: [
        {
          label: 'Architecture',
          value: 'Decoupled / Headless',
          icon: 'Server',
          accentColor: 'deep-ink',
        },
        {
          label: 'Delivery',
          value: 'Static Site Generation',
          icon: 'Activity',
          accentColor: 'plasma-teal',
        },
      ],
      agenticEdge:
        'Real-time AI optimization analyzes traffic patterns to pre-render the most heavily accessed conversion paths before a user even clicks.',
      plugins: [
        { text: 'Headless GraphQL API Bridge' },
        { text: 'Dynamic Block Serialization' },
        { text: 'Marketing Automation Webhooks' },
      ],
      order: 3,
    },
  })

  console.log('Seed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
