import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import { Analytics } from './Analytics'

describe('Analytics', () => {
  it('renders nothing without a token', () => {
    expect(renderToStaticMarkup(<Analytics token="" />)).toBe('')
  })

  it('loads the Cloudflare beacon deferred with the token', () => {
    const markup = renderToStaticMarkup(<Analytics token="abc123" />)
    expect(markup).toContain('src="https://static.cloudflareinsights.com/beacon.min.js"')
    expect(markup).toContain('defer')
    expect(markup).toContain('data-cf-beacon="{&quot;token&quot;:&quot;abc123&quot;}"')
  })
})
