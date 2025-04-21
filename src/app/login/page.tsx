'use client';
export const dynamic = 'force-dynamic';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSupabase } from '@/components/SupabaseProvider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { supabaseClient, session } = useSupabase();
  const router = useRouter();

  // Redirect to /upload if user is already logged in
  useEffect(() => {
    if (session) {
      router.push('/upload');
    }
  }, [session, router]);

  // Don't render the form if session exists (already handled by redirect)
  if (session) {
    return null; // Or a loading indicator while redirecting
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-900">
      <div className="w-full max-w-md p-8 space-y-8 bg-slate-800 rounded-lg shadow-lg">
        <Auth
          supabaseClient={supabaseClient}
          appearance={{ theme: ThemeSupa }}
          theme="dark"
          providers={[]} // Nur Email/Passwort/MagicLink, keine Social Logins
          view="magic_link" // Nur Magic Link anzeigen
          showLinks={false} // Sicherstellen, dass keine anderen Links angezeigt werden
          // Ensure this matches your Supabase Auth settings Callback URL
          redirectTo={`${typeof window !== 'undefined' ? window.location.origin : ''}/auth/callback`}
        />
      </div>
    </div>
  );
}
