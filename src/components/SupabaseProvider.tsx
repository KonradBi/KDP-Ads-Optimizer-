"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createSupabaseClient, publicSupabaseUrl, publicSupabaseAnonKey } from '@/lib/utils/supabase';
import LoginModal from './LoginModal.tsx';
import { Session, SupabaseClient } from '@supabase/supabase-js';

interface SupabaseContextValue {
  supabaseClient: SupabaseClient;
  session: Session | null;
  openLogin: () => void;
  closeLogin: () => void;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

// Function to create the client - ensures required env vars are present
const createClient = () => {
  if (!publicSupabaseUrl || !publicSupabaseAnonKey) {
    // This check now happens definitively on the client side within the provider
    throw new Error('Missing Supabase URL or Anon Key for client creation.');
  }
  return createSupabaseClient(publicSupabaseUrl, publicSupabaseAnonKey);
};

export function SupabaseProvider({ children }: { children: ReactNode }) {
  // Create the Supabase client instance in useEffect to ensure env vars are ready
  const [supabaseClient, setSupabaseClient] = useState<SupabaseClient | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  // Initialize Supabase client after mount
  useEffect(() => {
    if (publicSupabaseUrl && publicSupabaseAnonKey) {
      const client = createClient();
      console.log("Anon Key in provider:", publicSupabaseAnonKey);
      setSupabaseClient(client);
    } else {
      console.error("Missing publicSupabaseUrl or publicSupabaseAnonKey", { publicSupabaseUrl, publicSupabaseAnonKey });
    }
  }, []);

  // Sync session once client is ready
  useEffect(() => {
    if (!supabaseClient) return;
    // Use the stateful client instance
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [supabaseClient]); // Add supabaseClient as dependency

  // Don’t render children until client is initialized
  if (!supabaseClient) {
    return null;
  }

  return (
    // Pass the stateful client instance via context
    <SupabaseContext.Provider value={{ supabaseClient, session, openLogin, closeLogin }}>
      {children}
      <LoginModal isOpen={loginOpen} onClose={closeLogin} />
    </SupabaseContext.Provider>
  );
}

export function useSupabase() {
  const context = useContext(SupabaseContext);
  if (!context) {
    throw new Error('useSupabase must be used within SupabaseProvider');
  }
  return context;
}
