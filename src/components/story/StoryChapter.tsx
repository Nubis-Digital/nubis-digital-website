import type { HTMLAttributes, ReactNode } from 'react'

import { content } from '@/data/content'
import { storyChapters, type StoryChapter as StoryChapterModel, type StoryDevice, type StoryVisual } from '@/data/story'

import { AgentExchange } from './AgentExchange'
import { SERVER_EXPOSED_MOUNT } from './storyMotion'

export interface StoryChapterProps {
  chapter: StoryChapterModel
  index: number
  active: boolean
  enhanced: boolean
  /** Which of the dual mounts this copy of the chapter belongs to. */
  mount?: StoryDevice
}

/**
 * `inert` has to be rendered with a *non-empty* value.
 *
 * Next's vendored React 19 renderer treats `inert` as a boolean attribute and
 * drops an empty-string value on the server; the React 18 renderer the tests
 * run on writes `inert=""`. So `inert: ''` is green in jsdom and missing from
 * the shipped HTML — the silent half of a doubled screen-reader announcement.
 * Any non-empty value is inert per the HTML spec and survives both renderers.
 */
export const INERT_ATTRIBUTE_VALUE = 'inert' as const

export type StoryHiddenAttributes = Pick<HTMLAttributes<HTMLElement>, 'aria-hidden'> & { inert?: typeof INERT_ATTRIBUTE_VALUE }

/** Removed from the accessibility tree *and* from the focus order. */
export const silencedAttributes = (): StoryHiddenAttributes => ({ 'aria-hidden': true, inert: INERT_ATTRIBUTE_VALUE })

export function getChapterAccessibility(active: boolean, enhanced: boolean): StoryHiddenAttributes {
  return enhanced && !active ? silencedAttributes() : {}
}

/**
 * The dual mount renders every chapter twice, so ids have to be scoped or the
 * duplicates collide: `aria-labelledby` resolves to the first match in the
 * document, which would label the phone tree's sections with the laptop tree's
 * headings. The server-exposed mount keeps the bare ids — those are the anchor
 * targets the header links to (`/#story-proposals`, `/#story-proof`).
 */
export function scopedChapterId(baseId: string, mount: StoryDevice): string {
  return mount === SERVER_EXPOSED_MOUNT ? baseId : `${baseId}-${mount}`
}

function ProofAndTrust({ mount }: { mount: StoryDevice }) {
  const id = (base: string) => scopedChapterId(base, mount)

  return (
    <div className="story-proof">
      <section aria-labelledby={id('story-proof-about')}>
        <h3 id={id('story-proof-about')}>{content.about.headline} {content.about.headlineEmphasis}</h3>
        <blockquote>
          <p>{content.about.stance.pre} <em>{content.about.stance.em}</em> {content.about.stance.post}</p>
          <footer>{content.about.stance.byline}</footer>
        </blockquote>
        <p>{content.about.lead}</p>
        <p>{content.about.story}</p>
        <ul>{content.about.principles.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>
      </section>
      <section aria-labelledby={id('story-proof-projects')}>
        <h3 id={id('story-proof-projects')}>{content.projects.empty.title}</h3>
        <p>{content.projects.empty.body}</p>
      </section>
      <section aria-labelledby={id('story-proof-testimonials')}>
        <h3 id={id('story-proof-testimonials')}>{content.testimonials.headline} {content.testimonials.headlineEmphasis}</h3>
        <p>{content.testimonials.empty.body}</p>
      </section>
    </div>
  )
}

function chapterDetail(visual: StoryVisual, mount: StoryDevice): ReactNode {
  const details: Record<StoryVisual, ReactNode> = {
    tension: <ul>{content.whyAgentic.benefits.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.description}</span></li>)}</ul>,
    readiness: <ol>{content.process.steps.map((step) => <li key={step.number}><span>{step.number}</span><strong>{step.title}</strong></li>)}</ol>,
    proposal: <ul>{content.services.packages.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.description}</span></li>)}</ul>,
    proof: <ProofAndTrust mount={mount} />,
    mobile: <p>{content.services.foundation.description}</p>,
    // The static fallback shows the whole exchange; the enhanced timeline paces it.
    agent: <AgentExchange phase="approved" />,
  }

  return details[visual]
}

export function StoryChapter({ chapter, index, active, enhanced, mount = SERVER_EXPOSED_MOUNT }: StoryChapterProps) {
  return (
    <article
      id={scopedChapterId(`story-${chapter.id}`, mount)}
      data-device={chapter.device}
      data-active={active ? 'true' : 'false'}
      {...(getChapterAccessibility(active, enhanced) as HTMLAttributes<HTMLElement>)}
    >
      <p className="story-progress">Chapter {index + 1} of {storyChapters.length}</p>
      <p className="story-chapter__eyebrow">{chapter.eyebrow}</p>
      <h2>{chapter.headline}</h2>
      <p>{chapter.body}</p>
      <div className="story-chapter__detail">{chapterDetail(chapter.visual, mount)}</div>
    </article>
  )
}
