import { describe, expect, it } from 'vitest'

import { content } from './content'
import { storyLedger } from './storyLedger'

// Every value must be built from content.ts — asserted against the source
// constants, never literals, so the ledger cannot drift into invented copy.
describe('storyLedger', () => {
  it('stays within the 6–8 row budget', () => {
    expect(storyLedger.length).toBeGreaterThanOrEqual(6)
    expect(storyLedger.length).toBeLessThanOrEqual(8)
  })

  it('traces every value to content.ts', () => {
    const byField = Object.fromEntries(storyLedger.map((row) => [row.field, row.value]))
    const sources: Record<string, string[]> = {
      Business: [content.header.logoText, content.footer.tagline],
      Services: content.services.packages.map((item) => item.title),
      Platform: [content.umbraco.hero.brand, content.umbraco.hero.stat, content.umbraco.hero.statLabel],
      Method: content.process.steps.map((step) => step.title),
      Foundation: [content.services.foundation.title],
      Oversight: [content.about.stance.em, content.story.agent.oversightLabel],
      Proof: [content.projects.empty.title],
      Contact: [content.contact.headline, content.contact.subheadline],
    }

    expect(Object.keys(byField)).toEqual(Object.keys(sources))
    Object.entries(sources).forEach(([field, parts]) => {
      expect(byField[field].trim()).not.toBe('')
      parts.forEach((part) => expect(byField[field]).toContain(part))
    })
  })

  it('shows one honest gap: proof is pending until case studies exist', () => {
    expect(storyLedger.filter((row) => row.read === 'pending').map((row) => row.field)).toEqual(['Proof'])
  })
})
