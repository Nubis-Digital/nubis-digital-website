import { content } from '@/data/content';
import { Icon } from '@/components/icons';
import { highlightUmbraco } from '@/components/umbraco/highlightUmbraco';

/**
 * UmbracoCTA — closing Umbraco-branded band; one clear next step to the contact
 * form on the homepage.
 */
export default function UmbracoCTA() {
  const c = content.umbraco.cta;
  return (
    <section className="umb-cta">
      <div className="umb-grid" aria-hidden="true" />
      <div className="umb-cta-inner reveal">
        <h2 className="umb-cta-h2">{highlightUmbraco(c.headline)}</h2>
        <p className="umb-cta-text">{c.text}</p>
        <a className="umb-btn umb-btn--lg" href={c.buttonUrl}>
          {c.button}
          <Icon name="arrow-right" size={16} />
        </a>
      </div>
    </section>
  );
}
