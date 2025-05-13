import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CookieBanner from '@/components/CookieBanner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KDP AdNinja — Turn KDP Ad Disasters into Profit Machines',
  description: 'Stop wasting money on ineffective KDP ads. Our free tool analyzes your Amazon advertising CSV to cut wasted spend and boost your book sales. No signup required.',
  icons: {
    icon: '/favicon.ico', // Link to the generated favicon
  },
  keywords: [
    'KDP ACOS optimization',
    'Lower ACOS Amazon ads',
    'KDP ads analysis tool',
    'Amazon advertising optimization',
    'KDP bid recommendations',
    'Reduce wasted ad spend',
    'KDP AdNinja',
    'Amazon book advertising ROI',
    'KDP sponsored ads analysis',
    'Improve KDP ad performance',
    'Amazon book marketing optimization',
    'KDP advertising data analysis',
  ],
  authors: [{ name: 'KDP AdNinja Team', url: 'https://www.kdpninja.app' }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://www.kdpninja.app/',
  },
  openGraph: {
    type: 'website',
    url: 'https://www.kdpninja.app/',
    title: 'KDP AdNinja — Turn KDP Ad Disasters into Profit Machines',
    description: 'Stop wasting money on ineffective KDP ads. Our free tool analyzes your Amazon advertising CSV to cut wasted spend and boost your book sales.',
    images: [
      {
        url: 'https://www.kdpninja.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KDP AdNinja dashboard preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KDP AdNinja — Turn KDP Ad Disasters into Profit Machines',
    description: 'Stop wasting money on ineffective KDP ads. Our free tool analyzes your Amazon advertising CSV to cut wasted spend and boost your book sales.',
    images: ['https://www.kdpninja.app/og-image.png'],
    creator: '@kdpadninja',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <head>
        {/* JSON-LD structured data for better SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "KDP AdNinja - Amazon Book Advertising Tool",
              "applicationCategory": "BusinessApplication",
              "applicationSubCategory": "AdvertisingAnalysisSoftware",
              "operatingSystem": "Web",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Stop wasting money on ineffective KDP ads. Our tool helps authors and publishers optimize their Amazon book advertising for better sales and lower costs.",
              "keywords": "KDP ads, Amazon book advertising, lower ACOS, KDP bid recommendations, book marketing, self-publishing ads",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "ratingCount": "127"
              },
              "author": {
                "@type": "Organization",
                "name": "KDP AdNinja",
                "url": "https://www.kdpninja.app"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} h-full w-full bg-slate-950 text-slate-200 flex flex-col min-h-screen`}>
        <SupabaseProvider>
          <Header />
          <main className="flex-grow bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700/30 via-amber-800/25 via-slate-800/70 to-slate-900">{children}</main>
          <Footer />
          <CookieBanner />
          <div id="tooltip-portal-root"></div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
