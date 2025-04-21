"use client"

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/utils/supabase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/upload');
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/login` }
    });

    if (error) setError(error.message);
    else setMessage('Magic link sent! Check your email.');

    setLoading(false);
  };

  return (
    <div className="h-screen flex items-center justify-center bg-slate-900">
      <div className="bg-slate-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-white">Login / Signup</h1>
        {message && <p className="mb-4 text-green-400">{message}</p>}
        {error && <p className="mb-4 text-red-400">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 rounded bg-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 bg-amber-500 text-white font-medium rounded hover:bg-amber-600 transition disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Magic Link'}
          </button>
        </form>
      </div>
    </div>
  );
}
