"use client"

import React, { useState } from 'react';
import { useSupabase } from './SupabaseProvider';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  redirectTo?: string;
}

export default function LoginModal({ isOpen, onClose, redirectTo }: LoginModalProps) {
  const { supabaseClient } = useSupabase();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLogin, setIsLogin] = useState(true); // true = Login, false = Registrierung
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
      setError('Bitte E-Mail und Passwort eingeben.');
      return;
    }
    if (!isLogin && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Das Passwort muss mindestens ${MIN_PASSWORD_LENGTH} Zeichen lang sein.`);
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        // Login
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.toLowerCase().includes('invalid login credentials')) {
            setError('Falsche E-Mail oder Passwort.');
          } else {
            setError(error.message);
          }
        } else {
          setMessage('Login erfolgreich!');
          setDisableFields(true);
          setTimeout(() => {
            setDisableFields(false);
            onClose();
          }, 1000);
        }
      } else {
        // Registrierung
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
            setError('Diese E-Mail ist bereits registriert.');
          } else if (error.message.toLowerCase().includes('password')) {
            setError('Das Passwort ist zu schwach oder entspricht nicht den Anforderungen.');
          } else {
            setError(error.message);
          }
        } else {
          setMessage('Registrierung erfolgreich! Bitte bestätige deine E-Mail.');
          setDisableFields(true);
        }
      }
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!email) {
      setError('Bitte zuerst eine E-Mail eingeben.');
      return;
    }
    setLoading(true);
    try {
      // Add redirectTo pointing to the new password update page
      const resetUrl = `${window.location.origin}/update-password`;
      const { error } = await supabaseClient.auth.resetPasswordForEmail(email, {
        redirectTo: resetUrl,
      });
      if (error) setError(error.message);
      else {
        setMessage('Passwort-Reset-E-Mail wurde gesendet!');
        setDisableFields(true);
      }
    } catch (err: any) {
      setError(err.message || 'Unbekannter Fehler beim Senden der Reset-E-Mail.');
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
        <h2 className="text-xl font-semibold mb-4 text-gray-200">Login or Sign Up</h2>
        {/* Adjusted message/error text colors */}
        {message && <p className="text-green-400 mb-4 text-sm"> {message}</p>}
        {error && <p className="text-red-400 mb-4 text-sm"> {error}</p>}
        
        <form onSubmit={handleSubmit} className="space-y-4" aria-label={isLogin ? 'Login-Formular' : 'Registrierungsformular'}>
          <label htmlFor="email-input" className="block text-sm font-medium text-gray-400">E-Mail:</label>
          <input
            id="email-input"
            type="email"
            required
            placeholder="deine@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ref={emailInputRef}
            autoComplete="email"
            disabled={disableFields || loading}
            aria-disabled={disableFields || loading}
            aria-label="E-Mail-Adresse"
          />
          <label htmlFor="password-input" className="block text-sm font-medium text-gray-400">Passwort:</label>
          <input
            id="password-input"
            type="password"
            required
            placeholder="Passwort"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-600 rounded bg-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            ref={passwordInputRef}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            disabled={disableFields || loading}
            aria-disabled={disableFields || loading}
            aria-label="Passwort"
          />
          {!isLogin && (
            <div className="text-xs text-gray-400 mt-1">Mindestens {MIN_PASSWORD_LENGTH} Zeichen</div>
          )}
          {/* Passwort vergessen Link nur im Login-Modus */}
          {isLogin && (
            <div className="text-right">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-xs text-blue-400 hover:underline mt-1"
                disabled={loading || !email || disableFields}
                aria-disabled={loading || !email || disableFields}
              >
                Passwort vergessen?
              </button>
            </div>
          )}
          {/* Flex container für Buttons */}
          <div className="flex justify-between pt-2 space-x-3">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-4 py-2 rounded text-gray-400 hover:text-white transition-colors duration-150 ease-in-out"
              disabled={loading}
              aria-disabled={loading}
            >
              Abbrechen
            </button>
            <button 
              type="submit" 
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 flex items-center justify-center"
              disabled={loading || disableFields}
              aria-disabled={loading || disableFields}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              ) : null}
              {isLogin ? 'Login' : 'Registrieren'}
            </button>
          </div>
        </form>
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleMode}
            className="text-xs text-gray-400 hover:underline"
            disabled={loading}
            aria-disabled={loading}
          >
            {isLogin ? 'Noch kein Konto? Jetzt registrieren!' : 'Schon registriert? Jetzt einloggen!'}
          </button>
        </div>
      </div>
    </div>
  );
}
