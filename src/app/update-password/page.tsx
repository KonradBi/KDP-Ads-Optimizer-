"use client";

import React, { useState, useEffect } from 'react';
import { useSupabase } from '@/components/SupabaseProvider';
import { useRouter } from 'next/navigation';

export default function UpdatePasswordPage() {
  const { supabaseClient, session } = useSupabase();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if the user is here for password recovery
  // This check is basic. A more robust check might involve parsing the URL hash fragment
  // for the access_token if Supabase sends it that way for recovery.
  // However, onAuthStateChange in the provider should handle setting the session correctly.
  useEffect(() => {
    if (session) {
      // Optional: You could check session properties if needed, 
      // but usually, if a session exists after clicking the link, it's the recovery session.
      setMessage('Bitte gib dein neues Passwort ein.');
    } else {
      // If there's no session, the user might have arrived here directly
      // or the recovery link/token is invalid/expired.
      setError('Ungültiger oder abgelaufener Link. Bitte fordere einen neuen Passwort-Reset an.');
      // Optionally redirect after a delay
      // setTimeout(() => router.push('/'), 5000);
    }
  }, [session, router]);

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!password || !confirmPassword) {
      setError('Bitte gib das neue Passwort ein und bestätige es.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Die Passwörter stimmen nicht überein.');
      return;
    }
    if (password.length < 8) {
      setError('Das Passwort muss mindestens 8 Zeichen lang sein.');
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await supabaseClient.auth.updateUser({ password });

      if (updateError) {
        setError(`Fehler beim Aktualisieren des Passworts: ${updateError.message}`);
      } else {
        setMessage('Passwort erfolgreich aktualisiert! Du wirst zum Login weitergeleitet...');
        setPassword('');
        setConfirmPassword('');
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push('/'); // Or wherever your login page / main page is
        }, 3000);
      }
    } catch (err: any) { 
      setError(err.message || 'Ein unbekannter Fehler ist aufgetreten.');
    } finally {
      setLoading(false);
    }
  };

  // Don't render the form if there's no session (invalid link)
  if (!session && !error) {
    return <div className="p-4 text-center">Lade...</div>; // Or a more sophisticated loading state
  }
  if (error && !message.includes('Bitte gib dein neues Passwort ein')) { // Show error if it's not the initial instruction
      return <div className="p-4 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">Neues Passwort festlegen</h1>
      
      {message && <p className="text-green-500 mb-4 text-center">{message}</p>}
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      <form onSubmit={handlePasswordUpdate} className="space-y-4">
        <div>
          <label htmlFor="password">Neues Passwort:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          />
        </div>
        <div>
          <label htmlFor="confirmPassword">Neues Passwort bestätigen:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className="w-full px-3 py-2 border rounded"
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Aktualisiere...' : 'Neues Passwort speichern'}
        </button>
      </form>
    </div>
  );
}
