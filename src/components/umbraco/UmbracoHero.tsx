import { content } from '@/data/content';
import { Icon } from '@/components/icons';
import UmbracoLogo from '@/components/umbraco/UmbracoLogo';

/**
 * UmbracoHero — an Umbraco-branded drenched band (their deep navy + blue), the
 * one place we deliberately leave the house ink/paper/cobalt to fly Umbraco's
 * own colours. Copy on the left; a framed shot of the Umbraco editor on the
 * right (the same page in two languages — shows how easy, multilingual editing
 * really is).
 */
export default function UmbracoHero() {
  const h = content.umbraco.hero;
  return (
    <section className="umb-hero" id="top">
      <div className="umb-grid" aria-hidden="true" />
      <div className="umb-hero-inner">
        <div className="umb-hero-copy">
          <UmbracoLogo className="umb-logo-mark" size={52} />
          <h1 className="umb-hero-h1">
            {h.headlinePre} <span className="umb-brand">{h.brand}</span>
            <span className="umb-dot">.</span>
          </h1>
          <p className="umb-hero-sub">{h.sub}</p>
          <div className="umb-hero-row">
            <a className="umb-btn" href={h.ctaUrl}>
              {h.cta}
              <Icon name="arrow-right" size={16} />
            </a>
            <p className="umb-stat">
              <span className="umb-stat-n">{h.stat}</span>
              <span className="umb-stat-l">{h.statLabel}</span>
            </p>
          </div>
        </div>

        <figure className="umb-hero-figure">
          <img
            className="umb-shot"
            src="/umbraco-backoffice.webp"
            alt="The Umbraco editor: the same product page being edited side by side in Swedish and Finnish."
            width={906}
            height={605}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
          <figcaption className="umb-shot-cap">The Umbraco editor — one page, edited in two languages.</figcaption>
        </figure>
      </div>
    </section>
  );
}
