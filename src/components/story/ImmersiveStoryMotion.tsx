'use client'

import { useEffect } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import { createStoryTimeline, setActiveChapter, setInvitationAccessibility } from './storyMotion'

interface ImmersiveStoryMotionProps { rootId: 'immersive-story' }

export function resetStoryEnhancement(root: HTMLElement): void {
  root.removeAttribute('data-enhanced')
  root.removeAttribute('data-beat')
  root.removeAttribute('data-device')
  root.style.removeProperty('--story-progress')
  setInvitationAccessibility(root, true)
  root.querySelectorAll('[data-story-chapter]').forEach((element) => {
    element.removeAttribute('aria-hidden')
    element.removeAttribute('inert')
    element.removeAttribute('data-active')
  })
}

export function activateStoryEnhancement(root: HTMLElement): () => void {
  root.dataset.enhanced = 'true'
  setInvitationAccessibility(root, true)
  setActiveChapter(root, 0)
  createStoryTimeline(gsap, root)
  return () => resetStoryEnhancement(root)
}

export function ImmersiveStoryMotion({ rootId }: ImmersiveStoryMotionProps) {
  useEffect(() => {
    const root = document.getElementById(rootId)
    if (!root || typeof window.matchMedia !== 'function') return

    gsap.registerPlugin(ScrollTrigger)
    const media = gsap.matchMedia()
    const context = gsap.context(() => {
      media.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
        return activateStoryEnhancement(root)
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
