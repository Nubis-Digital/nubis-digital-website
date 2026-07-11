import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const projectRoot = process.cwd()

describe('vector laptop portal shell', () => {
  it('keeps an exact structural screen cutout in the laptop-only artwork', () => {
    const svg = fs.readFileSync(
      path.join(projectRoot, 'public/assets/laptop-portal.svg'),
      'utf8',
    )
    const document = new DOMParser().parseFromString(svg, 'image/svg+xml')
    const root = document.documentElement
    const cutout = 'M95.563,127.49h405.654v252.769H95.563z'
    const paths = [...document.querySelectorAll('path')]
    const displayBackings = paths.filter((element) =>
      /^(M513\.447,396\.567|M84\.861,396\.567)/.test(element.getAttribute('d') ?? ''),
    )

    expect(document.querySelector('parsererror')).toBeNull()
    expect(root.tagName).toBe('svg')
    expect(root.getAttribute('viewBox')).toBe('0 0 600 600')
    expect(root.children).toHaveLength(1)
    expect(root.firstElementChild?.getAttribute('id')).toBe('objects')

    expect(document.querySelectorAll('g')).toHaveLength(3)
    expect(paths).toHaveLength(4)
    expect(document.querySelectorAll('rect')).toHaveLength(1)
    expect(document.querySelectorAll('circle')).toHaveLength(1)
    expect(document.querySelectorAll('line')).toHaveLength(1)
    expect(document.querySelectorAll('linearGradient')).toHaveLength(4)
    expect(document.querySelectorAll('stop')).toHaveLength(39)

    expect(document.querySelector('rect[width="600"][height="600"]')).toBeNull()
    expect(
      document.querySelector(
        'rect[x="95.563"][y="127.49"][width="405.654"][height="252.769"]',
      ),
    ).toBeNull()
    expect(displayBackings).toHaveLength(2)
    displayBackings.forEach((element) => {
      expect(element.getAttribute('fill-rule')).toBe('evenodd')
      expect(element.getAttribute('d')).toContain(cutout)
    })

    expect(document.getElementById('background')).toBeNull()
    expect(svg).not.toMatch(/462\.0303|471\.508|smartphone|phone/i)
  })

  it('maps the aperture to the exact SVG screen rectangle', () => {
    const css = fs.readFileSync(
      path.join(projectRoot, 'src/app/globals.css'),
      'utf8',
    )

    expect(css).toContain('--portal-x: 15.927167%')
    expect(css).toContain('--portal-y: 21.248333%')
    expect(css).toContain('--portal-w: 67.609%')
    expect(css).toContain('--portal-h: 42.128167%')
  })
})
