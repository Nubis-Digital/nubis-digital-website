#!/usr/bin/env node
/**
 * Post-export step: start Next's JavaScript right after first paint.
 *
 * Every page is fully server-rendered, so the HTML and CSS alone paint the
 * whole first screen. Next still requests its framework chunks from <head>,
 * and on a slow mobile link those ~100KB compete with the fonts and the page
 * itself before anything is on screen. This rewrites each exported page so
 * the same chunks are injected right after first paint: the text paints
 * first, and hydration follows a few milliseconds later.
 *
 * The chunks stay async and unordered, exactly as Next emits them (webpack's
 * runtime queues whichever arrives first), so behaviour is unchanged.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const OUT = new URL('../out/', import.meta.url).pathname

const SCRIPT_TAG = /<script src="(\/_next\/[^"]+)"([^>]*)><\/script>/g
const SCRIPT_PRELOAD = /<link rel="preload" as="script"[^>]*>/g

function htmlFiles(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    if (statSync(path).isDirectory()) return name === '_next' ? [] : htmlFiles(path)
    return name.endsWith('.html') ? [path] : []
  })
}

export function deferScripts(html) {
  const scripts = []
  const rewritten = html
    .replace(SCRIPT_TAG, (tag, src, attrs) => {
      // Legacy-browser polyfills keep their nomodule tag: modern browsers skip them anyway.
      if (/nomodule/i.test(attrs) || !/async/.test(attrs)) return tag
      const id = attrs.match(/id="([^"]+)"/)?.[1]
      scripts.push(id ? { src, id } : { src })
      return ''
    })
    .replace(SCRIPT_PRELOAD, '')
  if (scripts.length === 0) return html

  // Start on the browser's own first-contentful-paint signal. A background tab
  // paints (and so hydrates) the moment it is shown. Browsers without paint
  // timing fall back to `load`.
  const loader = `<script>(function(){var s=${JSON.stringify(scripts)},done=0;function go(){if(done)return;done=1;s.forEach(function(d){var e=document.createElement('script');e.src=d.src;e.async=true;if(d.id)e.id=d.id;document.body.appendChild(e)})}function soon(){setTimeout(go,0)}var P=window.PerformanceObserver;if(P&&P.supportedEntryTypes&&P.supportedEntryTypes.indexOf('paint')>-1){new P(function(l){if(l.getEntriesByName('first-contentful-paint').length)soon()}).observe({type:'paint',buffered:true})}else{addEventListener('load',soon)}})()</script>`
  return rewritten.replace('</body>', `${loader}</body>`)
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const files = htmlFiles(OUT)
  for (const file of files) writeFileSync(file, deferScripts(readFileSync(file, 'utf8')))
  console.log(`defer-next-scripts: rewrote ${files.length} pages`)
}
