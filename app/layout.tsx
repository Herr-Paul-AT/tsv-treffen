import type { Metadata, Viewport } from 'next';
import { Fraunces, Manrope, DM_Mono } from 'next/font/google';
import { SerwistProvider } from '@serwist/turbopack/react';
import { PwaAutoUpdate } from '@/components/PwaAutoUpdate';
import './globals.css';
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap',
  axes: ['opsz'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const dmMono = DM_Mono({
  subsets: ['latin'],
  variable: '--font-dm-mono',
  display: 'swap',
  weight: ['400', '500'],
});

const APP_NAME = SITE_NAME;
const APP_DESCRIPTION = SITE_DESCRIPTION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: APP_NAME,
  title: {
    default: APP_NAME,
    template: '%s · TSV Schloss Treffen',
  },
  description: APP_DESCRIPTION,
  keywords: [
    'Tennis',
    'Tennisverein',
    'Treffen am Ossiachersee',
    'Sandplatz',
    'Kindertraining',
    'Tennis Kärnten',
    'TSV Schloss Treffen',
    'Gerlitzen',
    'Villach-Land',
  ],
  openGraph: {
    type: 'website',
    locale: 'de_AT',
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  // Google-Search-Console-Bestätigung (optional, Code als Env-Variable in Vercel).
  ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } }
    : {}),
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    // 'default' statt 'black-translucent': iOS reserviert die Statusleiste,
    // der Inhalt startet darunter -> keine Überlappung mehr (iPhone-Ränder).
    statusBarStyle: 'default',
    title: 'TSV Treffen',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
    ],
    // iOS kann kein SVG als Homescreen-Icon → PNG.
    apple: [{ url: '/apple-touch-icon.png', type: 'image/png', sizes: '180x180' }],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#F5F1E5' },
    { media: '(prefers-color-scheme: dark)', color: '#1F2224' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      className={`${fraunces.variable} ${manrope.variable} ${dmMono.variable}`}
    >
      <body>
        <SerwistProvider swUrl="/serwist/sw.js">
          <PwaAutoUpdate />
          {children}
        </SerwistProvider>
      </body>
    </html>
  );
}
