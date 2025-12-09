import type { Metadata, Viewport } from 'next';
import { DM_Sans, Instrument_Sans } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Keeper - You paid for it, make it count',
    template: '%s | Keeper',
  },
  description:
    'Track warranties, access manuals instantly, and get AI-powered support for everything you own.',
  keywords: [
    'warranty tracking',
    'product manuals',
    'receipt scanner',
    'warranty management',
    'product health',
  ],
  authors: [{ name: 'Keeper' }],
  creator: 'Keeper',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://usekeeper.com',
    title: 'Keeper - You paid for it, make it count',
    description:
      'Track warranties, access manuals instantly, and get AI-powered support for everything you own.',
    siteName: 'Keeper',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Keeper - You paid for it, make it count',
    description:
      'Track warranties, access manuals instantly, and get AI-powered support for everything you own.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#00a3a3' },
    { media: '(prefers-color-scheme: dark)', color: '#003d3d' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dmSans.variable} ${instrumentSans.variable}`}>
      <body className="font-body antialiased min-h-screen bg-[var(--background)]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
