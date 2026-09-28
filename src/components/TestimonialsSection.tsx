import { content } from '@/data/content';

/**
 * TestimonialsSection — client voices on the ink ground, not a 3-quote card
 * grid. One large featured pull-quote carries the weight; two secondary quotes
 * sit beneath, hairline-separated. Placeholder copy is obviously placeholder
 * (real, attributed quotes only — fake social proof never ships).
 */
export default function TestimonialsSection() {
  const t = content.testimonials;
  const hasQuotes = t.featured.quote.trim().length > 0 || t.more.length > 0;

  return (
    <section className="testimonials" id="testimonials">
      <div className="depth-grid" aria-hidden="true" />
      <div className="tm-inner">
        <header className="tm-head reveal">
          <h2 className="js-head">
            {t.headline} <span className="em">{t.headlineEmphasis}</span>
          </h2>
        </header>

        {!hasQuotes ? (
          <div className="tm-empty reveal">
            <p className="tm-empty-body">{t.empty.body}</p>
            <a className="tm-empty-cta" href={t.empty.ctaUrl}>
              {t.empty.cta}
            </a>
          </div>
        ) : (
          <>
            <figure className="tm-feature reveal">
              <blockquote className="tm-quote">{t.featured.quote}</blockquote>
              <figcaption className="tm-by">
                <span className="tm-name">{t.featured.name}</span>
                <span className="tm-role">{t.featured.role}</span>
              </figcaption>
            </figure>

            <ul className="tm-more">
              {t.more.map((q, i) => (
                <li className="tm-item reveal" key={i}>
                  <blockquote>{q.quote}</blockquote>
                  <figcaption>
                    <span className="tm-name">{q.name}</span>
                    <span className="tm-role">{q.role}</span>
                  </figcaption>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
