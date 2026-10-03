import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

import { Analytics } from '@/components/Analytics';
import { WebMcpTools } from '@/components/WebMcpTools';
import { SITE_NAME, SITE_URL, jsonLdScript, siteJsonLd } from '@/data/machineReadable';

// Self-hosted variable fonts, subset to the characters the site uses
// (scripts/subset-fonts.py): no third-party request, preloaded, and
// size-adjusted fallbacks stop the swap from shifting layout.
const inter = localFont({ src: '../fonts/inter-latin.woff2', weight: '100 900', variable: '--font-inter', display: 'swap' });
const playfair = localFont({
  src: [
    { path: '../fonts/playfair-latin.woff2', weight: '400 900', style: 'normal' },
    { path: '../fonts/playfair-italic-latin.woff2', weight: '400 900', style: 'italic' },
  ],
  variable: '--font-playfair',
  display: 'swap',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});
const mono = localFont({ src: '../fonts/jetbrains-mono-latin.woff2', weight: '400 800', variable: '--font-jetbrains', display: 'swap', fallback: ['ui-monospace', 'Menlo', 'monospace'] });

const description =
  'Be the business AI recommends. Nubis Digital rebuilds your website so ChatGPT and other AI assistants can find, understand and recommend you — bringing more visits, more leads, and follow-up that runs itself.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Nubis Digital — Be the Business AI Recommends',
  description,
  alternates: {
    canonical: '/',
    types: { 'text/markdown': '/index.md', 'text/plain': '/llms.txt' },
  },
  openGraph: { type: 'website', siteName: SITE_NAME, url: '/', title: 'Be the Business AI Recommends', description },
  twitter: { card: 'summary', title: 'Be the Business AI Recommends', description },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${mono.variable}`}>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd()) }} />
        {children}
        <WebMcpTools />
        <Analytics />
      </body>
    </html>
  );
}
