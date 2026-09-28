/**
 * BrandLogo — a company set as a serif wordmark.
 *
 * Logos used to be pulled live from the Clearbit logo CDN, which no longer
 * resolves: every visitor paid a failed third-party request (and a console
 * error) before falling back to the name anyway. The name is the honest,
 * fast, private version, and `domain` stays in the data for attribution.
 */
export default function BrandLogo({ name }: { name: string; domain: string }) {
  return <span className="umb-logo-name">{name}</span>;
}
