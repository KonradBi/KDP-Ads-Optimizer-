import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import Header from '@/components/Header';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KDP Ads Optimizer A.I. — Free Amazon Ads CSV Analysis',
  description: 'Upload your Amazon KDP advertising CSV and get an instant, free analysis to cut wasted spend and lower ACOS. No signup. No credit card.',
  icons: {
    icon: '/favicon.ico', // Link to the generated favicon
  },
  keywords: [
    'KDP ads',
    'Amazon advertising',
    'ACOS optimization',
    'free CSV analysis',
    'keyword research',
    'bid optimization',
    'book marketing',
  ],
  authors: [{ name: 'KDP Ads Optimizer Team', url: 'https://kdp-ads-optimizer.com' }],
  robots: { index: true, follow: true },
  alternates: {
    canonical: 'https://kdp-ads-optimizer.com/',
  },
  openGraph: {
    type: 'website',
    url: 'https://kdp-ads-optimizer.com/',
    title: 'KDP Ads Optimizer A.I. — Free Amazon Ads CSV Analysis',
    description: 'Upload your Amazon KDP advertising CSV and get an instant, free analysis to cut wasted spend and lower ACOS.',
    images: [
      {
        url: 'https://kdp-ads-optimizer.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'KDP Ads Optimizer dashboard preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KDP Ads Optimizer A.I. — Free Amazon Ads CSV Analysis',
    description: 'Upload your Amazon KDP advertising CSV and get an instant, free analysis to cut wasted spend and lower ACOS.',
    images: ['https://kdp-ads-optimizer.com/og-image.png'],
    creator: '@kdpadsoptimizer',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full w-full bg-slate-950 text-slate-200`}>
        <SupabaseProvider>
          <Header />
          <main className="bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-amber-700/30 via-amber-800/25 via-slate-800/70 to-slate-900">{children}</main>
          
          <div id="tooltip-portal-root"></div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
