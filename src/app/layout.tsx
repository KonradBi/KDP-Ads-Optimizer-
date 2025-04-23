import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'KDP Ads Optimizer A.I.',
  description: 'Optimize your Amazon Ads in minutes! Upload your CSV export for expert insights.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0a0a23] text-slate-200`}>
        <SupabaseProvider>
          <Header />
          <main>{children}</main>
          <Footer />
          <div id="tooltip-portal-root"></div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
