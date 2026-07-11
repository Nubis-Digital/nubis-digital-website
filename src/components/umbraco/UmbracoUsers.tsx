import { content } from '@/data/content';
import { highlightUmbraco } from '@/components/umbraco/highlightUmbraco';
import BrandLogo from '@/components/umbraco/BrandLogo';

/**
 * UmbracoUsers — social proof. Real, public Umbraco case-study brands shown as
 * plain wordmarks (text, not logos — honest and trademark-safe) in a hairline
 * grid, each in Umbraco blue. Source noted.
 */
export default function UmbracoUsers() {
  const u = content.umbraco.users;
  return (
    <section className="section umb-users">
      <div className="inner">
        <div className="umb-head reveal">
          <h2 className="js-head">{highlightUmbraco(u.headline)}</h2>
          <p className="umb-lead">{u.lead}</p>
        </div>

        <ul className="umb-logos reveal">
          {u.companies.map((c) => (
            <li className="umb-logo" key={c.domain}>
              <BrandLogo name={c.name} domain={c.domain} />
            </li>
          ))}
        </ul>
        <p className="umb-source">{u.note}</p>
      </div>
    </section>
  );
}
