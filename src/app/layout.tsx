import type { Metadata } from 'next';
import './globals.css';

import { WebMcpTools } from '@/components/WebMcpTools';
import { SITE_NAME, SITE_URL, jsonLdScript, siteJsonLd } from '@/data/machineReadable';

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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600&family=JetBrains+Mono:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(siteJsonLd()) }} />
        {children}
        <WebMcpTools />
      </body>
    </html>
  );
}
