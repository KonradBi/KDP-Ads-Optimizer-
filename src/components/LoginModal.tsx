"use client"

import React, { useState } from 'react';
import { useSupabase } from './SupabaseProvider';
import { useRouter } from 'next/navigation';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function LoginModal({ isOpen, onClose, redirectTo }: LoginModalProps) {
  const { supabaseClient } = useSupabase();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Sign Up
  const [loading, setLoading] = useState(false);
  const [disableFields, setDisableFields] = useState(false);

  const emailInputRef = React.useRef<HTMLInputElement>(null);
  const passwordInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen && emailInputRef.current) {
      emailInputRef.current.focus();
    }
  }, [isOpen, isLogin]);

  if (!isOpen) return null;

  const MIN_PASSWORD_LENGTH = 8;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }
    if (!isLogin && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters long.`);
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            setError('Incorrect email or password.');
          } else {
            setError(error.message);
          }
        } else {
          setMessage('Login successful!');
          setDisableFields(true); // Keep fields disabled while navigating

          if (redirectTo) {
            // Redirect if a specific URL was provided
            console.log('Login successful, redirecting to:', redirectTo); // Add log
            router.push(redirectTo);
            // No need to call onClose if we are redirecting
          } else {
            // Default behavior: close the modal
            console.log('Login successful, closing modal (no redirect specified).'); // Add log
            setTimeout(() => { // Keep timeout for visual feedback before close
              setDisableFields(false);
              onClose();
            }, 1000);
          }
        }
      } else {
        // Sign Up
        // Construct the redirect URL. Use the passed redirectTo prop or default to the origin.
        // IMPORTANT: Ensure the page receiving the redirect (e.g., /upload) correctly handles the session and potential actions.
        const redirectUrl = redirectTo || `${window.location.origin}/`; // Default to origin if not provided
        
        const { error } = await supabaseClient.auth.signUp({
           email,
           password,
           options: { emailRedirectTo: redirectUrl }
        });
        if (error) {
          if (error.message.toLowerCase().includes('user already registered')) {
            setError('This email is already registered.');
          } else if (error.message.toLowerCase().includes('password')) {
            setError('Password is too weak or does not meet requirements.');
          } else {
            setError(error.message);
          }
        } else {
          setMessage('Registration successful! Please confirm your email.');
          setDisableFields(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Please enter an email first.');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
      if (error) setError(error.message);
      else {
        setMessage('Password reset email sent!');
        setDisableFields(true);
      }
    } catch (err: any) {
      setError(err.message || 'Unknown error sending reset email.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
    setPassword('');
    setDisableFields(false);
    setTimeout(() => {
      if (emailInputRef.current) emailInputRef.current.focus();
    }, 50);
  };



  return (
    // Added z-50 for stacking order and dark theme styling
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      {/* Dark background, rounded corners, padding, max-width */}
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-sm shadow-xl border border-gray-700">
        {/* Lighter text color for heading */}
        <h2 className="text-xl font-semibold mb-4 text-gray-200">{isLogin ? 'Login' : 'Sign Up'}</h2>
        {/* Adjusted message/error text colors */}
        {message && <p className="text-green-400 mb-4 text-sm"> {message}</p>}
        {error && <p className="text-red-400 mb-4 text-sm"> {error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4" aria-label={isLogin ? 'Login form' : 'Registration form'}>
          <label htmlFor="email-input" className="block text-sm font-medium text-gray-400">Email:</label>
          <input
            id="email-input"
            type="email"
            required
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ref={emailInputRef}
            autoComplete="email"
            disabled={disableFields || loading}
            aria-disabled={disableFields || loading}
            aria-label="Email address"
          />
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-400">Password:</label>
          <input
            id="password-input"
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ref={passwordInputRef}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            disabled={disableFields || loading}
            aria-disabled={disableFields || loading}
            aria-label="Password"
          />
          {!isLogin && (
            <div className="text-xs text-gray-400 mt-1">Minimum {MIN_PASSWORD_LENGTH} characters</div>
          )}
          {/* Forgot password link only in login mode */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-blue-400 hover:underline mt-1"
                disabled={loading || !email || disableFields}
                aria-disabled={loading || !email || disableFields}
              >
                Forgot password?
              </button>
            </div>
          )}
          {/* Flex container for buttons */}
          <div className="flex justify-between pt-2 space-x-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded text-gray-400 hover:text-white transition-colors duration-150 ease-in-out"
              disabled={loading}
              aria-disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 transition-colors duration-150 ease-in-out"
              disabled={disableFields || loading}
              aria-live="polite"
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : isLogin ? 'Login' : 'Sign Up'}
            </button>
          </div>
          {/* Toggle between Login and Sign Up */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={toggleMode}
              className="text-sm text-blue-400 hover:underline"
              disabled={loading || disableFields}
              aria-disabled={loading || disableFields}
            >
              {isLogin ? "Don't have an account? Sign Up!" : "Already have an account? Login!"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
