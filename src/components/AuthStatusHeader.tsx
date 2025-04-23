'use client';

import React from 'react';
import Link from 'next/link';
import { useSupabase } from './SupabaseProvider'; // Assuming SupabaseProvider exports useSupabase
import { useRouter } from 'next/navigation';

export default function AuthStatusHeader() {
  const { supabaseClient, session } = useSupabase();
  const router = useRouter();

  const handleLogout = async () => {
    if (!supabaseClient) return; // Add guard in case client isn't ready
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
    } else {
      // Optional: Redirect to home page or login page after logout
      router.push('/');
      router.refresh(); // Refresh server components
    }
  };

  return (
    <div className="flex items-center">
      {session?.user ? (
        <div className="flex items-center space-x-4">
          <span className="text-sm text-slate-300 hidden sm:inline">
            {session.user.email}
          </span>
          <button
            onClick={handleLogout}
            className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-slate-700 hover:bg-slate-600 transition"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-full text-white bg-slate-700 hover:bg-slate-600 transition"
        >
          Login / Signup
        </Link>
      )}
      {/* Keep the Analyze New Report button separate */}
      <Link
         href="/upload"
         className="relative ml-4 inline-flex items-center px-5 py-2.5 overflow-hidden border border-amber-500/30 text-sm font-medium rounded-full shadow-md shadow-amber-500/10 text-white bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-400 hover:via-orange-400 hover:to-red-400 hover:shadow-lg hover:shadow-amber-500/20 transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 focus:ring-offset-slate-900"
       >
         <span className="relative z-10 flex items-center">
           Analyze New Report
           <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
           </svg>
         </span>
       </Link>
    </div>
  );
}
