"use client"

import React, { useState } from 'react';
import { useSupabase } from './SupabaseProvider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { openLogin, closeLogin, supabaseClient } = useSupabase();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const { error } = await supabaseClient.auth.signInWithOtp({ email });
    if (error) setError(error.message);
    else setMessage('Magic link sent!');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Login / Signup</h2>
        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded"
          />
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="px-4 py-2 mr-2">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Send</button>
          </div>
        </form>
      </div>
    </div>
  );
}
