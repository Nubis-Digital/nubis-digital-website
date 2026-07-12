import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'

import RootLayout from './layout'

describe('RootLayout', () => {
  it('renders page content without a blocking full-screen loader', () => {
    const markup = renderToStaticMarkup(
      <RootLayout>
        <main>
          <h1>Architectural Resilience</h1>
          <section id="immersive-story" className="immersive-story" />
        </main>
      </RootLayout>,
    )

    expect(markup).not.toContain('page-loader')
    expect(markup).toContain('class="immersive-story"')
    expect(markup).toContain('<h1>Architectural Resilience</h1>')
  })
})
