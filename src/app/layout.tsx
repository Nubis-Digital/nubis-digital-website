import type { Metadata } from 'next';
import './globals.css';
import PageLoader from '@/components/PageLoader';

export const metadata: Metadata = {
  title: 'Nubis Digital — Architectural Resilience for the Agentic Web',
  description:
    'We make your website work for AI agents. Umbraco specialists — upgraded, fast, and agent-ready with agent.txt endpoints and RAG-ready APIs.',
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
        <PageLoader />
        {children}
      </body>
    </html>
  );
}
