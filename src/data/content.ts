/**
 * Nubis Digital — site content (EN). Single source of truth for copy.
 *
 * Voice: plain-first for non-technical business owners. Lead with the outcome a
 * customer cares about; keep the technical proof present but demoted to a quiet
 * supporting role. Concrete and candid, never hype.
 */

export interface Benefit {
  icon: string;
  title: string;
  description: string;
}

export interface Package {
  icon: string;
  title: string;
  description: string;
}

export interface ProcessStep {
  number: string;
  title: string;
  icon: string;
  description: string;
}

export interface Metric {
  value: string;
  label: string;
  description: string;
}

export const content = {
  header: {
    logoText: 'Nubis',
    logoAccent: '.',
    nav: [
      { label: 'Services', href: '/#services' },
      { label: 'Work', href: '/#projects' },
      { label: 'About', href: '/#about' },
      { label: 'Umbraco', href: '/umbraco' },
    ],
    cta: 'Get in touch',
  },
  hero: {
    // "The Answer": the hero plays out as an AI assistant answering a visitor —
    // the question types in, the headline arrives as the answer, cited to Nubis.
    assistantPrompt: 'Who can get my business recommended by AI assistants?',
    citation: 'Cited answer · Nubis',
    headlinePart1: 'Be the Business',
    headlineEmphasis: 'AI Recommends.',
    bodyText:
      'More and more, people ask AI assistants like ChatGPT to find and recommend businesses. We make sure yours is the one they point to — so you keep winning customers as the way people search changes.',
    ctaText: 'See why this matters',
    ctaUrl: '#why-agentic',
  },
  whyAgentic: {
    label: 'Why It Matters',
    headline: 'The way people find businesses is changing.',
    headlineEmphasis: 'And most websites are invisible to it.',
    introText:
      'When someone asks ChatGPT or a voice assistant to recommend a business, the AI picks from the sites it can read and trust. Get it right and you’re the answer. Get it wrong and you never come up.',
    benefits: [
      {
        icon: 'cpu',
        title: 'People ask AI first',
        description:
          'Instead of scrolling through search results, customers now ask an assistant “who should I use?” — and they trust the answer it gives.',
      },
      {
        icon: 'sparkles',
        title: 'AI does the recommending',
        description:
          'The assistant decides which businesses to name. If it can’t read your site clearly, it skips you and recommends a competitor it can.',
      },
      {
        icon: 'shield-check',
        title: 'Most sites aren’t ready',
        description:
          'Older websites are built for people, not AI. The ones that get recommended are built for both — and closing that gap is exactly what we do.',
      },
    ] as Benefit[],
    cta: 'See how we help',
    ctaUrl: '#services',
  },
  services: {
    headlinePart1: 'Everything your site needs to',
    headlineEmphasis: 'win with AI.',
    introText:
      'We rebuild your website so AI assistants can find it, understand it, and recommend you — fast, secure, and with no downtime.',
    packages: [
      {
        icon: 'cpu',
        title: 'Get found by AI',
        description:
          'We rebuild your site so AI assistants can actually read it — and start pulling you into their answers when people ask.',
      },
      {
        icon: 'sparkles',
        title: 'Get recommended',
        description:
          'We organize your content so when someone asks an AI for what you do, you’re the name it gives — clearly and correctly.',
      },
      {
        icon: 'shield-check',
        title: 'Stay in control',
        description:
          'Real people on our team oversee every AI feature we build. Your brand, your rules — never left to run on its own.',
      },
    ] as Package[],
    foundation: {
      title: 'Built on a faster, safer website',
      description:
        'It all runs on a modern, secure rebuild of your site — usually 2–4× faster than before, with no downtime while we switch you over. The technical groundwork is ours to worry about, not yours.',
      cta: 'Talk to us about your site',
      ctaUrl: '#contact',
    },
  },
  projects: {
    label: 'Selected Work',
    headline: 'Proof, not promises.',
    headlineEmphasis: 'Real work, written up properly.',
    intro:
      'We’d rather show you real builds than stock-photo proof — so this stays empty until our first case studies are documented in full.',
    empty: {
      title: 'Case studies in progress',
      body: 'We’re writing up real projects — the problem, what we built, and the measurable result — and we won’t post anything we can’t stand behind. Want the unvarnished version now? Ask, and we’ll walk you through what we’ve shipped.',
      cta: 'Ask about our work',
      ctaUrl: '#contact',
    },
    items: [] as Array<{
      code: string;
      url: string;
      image: string;
      client: string;
      title: string;
      description: string;
      tags: string[];
      stat: string;
      statLabel: string;
    }>,
  },
  testimonials: {
    label: 'In Their Words',
    headline: 'What it’s like to',
    headlineEmphasis: 'work with us.',
    empty: {
      body: 'We only publish testimonials we can attribute — real names, real companies, their exact words. We’re collecting them from current clients now. Until they’re here, we’d rather show nothing than invent something.',
      cta: 'Talk to us directly',
      ctaUrl: '#contact',
    },
    featured: { quote: '', name: '', role: '' },
    more: [] as Array<{ quote: string; name: string; role: string }>,
  },
  comparison: {
    headline: 'Why we build on Umbraco',
    headlineEmphasis: '— and not the big names you’ve heard of.',
    introText:
      'Every platform has trade-offs. Here’s why we build on Umbraco for control, low running costs, and an AI-ready site — and where the big names still fit.',
    takeaway:
      'The freedom of open-source, the security of serious software — and the cleanest path to a site that AI recommends.',
    columns: [
      { name: 'Umbraco', note: 'Our pick', highlight: true },
      { name: 'WordPress', note: 'The popular one', highlight: false },
      { name: 'Sitecore / AEM', note: 'The expensive ones', highlight: false },
      { name: 'Contentful', note: 'The developer-only one', highlight: false },
    ],
    rows: [
      {
        criterion: 'What it costs to license',
        cells: [
          { tone: 'strong', text: 'Free to license' },
          { tone: 'strong', text: 'Free core' },
          { tone: 'weak', text: 'Six-figure fees' },
          { tone: 'ok', text: 'Pay per user' },
        ],
      },
      {
        criterion: 'How secure it is',
        cells: [
          { tone: 'strong', text: 'Bank-grade, rarely targeted' },
          { tone: 'weak', text: 'The most-hacked platform' },
          { tone: 'ok', text: 'Strong but heavy' },
          { tone: 'ok', text: 'Secure but locked-in' },
        ],
      },
      {
        criterion: 'Who’s in control',
        cells: [
          { tone: 'strong', text: 'You are, fully' },
          { tone: 'ok', text: 'Yours, but messy' },
          { tone: 'weak', text: 'Locked to the vendor' },
          { tone: 'weak', text: 'Limited by their rules' },
        ],
      },
      {
        criterion: 'Cost over time',
        cells: [
          { tone: 'strong', text: 'Low and predictable' },
          { tone: 'ok', text: 'Creeps up over time' },
          { tone: 'weak', text: 'Very high' },
          { tone: 'ok', text: 'Grows with use' },
        ],
      },
      {
        criterion: 'Easy to update yourself',
        cells: [
          { tone: 'strong', text: 'Clean and simple' },
          { tone: 'ok', text: 'Familiar but cluttered' },
          { tone: 'weak', text: 'Hard to learn' },
          { tone: 'ok', text: 'Built for developers' },
        ],
      },
      {
        criterion: 'Ready for AI',
        cells: [
          { tone: 'strong', text: 'Ready out of the box' },
          { tone: 'ok', text: 'Needs work' },
          { tone: 'ok', text: 'Possible but complex' },
          { tone: 'strong', text: 'Ready, but rigid' },
        ],
      },
    ],
  },
  process: {
    label: 'How It Works',
    headline: 'From first look to fully ready',
    headlineEmphasis: 'Four simple steps.',
    steps: [
      {
        number: '01',
        title: 'We check your site',
        icon: 'search',
        description:
          'We look at how AI assistants see your site today — what they can read, what they miss — and map exactly what’s holding you back.',
      },
      {
        number: '02',
        title: 'We plan it around you',
        icon: 'sparkles',
        description:
          'We organize your content so it works for two audiences at once: the people who visit, and the AI assistants that recommend you.',
      },
      {
        number: '03',
        title: 'We build it',
        icon: 'users',
        description:
          'Our team rebuilds your site to be fast, secure, and easy for AI to understand — and a real person checks every part before it goes live.',
      },
      {
        number: '04',
        title: 'We launch and watch',
        icon: 'rocket',
        description:
          'We put your new site live, then keep an eye on how AI assistants and customers use it — and keep improving it over time.',
      },
    ] as ProcessStep[],
    cta: 'Start with a site check',
    ctaUrl: '#contact',
  },
  about: {
    label: 'About Nubis',
    // The folded "Where We Stand" pull-moment — now the brand thesis that opens About.
    stance: {
      pre: 'Powerful AI, with',
      em: 'real people',
      post: 'in control.',
      byline:
        'Everything we build is genuinely useful and watched over by our team — smart technology that earns its keep, never left to run on its own.',
    },
    headline: 'Builders who’d rather show you',
    headlineEmphasis: 'than sell you.',
    lead: 'Nubis gets businesses ready for how people search now — by asking an AI, not scrolling results. We work the unglamorous parts — speed, security, content structure — because that’s what decides whether AI can find and recommend you.',
    story:
      'Nubis started from one conviction: the web is shifting from something people read to something AI reads on their behalf — and most businesses aren’t built for it. So we build for that shift the way we’d build for ourselves: in the open, on foundations you keep, with a real person accountable for everything that ships.',
    storyNote:
      'Make this yours — add your specifics: when and why Nubis started, who’s on the team, and a milestone or two. Keep it true.',
    principles: [
      {
        title: 'Plain over jargon',
        text: 'We explain what we’re doing in language you’d use yourself — never hiding behind technical terms.',
      },
      {
        title: 'Yours to keep',
        text: 'We build on open, well-supported foundations, so you own your site and your costs stay predictable — no lock-in.',
      },
    ],
  },
  story: {
    invitation: {
      cue: 'Scroll to see how AI finds you, sends you visitors, and handles the follow-up.',
    },
    readiness: {
      eyebrow: 'Get found by AI',
      headline: 'We make your site easy for AI to read — so it can recommend you.',
      body: 'We organize your content so assistants understand exactly what you do, who you serve and why you’re the right choice. Then they start naming you in their answers.',
    },
    mobile: {
      eyebrow: 'More visits, more leads',
      headline: 'When AI recommends you, people show up ready to talk.',
      body: 'People ask AI from their phones, too. Your site meets them there — fast, clear and easy to act on — so the visit turns into an inquiry.',
    },
    agent: {
      eyebrow: 'Automate the follow-up',
      headline: 'An assistant on your site answers, qualifies and books — while you work.',
      body: 'It answers from your approved content, captures the lead and lines up the next step. Your team reviews what matters, and nothing slips through.',
      visitorNeed: 'Can you help more customers find us through AI?',
      recommendation: 'Yes — we start by checking your site: what AI assistants see today, and what to fix first.',
      automation: ['Lead saved to your inbox', 'Intro call proposed', 'Your team notified'],
      oversightLabel: 'Human review required',
      approvalLabel: 'Approved by your team',
    },
  },
  contact: {
    sectionLabel: 'Get In Touch',
    headline: 'Start a Conversation',
    subheadline: 'Tell us about your business — we’ll get back within 24 hours.',
    reassure:
      'A real person on our team reads every message — no bots, no autoresponders — and usually replies the same business day.',
    successTitle: 'Message received',
    successBody: 'Thanks — we’ve got your message and will reply within 24 hours.',
  },
  footer: {
    logoText: 'Nubis',
    logoAccent: '.',
    tagline: 'Helping businesses win with AI',
    pageLinks: [{ label: 'Umbraco', href: '/umbraco' }],
    // Built for AI first: the machine-readable versions of this site, in plain view.
    aiLabel: 'For AI assistants',
    aiLinks: [
      { label: 'llms.txt', href: '/llms.txt' },
      { label: 'Markdown', href: '/index.md' },
      { label: 'Sitemap', href: '/sitemap.xml' },
    ],
  },
  umbraco: {
    hero: {
      kicker: 'The platform we build on',
      headlinePre: 'Your website, built on',
      brand: 'Umbraco',
      sub: 'Umbraco is the trusted software that runs your website behind the scenes — open, secure, and yours to keep. The same platform careful, well-known brands rely on every day.',
      cta: 'Talk to us about your site',
      ctaUrl: '/#contact',
      stat: '750,000+',
      statLabel: 'websites run on Umbraco',
    },
    what: {
      kicker: 'In plain terms',
      headline: 'So what is Umbraco?',
      lead: 'Think of your website as a building. Umbraco is the foundation and frame underneath it — the part you never see, but everything depends on. A strong one means a site that’s fast, safe, and easy to change.',
      points: [
        {
          title: 'The engine, not the paint',
          text: 'Umbraco runs your site behind the scenes. Your look, words, and brand sit on top — Umbraco keeps it all loading fast and staying online.',
        },
        {
          title: 'Yours to keep — no rent',
          text: 'Umbraco is open-source and free to license. No yearly platform fees, no vendor holding your site hostage. You own it.',
        },
        {
          title: 'Easy to update yourself',
          text: 'A friendly editor lets your team change text, images, and pages — without calling a developer for every small thing.',
        },
      ],
    },
    users: {
      kicker: 'In good company',
      headline: 'Brands that run on Umbraco',
      lead: 'Umbraco powers over 750,000 websites — from local businesses to names you’ll recognise. A few of them:',
      companies: [
        { name: 'Carlsberg', domain: 'carlsberg.com' },
        { name: 'Domino’s Pizza', domain: 'dominos.com' },
        { name: 'Renault', domain: 'renault.com' },
        { name: 'Mercedes-Benz', domain: 'mercedes-benz.com' },
        { name: 'Volvo', domain: 'volvocars.com' },
        { name: 'Thames Water', domain: 'thameswater.co.uk' },
        { name: 'NHS', domain: 'nhs.uk' },
        { name: 'Royal Navy', domain: 'royalnavy.mod.uk' },
        { name: 'Aardman', domain: 'aardman.com' },
        { name: 'Bristol Airport', domain: 'bristolairport.co.uk' },
      ],
      note: 'All public Umbraco case studies — source: umbraco.com. Logos belong to their respective owners.',
    },
    why: {
      kicker: 'Why we choose it',
      headline: 'Why Umbraco is a smart, safe bet',
      items: [
        { title: 'No license fees', text: 'Open-source means you don’t pay to use the platform — your budget goes into your actual site, not software rent.' },
        { title: 'Seriously secure', text: 'A strong security record and a dedicated team watching for issues — it matters when your site carries your reputation.' },
        { title: 'Fast and reliable', text: 'Built on modern Microsoft .NET — quick for visitors and stable when traffic spikes.' },
        { title: 'You stay in control', text: 'Your content, your data, your choice of hosting. No lock-in to one vendor’s rules.' },
        { title: 'Grows with you', text: 'From a simple site to a large multi-language one, Umbraco scales without starting over.' },
        { title: 'Big, friendly community', text: 'Thousands of developers worldwide — so help, add-ons, and talent are always easy to find.' },
      ],
    },
    migration: {
      kicker: 'Moving over',
      headline: 'Switching to Umbraco is painless',
      lead: 'We handle the move end to end — and your current site stays live the whole time.',
      steps: [
        { n: '01', title: 'We map your current site', text: 'Every page and piece of content, and exactly what needs to carry over.' },
        { n: '02', title: 'We rebuild it on Umbraco', text: 'Faster, more secure, and easy for your team to edit.' },
        { n: '03', title: 'We switch you over', text: 'No downtime — visitors never notice the change, except that it’s quicker.' },
      ],
    },
    cta: {
      headline: 'Want a site built to last on Umbraco?',
      text: 'Tell us about your business — we’ll show you what’s possible.',
      button: 'Start a conversation',
      buttonUrl: '/#contact',
    },
  },
  cookies: {
    kicker: 'Cookies',
    message:
      'We use essential cookies to run this site, and optional ones to learn what’s working. Your call.',
    acceptLabel: 'Accept all',
    essentialLabel: 'Essential only',
  },
} as const;

export type SiteContent = typeof content;
