import { content } from '@/data/content'

import { storyLedger } from '@/data/storyLedger'

import { DimensionLines } from './DimensionLines'
import { LaptopShell } from './LaptopShell'
import { MachineReadLedger } from './MachineReadLedger'
import { PhoneShell } from './PhoneShell'
import { StoryChapterTree } from './StoryChapterTree'
import { StoryMasthead } from './StoryMasthead'
import { StoryPlates } from './StoryPlates'
import { StoryRail } from './StoryRail'
import { ImmersiveStoryMotion } from './ImmersiveStoryMotion'

interface ImmersiveStoryProps {
  enhanced?: boolean
  activeChapterIndex?: number
}

export function ImmersiveStory({ enhanced = false, activeChapterIndex = 0 }: ImmersiveStoryProps = {}) {
  return (
    <div id="immersive-story" className="immersive-story" data-enhanced={enhanced ? 'true' : 'false'}>
      <ImmersiveStoryMotion rootId="immersive-story" />
      <section className="story-invitation" aria-labelledby="story-title">
        <div>
          {/* The visitor's question to an assistant. The full sentence is always
              in the document; the typed copy beside it is decoration. */}
          <p className="story-query">
            <span className="story-query__prompt" aria-hidden="true">›</span>
            <span className="sr-only">{content.hero.assistantPrompt}</span>
            <span className="story-query__text" data-story-query aria-hidden="true">{content.hero.assistantPrompt}</span>
            <span className="story-query__caret" data-story-caret aria-hidden="true" />
          </p>
          <h1 id="story-title">{content.hero.headlinePart1} <strong>{content.hero.headlineEmphasis}</strong></h1>
          <p className="story-citation" data-story-citation>
            <span className="story-citation__tick" aria-hidden="true">✓</span>
            {content.hero.citation}
          </p>
          <p data-story-hero-body>{content.hero.bodyText}</p>
          <a className="btn-primary story-invitation__cta" data-story-hero-body href={content.services.foundation.ctaUrl}>{content.services.foundation.cta}</a>
        </div>
        <div data-story-dock-slot aria-hidden="true" />
        <p className="story-invitation__cue">{content.story.invitation.cue}</p>
      </section>

      <section className="story-stage" aria-label="Nubis transformation story">
        <StoryRail />
        <div className="story-device-rail">
          {/* Dual mount: the same six chapters live inside both shells so the
              handoff is a change of voice, not a move of DOM. Exactly one tree
              is ever exposed — see StoryChapterTree and setActiveMount. */}
          <div data-story-device="laptop">
            <LaptopShell>
              <StoryMasthead />
              <StoryChapterTree mount="laptop" activeChapterIndex={activeChapterIndex} enhanced={enhanced} />
            </LaptopShell>
          </div>
          <StoryPlates />
          <div data-story-device="phone">
            <PhoneShell>
              <StoryChapterTree mount="phone" activeChapterIndex={activeChapterIndex} enhanced={enhanced} />
            </PhoneShell>
          </div>
          {/* The machine read. Server-rendered as the static drafted panel (every
              row read) so the fallback shows it whole; the timeline re-paces it. */}
          <div className="story-ledger" data-story-ledger aria-hidden="true">
            <p className="story-ledger__title">What the assistant read</p>
            <MachineReadLedger rows={storyLedger} revealed={storyLedger.length} />
            <DimensionLines rows={storyLedger.length} progress={1} />
          </div>
        </div>
      </section>
    </div>
  )
}
