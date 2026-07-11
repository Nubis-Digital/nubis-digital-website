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

  portal.to(shell, { scale: 10.5, ease: 'power2.inOut', duration: 0.68 }, 0)
  if (cue) portal.to(cue, { opacity: 0, ease: 'power2.in', duration: 0.12 }, 0)
  portal.to(aperture, { rotateX: 0, rotateY: 0, duration: 0.18 }, 0.5)
  portal.to(laptop, { opacity: 0, duration: 0.06 }, 0.66)
  portal.to(surface, { scale: 1, ease: 'power2.out', duration: 0.2 }, 0.68)

  return portal
}

export function shouldEnablePortalMotion({
  viewportWidth,
  reducedMotion,
}: PortalMotionEnvironment): boolean {
  return viewportWidth >= 900 && !reducedMotion
}
