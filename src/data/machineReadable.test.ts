import { describe, expect, it } from 'vitest'

import { buildMailtoHref } from '@/components/ContactSection'
import { createWebMcpTools } from '@/components/WebMcpTools'

import { content } from './content'
import { homeMarkdown, jsonLdScript, llmsTxt, securityTxt, siteJsonLd, umbracoMarkdown } from './machineReadable'

describe('machine-readable site', () => {
  it('llms.txt links every Markdown page and names every service', () => {
    const txt = llmsTxt()
    expect(txt.startsWith('# Nubis Digital\n\n> ')).toBe(true)
    expect(txt).toContain('/index.md')
    expect(txt).toContain('/umbraco.md')
    content.services.packages.forEach((item) => expect(txt).toContain(item.title))
  })

  it('Markdown pages carry the visible copy, not invented copy', () => {
    expect(homeMarkdown()).toContain(content.hero.bodyText)
    content.process.steps.forEach((step) => expect(homeMarkdown()).toContain(step.title))
    expect(umbracoMarkdown()).toContain(content.umbraco.hero.sub)
  })

  it('JSON-LD lists the services and cannot break out of its script tag', () => {
    const graph = siteJsonLd()['@graph'][0] as { hasOfferCatalog: { itemListElement: unknown[] } }
    expect(graph.hasOfferCatalog.itemListElement).toHaveLength(content.services.packages.length)
    expect(jsonLdScript({ x: '</script><script>alert(1)</script>' })).not.toContain('</script>')
  })
})

describe('WebMCP tools', () => {
  it('exposes read-only tools plus a draft that never sends', async () => {
    const tools = createWebMcpTools()
    expect(tools.map((tool) => tool.name)).toEqual(['get_business_overview', 'get_page_content', 'list_services', 'show_section', 'draft_inquiry'])
    const overview = await tools[0].execute({})
    expect(overview.content[0].text).toBe(llmsTxt())
    expect(tools.find((tool) => tool.name === 'draft_inquiry')?.description).toMatch(/does not send/i)
  })
})

describe('mailto fallback', () => {
  it('pre-fills subject and body, encoded', () => {
    const href = buildMailtoHref('hello@example.com', { name: 'Ana', email: 'ana@x.com', company: '', message: 'Need help & more' })
    expect(href.startsWith('mailto:hello@example.com?subject=New%20inquiry%20from%20Ana&body=')).toBe(true)
    expect(decodeURIComponent(href.split('body=')[1])).toBe('Need help & more\n\n— Ana\nana@x.com')
  })
})

describe('AI-first discovery', () => {
  it('robots.txt names and allows the major AI crawlers, and points at the sitemap', async () => {
    const { default: robots } = await import('@/app/robots')
    const result = robots()
    const rules = Array.isArray(result.rules) ? result.rules : [result.rules]
    const aiRule = rules.find((rule) => Array.isArray(rule.userAgent) && rule.userAgent.includes('GPTBot'))
    expect(aiRule?.allow).toBe('/')
    ;['ClaudeBot', 'OAI-SearchBot', 'PerplexityBot', 'Google-Extended', 'Applebot-Extended'].forEach((bot) => expect(aiRule?.userAgent).toContain(bot))
    expect(result.sitemap).toBe('https://www.nubisdigital.com/sitemap.xml')
  })

  it('the sitemap lists the machine-readable twins next to the HTML', async () => {
    const { default: sitemap } = await import('@/app/sitemap')
    const urls = sitemap().map((entry) => entry.url)
    ;['/', '/umbraco', '/llms.txt', '/llms-full.txt', '/index.md', '/umbraco.md'].forEach((path) => expect(urls).toContain(`https://www.nubisdigital.com${path}`))
    sitemap().forEach((entry) => expect(entry.lastModified).toBeInstanceOf(Date))
  })
})

describe('security.txt', () => {
  it('is RFC 9116 valid: mailto contact and an Expires under a year out', () => {
    const txt = securityTxt(new Date('2026-09-28T00:00:00Z'))
    expect(txt).toContain('Contact: mailto:contact@nubisdigital.com')
    expect(txt).toContain('Expires: 2027-03-27T00:00:00Z')
    expect(txt).toContain('Canonical: https://www.nubisdigital.com/.well-known/security.txt')
  })
})
