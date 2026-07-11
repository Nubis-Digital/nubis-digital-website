import { content } from '@/data/content';
import Wordmark from '@/components/Wordmark';

export default function Footer() {
  const f = content.footer;

  return (
    <footer className="site-footer">
      <div>
        <div className="f-logo">
          <Wordmark inverted />
        </div>
        <p className="f-tag">{f.tagline} &bull; {new Date().getFullYear()}</p>
      </div>
      <nav className="f-links">
        {f.pageLinks.map((link) => (
          <a key={link.href} href={link.href}>
            {link.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}
