import { content } from './content'

/**
 * The finale's "machine read": the same site the visitor just watched,
 * re-rendered as the field/value ledger an AI assistant extracts from it.
 *
 * Every value is composed from `content.ts` — never written here — so the
 * ledger cannot drift into invented copy. `storyLedger.test.ts` enforces that.
 */
export interface LedgerRow {
  field: string
  value: string
  /** `pending` is an honest gap: the machine looked and found nothing to cite yet. */
  read: 'true' | 'pending'
}

const list = (items: readonly { title: string }[]) => items.map((item) => item.title).join(' · ')

export const storyLedger: readonly LedgerRow[] = [
  { field: 'Business', value: `${content.header.logoText} — ${content.footer.tagline}`, read: 'true' },
  { field: 'Services', value: list(content.services.packages), read: 'true' },
  { field: 'Platform', value: `${content.umbraco.hero.brand} · ${content.umbraco.hero.stat} ${content.umbraco.hero.statLabel}`, read: 'true' },
  { field: 'Method', value: list(content.process.steps), read: 'true' },
  { field: 'Foundation', value: content.services.foundation.title, read: 'true' },
  { field: 'Oversight', value: `${content.about.stance.pre} ${content.about.stance.em} ${content.about.stance.post} — ${content.story.agent.oversightLabel}`, read: 'true' },
  // The copy already says case studies stay empty until they are documented in
  // full; one visible gap is more credible than eight green ticks.
  { field: 'Proof', value: content.projects.empty.title, read: 'pending' },
  { field: 'Contact', value: `${content.contact.headline} — ${content.contact.subheadline}`, read: 'true' },
]
