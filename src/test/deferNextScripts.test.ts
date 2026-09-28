import { describe, expect, it } from 'vitest'

import { deferScripts } from '../../scripts/defer-next-scripts.mjs'

const page = `<html><head><link rel="preload" as="script" fetchPriority="low" href="/_next/static/chunks/webpack-1.js"/><script src="/_next/static/chunks/main-1.js" async=""></script><script src="/_next/static/chunks/webpack-1.js" id="_R_" async=""></script><script src="/_next/static/chunks/polyfills-1.js" noModule=""></script></head><body><h1>Hi</h1><script>self.__next_f.push([1,"x"])</script></body></html>`

describe('defer-next-scripts', () => {
  const out = deferScripts(page)

  it('moves every async Next chunk out of <head>, keeping nomodule polyfills and inline data', () => {
    expect(out).not.toContain('<script src="/_next/static/chunks/main-1.js"')
    expect(out).not.toContain('rel="preload" as="script"')
    expect(out).toContain('<script src="/_next/static/chunks/polyfills-1.js" noModule=""></script>')
    expect(out).toContain('self.__next_f.push')
  })

  it('injects the same chunks (with their ids) after first contentful paint', () => {
    expect(out).toContain('{"src":"/_next/static/chunks/main-1.js"}')
    expect(out).toContain('{"src":"/_next/static/chunks/webpack-1.js","id":"_R_"}')
    expect(out).toContain("getEntriesByName('first-contentful-paint')")
    expect(out.indexOf('first-contentful-paint')).toBeLessThan(out.indexOf('</body>'))
  })

  it('leaves a page without Next chunks untouched', () => {
    expect(deferScripts('<html><body>plain</body></html>')).toBe('<html><body>plain</body></html>')
  })
})
