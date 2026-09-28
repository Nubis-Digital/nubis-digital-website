import { globSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

import { describe, expect, it } from 'vitest'

const root = join(__dirname, '..', '..')

describe('subset webfonts', () => {
  it('cover every character the site renders', () => {
    const glyphs = new Set(readFileSync(join(__dirname, 'glyphs.txt'), 'utf8'))
    const missing = new Set<string>()
    for (const file of globSync('src/**/*.{ts,tsx}', { cwd: root })) {
      if (file.includes('.test.')) continue
      for (const ch of readFileSync(join(root, file), 'utf8')) {
        if (ch.codePointAt(0)! > 0x7e && /\P{C}/u.test(ch) && !glyphs.has(ch)) missing.add(ch)
      }
    }
    // A miss renders in the fallback font. Re-run scripts/subset-fonts.py.
    expect([...missing].join('')).toBe('')
  })
})
