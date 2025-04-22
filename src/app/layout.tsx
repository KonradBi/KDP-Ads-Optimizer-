import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import Image from 'next/image';
import './globals.css';
import { SupabaseProvider } from '@/components/SupabaseProvider';
import AuthButton from '@/components/AuthButton';

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
                <div className="flex items-center">
                  <AuthButton />
                  <Link
                    href="/upload"
                    className="relative inline-flex items-center px-5 py-2.5 overflow-hidden border border-amber-500/30 text-sm font-medium rounded-full shadow-md shadow-amber-500/10 text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 hover:shadow-lg hover:shadow-amber-500/20 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-slate-900"
                  >
                    <span className="relative z-10 flex items-center">
                      Analyze New Report
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </Link>
                </div>
              </div>
            </div>
          </header>
          <main>{children}</main>
          <div id="tooltip-portal-root"></div>
        </SupabaseProvider>
      </body>
    </html>
  );
}
