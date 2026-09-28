/**
 * Measure-and-invert helper for the hero dock.
 *
 * The device layer lays each device out centred at its *stage* (largest) size;
 * the hero dock is a transform that shrinks it into the measured grid slot. Two
 * rules make this stable:
 *
 * 1. Inputs are **layout boxes** (`offsetLeft/offsetTop/offsetWidth/offsetHeight`),
 *    never `getBoundingClientRect()`. A bounding rect already contains the
 *    transform being computed, so measuring one would make the result drift on
 *    every `ScrollTrigger.refresh()`.
 * 2. Both boxes must be read in the same coordinate space — `readLayoutBox`
 *    accumulates the offsetParent chain, and only the *difference* between two
 *    boxes is ever used, so any shared ancestor offset cancels out.
 *
 * Pure: no DOM in `getDockTransform`, no GSAP anywhere.
 */

export interface LayoutBox {
  left: number
  top: number
  width: number
  height: number
}

export interface DockTransform {
  x: number
  y: number
  scale: number
}

const centerX = (box: LayoutBox) => box.left + box.width / 2
const centerY = (box: LayoutBox) => box.top + box.height / 2
const hasSize = (box: LayoutBox) => box.width > 0 && box.height > 0

/**
 * The transform that docks `device` into `slot`: translate centre-to-centre,
 * then scale down on the binding axis so the device fits inside the slot.
 * A zero-sized box (not yet laid out, or display:none) degrades to `scale: 1`
 * rather than producing `NaN` / `Infinity`.
 */
export function getDockTransform(device: LayoutBox, slot: LayoutBox): DockTransform {
  const scale = hasSize(device) && hasSize(slot)
    ? Math.min(slot.width / device.width, slot.height / device.height)
    : 1

  return {
    x: centerX(slot) - centerX(device),
    y: centerY(slot) - centerY(device),
    scale,
  }
}

/** Thin DOM reader: the element's layout box in offsetParent-chain coordinates. */
export function readLayoutBox(element: HTMLElement): LayoutBox {
  let left = 0
  let top = 0
  let node: HTMLElement | null = element

  while (node) {
    left += node.offsetLeft
    top += node.offsetTop
    node = node.offsetParent as HTMLElement | null
  }

  return { left, top, width: element.offsetWidth, height: element.offsetHeight }
}
