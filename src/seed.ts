import { getPayload } from 'payload'
import config from '@payload-config'

async function seed() {
  const payload = await getPayload({ config })

  console.log('Seeding Transparency Panel global...')
  await payload.updateGlobal({
    slug: 'transparency-panel',
    data: {
      message:
        'Live Agentic Signal: This site runs on agent.txt and RAG-ready APIs \u2014 the same architecture we build for our clients.',
      linkText: '[Explore Our Stack]',
      linkUrl: '#services',
    },
  })

  console.log('Seeding Hero global...')
  await payload.updateGlobal({
    slug: 'hero',
    data: {
      headlinePart1: 'We Make Your Website Work for',
      headlineEmphasis: 'AI Agents.',
      bodyText:
        'AI agents are rewriting how customers find, evaluate, and choose businesses. We build websites that AI can read, recommend, and act on \u2014 turning your digital presence into a competitive advantage in the agentic era.',
      ctaButtonText: 'See What Agentic Means',
      ctaButtonUrl: '#why-agentic',
    },
  })

  console.log('Seeding Why Agentic Section global...')
  await payload.updateGlobal({
    slug: 'why-agentic-section',
    data: {
      headline: 'Why Agentic Matters',
      headlineEmphasis: 'AI agents are becoming your most important visitors.',
      introText:
        'Search engines, voice assistants, and AI copilots increasingly use autonomous agents to crawl, interpret, and recommend websites. If your site isn\u2019t optimized for agents, you\u2019re invisible to the fastest-growing channel on the web.',
      benefits: [
        {
          icon: 'Cpu',
          title: 'Agent Discovery',
          description:
            'AI agents like ChatGPT, Perplexity, and Claude actively search the web for answers. Sites with agent.txt and structured endpoints get retrieved first.',
        },
        {
          icon: 'Sparkles',
          title: 'Structured for LLMs',
          description:
            'When an AI summarizes your services, clean semantic data wins. We build content schemas that LLMs parse accurately \u2014 no hallucination, no misrepresentation.',
        },
        {
          icon: 'ShieldCheck',
          title: 'Human Oversight Built In',
          description:
            'Every AI workflow we deploy is governed by human architects. Your brand voice, your data, your rules \u2014 always under your control.',
        },
      ],
    },
  })

  console.log('Seeding Services Section global...')
  await payload.updateGlobal({
    slug: 'services-section',
    data: {
      sectionHeadlinePart1: 'Three Platforms.',
      sectionHeadlineEmphasis: 'All Agent-Ready.',
      sectionIntroText:
        'Every platform we deploy is optimized for AI discovery, structured for LLM consumption, and wired with agent.txt endpoints. Choose your foundation.',
    },
  })

  console.log('Seeding Process Section global...')
  await payload.updateGlobal({
    slug: 'process-section',
    data: {
      headline: 'From Audit to Agentic',
      headlineEmphasis: 'Four steps to an AI-ready website.',
      steps: [
        {
          number: '01',
          title: 'Agentic Audit',
          description:
            'We analyze how AI agents currently see your site \u2014 crawlability, structured data, agent.txt compliance \u2014 and map the gaps between your content and AI discoverability.',
          icon: 'Search',
        },
        {
          number: '02',
          title: 'Architecture & Schema',
          description:
            'We design your content schema for dual audiences: humans who browse and AI agents that retrieve. Every field, endpoint, and taxonomy is optimized for both.',
          icon: 'Sparkles',
        },
        {
          number: '03',
          title: 'Build & Integrate',
          description:
            'Senior engineers build your hub with agent.txt endpoints, RAG-ready APIs, and full test coverage. Every AI integration is validated by human architects before launch.',
          icon: 'Users',
        },
        {
          number: '04',
          title: 'Launch & Monitor',
          description:
            'We deploy to edge networks, activate AI monitoring, and track how agents interact with your content \u2014 optimizing quarterly based on real agentic traffic data.',
          icon: 'Rocket',
        },
      ],
    },
  })

  console.log('Seeding Agentic Advantage Section global...')
  await payload.updateGlobal({
    slug: 'agentic-advantage-section',
    data: {
      headline: 'The Agentic Advantage',
      headlineEmphasis: 'What agent-ready architecture delivers.',
      metrics: [
        {
          value: '3x',
          label: 'Agent Retrieval Rate',
          description:
            'Sites with agent.txt and structured JSON APIs are retrieved 3x more often by AI agents compared to standard web pages.',
        },
        {
          value: '60%',
          label: 'Faster Content Delivery',
          description:
            'Edge-deployed architectures with semantic caching deliver content to both humans and AI crawlers up to 60% faster.',
        },
        {
          value: '< 200ms',
          label: 'API Response Time',
          description:
            'Our RAG-ready endpoints respond in under 200ms, meeting the latency requirements of real-time AI agent workflows.',
        },
      ],
      governanceHeadline: '100% Human-Governed. Zero Concessions.',
      governanceBody:
        'We believe AI should amplify your team, not replace its judgment. Our architecture ensures you have the final say, always.',
      ctaText: 'Start Your Agentic Project',
      ctaUrl: '#contact',
    },
  })

  console.log('Seeding Footer global...')
  await payload.updateGlobal({
    slug: 'footer',
    data: {
      logoText: 'Nubis',
      logoAccent: '.',
      tagline: 'Making the Web Agentic \u2022 2026',
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
          metaTitle: 'About Nubis Digital \u2014 Making the Web Agentic',
          metaDescription:
            'Learn how Nubis Digital builds websites that AI agents can see, understand, and recommend.',
        },
        layout: [
          {
            blockType: 'hero-block',
            heading: 'We Build Websites That AI Agents Can See, Understand, and Recommend.',
            body: 'Nubis Digital engineers websites optimized for the agentic era \u2014 where AI agents discover, evaluate, and recommend businesses. We make your digital presence work for both humans and machines.',
            ctaText: 'View Our Services',
            ctaLink: '/#services',
            showPrism: false,
          },
          {
            blockType: 'cta-block',
            heading: 'Ready to Go Agentic?',
            body: 'Let us build your next website with agent.txt, RAG-ready APIs, and human oversight built in.',
            buttonText: 'Start Your Project',
            buttonLink: '#contact',
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
        'Your Payload site ships with agent.txt, LLM-friendly JSON endpoints, and automated semantic markup \u2014 making it discoverable by AI agents from day one.',
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
        'Our migration agents automate legacy-to-Umbraco transitions while injecting agent-readable structure, so your enterprise hub is AI-discoverable from launch.',
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
        'AI-driven pre-rendering and agent.txt integration ensure both human visitors and AI agents reach your highest-value pages instantly.',
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
