import { content } from '@/data/content'
import { storyChapters } from '@/data/story'

import { LaptopShell } from './LaptopShell'
import { PhoneShell } from './PhoneShell'
import { StoryChapter } from './StoryChapter'
import { ImmersiveStoryMotion } from './ImmersiveStoryMotion'

interface ImmersiveStoryProps {
  enhanced?: boolean
  activeChapterIndex?: number
}

export function ImmersiveStory({ enhanced = false, activeChapterIndex = 0 }: ImmersiveStoryProps = {}) {
  return (
    <main id="immersive-story" className="immersive-story" data-enhanced={enhanced ? 'true' : 'false'}>
      <ImmersiveStoryMotion rootId="immersive-story" />
      <section className="story-invitation" aria-labelledby="story-title">
        <div>
          <h1 id="story-title">{content.hero.headlinePart1} <strong>{content.hero.headlineEmphasis}</strong></h1>
          <p>{content.hero.bodyText}</p>
        </div>
        <p className="story-invitation__cue">{content.story.invitation.cue}</p>
      </section>

      <section className="story-stage" aria-label="Nubis transformation story">
        <div className="story-device-rail" aria-hidden="true">
          <div data-story-device="laptop"><LaptopShell><span /></LaptopShell></div>
          <div data-story-continuity />
          <div data-story-device="phone"><PhoneShell><span /></PhoneShell></div>
        </div>
        <ol className="story-chapters">
          {storyChapters.map((chapter, index) => (
            <li key={chapter.id} data-story-chapter>
              <StoryChapter chapter={chapter} index={index} active={index === activeChapterIndex} enhanced={enhanced} />
            </li>
          ))}
        </ol>
      </section>
    </main>
  )
}
