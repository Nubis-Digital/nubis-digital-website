import { Icon } from '@/components/icons';
import Wordmark from '@/components/Wordmark';
import { content } from '@/data/content';

export interface PortalContentProps {
  compact?: boolean;
}

export default function PortalContent({
  compact = false,
}: PortalContentProps): React.ReactElement {
  const { hero } = content;

  return (
    <div className="portal-content" data-compact={compact || undefined}>
      <header className="portal-content__bar">
        <span className="portal-content__wordmark">
          <Wordmark inverted />
        </span>
        <span className="portal-content__nav-cue" aria-hidden="true">
          AI-ready websites
        </span>
      </header>
      <div className="portal-content__body">
        <h1>
          {hero.headlinePart1} <em>{hero.headlineEmphasis}</em>
        </h1>
        <p>{hero.bodyText}</p>
        <a className="btn-primary portal-content__cta" href={hero.ctaUrl}>
          {hero.ctaText}
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
    </div>
  );
}
