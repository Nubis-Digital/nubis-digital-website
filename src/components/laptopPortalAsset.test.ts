import fs from 'node:fs'
import path from 'node:path'

import { describe, expect, it } from 'vitest'

const projectRoot = process.cwd()

describe('vector laptop portal shell', () => {
  it('keeps the screen opening transparent and excludes the phone artwork', () => {
    const svg = fs.readFileSync(
      path.join(projectRoot, 'public/assets/laptop-portal.svg'),
      'utf8',
    )

    expect(svg).toContain('viewBox="0 0 600 600"')
    expect(svg).toContain('fill-rule="evenodd"')
    expect(svg).toContain('M95.563,127.49h405.654v252.769H95.563z')
    expect(svg).not.toContain('id="background"')
    expect(svg).not.toContain('style="fill:#FFFFFF;"')
    expect(svg).not.toContain('x1="462.0303"')
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
