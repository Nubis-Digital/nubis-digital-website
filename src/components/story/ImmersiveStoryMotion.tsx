'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { MorphSVGPlugin } from 'gsap/MorphSVGPlugin'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

import { createStoryTimeline, getAgentPhase, getStoryState, playLidIntro, refreshOnFontsReady, resetStoryFinale, resetStoryMounts, setActiveChapter, setActiveMount, setAgentPhase, setInvitationAccessibility, setLedgerProgress } from './storyMotion'

interface ImmersiveStoryMotionProps { rootId: 'immersive-story' }

export function resetStoryEnhancement(root: HTMLElement): void {
  root.removeAttribute('data-enhanced')
  root.removeAttribute('data-beat')
  root.removeAttribute('data-device')
  root.style.removeProperty('--story-progress')
  setInvitationAccessibility(root, true)
  // Mounts first, then chapters: `resetStoryMounts` re-silences the second
  // tree as a whole, and the loop below clears the per-chapter state in both.
  resetStoryMounts(root)
  resetStoryFinale(root)
  root.querySelectorAll('[data-story-chapter]').forEach((element) => {
    element.removeAttribute('aria-hidden')
    element.removeAttribute('inert')
    element.removeAttribute('data-active')
  })
}

/** Hero intro pacing: the question types at a readable speed, capped. */
const TYPE_SECONDS_PER_CHAR = 0.028
const TYPE_MAX_SECONDS = 1.5

/**
 * "The Answer": the hero plays out as an assistant answering. The visitor's
 * question types in, the headline rises line by line as the answer, the cited
 * chip lands, then the body and CTA settle. One-off and time-based, so it only
 * plays from the top of the page in a visible tab — everything is server-
 * rendered visible, and anything that skips the intro simply stays that way.
 * SplitText keeps an `aria-label` on the heading; all of it reverts on teardown.
 */
export function playHeroIntro(root: HTMLElement, progress: number): () => void {
  const headline = root.querySelector<HTMLElement>('#story-title')
  const query = root.querySelector<HTMLElement>('[data-story-query]')
  // SplitText re-splits on font load, so it needs a complete FontFaceSet.
  const fonts = (document as Document & { fonts?: Partial<FontFaceSet> }).fonts
  if (progress > 0 || document.visibilityState === 'hidden' || !headline || !query) return () => {}
  if (typeof fonts?.addEventListener !== 'function' || typeof fonts.removeEventListener !== 'function') return () => {}

  const caret = root.querySelector<HTMLElement>('[data-story-caret]')
  const citation = root.querySelector<HTMLElement>('[data-story-citation]')
  const body = Array.from(root.querySelectorAll<HTMLElement>('[data-story-hero-body]'))
  const full = query.textContent ?? ''
  const typing = { chars: 0 }
  const split = SplitText.create(headline, { type: 'lines', mask: 'lines', aria: 'auto' })

  const intro = gsap.timeline({ delay: 0.15 })
  intro
    .set(query, { textContent: '' })
    .set(split.lines, { yPercent: 105 })
    .set([citation, ...body].filter(Boolean), { autoAlpha: 0, y: 10 })
    .to(typing, {
      chars: full.length,
      duration: Math.min(TYPE_MAX_SECONDS, full.length * TYPE_SECONDS_PER_CHAR),
      ease: 'none',
      onUpdate: () => { query.textContent = full.slice(0, Math.round(typing.chars)) },
    })
    .to(split.lines, { yPercent: 0, duration: 1, stagger: 0.09, ease: 'expo.out' }, '+=0.12')
    .to(citation, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, '-=0.55')
    .to(body, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'expo.out' }, '-=0.3')
  if (caret) intro.to(caret, { autoAlpha: 0, duration: 0.3 }, '-=0.2')

  return () => {
    intro.kill()
    split.revert()
    query.textContent = full
    gsap.set([query, caret, citation, ...body].filter(Boolean), { clearProps: 'all' })
  }
}

export function activateStoryEnhancement(root: HTMLElement): () => void {
  root.dataset.enhanced = 'true'
  setInvitationAccessibility(root, true)
  // Same decider the timeline uses, so the first frame and every later frame
  // agree on which mount is voiced.
  const start = getStoryState(0)
  setActiveMount(root, start.device)
  setActiveChapter(root, start.chapterIndex)
  setAgentPhase(root, getAgentPhase(start))
  setLedgerProgress(root, start.ledgerProgress)
  const timeline = createStoryTimeline(gsap, root)
  const hidden = document.visibilityState === 'hidden'
  // Progress can still read 0 before the first refresh on a restored scroll.
  const startProgress = timeline.progress() || (window.scrollY > 40 ? 1 : 0)
  playLidIntro(gsap, root, startProgress, hidden)
  const revertHero = playHeroIntro(root, startProgress)
  // The dock slot is a grid track sized against the Playfair headline, so the
  // first measurement is only trustworthy once the webfonts have swapped in.
  const cancelFontRefresh = refreshOnFontsReady(document, () => { ScrollTrigger.refresh() })
  return () => {
    cancelFontRefresh()
    revertHero()
    resetStoryEnhancement(root)
  }
}

/**
 * The <1024 path keeps chapters in document flow; this only adds a gentle
 * reveal-on-enter and drives the sticky chapter rail. Opt-in via
 * `data-reveal="on"`, so no-JS and reduced-motion visitors (never activated)
 * see every chapter at full opacity.
 */
export function activateFallbackReveal(root: HTMLElement): () => void {
  if (typeof IntersectionObserver !== 'function') return () => {}

  const chapters = Array.from(root.querySelectorAll<HTMLElement>('[data-story-mount="laptop"] [data-story-chapter]'))
  const ticks = Array.from(root.querySelectorAll<HTMLElement>('[data-story-rail-tick]'))
  root.dataset.reveal = 'on'

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      const chapter = entry.target as HTMLElement
      chapter.dataset.revealed = 'true'
      const index = chapters.indexOf(chapter)
      ticks.forEach((tick, tickIndex) => { tick.dataset.current = String(tickIndex === index) })
    })
  }, { rootMargin: '0px 0px -30% 0px' })
  chapters.forEach((chapter) => observer.observe(chapter))

  return () => {
    observer.disconnect()
    root.removeAttribute('data-reveal')
    chapters.forEach((chapter) => chapter.removeAttribute('data-revealed'))
    ticks.forEach((tick) => tick.removeAttribute('data-current'))
  }
}

export function ImmersiveStoryMotion({ rootId }: ImmersiveStoryMotionProps) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root || typeof window.matchMedia !== 'function') return

    gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin, SplitText)
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        return activateStoryEnhancement(root)
      })
      media.add('(max-width: 1023px) and (prefers-reduced-motion: no-preference)', () => {
        const revertReveal = activateFallbackReveal(root)
        const revertHero = playHeroIntro(root, window.scrollY > 40 ? 1 : 0)
        return () => {
          revertHero()
          revertReveal()
        }
      })
    }, root)

    return () => {
      resetStoryEnhancement(root)
      context.revert()
      media.revert()
    }
  }, [rootId])

  return null
}
