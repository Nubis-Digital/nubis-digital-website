import { content } from '@/data/content';
import { Icon } from '@/components/icons';

const c = content.comparison;

const TONE_LABEL: Record<string, string> = {
  strong: 'Strong',
  ok: 'Fair',
  weak: 'Weak',
};

/**
 * ComparisonSection — an honest "why Umbraco" matrix against the CMSs buyers
 * actually shortlist. On-brand hairline table (not a green-check pricing grid):
 * the Umbraco column carries the cobalt "signal" emphasis, cells hold short
 * candid phrases, and each tone gets a drawn mark (not colour alone).
 *
 * Semantic <table> with row/column headers; on mobile it reflows to one card
 * per criterion (column names move into each cell via data-label).
 */
export default function ComparisonSection() {
  return (
    <section className="section comparison" id="comparison">
      <div className="inner">
        <div className="cmp-head section-head--editorial reveal">
          <h2 className="js-head">
            {c.headline} <span className="em">{c.headlineEmphasis}</span>
          </h2>
          <p className="lede">{c.introText}</p>
        </div>

        <p className="cmp-takeaway reveal">
          <span className="cmp-takeaway-mark" aria-hidden="true" />
          {c.takeaway}
        </p>

        <details className="cmp-details reveal">
          <summary className="cmp-toggle">
            <span>See the full comparison</span>
            <Icon name="arrow-right" size={16} />
          </summary>
          <div className="cmp-wrap">
            <table className="cmp">
              <caption className="sr-only">
                How Umbraco compares with WordPress, Sitecore / AEM, and Contentful
                across cost, security, ownership, total cost, editing, and AI-readiness.
              </caption>
              <thead>
              <tr>
                <td className="cmp-corner" aria-hidden="true" />
                {c.columns.map((col) => (
                  <th
                    key={col.name}
                    scope="col"
                    className={col.highlight ? 'cmp-col-umbraco' : undefined}
                  >
                    <span className="cmp-col-name">{col.name}</span>
                    <span className="cmp-col-note">{col.note}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {c.rows.map((row) => (
                <tr key={row.criterion}>
                  <th scope="row">{row.criterion}</th>
                  {row.cells.map((cell, i) => (
                    <td
                      key={c.columns[i].name}
                      data-label={c.columns[i].name}
                      className={c.columns[i].highlight ? 'cmp-col-umbraco' : undefined}
                    >
                      <span className={`cmp-mark cmp-mark--${cell.tone}`} aria-hidden="true" />
                      <span className="cmp-val">{cell.text}</span>
                      <span className="sr-only"> — {TONE_LABEL[cell.tone]}</span>
                    </td>
                  ))}
                </tr>
              ))}
              </tbody>
            </table>
          </div>
        </details>

        <a className="cmp-more reveal" href="/umbraco">
          Why we build on Umbraco
          <Icon name="arrow-right" size={15} />
        </a>
      </div>
    </section>
  );
}
