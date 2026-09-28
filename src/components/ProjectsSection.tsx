import { content } from '@/data/content';
import { Icon } from '@/components/icons';

/**
 * ProjectsSection — "Selected Work" as a drafted catalogue, not a card grid.
 * Each project is a ruled ledger row (thumbnail · the work · the result) that
 * links through to the project. Until a real image URL is supplied the thumb
 * renders as a drafted "empty frame" (the architect's X-in-a-box), never a fake
 * stock photo. External links open in a new tab; in-page placeholders don't.
 */
export default function ProjectsSection() {
  const p = content.projects;
  const hasItems = p.items.length > 0;

  return (
    <section className="section projects" id="projects">
      <div className="inner">
        <div className="section-head section-head--editorial reveal">
          <h2 className="js-head">
            {p.headline} <span className="em">{p.headlineEmphasis}</span>
          </h2>
          <p className="lede">{p.intro}</p>
        </div>

        {!hasItems ? (
          <div className="work-empty reveal">
            <p className="work-empty-title">{p.empty.title}</p>
            <p className="work-empty-body">{p.empty.body}</p>
            <a className="work-empty-cta" href={p.empty.ctaUrl}>
              {p.empty.cta}
              <Icon name="arrow-up-right" size={18} />
            </a>
          </div>
        ) : (
        <ol className="work-list">
          {p.items.map((item) => {
            const external = /^https?:\/\//.test(item.url);
            return (
              <li className="work-row reveal" key={item.code}>
                <a
                  className="work-link"
                  href={item.url}
                  {...(external
                    ? { target: '_blank', rel: 'noopener noreferrer' }
                    : {})}
                  aria-label={`${item.title} — ${item.client}`}
                >
                  <div className="work-thumb">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={`${item.title} — project preview`}
                        loading="lazy"
                        width={400}
                        height={300}
                      />
                    ) : (
                      <span className="work-thumb-ph" aria-hidden="true">
                        <span className="work-thumb-label">Project image</span>
                      </span>
                    )}
                  </div>

                  <div className="work-body">
                    <div className="work-meta-row">
                      <span className="work-num">{item.code}</span>
                      <span className="work-meta">{item.client}</span>
                    </div>
                    <h3 className="work-title">
                      {item.title}
                      <Icon name="arrow-up-right" size={20} className="work-arrow" />
                    </h3>
                    <p className="work-desc">{item.description}</p>
                    <ul className="work-tags">
                      {item.tags.map((t) => (
                        <li key={t}>{t}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="work-result">
                    <span className="work-stat">{item.stat}</span>
                    <span className="work-stat-label">{item.statLabel}</span>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>
        )}
      </div>
    </section>
  );
}
