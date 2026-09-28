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

    expect(css).toContain('--story-laptop-x: 15.927167%')
    expect(css).toContain('--story-laptop-y: 21.248333%')
    expect(css).toContain('--story-laptop-w: 67.609%')
    expect(css).toContain('--story-laptop-h: 42.128167%')
  })

  it('splits the drawing losslessly into a hinged lid and a base', () => {
    const read = (name: string) => fs.readFileSync(path.join(projectRoot, 'public/assets', name), 'utf8')
    const shapes = (svg: string) =>
      [...new DOMParser().parseFromString(svg, 'image/svg+xml').querySelectorAll('path, rect, circle, line')].map((el) => el.outerHTML.replace(/\s+/g, ' '))
    const parse = (svg: string) => new DOMParser().parseFromString(svg, 'image/svg+xml')

    const lid = read('laptop-lid.svg')
    const base = read('laptop-base.svg')
    ;[lid, base].forEach((svg) => {
      expect(parse(svg).querySelector('parsererror')).toBeNull()
      expect(parse(svg).documentElement.getAttribute('viewBox')).toBe('0 0 600 600')
    })

    // Same shapes, same coordinates: the aperture vars stay exact for the lid.
    expect([...shapes(lid), ...shapes(base)].sort()).toEqual(shapes(read('laptop-portal.svg')).sort())
    // The screen cutout (and camera) ride on the lid; nothing of the base does.
    expect(parse(lid).querySelectorAll('path[fill-rule="evenodd"]')).toHaveLength(2)
    expect(parse(lid).querySelector('circle')).not.toBeNull()
    expect(parse(base).querySelector('rect[y="396.567"]')).not.toBeNull()
    // Every gradient a layer references is defined in that layer.
    ;[lid, base].forEach((svg) => {
      const doc = parse(svg)
      ;[...svg.matchAll(/url\(#([^)]+)\)/g)].forEach(([, id]) => expect(doc.getElementById(id)).not.toBeNull())
    })
  })
})
