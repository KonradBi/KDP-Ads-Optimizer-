import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import AuthStatusHeader from '@/components/AuthStatusHeader';

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
        <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-slate-900 via-[#111827] to-slate-800 shadow-lg border-b border-slate-700/30 backdrop-blur-sm">
          <div className="px-6 sm:px-8 lg:px-10 py-2">
            <div className="flex justify-between items-center h-16">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/" className="group block transition-transform duration-300 hover:scale-105">
                  <div className="flex items-center">
                    <Image 
                      src="/screenshots/herologo.png" 
                      alt="KDP AdNinja Logo Icon" 
                      width={48}
                      height={48}
                      className="h-12 w-auto"
                    />
                    <div className="flex items-center ml-3.5">
                      <span className="text-white font-bold text-xl tracking-tight">KDP AdNinja</span>
                      <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent font-bold text-xl tracking-wide ml-2">A.I.</span>
                    </div>
                  </div>
                </Link>
              </div>
              <AuthStatusHeader />
            </div>
          </div>
        </header>
        <main><SupabaseProvider>{children}</SupabaseProvider></main>
        <div id="tooltip-portal-root"></div>
      </body>
    </html>
  );
}
