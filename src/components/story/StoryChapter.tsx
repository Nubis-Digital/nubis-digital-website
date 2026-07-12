import type { HTMLAttributes, ReactNode } from 'react'

import { content } from '@/data/content'
import { storyChapters, type StoryChapter as StoryChapterModel, type StoryVisual } from '@/data/story'

export interface StoryChapterProps {
  chapter: StoryChapterModel
  index: number
  active: boolean
  enhanced: boolean
}

export function getChapterAccessibility(active: boolean, enhanced: boolean): Pick<HTMLAttributes<HTMLElement>, 'aria-hidden'> & { inert?: '' } {
  return enhanced && !active ? { 'aria-hidden': true, inert: '' } : {}
}

function AgentRecommendation() {
  return (
    <section className="story-agent" aria-label="Governed agent recommendation">
      <dl>
        <div><dt>Visitor need</dt><dd>{content.story.agent.visitorNeed}</dd></div>
        <div><dt>Approved knowledge</dt><dd>Verified site content</dd></div>
        <div><dt>Recommendation</dt><dd>{content.story.agent.recommendation}</dd></div>
      </dl>
      <p className="story-agent__oversight">{content.story.agent.oversightLabel}</p>
      <button type="button" disabled aria-disabled="true">{content.story.agent.approvalLabel}</button>
    </section>
  )
}

function chapterDetail(visual: StoryVisual): ReactNode {
  const details: Record<StoryVisual, ReactNode> = {
    tension: <ul>{content.whyAgentic.benefits.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.description}</span></li>)}</ul>,
    readiness: <ol>{content.process.steps.map((step) => <li key={step.number}><span>{step.number}</span><strong>{step.title}</strong></li>)}</ol>,
    proposal: <ul>{content.services.packages.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.description}</span></li>)}</ul>,
    proof: <ul>{content.about.principles.map((item) => <li key={item.title}><strong>{item.title}</strong><span>{item.text}</span></li>)}</ul>,
    mobile: <p>{content.services.foundation.description}</p>,
    agent: <AgentRecommendation />,
  }

  return details[visual]
}

export function StoryChapter({ chapter, index, active, enhanced }: StoryChapterProps) {
  return (
    <article
      id={`story-${chapter.id}`}
      data-device={chapter.device}
      data-active={active ? 'true' : 'false'}
      {...(getChapterAccessibility(active, enhanced) as HTMLAttributes<HTMLElement>)}
    >
      <p className="story-progress">Chapter {index + 1} of {storyChapters.length}</p>
      <p className="story-chapter__eyebrow">{chapter.eyebrow}</p>
      <h2>{chapter.headline}</h2>
      <p>{chapter.body}</p>
      <div className="story-chapter__detail">{chapterDetail(chapter.visual)}</div>
    </article>
  )
}
