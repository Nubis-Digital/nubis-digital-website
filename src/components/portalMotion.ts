import { gsap } from 'gsap'

export interface PortalMotionEnvironment {
  viewportWidth: number
  reducedMotion: boolean
}

export interface PortalTimelineTargets {
  hero: HTMLElement
  shell: HTMLElement
  laptop: HTMLElement
  aperture: HTMLElement
  surface: HTMLElement
  cue: HTMLElement | null
}

export const buildPortalSteps = () => [
  { at: 0, target: 'shell', vars: { scale: 10.5, duration: 0.68 } },
  { at: 0, target: 'cue', vars: { opacity: 0, duration: 0.12 } },
  { at: 0.5, target: 'aperture', vars: { rotateX: 0, rotateY: 0, duration: 0.18 } },
  { at: 0.66, target: 'laptop', vars: { opacity: 0, duration: 0.06 } },
  { at: 0.68, target: 'surface', vars: { scale: 1, duration: 0.2 } },
] as const

const portalEases = {
  shell: 'power2.inOut',
  cue: 'power2.in',
  aperture: undefined,
  laptop: undefined,
  surface: 'power2.out',
} as const

export function createPortalTimeline(
  gsapApi: typeof gsap,
  targets: PortalTimelineTargets,
): gsap.core.Timeline {
  const { hero, shell, laptop, aperture, surface, cue } = targets
  const portal = gsapApi.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: hero,
      start: 'top top',
      end: '+=300%',
      scrub: 0.6,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onLeave: () => {
        shell.dataset.portalState = 'page'
      },
      onEnterBack: () => {
        shell.dataset.portalState = 'screen'
      },
    },
  })

  const elements = { shell, cue, aperture, laptop, surface }
  buildPortalSteps().forEach(({ at, target, vars }) => {
    const element = elements[target]
    if (!element) return
    const ease = portalEases[target]
    portal.to(element, ease ? { ...vars, ease } : vars, at)
  })

  return portal
}

export function activatePortalTimeline(gsapApi: typeof gsap, targets: PortalTimelineTargets) {
  const { hero, shell, laptop, aperture, surface, cue } = targets
  hero.classList.add('hero--portal-active')
  shell.dataset.portalState = 'screen'
  gsapApi.set(shell, { scale: 1 })
  gsapApi.set(laptop, { opacity: 1 })
  gsapApi.set(aperture, { rotateX: 0.8, rotateY: -0.5 })
  gsapApi.set(surface, { scale: 1 })
  createPortalTimeline(gsapApi, targets)

  return () => {
    hero.classList.remove('hero--portal-active')
    shell.dataset.portalState = 'screen'
    gsapApi.set([shell, laptop, aperture, surface], { clearProps: 'all' })
    if (cue) gsapApi.set(cue, { clearProps: 'opacity' })
  }
}

export function shouldEnablePortalMotion({
  viewportWidth,
  reducedMotion,
}: PortalMotionEnvironment): boolean {
  return viewportWidth >= 900 && !reducedMotion
}
