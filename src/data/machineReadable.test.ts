import { describe, expect, it } from 'vitest'

import { buildMailtoHref } from '@/components/ContactSection'
import { createWebMcpTools } from '@/components/WebMcpTools'

import { content } from './content'
import { homeMarkdown, jsonLdScript, llmsTxt, siteJsonLd, umbracoMarkdown } from './machineReadable'

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
