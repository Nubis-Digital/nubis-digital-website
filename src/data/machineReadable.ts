import { content } from './content'

/**
 * The machine-readable twin of the site: Markdown pages, `llms.txt` and
 * JSON-LD. Everything is composed from `content.ts` so what an AI assistant
 * reads can never drift from what a visitor sees.
 */
export const SITE_URL = 'https://www.nubisdigital.com'
export const SITE_NAME = 'Nubis Digital'

const { hero, whyAgentic, services, process, about, projects, contact, umbraco, footer } = content

const bullets = (items: readonly { title: string; description?: string; text?: string }[]) =>
  items.map((item) => `- **${item.title}** — ${item.description ?? item.text ?? ''}`).join('\n')

export const MARKDOWN_PAGES = [
  { path: '/index.md', htmlPath: '/', title: `${SITE_NAME} — ${hero.headlinePart1} ${hero.headlineEmphasis}` },
  { path: '/umbraco.md', htmlPath: '/umbraco', title: `Umbraco — the platform we build on | ${SITE_NAME}` },
] as const

export function homeMarkdown(): string {
  return `# ${SITE_NAME} — ${hero.headlinePart1} ${hero.headlineEmphasis}

> ${hero.bodyText}

Canonical page: ${SITE_URL}/

## ${whyAgentic.headline} ${whyAgentic.headlineEmphasis}

${whyAgentic.introText}

${bullets(whyAgentic.benefits)}

## ${services.headlinePart1} ${services.headlineEmphasis}

${services.introText}

${bullets(services.packages)}

### ${services.foundation.title}

${services.foundation.description}

## ${process.headline} — ${process.headlineEmphasis}

${process.steps.map((step) => `${Number(step.number)}. **${step.title}** — ${step.description}`).join('\n')}

## ${about.label}

**${about.stance.pre} ${about.stance.em} ${about.stance.post}** ${about.stance.byline}

${about.lead}

${about.story}

${bullets(about.principles)}

## ${projects.headline} ${projects.headlineEmphasis}

${projects.empty.title}. ${projects.empty.body}

## ${contact.headline}

${contact.subheadline} ${contact.reassure}

Contact form: ${SITE_URL}/#contact

See also: [Why we build on Umbraco](${SITE_URL}/umbraco.md)
`
}

export function umbracoMarkdown(): string {
  return `# ${umbraco.hero.headlinePre} ${umbraco.hero.brand}

> ${umbraco.hero.sub}

Canonical page: ${SITE_URL}/umbraco

${umbraco.hero.stat} ${umbraco.hero.statLabel}.

## ${umbraco.what.headline}

${umbraco.what.lead}

${bullets(umbraco.what.points)}

## ${umbraco.users.headline}

${umbraco.users.lead} ${umbraco.users.companies.map((company) => company.name).join(', ')}.

_${umbraco.users.note}_

## ${umbraco.why.headline}

${bullets(umbraco.why.items)}

## ${umbraco.migration.headline}

${umbraco.migration.lead}

${umbraco.migration.steps.map((step) => `${Number(step.n)}. **${step.title}** — ${step.text}`).join('\n')}

## ${umbraco.cta.headline}

${umbraco.cta.text} ${SITE_URL}/#contact
`
}

export function llmsTxt(): string {
  return `# ${SITE_NAME}

> ${footer.tagline}. ${hero.bodyText}

${SITE_NAME} rebuilds business websites so AI assistants can find, understand and recommend them — on a fast, secure Umbraco foundation, with real people overseeing every AI feature.

## Pages

- [Home](${SITE_URL}/index.md): what we do, how it works, and how to start
- [Umbraco](${SITE_URL}/umbraco.md): the open, secure platform we build on, in plain terms

## Services

${services.packages.map((item) => `- ${item.title}: ${item.description}`).join('\n')}

## Contact

- [Start a conversation](${SITE_URL}/#contact): ${contact.subheadline}

## Optional

- [Full site text](${SITE_URL}/llms-full.txt): every page in one file
`
}

export function llmsFullTxt(): string {
  return `${homeMarkdown()}\n---\n\n${umbracoMarkdown()}`
}

const organizationId = `${SITE_URL}/#organization`

export function siteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': organizationId,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        logo: `${SITE_URL}/icon.svg`,
        slogan: footer.tagline,
        description: hero.bodyText,
        knowsAbout: ['AI search visibility', 'Generative engine optimization', 'Umbraco CMS', 'Structured content', 'AI agents'],
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: `${services.headlinePart1} ${services.headlineEmphasis}`,
          itemListElement: services.packages.map((item) => ({
            '@type': 'Offer',
            itemOffered: { '@type': 'Service', name: item.title, description: item.description, provider: { '@id': organizationId } },
          })),
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: `${SITE_URL}/`,
        publisher: { '@id': organizationId },
        inLanguage: 'en',
      },
    ],
  }
}

export function homeJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `${process.headline} — ${process.headlineEmphasis}`,
    step: process.steps.map((step, index) => ({ '@type': 'HowToStep', position: index + 1, name: step.title, text: step.description })),
  }
}

export function umbracoJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${umbraco.hero.headlinePre} ${umbraco.hero.brand}`,
    url: `${SITE_URL}/umbraco`,
    description: umbraco.hero.sub,
    isPartOf: { '@id': `${SITE_URL}/#website` },
    about: { '@type': 'SoftwareApplication', name: 'Umbraco CMS', applicationCategory: 'Content management system', url: 'https://umbraco.com' },
  }
}

/** Serialises JSON-LD safely for an inline `<script>`: no `</script>` breakout. */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
