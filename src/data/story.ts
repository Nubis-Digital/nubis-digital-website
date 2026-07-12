import { content } from './content'

export type StoryDevice = 'laptop' | 'phone'
export type StoryVisual = 'tension' | 'readiness' | 'proposal' | 'proof' | 'mobile' | 'agent'

export interface StoryChapter {
  id: 'tension' | 'readiness' | 'proposals' | 'proof' | 'mobile' | 'agent'
  device: StoryDevice
  eyebrow: string
  headline: string
  body: string
  visual: StoryVisual
}

export const storyChapters: readonly StoryChapter[] = [
  { id: 'tension', device: 'laptop', eyebrow: content.whyAgentic.label, headline: content.whyAgentic.headline, body: content.whyAgentic.introText, visual: 'tension' },
  { id: 'readiness', device: 'laptop', ...content.story.readiness, visual: 'readiness' },
  { id: 'proposals', device: 'laptop', eyebrow: 'Transformation proposals', headline: content.services.headlinePart1, body: content.services.introText, visual: 'proposal' },
  { id: 'proof', device: 'laptop', eyebrow: content.projects.label, headline: content.projects.headline, body: `${content.about.lead} ${content.projects.empty.body} ${content.testimonials.empty.body}`, visual: 'proof' },
  { id: 'mobile', device: 'phone', ...content.story.mobile, visual: 'mobile' },
  { id: 'agent', device: 'phone', ...content.story.agent, visual: 'agent' },
] as const
