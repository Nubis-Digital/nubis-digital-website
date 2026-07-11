import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { content } from '@/data/content';

import PortalContent from './PortalContent';
import Hero from './Hero';

describe('PortalContent', () => {
  it('renders the authored homepage hero as the single primary heading', () => {
    render(<PortalContent />);

    expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      `${content.hero.headlinePart1} ${content.hero.headlineEmphasis}`,
    );
    expect(screen.getByText(content.hero.bodyText)).toBeInTheDocument();
  });

  it('exposes one real page CTA instead of duplicate screen controls', () => {
    render(<PortalContent compact />);

    expect(
      screen.getAllByRole('link', { name: content.hero.ctaText }),
    ).toHaveLength(1);
    expect(
      screen.getByRole('link', { name: content.hero.ctaText }),
    ).toHaveAttribute('href', content.hero.ctaUrl);
  });
});

it('uses the laptop only as a decorative shell around one live portal', () => {
  const { container } = render(<Hero />);
  expect(container.querySelectorAll('.portal-surface')).toHaveLength(1);
  expect(container.querySelectorAll('.dive-ui, .dive-reveal, .dive-callout')).toHaveLength(0);
  expect(screen.getByRole('img', { hidden: true })).toHaveAttribute('alt', '');
  expect(screen.getAllByRole('heading', { level: 1 })).toHaveLength(1);
});
