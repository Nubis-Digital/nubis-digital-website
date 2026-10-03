/**
 * Cloudflare Web Analytics — cookieless, no personal data, no consent needed,
 * so it runs for every visitor without touching the cookie banner's promise.
 * Set NEXT_PUBLIC_CF_ANALYTICS_TOKEN (a repository variable) to switch it on;
 * without it nothing is rendered. `defer` keeps it off the first-paint path.
 */
const TOKEN = process.env.NEXT_PUBLIC_CF_ANALYTICS_TOKEN;

export function Analytics({ token = TOKEN }: { token?: string }) {
  if (!token) return null;
  return (
    <script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={JSON.stringify({ token })}
    />
  );
}
