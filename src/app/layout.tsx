import type { Metadata } from 'next';
import { IBM_Plex_Sans, Source_Serif_4 } from 'next/font/google';
import './globals.css';
import { PublicShell } from '@/components/PublicShell';

const sans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
});

const display = Source_Serif_4({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: {
    default: 'CyberIntel — Cybersecurity Current Affairs',
    template: '%s | CyberIntel',
  },
  description:
    'Know what happened in cybersecurity today. Attacks, vulnerabilities, breaches, malware, and threat intelligence.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'CyberIntel',
    description: 'Know what happened in cybersecurity today.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CyberIntel',
    description: 'Know what happened in cybersecurity today.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${sans.variable} ${display.variable} antialiased`}>
        <PublicShell>{children}</PublicShell>
      </body>
    </html>
  );
}
