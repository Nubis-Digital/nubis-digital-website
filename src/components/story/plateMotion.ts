import type { gsap } from 'gsap'

import { BASELINE_PATH, RESTRUCTURE_SCATTER, VISIT_PATHS, VISITS_RISE } from './StoryPlates'

/** The slice of the timeline a plate plays in, in progress units. */
export interface PlateSlice { start: number; end: number }

const all = (plate: HTMLElement, selector: string) => Array.from(plate.querySelectorAll<Element>(selector))

/**
 * Scrubs each drafted plate inside its chapter's slice. Initial states are
 * timeline `.set`s at 0 and every move is a `.to`, so the whole choreography is
 * reversible under scrub and re-derives from the timeline on any seek.
 *
 * Plates enter just as their chapter's scan wipe lands and leave just before
 * the next one, so exactly one plate is ever on stage.
 */
export function addPlateChoreography(timeline: gsap.core.Timeline, root: HTMLElement, slices: readonly PlateSlice[]): void {
  const plates = Array.from(root.querySelectorAll<HTMLElement>('[data-story-plate]'))
  if (plates.length !== slices.length) throw new Error(`Immersive story requires ${slices.length} plates; found ${plates.length}`)

  timeline.set(plates, { autoAlpha: 0 }, 0)

  plates.forEach((plate, index) => {
    const { start, end } = slices[index]
    const t = start + 0.004
    timeline
      .to(plate, { autoAlpha: 1, duration: 0.012 }, start - 0.01)
      .to(plate, { autoAlpha: 0, duration: 0.012 }, end - 0.02)

    const labels = all(plate, '[data-plate-label]')
    timeline.set(labels, { autoAlpha: 0 }, 0)

    switch (plate.dataset.storyPlate) {
      case 'tension': {
        const frame = all(plate, '[data-plate-draw]')
        const blockLines = all(plate, '[data-plate-block] > *')
        const blocks = all(plate, '[data-plate-block]')
        const crosses = all(plate, '[data-plate-cross]')
        const beam = all(plate, '[data-plate-beam]')
        const underline = all(plate, '[data-plate-underline]')
        timeline
          .set([...frame, ...blockLines, ...crosses, ...underline], { drawSVG: '0%' }, 0)
          .set(blocks, { opacity: 1 }, 0)
          .set(beam, { x: 0, autoAlpha: 0 }, 0)
          // The page draws on…
          .to(frame, { drawSVG: '100%', duration: 0.02, stagger: 0.003 }, t)
          .to(blockLines, { drawSVG: '100%', duration: 0.02, stagger: 0.003 }, t + 0.01)
          // …the assistant's scan passes over it, and every block goes unread.
          .to(beam, { autoAlpha: 1, duration: 0.004 }, t + 0.03)
          .to(beam, { x: 300, duration: 0.03 }, t + 0.03)
          .to(blocks, { opacity: 0.15, duration: 0.006, stagger: 0.0045 }, t + 0.033)
          .to(crosses, { drawSVG: '100%', duration: 0.006, stagger: 0.0045 }, t + 0.034)
          .to(beam, { autoAlpha: 0, duration: 0.004 }, t + 0.06)
          .to(labels, { autoAlpha: 1, duration: 0.008, stagger: 0.004 }, t + 0.06)
          .to(underline, { drawSVG: '100%', duration: 0.008 }, t + 0.066)
        break
      }
      case 'readiness': {
        const nodes = all(plate, '[data-plate-node]')
        const connectors = all(plate, '[data-plate-draw]')
        const morph = all(plate, '[data-plate-morph]')
        const askers = all(plate, '[data-plate-asker]')
        const queries = all(plate, '[data-plate-query]')
        timeline
          .set(connectors, { drawSVG: '0%' }, 0)
          .set(queries, { drawSVG: '0%' }, 0)
          .set(askers, { autoAlpha: 0, y: -8 }, 0)
        nodes.forEach((node, nodeIndex) => {
          timeline.set(node, { ...RESTRUCTURE_SCATTER[nodeIndex % RESTRUCTURE_SCATTER.length], autoAlpha: 0, transformOrigin: '50% 50%' }, 0)
        })
        timeline
          .to(nodes, { autoAlpha: 1, duration: 0.01, stagger: 0.002 }, t)
          // Scattered content snaps into one structure…
          .to(nodes, { x: 0, y: 0, rotation: 0, duration: 0.026, stagger: 0.003, ease: 'power2.out' }, t + 0.004)
          .to(connectors, { drawSVG: '100%', duration: 0.016 }, t + 0.03)
          .to(morph, { morphSVG: BASELINE_PATH, duration: 0.024, ease: 'power1.inOut' }, t + 0.024)
          // …and now the assistants can read it: they arrive, ask, and cite it.
          .to(askers, { autoAlpha: 1, y: 0, duration: 0.01, stagger: 0.003 }, t + 0.044)
          .to(queries, { drawSVG: '100%', duration: 0.014 }, t + 0.05)
          .to(labels, { autoAlpha: 1, duration: 0.008, stagger: 0.004 }, t + 0.062)
        break
      }
      case 'proposals': {
        const askers = all(plate, '[data-plate-asker]')
        const lines = all(plate, '[data-plate-draw]')
        const visitors = all(plate, '[data-plate-visitor]')
        const leads = all(plate, '[data-plate-lead]')
        const curve = all(plate, '[data-plate-morph]')
        timeline
          .set(lines, { drawSVG: '0%' }, 0)
          .set(askers, { autoAlpha: 0, y: -8 }, 0)
          .set(visitors, { autoAlpha: 0 }, 0)
          .set(leads, { autoAlpha: 0, x: 24 }, 0)
          .to(askers, { autoAlpha: 1, y: 0, duration: 0.008, stagger: 0.003 }, t)
          .to(lines, { drawSVG: '100%', duration: 0.014, stagger: 0.002 }, t + 0.004)
        // Each answer sends visitors down its path into the site, one after another.
        visitors.forEach((visitor, visitorIndex) => {
          const path = VISIT_PATHS[Number((visitor as HTMLElement).dataset.path ?? 0)]
          const at = t + 0.016 + (visitorIndex % 3) * 0.009 + Math.floor(visitorIndex / 3) * 0.003
          timeline
            .set(visitor, { motionPath: { path, start: 0, end: 0 } }, 0)
            .to(visitor, { autoAlpha: 1, duration: 0.002 }, at)
            .to(visitor, { motionPath: { path, start: 0, end: 1 }, duration: 0.012, ease: 'power1.in' }, at)
            .to(visitor, { autoAlpha: 0, duration: 0.002 }, at + 0.011)
        })
        timeline
          // Visits climb, and they land as leads.
          .to(curve, { morphSVG: VISITS_RISE, duration: 0.03, ease: 'power2.out' }, t + 0.024)
          .to(leads, { autoAlpha: 1, x: 0, duration: 0.008, stagger: 0.008, ease: 'back.out(2)' }, t + 0.032)
          .to(labels, { autoAlpha: 1, duration: 0.008, stagger: 0.004 }, t + 0.056)
        break
      }
      case 'proof': {
        const lines = all(plate, '[data-plate-draw]')
        const bars = all(plate, '[data-plate-bar]')
        const stamp = all(plate, '[data-plate-stamp]')
        timeline
          .set(lines, { drawSVG: '0%' }, 0)
          .set(bars, { scaleX: 0, transformOrigin: '0% 50%' }, 0)
          .set(stamp, { autoAlpha: 0, scale: 1.5, rotation: 0, transformOrigin: '50% 50%' }, 0)
          // The write-up measures the outcomes that matter…
          .to(lines, { drawSVG: '100%', duration: 0.015, stagger: 0.003 }, t)
          .to(bars, { scaleX: 1, duration: 0.014, stagger: 0.004, ease: 'power2.out' }, t + 0.024)
          // …and is honestly stamped: not published until it can be stood behind.
          .to(stamp, { autoAlpha: 1, scale: 1, rotation: -8, duration: 0.012, ease: 'expo.out' }, t + 0.05)
          .to(labels, { autoAlpha: 1, duration: 0.008 }, t + 0.06)
        break
      }
      default:
        throw new Error(`Unknown story plate: ${plate.dataset.storyPlate}`)
    }
  })
}
