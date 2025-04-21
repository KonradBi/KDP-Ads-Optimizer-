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
    // Added z-50 for stacking order and dark theme styling
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {/* Dark background, rounded corners, padding, max-width */}
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl border border-gray-700">
        {/* Lighter text color for heading */}
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Login or Sign Up</h2>
        {/* Adjusted message/error text colors */}
        {message && <p className="text-green-400 mb-4 text-sm"> {message}</p>}
        {error && <p className="text-red-400 mb-4 text-sm"> {error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <label htmlFor="email-input" className="block text-sm font-medium text-gray-400">Enter your email to receive a magic link:</label>
          <input
            id="email-input"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            // Darker input field with lighter text and border
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {/* Flex container for buttons, aligned to the right */}
          <div className="flex justify-end pt-2 space-x-3">
            {/* Cancel button: Lighter text, subtle hover */}
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded text-gray-400 hover:text-white transition-colors duration-150 ease-in-out"
            >
              Cancel
            </button>
            {/* Send button: Primary color background, white text, hover effect */}
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Send Magic Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
