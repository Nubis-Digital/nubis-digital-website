import { describe, expect, it } from 'vitest'

import { getDockTransform, readLayoutBox, type DockTransform, type LayoutBox } from './dockTransform'

const box = (left: number, top: number, width: number, height: number): LayoutBox => ({ left, top, width, height })

/**
 * What a `getBoundingClientRect()` would report for a box that already carries
 * the given dock transform. Used only to prove why this helper must not read
 * bounding rects: they fold the transform back into the next measurement.
 */
function boxAfterTransform(source: LayoutBox, transform: DockTransform): LayoutBox {
  const centerX = source.left + source.width / 2 + transform.x
  const centerY = source.top + source.height / 2 + transform.y
  const width = source.width * transform.scale
  const height = source.height * transform.scale
  return { left: centerX - width / 2, top: centerY - height / 2, width, height }
}

describe('getDockTransform', () => {
  it('is the identity translation when the slot is already centred on the device', () => {
    const device = box(200, 100, 600, 600)
    const slot = box(350, 250, 300, 300)

    expect(getDockTransform(device, slot)).toEqual({ x: 0, y: 0, scale: 0.5 })
  })

  it('translates by the distance between the two centres', () => {
    const device = box(0, 0, 600, 600)

    expect(getDockTransform(device, box(700, 300, 400, 400)).x).toBeCloseTo(600)
    expect(getDockTransform(device, box(700, 300, 400, 400)).y).toBeCloseTo(200)
    expect(getDockTransform(device, box(-500, -400, 400, 400)).x).toBeCloseTo(-600)
    expect(getDockTransform(device, box(-500, -400, 400, 400)).y).toBeCloseTo(-500)
  })

  it('binds the scale to the smaller ratio so the device always fits inside the slot', () => {
    const device = box(0, 0, 600, 600)

    expect(getDockTransform(device, box(0, 0, 900, 300)).scale).toBe(0.5)
    expect(getDockTransform(device, box(0, 0, 300, 900)).scale).toBe(0.5)
  })

  it('is idempotent across repeated refreshes because layout boxes exclude the transform', () => {
    const device = box(120, 80, 616, 616)
    const slot = box(760, 210, 440, 440)

    const first = getDockTransform(device, slot)
    // A refresh re-measures the same *layout* boxes — transforms never move them.
    const second = getDockTransform(device, slot)
    const third = getDockTransform(device, slot)

    expect(second).toEqual(first)
    expect(third).toEqual(first)

    // The trap this guards: feeding back a post-transform (bounding-rect) box
    // drifts on every refresh, because the rect already contains the transform.
    const drifted = getDockTransform(boxAfterTransform(device, first), slot)
    expect(drifted).not.toEqual(first)
  })

  it('degrades to scale 1 instead of NaN or Infinity when a box has no size', () => {
    const device = box(0, 0, 600, 600)

    expect(getDockTransform(device, box(100, 100, 0, 0)).scale).toBe(1)
    expect(getDockTransform(device, box(100, 100, 400, 0)).scale).toBe(1)
    expect(getDockTransform(box(0, 0, 0, 0), box(100, 100, 400, 400)).scale).toBe(1)
    Object.values(getDockTransform(box(0, 0, 0, 0), box(0, 0, 0, 0))).forEach((value) => {
      expect(Number.isFinite(value)).toBe(true)
    })
  })
})

function layoutElement(
  metrics: { left: number; top: number; width: number; height: number },
  offsetParent: HTMLElement | null = null,
): HTMLElement {
  const element = document.createElement('div')
  Object.defineProperties(element, {
    offsetLeft: { value: metrics.left },
    offsetTop: { value: metrics.top },
    offsetWidth: { value: metrics.width },
    offsetHeight: { value: metrics.height },
    offsetParent: { value: offsetParent },
  })
  return element
}

describe('readLayoutBox', () => {
  it('reads the element layout box, never its bounding rect', () => {
    const element = layoutElement({ left: 40, top: 60, width: 300, height: 200 })
    element.getBoundingClientRect = () => {
      throw new Error('readLayoutBox must not read bounding rects')
    }

    expect(readLayoutBox(element)).toEqual({ left: 40, top: 60, width: 300, height: 200 })
  })

  it('accumulates offsets up the offsetParent chain so two boxes share one coordinate space', () => {
    const stage = layoutElement({ left: 10, top: 20, width: 1440, height: 900 })
    const rail = layoutElement({ left: 5, top: 7, width: 1440, height: 900 }, stage)
    const shell = layoutElement({ left: 100, top: 200, width: 616, height: 616 }, rail)

    expect(readLayoutBox(shell)).toEqual({ left: 115, top: 227, width: 616, height: 616 })
  })
})
