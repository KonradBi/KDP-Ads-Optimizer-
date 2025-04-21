"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/utils/supabase';
import LoginModal from './LoginModal.tsx';
import { Session } from '@supabase/supabase-js';

interface SupabaseContextValue {
  supabaseClient: typeof supabase;
  session: Session | null;
  openLogin: () => void;
  closeLogin: () => void;
}

const SupabaseContext = createContext<SupabaseContextValue | undefined>(undefined);

export function SupabaseProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [loginOpen, setLoginOpen] = useState(false);

  const openLogin = () => setLoginOpen(true);
  const closeLogin = () => setLoginOpen(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <SupabaseContext.Provider value={{ supabaseClient: supabase, session, openLogin, closeLogin }}>
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
