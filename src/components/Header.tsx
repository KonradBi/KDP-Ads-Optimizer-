"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useSupabase } from '@/components/SupabaseProvider';

export default function Header() {
  const { session, supabaseClient, openLogin } = useSupabase();

  const handleLogout = async () => {
    await supabaseClient.auth.signOut();
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-gradient-to-r from-slate-900 via-[#111827] to-slate-800 shadow-lg border-b border-slate-700/30 backdrop-blur-sm">
      <div className="px-6 sm:px-8 lg:px-10 py-2">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="group block transition-transform duration-300 hover:scale-105">
              <div className="flex items-center">
                <Image src="/screenshots/herologo.png" alt="KDP AdNinja Logo" width={48} height={48} className="h-12 w-auto" />
                <div className="flex items-center ml-3.5">
                  <span className="text-white font-bold text-xl tracking-tight">KDP AdNinja</span>
                  <span className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent font-bold text-xl tracking-wide ml-2">A.I.</span>
                </div>
              </div>
            </Link>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden sm:inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-slate-700 hover:bg-slate-600 transition"
                >
                  My Analyses
                </Link>
                <span className="text-sm text-slate-300 hidden sm:inline">{session.user?.email}</span>
                <button
                  onClick={handleLogout}
                  className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-red-600 hover:bg-red-500 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={openLogin}
                className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-slate-700 hover:bg-slate-600 transition"
              >
                Login / Signup
              </button>
            )}
            <Link
              href="/upload"
              className="relative inline-flex items-center px-5 py-2.5 overflow-hidden border border-amber-500/30 text-sm font-medium rounded-full shadow-md shadow-amber-500/10 text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:scale-105 transition-all duration-300"
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
  );
}
