'use client';

import React from 'react';
import { useSupabase } from './SupabaseProvider';
import { useRouter } from 'next/navigation'; // Import useRouter

export default function AuthButton() {
  const { session, openLogin, supabaseClient } = useSupabase();
  const router = useRouter(); // Initialize router

  const handleLogout = async () => {
    const { error } = await supabaseClient.auth.signOut();
    if (error) {
      console.error('Error logging out:', error);
      // Optionally show an error message to the user
    } else {
      // Redirect to home page or login page after logout
      router.push('/');
      router.refresh(); // Force refresh to ensure state is updated across server/client components
    }
  };

  return (
    <div>
      {session ? (
        <button
          onClick={handleLogout}
          className="relative inline-flex items-center px-4 py-2 mr-4 text-sm font-medium rounded-full text-white bg-slate-700 hover:bg-red-600 transition"
        >
          Logout
        </button>
      ) : (
        <button
          onClick={openLogin} // Call openLogin from SupabaseProvider context
          className="relative inline-flex items-center px-4 py-2 mr-4 text-sm font-medium rounded-full text-white bg-slate-700 hover:bg-slate-600 transition"
        >
          Login / Signup
        </button>
      )}
    </div>
  );
}
